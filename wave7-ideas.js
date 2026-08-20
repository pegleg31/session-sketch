/* Wave 7 — the model generates the activity; the engine is the rubric. SOURCE FILE.
   Inlined into the result script block of Session-Sketch.html by
   build-ideas-inline.js (which also removes the superseded Wave 6 overlay),
   then flows into the portal via build-portal.js. Do not hand-edit the copy in
   the HTML — edit this file and re-run:
       node build-ideas-inline.js && node build-portal.js

   The split (HANDOFF-to-code-wave7.md):
     engine  — decides the type and the casting, states the rules, rejects
     Claude  — invents the situation and the activity, three ideas to choose from
   Scoring is untouched. Nothing in this file can move a tag, a score, an
   activity choice or a casting pool.

   Spec: Session-Sketch-idea-prompt.md Part B. A failing idea is DROPPED, never
   repaired. Fewer than three passing is fine; none passing falls back to the
   deterministic text with a plain line saying so (decision 4). No key and no
   endpoint → the tool behaves exactly as it does today.

   Build-script constraints: nothing in this file may contain a literal script
   tag (even in a comment) or a bare call to the wizard renderer — the block
   extractors and build-portal.js grep for both. */

/* ================= tunables — decision-sheet hand tests 1 and 2 may move
   these numbers, so they all live here ================= */
var IDEACHECK = {
  maxIdeas: 3,                 /* checks 1: ideas array is 1..maxIdeas */
  situationSentences: [2, 5],  /* check 4 */
  speedRe: /\b(faster|quicker|saves? time|more efficient|in less time)\b/i,  /* check 5 */
  speedSubstanceMin: 6,        /* check 5: significant words that must remain once speed clauses are cut */
  catchConsecWords: 4,         /* check 6 — decision-sheet Q2 may lower this */
  stepsRequired: 5,            /* check 8 */
  minutesTolerance: 3,         /* check 8 */
  banned: ["delve", "leverage", "robust", "unlock", "journey", "empower", "seamless", "in today's fast-paced"], /* check 9 */
  aiProducts: ["ChatGPT", "Copilot", "Gemini", "Claude"],  /* check 10 */
  fileSpecMinProps: 2,         /* check 11 */
  clarifyMax: 3,               /* the writer may ask at most this many questions before writing */
  /* check 13 — a screen, not a guarantee: common brands a model reaches for.
     Case-sensitive word match. "Oracle" is deliberately absent (it is one of
     our casting names); extend freely. */
  realOrgs: ["Google","Amazon","Apple","Microsoft","Meta","Facebook","Instagram","TikTok","Netflix","Disney",
    "Starbucks","McDonald's","Walmart","Costco","Nike","Adidas","Coca-Cola","Pepsi","Toyota","Tesla",
    "Marriott","Hilton","Airbnb","Uber","Lyft","FedEx","Mastercard","PayPal","Salesforce","IBM",
    "Intel","Nvidia","Samsung","Sony","LEGO","IKEA","Zara","Sephora","Walgreens","Kroger",
    "Chipotle","Spotify","YouTube","LinkedIn","Reddit","Snapchat","Pinterest","Patagonia","Trader Joe's","Wegmans"],
  /* check 14 — decimals with or without a leading digit (statistics are
     usually written ".84", "r = .93"), and percentages */
  statRe: /\b\d+\.\d+\b|(?:^|[^0-9])\.\d+\b|\b\d+(?:\.\d+)?%/
};

/* ================= translation layer (Part B §B2) — the model has none of
   our vocabulary; send meanings, never keys ================= */
var IDEATYPE = {
  lab:    "a verification activity — students check AI's confident work against something real. It is not open-ended research.",
  studio: "a making activity — students use AI to produce a real, tangible thing and push it past generic.",
  arena:  "a competition activity — students perform against a rival or a clock that will not wait, with AI driving the pace.",
  quests: "a simulation activity — students build an experience someone else moves through, and depth of understanding shows in the build."
};
var IDEASTAGE = {
  intro:  "meeting it for the first time — this activity carries the introduction",
  review: "they have seen it before; this reinforces it",
  extend: "extending it past what the class has covered"
};
var IDEAEXPER = {
  yes:  "many already do this work professionally",
  some: "a handful have relevant professional experience; most do not",
  no:   "this is new territory for them"
};
var IDEASIZE = { "<12": "under 12", "12-25": "about 20", "26-40": "about 30", "40+": "over 40" };

/* ================= availability & signature ================= */
function ideasKey(){ try { return localStorage.getItem("snhu-sketch-key") || null; } catch(e){ return null; } }
function ideasAvailable(){
  if (ideasKey()) return true;                                  /* pasted key works anywhere, file:// included */
  try { return typeof fetch === "function" && location.protocol !== "file:"; }  /* hosted /api/ideas needs an origin */
  catch(e){ return false; }
}
/* every input that could make a stored set of ideas wrong */
function ideaSig(c){
  var a = c.a;
  return ["w7v1", a.subject, a.course, a.topic, a.tool, a.teaches, a.stage,
    a.skill, a.output, a.material, a.matstate, a.length, a.size, a.compete,
    a.exper, a.catch, a.catchway, a.worry, a.remember, a.avoid,
    c.k, c.P.name, c.job || "", c.len
  ].join("");
}
function ideasFor(c){
  var I = c.a && c.a.ideas;
  return (I && I.sig === ideaSig(c) && I.ideas && I.ideas.length) ? I : null;
}

