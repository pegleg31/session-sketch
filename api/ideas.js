/* Vercel serverless function — the idea generator behind Session Sketch's
   "Write three ideas" button (Wave 7; supersedes api/enrich.js).

   Deliberately THIN. The prompt is assembled client-side (wave7-ideas.js →
   buildIdeaPrompt) so that SKETCH_VERSION honestly identifies which prompt
   produced which idea, and so the pasted-key direct-browser transport and this
   hosted transport run the exact same prompt. The fourteen acceptance checks
   also run client-side, next to the fallback decision they drive. This
   function only: holds the API key, pins the model, caps the sizes, relays
   the ideas, and reports token usage (decision 5 — measure the cost).

   No clamp, no repair: a malformed idea is the client's to reject.

   Env var required on Vercel: ANTHROPIC_API_KEY
   CommonJS on purpose: the repo's build-*.js scripts are CJS and a
   "type":"module" in package.json would break them. */

"use strict";
/* the SDK ships both a default and a named export; accept either */
const SDK = require("@anthropic-ai/sdk");
const Anthropic = SDK.Anthropic || SDK.default || SDK;

/* fallback schema if the client sends none — keep in sync with IDEASCHEMA in
   wave7-ideas.js (the client copy is authoritative and normally wins) */
const FALLBACK_SCHEMA = {
  type: "object",
  properties: {
    ideas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          casting: { type: "string" }, name: { type: "string" },
          situation: { type: "string" }, why_ai: { type: "string" },
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: { minutes: { type: "integer" }, text: { type: "string" } },
              required: ["minutes", "text"], additionalProperties: false
            }
          },
          lands_early: { type: "string" }, goes_wrong: { type: "string" },
          human_only: { type: "string" }, hand_in: { type: "string" },
          next_time: { type: "string" }, file_spec: { type: "string" },
          prep: { type: "string" }, numbers_are_targets: { type: "boolean" }
        },
        required: ["casting","name","situation","why_ai","steps","lands_early","goes_wrong",
                   "human_only","hand_in","next_time","file_spec","prep","numbers_are_targets"],
        additionalProperties: false
      }
    }
  },
  required: ["ideas"], additionalProperties: false
};

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }

  let p = req.body;
  if (typeof p === "string") { try { p = JSON.parse(p); } catch (e) { p = null; } }
  if (!p || typeof p !== "object" || typeof p.prompt !== "string" || !p.prompt.trim()) {
    res.status(400).json({ error: "bad payload" });
    return;
  }
  if (p.prompt.length > 30000) { res.status(413).json({ error: "prompt too large" }); return; }
  let schema = FALLBACK_SCHEMA;
  if (p.schema && typeof p.schema === "object") {
    if (JSON.stringify(p.schema).length > 20000) { res.status(413).json({ error: "schema too large" }); return; }
    schema = p.schema;
  }

  const client = new Anthropic(); // ANTHROPIC_API_KEY from env

  let msg;
  try {
    msg = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 12000,
      /* default (high) effort on purpose: the hand test that set the quality
         bar ran in a plain chat, and inventing three genuinely different
         situations is a reasoning task, not a rewrite */
      thinking: { type: "adaptive" },
      output_config: { format: { type: "json_schema", schema: schema } },
      messages: [{ role: "user", content: p.prompt }]
    });
  } catch (err) {
    /* branch on the HTTP status rather than instanceof: robust to whichever
       export shape the installed SDK version uses */
    const st = err && err.status;
    if (st === 429) {
      res.status(429).json({ error: "The idea service is rate-limited right now — try again in a minute." });
    } else if (st === 401 || st === 403) {
      res.status(500).json({ error: "The idea service is not configured — its API key is missing or invalid." });
    } else if (st) {
      res.status(502).json({ error: "The AI service returned an error (" + st + ")." });
    } else {
      res.status(502).json({ error: "Could not reach the AI service." });
    }
    return;
  }

  if (msg.stop_reason === "refusal") {
    res.status(502).json({ error: "The AI declined this request. The standard version still works." });
    return;
  }

  let data;
  try {
    const text = msg.content.find(b => b.type === "text").text;
    data = JSON.parse(text);
  } catch (e) {
    res.status(502).json({ error: "The AI returned an unreadable response." });
    return;
  }

  res.status(200).json({
    /* the full structured output — the client reads this. The endpoint is a
       generic prompt+schema relay: the idea call and the clarity call differ
       only in what they send. */
    result: data,
    /* legacy field so a cached pre-dev.7 client keeps working during deploy skew */
    ideas: Array.isArray(data.ideas) ? data.ideas : [],
    usage: msg.usage ? { input_tokens: msg.usage.input_tokens, output_tokens: msg.usage.output_tokens } : null,
    model: msg.model || "claude-opus-4-8"
  });
};