/* ================= the payload (Part B §B1) ================= */
function ideasPayload(c){
  var a = c.a;
  var castKeys = [c.job].concat(
    jobPool(c.k, a).map(function(j){ return j.k; }).filter(function(k){ return k !== c.job; })
  ).filter(Boolean).slice(0, 3);
  return {
    v: SKETCH_VERSION,
    course: a.course || "",
    subject: c.SU.label,
    topic: c.topic,                                   /* concept() has already split the tool out */
    tool: c.tool || "",
    teaches: a.teaches || "",
    stage: IDEASTAGE[a.stage] || "",
    skill: c.SK ? c.SK.label : "",
    output: (c.OU && a.output !== "none") ? c.OU.label : "no lasting artifact — the point is the doing",
    material: c.M.noun + (a.matstate === "messy"
      ? " — messy on purpose. Cleaning and vetting it is part of the work."
      : " — ready to use; the time goes to the thinking on top of it."),
    length: lenLabel(c.len),
    totalMinutes: c.total,
    size: IDEASIZE[a.size] || a.size || "",
    teamSize: c.teamSize,
    exper: IDEAEXPER[a.exper] || "",
    catchVerbatim: (a.catch || "").trim(),            /* NEVER paraphrased, never truncated */
    catchway: (a.catchway && CATCHWAY[a.catchway]) ? CATCHWAY[a.catchway].label : "",
    worry: a.worry || "",
    remember: (a.remember || "").trim(),
    avoid: (a.avoid || "").trim(),
    /* free-text the professor adds after seeing output — the clarify loop.
       Deliberately NOT in the signature: typing here never wipes stored
       ideas; it takes effect on the next explicit rewrite. */
    extra: (a.ideasNote || "").trim(),
    /* answered clarity questions, if the writer asked any — only when they
       belong to THIS answer-set (a stale conversation never leaks in) */
    clarifications: ((a.clarify && a.clarify.sig === ideaSig(c) && a.clarify.qs) || [])
      .filter(function(x){ return x && (x.a || "").trim(); })
      .map(function(x){ return { q: x.q, a: x.a.trim() }; }),
    type: IDEATYPE[c.k] || (c.ty.name + " — " + c.ty.blurb),
    anchor: c.P.anchor || "",                         /* the one thing kept from the seventeen activities */
    castings: castKeys.map(function(k){
      var j = AIJOB_BY_KEY[k];
      return { k: j.k, cast: j.cast, does: j.does, lift: j.lift, limit: j.limit };
    })
  };
}

/* ================= the prompts ================= */
/* the class block, shared by the idea prompt and the clarity prompt */
function ideaClassLines(p){
  var L = [];
  L.push("## The class");
  L.push("");
  L.push("- **Course:** " + p.course + " (" + p.subject + ")");
  L.push("- **Topic:** " + p.topic);
  if (p.tool) L.push("- **Software students use:** " + p.tool);
  if (p.teaches) L.push("- **What happens in class now:** " + p.teaches);
  if (p.stage) L.push("- **Where students are with the topic:** " + p.stage);
  L.push("- **What students are learning to do:** " + p.skill);
  L.push("- **What students produce:** " + p.output);
  L.push("- **What they work from:** " + p.material);
  L.push("- **Class length:** " + p.length + " (" + p.totalMinutes + " minutes of activity)");
  L.push("- **Class size:** " + p.size + ", so teams of " + p.teamSize);
  if (p.exper) L.push("- **Student experience:** " + p.exper);
  L.push("- **The mistake only an expert would catch** *(the professor's own words, use them):* \"" + p.catchVerbatim + "\"");
  if (p.catchway) L.push("- **How that mistake gets caught here:** " + p.catchway);
  if (p.remember) L.push("- **What the professor wants students to remember in a year:** " + p.remember);
  if (p.avoid) L.push("- **Keep out of it:** " + p.avoid);
  return L;
}
/* the professor's side of the clarify chat + the free-text note */
function ideaProfessorLines(p){
  var L = [];
  if (p.clarifications && p.clarifications.length){
    L.push("");
    L.push("## The professor's answers to your questions");
    L.push("");
    L.push("You asked before writing; the professor answered in their own words. These answers are corrections and context — where one contradicts anything above, the answer wins:");
    L.push("");
    p.clarifications.forEach(function(x){
      L.push("Q: " + x.q);
      L.push("A: " + x.a);
      L.push("");
    });
  }
  if (p.extra){
    L.push("");
    L.push("## More from the professor");
    L.push("");
    L.push("The professor added this in their own words, after seeing earlier output. Treat it as correction and context — where it contradicts anything above, this wins:");
    L.push("");
    L.push(p.extra);
  }
  return L;
}
/* the idea prompt — Part A, templated. The hand-tested text is the spec;
   anything Part A has that this lacks is a bug. */
function buildIdeaPrompt(p){
  var L = [];
  L.push("You are helping design one class activity for a university course. Not a lesson plan, not a syllabus — one activity a professor can picture and run next week.");
  L.push("");
  L = L.concat(ideaClassLines(p)).concat(ideaProfessorLines(p));
  L.push("");
  L.push("## What has already been decided");
  L.push("");
  L.push("This is " + p.type);
  if (p.anchor) L.push("");
  if (p.anchor) L.push("**What students check against:** " + p.anchor);
  L.push("");
  L.push("Write **three separate ideas**. Each one gives AI a different job:");
  L.push("");
  p.castings.forEach(function(j, i){
    L.push((i + 1) + ". **AI as " + j.cast + "** (casting key: `" + j.k + "`). " + j.does +
      " Where it helps: " + j.lift + " Where it runs out: " + j.limit);
  });
  L.push("");
  L.push("Each idea's `casting` field must carry its casting key exactly as given above.");
  L.push("");
  L.push("## Hard rules");
  L.push("");
  L.push("Every idea must pass all of these. If an idea cannot, throw it away and write a different one.");
  L.push("");
  L.push("1. **It has to have a situation.** Who are the students for the next " + p.totalMinutes + " minutes? What just happened? What is in front of them? Not \"teams analyse the " + "material" + "\" — a real situation with a name, a stake, and someone who wants something.");
  L.push("2. **AI has to be necessary.** State in one sentence what becomes possible that was not possible before AI. If the honest answer is \"the same thing, but faster,\" the idea fails. Throw it away.");
  L.push("3. **Use the professor's mistake, in their words.** It is the most valuable thing they told us. Build the activity so students hit it, and quote their sentence rather than paraphrasing it.");
  if (p.tool) L.push("4. **Name " + p.tool + " where it belongs.** Students are working in it, not in the abstract.");
  else L.push("4. **Stay concrete about the working material.** Students work with " + p.material.split(" — ")[0] + ", not in the abstract.");
  L.push("5. **Something has to land in the first ten minutes.** A specific moment where AI does something students did not expect it could do. It has to be guaranteed by how the activity is built, not left to luck.");
  L.push("6. **Something only a person can do.** Name it. If AI could do the whole activity, the idea fails.");
  L.push("7. **Exactly five steps that add up to " + p.totalMinutes + " minutes.** Give minutes for each.");
  if (p.avoid) L.push("8. **Respect what they said to keep out:** " + p.avoid);
  else L.push("8. **Add nothing that needs software, accounts or budget the class does not already have.**");
  L.push("9. **Say exactly what the file has to contain.** The moment that lands early has to be guaranteed by how the material is built — specific blanks, specific codes, specific redundant items. Spell it out, or the activity cannot be run.");
  L.push("10. **Say what the professor has to prepare, and how long it takes.** Be honest, with a number of minutes. A hidden hour of prep kills the idea.");
  L.push("11. **Any organisation you name must be invented.** Never use a real company.");
  L.push("12. **Any statistic you quote is a target for whoever builds the file**, not a prediction about what students will find. Set numbers_are_targets true.");
  L.push("");
  L.push("## Write it like this");
  L.push("");
  L.push("For each of the three ideas, fill the JSON fields as follows:");
  L.push("");
  L.push("- `name` — short, memorable, not jargon");
  L.push("- `situation` — three or four sentences. This is the part the professor reads first, so make it something they can picture.");
  L.push("- `why_ai` — one sentence. What is possible now that was not before.");
  L.push("- `steps` — five entries, one line of text each, with minutes.");
  L.push("- `lands_early` — the moment in the first ten minutes, and what makes it certain to happen.");
  L.push("- `goes_wrong` — how students hit the professor's mistake, and how they discover it themselves rather than being told.");
  L.push("- `human_only` — one line.");
  L.push("- `hand_in` — one line.");
  L.push("- `next_time` — the skill they could name afterwards, one line.");
  L.push("- `file_spec` — the specific properties of the material that make the early moment certain. One line per property, newline-separated.");
  L.push("- `prep` — what the professor builds beforehand, and roughly how long it takes.");
  L.push("");
  L.push("## Voice");
  L.push("");
  L.push("Write for a tired professor at 4pm. Short sentences. Concrete nouns. No jargon and no cheerleading. Never use these words: delve, leverage, robust, unlock, journey, empower, seamless, \"in today's fast-paced\". Do not name a specific AI product — say \"AI\" or \"the AI tool\".");
  return L.join("\n");
}

/* the JSON schema both transports enforce (structured outputs; array-count
   limits are unsupported there, so the checks below enforce counts) */
var IDEASCHEMA = {
  type: "object",
  properties: {
    ideas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          casting: { type: "string", description: "One of the casting keys given in the prompt, exactly." },
          name: { type: "string" },
          situation: { type: "string" },
          why_ai: { type: "string" },
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: { minutes: { type: "integer" }, text: { type: "string" } },
              required: ["minutes", "text"], additionalProperties: false
            },
            description: "Exactly five steps whose minutes sum to the class length."
          },
          lands_early: { type: "string" },
          goes_wrong: { type: "string" },
          human_only: { type: "string" },
          hand_in: { type: "string" },
          next_time: { type: "string" },
          file_spec: { type: "string" },
          prep: { type: "string" },
          numbers_are_targets: { type: "boolean" }
        },
        required: ["casting","name","situation","why_ai","steps","lands_early","goes_wrong",
                   "human_only","hand_in","next_time","file_spec","prep","numbers_are_targets"],
        additionalProperties: false
      }
    }
  },
  required: ["ideas"], additionalProperties: false
};

/* ================= the clarity pass — the writer asks first =================
   One small call before the expensive one: the writer reads the intake and
   asks up to clarifyMax questions ONLY where an answer would noticeably
   improve the ideas. A clean intake returns none and writing starts at once.
   After a rejected run, the same call re-runs seeded with the rule failures. */
function buildClarifyPrompt(p, reasons){
  var L = [];
  L.push("You are about to write three class activity ideas for a university professor, from the intake below. Before writing anything, decide whether the intake leaves you guessing anywhere that matters.");
  L.push("");
  L.push("Rules for asking:");
  L.push("- Ask at most " + IDEACHECK.clarifyMax + " questions. Fewer is better. If the intake is clear enough to write good ideas from, return an empty questions list — do not invent questions to seem thorough.");
  L.push("- Only ask what the professor alone can answer, and only where the answer would change the ideas — an ambiguous answer, a contradiction, a missing fact about how this class actually works.");
  L.push("- One plain sentence per question, addressed to the professor directly. No jargon. Never re-ask something the intake already answers, and never ask about format or preferences.");
  L.push("- For each question, `why` is one short line on what the answer unlocks.");
  if (reasons && reasons.length){
    L.push("");
    L.push("A previous set of ideas was rejected by these hard rules — ask about whatever underlying gap caused them, not about the rules themselves:");
    reasons.forEach(function(x){ L.push("- " + x); });
  }
  L.push("");
  L = L.concat(ideaClassLines(p)).concat(ideaProfessorLines(p));
  L.push("");
  L.push("The ideas will be " + p.type);
  return L.join("\n");
}
var CLARIFYSCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          q: { type: "string", description: "One plain sentence, addressed to the professor." },
          why: { type: "string", description: "One short line: what the answer unlocks." }
        },
        required: ["q", "why"], additionalProperties: false
      },
      description: "Empty when the intake is clear enough to write from."
    }
  },
  required: ["questions"], additionalProperties: false
};

/* ================= transport — one function, swap behind it (§B5) =========
   Pasted key (localStorage "snhu-sketch-key") calls the API direct from the
   browser — works from file://, for this machine and testing. Otherwise the
   hosted /api/ideas Vercel function is the real answer. Both the idea call
   and the clarity call ride the same relay; only prompt and schema differ. */
function callModel(prompt, schema){
  var key = ideasKey();
  if (key) {
    return fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 12000,
        thinking: { type: "adaptive" },
        output_config: { format: { type: "json_schema", schema: schema } },
        messages: [{ role: "user", content: prompt }]
      })
    }).then(function(res){ return res.json().then(function(j){
      if (!res.ok) throw new Error((j && j.error && j.error.message) || ("The AI service returned HTTP " + res.status + "."));
      if (j.stop_reason === "refusal") throw new Error("The AI service declined this request.");
      var text = "";
      (j.content || []).forEach(function(b){ if (b.type === "text") text += b.text; });
      return { data: JSON.parse(text), usage: j.usage || null };
    }); });
  }
  return fetch("/api/ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: prompt, schema: schema })
  }).then(function(res){ return res.text().then(function(txt){
    var j = null; try { j = JSON.parse(txt); } catch(e){}
    if (!res.ok) throw new Error((j && j.error) || ("The idea service returned HTTP " + res.status + "."));
    /* the endpoint echoes the parsed structured output as `result` (and keeps
       a legacy top-level `ideas` for old cached clients) */
    var data = (j && (j.result || j)) || null;
    if (!data) throw new Error("The idea service sent back nothing usable.");
    return { data: data, usage: (j && j.usage) || null };
  }); });
}
function getIdeas(payload){
  return callModel(buildIdeaPrompt(payload), IDEASCHEMA).then(function(r){
    return { ideas: (r.data && r.data.ideas) || [], usage: r.usage };
  });
}
function getClarity(payload, reasons){
  return callModel(buildClarifyPrompt(payload, reasons), CLARIFYSCHEMA).then(function(r){
    var qs = ((r.data && r.data.questions) || [])
      .filter(function(x){ return x && (x.q || "").trim(); })
      .slice(0, IDEACHECK.clarifyMax)
      .map(function(x){ return { q: x.q.trim(), why: (x.why || "").trim(), a: "" }; });
    return { questions: qs, usage: r.usage };
  });
}

/* ================= the fourteen checks (§B4) — reject, never repair ====== */
var IDEA_STOP = {};
("the a an of to in on for and or is are that what it with not do does did they their from at as by be was were this these those its into about than then so but if we you your our them he she his her when where which who how why can could will would should may might must have has had no nor too very just also any all each per via").split(" ").forEach(function(w){ IDEA_STOP[w] = 1; });
function ideaWords(s){
  return String(s || "").toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").split(/\s+/)
    .filter(function(w){ return w && w.length > 2 && !IDEA_STOP[w]; });
}
function ideaText(idea){
  return [idea.name, idea.situation, idea.why_ai,
    (idea.steps || []).map(function(s){ return s && s.text; }).join(" "),
    idea.lands_early, idea.goes_wrong, idea.human_only, idea.hand_in,
    idea.next_time, idea.file_spec, idea.prep].join("\n");
}
/* returns null if the idea passes, or "check N — reason" for the first failure */
function checkIdea(idea, p){
  var C = IDEACHECK, all = ideaText(idea), i;
  /* 2 — every field present and non-empty */
  var req = ["casting","name","situation","why_ai","lands_early","goes_wrong","human_only","hand_in","next_time","file_spec","prep"];
  for (i = 0; i < req.length; i++){
    if (!idea[req[i]] || !String(idea[req[i]]).trim()) return "check 2 — " + req[i] + " is missing or empty";
  }
  if (typeof idea.numbers_are_targets !== "boolean") return "check 2 — numbers_are_targets is missing";
  /* 3 — casting is one of the keys sent */
  var sent = p.castings.map(function(j){ return j.k; });
  if (sent.indexOf(idea.casting) < 0) return "check 3 — casting \"" + idea.casting + "\" was not one of the keys sent";
  /* 4 — situation is 2–5 sentences */
  var sn = String(idea.situation).split(/[.!?]+(?:\s|$)/).filter(function(x){ return x.trim().length > 2; }).length;
  if (sn < C.situationSentences[0] || sn > C.situationSentences[1]) return "check 4 — situation is " + sn + " sentences";
  /* 5 — the necessity test: why_ai must not be only a speed claim */
  if (C.speedRe.test(idea.why_ai)) {
    var substance = ideaWords(String(idea.why_ai).replace(new RegExp(C.speedRe.source, "gi"), " "));
    if (substance.length < C.speedSubstanceMin) return "check 5 — why_ai was a speed claim";
  }
  /* 6 — the planted mistake is really there */
  var cw = ideaWords(p.catchVerbatim), gw = ideaWords(idea.goes_wrong);
  var need = Math.min(C.catchConsecWords, cw.length);
  if (need > 0) {
    var found = false;
    for (i = 0; i + need <= cw.length && !found; i++){
      var gram = cw.slice(i, i + need).join(" ");
      if (gw.join(" ").indexOf(gram) > -1) found = true;
    }
    if (!found) return "check 6 — the planted mistake is not quoted in goes_wrong";
  }
  /* 7 — the tool appears. Match any DISTINCTIVE word of the tool string:
     generic words ("data", "analysis", "including") would make the check
     vacuous, but restricting to the pre-comma name alone rejected a live idea
     that said "ToolPak" throughout and never "Excel" (first live run, 18 Aug).
     Both halves of a compound tool name count. */
  if (p.tool) {
    var TOOLGENERIC = { data:1, analysis:1, analytics:1, including:1, tools:1, tool:1, software:1, suite:1, version:1, edition:1, using:1 };
    var tw = ideaWords(p.tool).filter(function(w){ return !TOOLGENERIC[w]; });
    if (!tw.length) tw = ideaWords(p.tool);
    /* no distinctive words at all (a junk answer like "no" or "-") → there is
       nothing meaningful to require; skip rather than fail unpassably. A
       faculty member's whole run once died three-for-three on this. */
    if (tw.length){
      var hit = false, alw = ideaWords(all).join(" ");
      for (i = 0; i < tw.length; i++){ if (alw.indexOf(tw[i]) > -1) { hit = true; break; } }
      if (!hit) return "check 7 — the working tool (" + p.tool + ") never appears";
    }
  }
  /* 8 — exactly five steps, minutes sum within tolerance */
  if (!idea.steps || idea.steps.length !== C.stepsRequired) return "check 8 — " + (idea.steps ? idea.steps.length : 0) + " steps, not " + C.stepsRequired;
  var sum = 0;
  for (i = 0; i < idea.steps.length; i++){
    if (!idea.steps[i] || typeof idea.steps[i].minutes !== "number" || !String(idea.steps[i].text || "").trim())
      return "check 8 — step " + (i + 1) + " is malformed";
    sum += idea.steps[i].minutes;
  }
  if (Math.abs(sum - p.totalMinutes) > C.minutesTolerance) return "check 8 — steps sum to " + sum + ", not " + p.totalMinutes;
  /* 9 — banned words */
  for (i = 0; i < C.banned.length; i++){
    if (new RegExp("\\b" + C.banned[i].replace(/[^a-z' -]/gi, "") + "\\b", "i").test(all)) return "check 9 — banned word \"" + C.banned[i] + "\"";
  }
  /* 10 — AI product names */
  for (i = 0; i < C.aiProducts.length; i++){
    if (new RegExp("\\b" + C.aiProducts[i] + "\\b", "i").test(all)) return "check 10 — names " + C.aiProducts[i];
  }
  /* 11 — file_spec present and specific */
  var props = String(idea.file_spec).split(/\n|;|•|(?:^|\s)[-–]\s/).map(function(x){ return x.trim(); }).filter(Boolean);
  if (props.length < C.fileSpecMinProps) return "check 11 — file_spec names " + props.length + " properties, needs " + C.fileSpecMinProps;
  /* 12 — prep has a time estimate */
  if (!/\b\d+\s*(?:[–—-]|to\s+\d+\s*)?\s*(?:minutes?|mins?|hours?|hrs?)\b/i.test(idea.prep)) return "check 12 — prep has no time estimate";
  /* 13 — no real organisations (a screen, not a guarantee) */
  for (i = 0; i < C.realOrgs.length; i++){
    if (new RegExp("\\b" + C.realOrgs[i].replace(/[.'&-]/g, "\\$&") + "\\b").test(all)) return "check 13 — names a real organisation (" + C.realOrgs[i] + ")";
  }
  /* 14 — statistics are labelled targets */
  if (C.statRe.test(all) && idea.numbers_are_targets !== true) return "check 14 — quotes a statistic without numbers_are_targets";
  return null;
}
/* check 1 lives here: the envelope */
function validateIdeas(raw, p){
  var out = { ideas: [], reasons: [] };
  if (!raw || !Array.isArray(raw) || raw.length < 1 || raw.length > IDEACHECK.maxIdeas) {
    out.reasons.push("check 1 — expected 1–" + IDEACHECK.maxIdeas + " ideas, got " + (raw && raw.length != null ? raw.length : "none"));
    return out;
  }
  raw.forEach(function(idea){
    var why = checkIdea(idea, p);
    if (why) out.reasons.push(why); else out.ideas.push(idea);
  });
  return out;
}

/* ================= run, store, log ================= */
var ideasBusy = false, ideasBusyKind = "", ideasErr = null, ideasRejectedAll = false;
var ideasLastSig = null, ideasAutoSig = null, clarifyAutoSig = null, ideasLastReasons = [];
/* the writer's questions for the CURRENT answer-set (persisted in S.a.clarify:
   {sig, status: "asked"|"done"|"skipped"|"empty", qs:[{q,why,a}]}) */
function clarifyFor(c){
  var C = c.a && c.a.clarify;
  return (C && C.sig === ideaSig(c)) ? C : null;
}
/* error and all-rejected are per-answer-set states: the moment any answer,
   tag, activity or casting changes, they reset so the new concept gets its
   own attempt */
function ideasSyncSig(c){
  var sig = ideaSig(c);
  if (sig !== ideasLastSig){ ideasLastSig = sig; ideasErr = null; ideasRejectedAll = false; ideasLastReasons = []; }
  return sig;
}
/* Wave 7 §6 + the clarify chat — the flow when the concept opens:
     1. the writer READS the intake first (one small call) and may ask up to
        clarifyMax questions; a clean intake asks none
     2. questions render as a chat turn; the professor answers or skips
     3. the ideas generate, carrying the answers as professor-authority context
   Each auto step fires once per answer-set (the sig); errors and all-rejected
   runs are never auto-retried — the card offers the manual path instead. */
function ideasMaybeAuto(c, sig){
  if (ideasBusy || ideasErr || ideasRejectedAll) return false;
  if (!ideasAvailable() || ideasFor(c)) return false;
  if (typeof setTimeout !== "function") return false;
  var CL = clarifyFor(c);
  if (!CL){
    if (clarifyAutoSig === sig) return false;
    clarifyAutoSig = sig;
    /* hold the busy state through the 0ms gap so every render in between
       shows progress, not a dead offer button */
    ideasBusy = true; ideasBusyKind = "clarify";
    setTimeout(function(){ ideasBusy = false; runClarity(); }, 0);
    return true;
  }
  if (CL.status === "asked") return false;      /* waiting on the professor — the chat renders */
  if (ideasAutoSig === sig) return false;
  ideasAutoSig = sig;
  ideasBusy = true; ideasBusyKind = "ideas";
  setTimeout(function(){ ideasBusy = false; runIdeas(); }, 0);
  return true;
}
/* the clarity pass. Never blocks the product: any failure marks the pass
   skipped and writing proceeds with what we have. */
function runClarity(reasons){
  if (ideasBusy || !ideasAvailable()) return;
  if (score().state === "notready") return;
  var c = concept(), sig = ideaSig(c), p = ideasPayload(c);
  ideasBusy = true; ideasBusyKind = "clarify"; ideasRepaint();
  getClarity(p, reasons).then(function(r){
    ideasBusy = false;
    S.a.clarify = { sig: sig, status: r.questions.length ? "asked" : "empty", qs: r.questions };
    jlog().push({ t: nowms(), e: "clarify", asked: r.questions.length, retry: !!(reasons && reasons.length), v: SKETCH_VERSION });
    if (reasons && reasons.length && r.questions.length) ideasRejectedAll = false;  /* the chat takes over from the rejected card */
    ideasSave(); ideasRepaint();
  }).catch(function(e){
    ideasBusy = false;
    S.a.clarify = { sig: sig, status: "skipped", qs: [] };   /* degrade: write without asking */
    try { console.log("[Session Sketch " + SKETCH_VERSION + "] clarity pass failed, writing anyway: " + ((e && e.message) || e)); } catch(x){}
    ideasSave(); ideasRepaint();
  });
}
/* the professor finished the chat turn (answered or skipped) → write */
function clarifyResolve(status){
  var c = concept(), CL = clarifyFor(c);
  if (!CL) return;
  CL.status = status;
  ideasSave();
  runIdeas();
  ideasRepaint();
}
function ideasRepaint(){
  var fn = (typeof paintResult === "function") ? paintResult
         : (typeof draw === "function") ? draw : null;
  if (fn) fn();
}
function ideasSave(){
  var fn = (typeof psave === "function") ? psave
         : (typeof save === "function") ? save : null;
  if (fn) fn();
}
function runIdeas(){
  if (ideasBusy || !ideasAvailable()) return;
  if (score().state === "notready") return;
  var c = concept(), sig = ideaSig(c), p = ideasPayload(c);
  ideasBusy = true; ideasBusyKind = "ideas"; ideasErr = null; ideasRejectedAll = false; ideasRepaint();
  getIdeas(p).then(function(r){
    var v = validateIdeas(r.ideas, p);
    /* decision 5 — measure the cost; and every rejection reason goes to the
       console as well as the log, so a failure is diagnosable from any run */
    try {
      if (r.usage) console.log("[Session Sketch " + SKETCH_VERSION + "] ideas call: " +
        (r.usage.input_tokens || "?") + " in / " + (r.usage.output_tokens || "?") + " out tokens");
      v.reasons.forEach(function(x){ console.log("[Session Sketch " + SKETCH_VERSION + "] idea rejected: " + x); });
    } catch(e){}
    jlog().push({ t: nowms(), e: "ideas", ok: v.ideas.length, failed: v.reasons.length, reasons: v.reasons, v: SKETCH_VERSION });
    ideasBusy = false;
    ideasLastReasons = v.reasons.slice();
    if (!v.ideas.length) {
      ideasRejectedAll = true;                                   /* fallback: today's text, said plainly */
    } else {
      c.a.ideas = { sig: sig, v: SKETCH_VERSION, at: nowms(), ideas: v.ideas, shown: v.ideas.length, kept: [], usage: r.usage || null, note: p.extra || "" };
    }
    ideasSave(); ideasRepaint();
  }).catch(function(e){
    ideasBusy = false;
    ideasErr = (e && e.message) || "Could not reach the idea service.";
    ideasRepaint();
  });
}
function clearIdeas(){
  if (S.a.ideas) delete S.a.ideas;
  ideasErr = null; ideasRejectedAll = false;
  ideasSave(); ideasRepaint();
}
/* decision 9 — a Keep toggle, not a pick; log the kept SET */
function toggleIdeaKeep(i){
  var I = S.a.ideas; if (!I || !I.ideas[i]) return false;
  i = +i;
  var at = I.kept.indexOf(i);
  if (at > -1) I.kept.splice(at, 1); else I.kept.push(i);
  jlog().push({ t: nowms(), e: "ideaKeep",
    kept: I.kept.map(function(x){ return I.ideas[x].casting; }),
    shown: I.ideas.length, v: SKETCH_VERSION });
  ideasSave();
  return true;
}

/* ================= the per-idea prompts ================= */
/* "write my Lab" — the existing build prompt plus the idea, which wins */
function buildPromptForIdea(c, idea){
  var L = [buildPrompt(c)];
  L.push("");
  L.push("== THE CHOSEN IDEA (this is the activity — where the ACTIVITY section above disagrees, the idea wins) ==");
  L.push("Idea: " + idea.name + "  [AI cast as " + (AIJOB_BY_KEY[idea.casting] ? AIJOB_BY_KEY[idea.casting].cast : idea.casting) + "]");
  L.push("The situation: " + idea.situation);
  L.push("Why AI has to be here: " + idea.why_ai);
  L.push("The five steps (replace the “How the activity runs” beats above; keep the framework phases and unlock words):");
  idea.steps.forEach(function(s, i){ L.push("  (" + (i + 1) + ") " + s.minutes + " min — " + s.text); });
  L.push("What lands early: " + idea.lands_early);
  L.push("Where it goes wrong on purpose: " + idea.goes_wrong);
  L.push("What only a person can do: " + idea.human_only);
  L.push("Students hand in: " + idea.hand_in);
  L.push("What they can do next time: " + idea.next_time);
  L.push("The file the activity depends on: " + idea.file_spec.replace(/\n/g, " | "));
  L.push("Professor prep: " + idea.prep);
  L.push("Every statistic above is a design target for whoever builds the file, not a prediction about what students will find.");
  L.push("Any organisation named in the idea is fictional and must stay fictional.");
  return L.join("\n");
}
/* decision 3C — "Build my file": a paste-ready prompt that builds the material */
function buildFilePrompt(c, idea){
  var L = [];
  L.push("Build the class file for a university activity called \"" + idea.name + "\" (course: " + (c.a.course || c.SU.label) + ", topic: " + c.topic + ").");
  if (c.tool) L.push("Students will work on it in " + c.tool + ", so produce a format that opens cleanly there (CSV unless the spec says otherwise).");
  L.push("");
  L.push("The file must contain, exactly:");
  idea.file_spec.split(/\n/).map(function(x){ return x.trim(); }).filter(Boolean).forEach(function(x){ L.push("- " + x); });
  L.push("");
  L.push("Rules:");
  L.push("- Every statistic in the spec is a DESIGN TARGET: engineer the data so it comes out that way when analysed. Verify before you finish.");
  L.push("- Any organisation, person or brand in the data must be invented. Never use a real one.");
  if ((c.a.avoid || "").trim()) L.push("- Keep out: " + c.a.avoid.trim());
  L.push("- Also produce a short answer key for the professor: where each engineered flaw sits, and what a correct analysis finds.");
  L.push("- Output the file contents in full, ready to copy into a file, then the answer key separately.");
  return L.join("\n");
}

/* ================= rendering — three cards; opening one is not a commitment
   (Layer 1 on the card face, Layer 2 inside a native details element) ====== */
function ideaCardHTML(idea, i, kept){
  var J = AIJOB_BY_KEY[idea.casting];
  var h = '<div class="callout idea' + (kept ? ' ikept' : '') + '" style="margin:0 0 12px' + (kept ? ';border-left:4px solid #fdb913' : '') + '">';
  h += '<div class="lbl">' + esc(idea.name) + (J ? ' &middot; AI as ' + esc(J.cast) : '') + (kept ? ' &middot; ✓ kept' : '') + '</div>';
  h += '<p>' + esc(idea.situation) + '</p>';
  h += '<p><b>Why AI has to be here:</b> ' + esc(idea.why_ai) + '</p>';
  h += '<p><b>Prep:</b> ' + esc(idea.prep) + '</p>';
  h += '<details class="ideadt"' + (kept ? ' open' : '') + '><summary>See the detail</summary>';
  /* §7 — plain words instead of our words */
  h += '<h3 style="margin-top:10px">The five steps</h3><ol class="rl">';
  idea.steps.forEach(function(s){ h += '<li><b>' + s.minutes + ' min</b> — ' + esc(s.text) + '</li>'; });
  h += '</ol>';
  h += '<p><b>What makes it land, early:</b> ' + esc(idea.lands_early) + '</p>';
  h += '<p><b>The mistake you&rsquo;re planting on purpose:</b> ' + esc(idea.goes_wrong) + '</p>';
  h += '<p><b>The part AI can&rsquo;t do for them:</b> ' + esc(idea.human_only) + '</p>';
  h += '<p><b>They hand in:</b> ' + esc(idea.hand_in) + '</p>';
  h += '<p><b>What they can do next time:</b> ' + esc(idea.next_time) + '</p>';
  h += '<p><b>The file has to contain</b> <span class="muted-note">(every statistic is a target for whoever builds the file, not a prediction)</span>:</p><ul class="rl">';
  idea.file_spec.split(/\n/).map(function(x){ return x.trim(); }).filter(Boolean).forEach(function(x){ h += '<li>' + esc(x) + '</li>'; });
  h += '</ul>';
  h += '<div class="noprint" style="margin-top:10px">';
  h += '<button class="btn btn-ink" data-icopy="' + i + '">Write my Lab</button> ';
  h += '<button class="btn btn-ghost" data-ifile="' + i + '">Build my file</button>';
  h += '<span class="copied hide" data-icopied="' + i + '">Copied</span>';
  h += '</div>';
  h += '</details>';
  h += '<div class="noprint" style="margin-top:8px"><button class="btn btn-ghost" data-ikeep="' + i + '">' + (kept ? 'Kept ✓ — un-keep' : 'Keep this idea') + '</button></div>';
  h += '</div>';
  return h;
}
/* the clarify loop — a free-text turn at the end of the intake. Whatever the
   professor types rides into the next generation as correcting context. */
function ideasNoteHTML(c, cta){
  return '<div class="noprint" style="margin:14px 0 0">' +
    '<label class="qt" style="display:block;margin:0 0 4px">Anything the ideas should know that the questions never asked?</label>' +
    '<p class="qh" style="margin:0 0 6px">Your words, straight to the writer — a correction, a constraint, the thing that makes your class different. It is used the next time ideas are written' + (cta ? ' (' + cta + ')' : '') + '. Public information only, per SNHU&rsquo;s AI &amp; data guidance.</p>' +
    '<textarea data-ideasnote="1" placeholder="e.g. most of my students work full-time in accounting firms; there is no class budget; the survey is about our own campus" style="width:100%;min-height:64px;box-sizing:border-box">' + esc(c.a.ideasNote || '') + '</textarea>' +
    '</div>';
}

function ideasHTML(c){
  /* Layer 1 (§6): this section is the first screen. data-layer="1" is how the
     portal lifts it above the tabs; everything else on the results page sits
     inside the .l3 wrapper behind the workshop toggle. */
  var h = '<div class="card hero" data-layer="1"><div class="eb">' + c.ty.icon + ' ' + esc(c.ty.name) + ' Lab &middot; ' + esc(c.title) + '</div>';
  var sig = ideasSyncSig(c);
  var I = ideasFor(c);
  if (!ideasAvailable()){
    h += '<h2>Three ideas, written for this class</h2>';
    h += '<p class="lead">Showing the standard version — the custom ideas need a connection. Opened online, this page writes three activity ideas for ' + esc(c.topicShort) + ' — each with a real situation, a different job for AI, and the file to build. Turn on the workshop view below to see the standard concept in full.</p>';
    h += '</div>';
    return h;
  }
  if (ideasBusy || ideasMaybeAuto(c, sig)){
    if (ideasBusyKind === "clarify"){
      h += '<h2>Reading your answers…</h2>';
      h += '<p class="lead">Before writing, the writer checks your answers for anything unclear or missing. If it has a question, it asks you first; if not, the ideas start writing on their own. A few seconds.</p>';
      h += '<div class="noprint"><button class="btn btn-ink" disabled>Reading…</button></div>';
    } else {
      h += '<h2>Writing three ideas…</h2>';
      h += '<p class="lead">Three activity ideas for ' + esc(c.topicShort) + ' — each with an invented situation, a different job for AI, and the exact file to build. This is real writing and usually takes a minute or two; leave the page open.</p>';
      h += '<div class="noprint"><button class="btn btn-ink" disabled>Writing…</button></div>';
    }
  } else if (!I && clarifyFor(c) && clarifyFor(c).status === "asked"){
    /* the chat turn: the writer asked; the professor answers or skips */
    var CL = clarifyFor(c);
    h += '<h2>Before it writes, ' + (CL.qs.length === 1 ? 'one question' : CL.qs.length + ' questions') + '</h2>';
    h += '<p class="lead">The writer read your answers and wants to be sure of ' + (CL.qs.length === 1 ? 'one thing' : 'a few things') + ' before inventing the ideas. Answer in your own words — a sentence is plenty — or skip and it writes with what it has.</p>';
    h += '<p class="muted-note" style="margin:0 0 10px">Public information only, per SNHU&rsquo;s AI &amp; data guidance — no student records, no personal or confidential details.</p>';
    CL.qs.forEach(function(x, i){
      h += '<div class="callout" style="margin:0 0 10px"><div class="lbl">The writer asks</div>' +
           '<p style="margin:0 0 4px">' + esc(x.q) + '</p>' +
           (x.why ? '<p class="muted-note" style="margin:0 0 8px">' + esc(x.why) + '</p>' : '') +
           '<textarea data-clarifya="' + i + '" placeholder="Your answer, in your words…" style="width:100%;min-height:48px;box-sizing:border-box">' + esc(x.a || '') + '</textarea></div>';
    });
    h += '<div class="noprint"><button class="btn btn-ink" data-ideas="clarified">Use my answers and write the ideas</button> ' +
         '<button class="btn btn-ghost" data-ideas="skipclarify" style="margin-left:8px">Skip — write with what it has</button></div>';
  } else if (I){
    h += '<h2>' + I.ideas.length + (I.ideas.length === 1 ? ' idea' : ' ideas') + ' for this class</h2>';
    h += '<p class="lead">The type, the casting and the rules came from your answers; the situations are invented to fit them. Open any of them — opening is not choosing. <b>Keep</b> the ones you could run: each kept idea gets its own build prompt, and the saved concept carries every kept idea. Two ideas is a term’s worth of material, not indecision.</p>';
    if (I.ideas.length < (I.shown || I.ideas.length) || I.ideas.length < 3){
      h += '<p class="muted-note" style="margin:0 0 10px">' + I.ideas.length + ' of 3 met the bar — the rest were rejected rather than padded' +
           (ideasLastReasons.length ? ': ' + esc(ideasLastReasons.join(' · ')) : '.') + '</p>';
    }
    I.ideas.forEach(function(idea, i){ h += ideaCardHTML(idea, i, I.kept.indexOf(i) > -1); });
    h += ideasNoteHTML(c, 'the button below');
    h += '<div class="noprint" style="margin-top:8px"><button class="btn btn-ghost" data-ideas="run">Write three new ideas</button> <button class="btn btn-ghost" data-ideas="clear" style="margin-left:8px">Remove the ideas</button></div>';
    if (I.usage) h += '<div class="fac"><div class="lbl">What this run cost</div>This run used ' + (I.usage.input_tokens || "?") + ' input / ' + (I.usage.output_tokens || "?") + ' output tokens (v ' + esc(I.v || SKETCH_VERSION) + ').</div>';
  } else if (ideasRejectedAll){
    h += '<h2>Three ideas, written for this class</h2>';
    h += '<p class="lead">Showing the standard version — the custom ideas did not meet the bar. Every idea that came back failed a hard rule and was rejected rather than repaired. The standard concept is in the workshop view below; try again if you like.</p>';
    if (ideasLastReasons.length){
      h += '<details class="axisdt" style="margin:0 0 12px"><summary>What failed, rule by rule</summary><ul class="rl" style="margin-top:8px">';
      ideasLastReasons.forEach(function(x){ h += '<li>' + esc(x) + '</li>'; });
      h += '</ul><p class="muted-note">These reasons are also written into the concept’s log — if the same rule keeps firing, that rule needs tuning, not your answers.</p></details>';
    }
    h += ideasNoteHTML(c, 'Try again uses it');
    h += '<div class="noprint" style="margin-top:8px"><button class="btn btn-ink" data-ideas="askfix">Let the writer ask you what to fix</button> ' +
         '<button class="btn btn-ghost" data-ideas="run" style="margin-left:8px">Just try again</button></div>';
  } else {
    h += '<h2>Three ideas, written for this class</h2>';
    h += '<p class="lead">One click writes three activity ideas for ' + esc(c.topicShort) + ' — each with a real situation (an invented client, a stake, a deadline), a different job for AI, the five steps with minutes, and the exact file to build. Your answers already decided the type and the casting; every idea is checked against the hard rules and any that fail are rejected.</p>';
    h += ideasNoteHTML(c, '');
    h += '<div class="noprint" style="margin-top:8px"><button class="btn btn-ink" data-ideas="run">Write three ideas</button></div>';
  }
  if (ideasErr){
    h += '<div class="warn" style="margin-top:12px"><div class="lbl">The ideas did not arrive</div>' + esc(ideasErr) + ' Nothing is lost — your answers are kept, and the standard concept is one click away in the workshop view.</div>';
  }
  h += '</div>';
  return h;
}

/* ================= events ================= */
function ideaCopy(text, i){
  function flash(){
    var m = document.querySelector('[data-icopied="' + i + '"]');
    if (!m) return;
    m.classList.remove("hide"); setTimeout(function(){ m.classList.add("hide"); }, 1800);
  }
  function fallback(){
    var t = document.createElement("textarea"); t.value = text;
    document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); } catch(e){}
    document.body.removeChild(t); flash();
  }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(flash, fallback);
  else fallback();
}
/* the clarify box and the chat answers save as they type — no repaint, so
   focus never jumps */
document.addEventListener("input", function(e){
  var el = e.target;
  if (!el || !el.getAttribute) return;
  if (el.getAttribute("data-ideasnote")){
    S.a.ideasNote = el.value;
    ideasSave();
    return;
  }
  var qa = el.getAttribute("data-clarifya");
  if (qa != null && qa !== ""){
    var CL = S.a.clarify;
    if (CL && CL.qs && CL.qs[+qa]){ CL.qs[+qa].a = el.value; ideasSave(); }
  }
});
document.addEventListener("click", function(e){
  var t = (e.target && e.target.closest) ? e.target : null;
  if (!t) return;
  var b;
  if ((b = t.closest("[data-ideas]"))){
    var v = b.getAttribute("data-ideas");
    if (v === "run") runIdeas();
    else if (v === "clear") clearIdeas();
    else if (v === "clarified") clarifyResolve("done");
    else if (v === "skipclarify") clarifyResolve("skipped");
    else if (v === "askfix") runClarity(ideasLastReasons);
    return;
  }
  if ((b = t.closest("[data-ikeep]"))){
    /* update in place — a full repaint would slam shut every open card */
    var i = +b.getAttribute("data-ikeep");
    if (toggleIdeaKeep(i)){
      var kept = S.a.ideas.kept.indexOf(i) > -1;
      b.textContent = kept ? "Kept ✓ — un-keep" : "Keep this idea";
      var card = b.closest(".idea");
      if (card){
        card.classList.toggle("ikept", kept);
        card.style.borderLeft = kept ? "4px solid #fdb913" : "";
        var dt = card.querySelector("details.ideadt");
        if (dt && kept) dt.open = true;
      }
    }
    return;
  }
  if ((b = t.closest("[data-icopy]"))){
    var c1 = concept(), I1 = ideasFor(c1), ix1 = +b.getAttribute("data-icopy");
    if (I1 && I1.ideas[ix1]) ideaCopy(buildPromptForIdea(c1, I1.ideas[ix1]), ix1);
    return;
  }
  if ((b = t.closest("[data-ifile]"))){
    var c2 = concept(), I2 = ideasFor(c2), ix2 = +b.getAttribute("data-ifile");
    if (I2 && I2.ideas[ix2]) ideaCopy(buildFilePrompt(c2, I2.ideas[ix2]), ix2);
    return;
  }
});
