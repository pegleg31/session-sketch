/* Wave 7, build step: swap the Wave 6 rewrite overlay for the Wave 7 idea
   generator in Session-Sketch.html. Supersedes build-enrich-inline.js.

   Does four things, each anchored and asserted:
     1. REVERTS the seven Wave 6 inline edits (exact inverse strings — the old
        build script is the source of these, verbatim).
     2. Replaces the wave6-enrich marker block with wave7-ideas.js under new
        markers (handles either marker set, so it is idempotent).
     3. Adds SKETCH_VERSION (engine state block) — footer, build prompt.
     4. Renders the ideas section at the top of the Activity tab.

   Idempotent: safe to re-run; re-runs re-inline the block and skip edits that
   are already applied. Run after editing wave7-ideas.js, then
   `node build-portal.js`:
       node build-ideas-inline.js

   Refuses to write a file that no longer ends in </html> or whose script-block
   count moved off 8 — the harnesses depend on both. */
var fs = require("fs");

/* THE version. Bump the .dev counter on every build that gets deployed or
   handed to anyone — two builds must never share a version string, or the
   feedback they send back can't be told apart. Drop the -dev suffix at
   release and move the CHANGELOG's Unreleased section under it. */
var VERSION = "5.0.0-dev.2";

var FILE = "Session-Sketch.html";
var s = fs.readFileSync(FILE, "utf8");
var before = s.length;
var applied = [], skipped = [];

function count(hay, needle){
  var n = 0, i = 0;
  while((i = hay.indexOf(needle, i)) > -1){ n++; i += needle.length; }
  return n;
}
/* replace `from` with `to`, exactly once — idempotent in BOTH directions.
   Grow edits (`to` contains `from`): the anchor survives inside the result, so
   "to present" must be checked first or the edit re-applies every run.
   Shrink edits (`from` contains `to`): the result is a substring of the old
   text, so "anchor present" must be checked first or the edit never applies. */
function rep(tag, from, to){
  var grows = to.indexOf(from) > -1;
  if(grows && s.indexOf(to) > -1){ skipped.push(tag); return; }
  var n = count(s, from);
  if(n === 1){ s = s.replace(from, to); applied.push(tag); return; }
  if(n === 0 && s.indexOf(to) > -1){ skipped.push(tag); return; }
  throw new Error(tag + ": expected its anchor exactly once, found " + n +
    "\n--- anchor ---\n" + from.slice(0, 240));
}

/* ---------- 1. revert the Wave 6 edits (inverse of build-enrich-inline.js) ---------- */
var CONCEPT_TAIL = '    title: t.titleFmt(topic), slug: (topic.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").split("-").slice(0,3).join("-")||"session")};\n';

rep("R2. wowOf/failOf/humanOf back to casting-then-template",
  '/* Wave 6: a stored rewrite wins; then the casting; then the tag template */\n' +
  'function wowOf(c){  return (c.EN&&c.EN.wow)     ? c.EN.wow     : (c.J ? c.J.wow      : c.t.wow(c.a));  }\n' +
  'function failOf(c){ return (c.EN&&c.EN.failure) ? c.EN.failure : (c.J ? c.J.failline : c.t.fail(c.a)); }\n' +
  'function humanOf(c){return (c.EN&&c.EN.human)   ? c.EN.human   : (c.J ? c.J.human    : c.t.human(c.a));}',
  'function wowOf(c){  return c.J ? c.J.wow      : c.t.wow(c.a);  }\n' +
  'function failOf(c){ return c.J ? c.J.failline : c.t.fail(c.a); }\n' +
  'function humanOf(c){return c.J ? c.J.human    : c.t.human(c.a);}');

rep("R3b. concept() overlay hook removed",
  CONCEPT_TAIL +
  '  /* Wave 6: overlay the stored rewrite, if it still matches these answers */\n' +
  '  if(typeof applyEnrich === "function") applyEnrich(_C);\n' +
  '  return _C;\n' +
  '}',
  CONCEPT_TAIL + '}');

rep("R3a. concept() returns its literal again",
  '  var _C = {r:r, k:k, t:t, ty:ty, a:a,',
  '  return {r:r, k:k, t:t, ty:ty, a:a,');

rep("R5. sketch lead back to the single template line",
  "(c.enriched\n" +
  "         ? '<p class=\"lead\">Rewritten in ' + esc(c.SU.label) + ' language for this topic — the shape was decided by your answers, the wording by an AI pass over them. The build prompt above is still what produces the finished, runnable session.</p>'\n" +
  "         : '<p class=\"lead\">A template-written draft — the shape is decided, the words are placeholders. The build prompt above is what produces the finished, custom-written session.</p>')+",
  "'<p class=\"lead\">A template-written draft — the shape is decided, the words are placeholders. The build prompt above is what produces the finished, custom-written session.</p>'+");

rep("R6. prompt-tab rewrite callout removed",
  "Every answer you gave is already inside it, along with instructions for the writing pass. The draft sketch below shows the shape of what will come back.</p>'+\n" +
  "       (c.enriched?'<div class=\"callout\"><div class=\"lbl\">Your rewrite is in here</div><p>The prompt below carries the '+esc(c.SU.label)+'-language wording, not the template wording, and tells the builder to keep it. Rewrite again or revert on the Activity tab and this updates with it.</p></div>':'')+",
  "Every answer you gave is already inside it, along with instructions for the writing pass. The draft sketch below shows the shape of what will come back.</p>'+");

rep("R7. buildPrompt customization pass back to the template text",
  '  if(c.enriched){\n' +
  '    L.push("The concept below has already had one AI rewriting pass into "+c.SU.label+" language, so the activity pitch, run beats, participant tasks, wow, designed failure and human-contribution lines are field-specific rather than template text. Treat that wording as the faculty member\'s intent:");\n' +
  '    L.push("- Keep the field-specific wording. Do not flatten it back toward generic language, and do not re-genericize the nouns.");\n' +
  '    L.push("- It is a draft, not finished session copy: where a beat still reads thin, deepen it in the same voice using the subject nouns given below.");\n' +
  '  } else {\n' +
  '    L.push("The concept below is template-written, so its phrasing is deliberately generic. Rewriting the language is part of the build:");\n' +
  '    L.push("- Rephrase all template language in this field\'s own professional voice, using the subject nouns given below.");\n' +
  '  }',
  '  L.push("The concept below is template-written, so its phrasing is deliberately generic. Rewriting the language is part of the build:");\n' +
  '  L.push("- Rephrase all template language in this field\'s own professional voice, using the subject nouns given below.");');

/* ---------- 2. the inlined idea code, replacing the Wave 6 block ---------- */
var src = fs.readFileSync("wave7-ideas.js", "utf8");
/* a script tag or a bare wizard-renderer call anywhere in the inlined source —
   even inside a comment — breaks the block extractors / build-portal.js */
if(/<\/?script/i.test(src)) throw new Error("wave7-ideas.js contains a literal script tag; remove it");
if(/\bdraw\(\);/.test(src)) throw new Error("wave7-ideas.js contains a bare wizard-renderer call; dispatch through a variable instead");

var W7START = "/* wave7-ideas:start", W7END = "/* wave7-ideas:end */";
var W6START = "/* wave6-enrich:start", W6END = "/* wave6-enrich:end */";
var block =
  "/* wave7-ideas:start (generated by build-ideas-inline.js from wave7-ideas.js — do not hand-edit) */\n" +
  src.replace(/\s*$/, "") + "\n" +
  "/* wave7-ideas:end */\n";

if(s.indexOf(W7START) > -1){
  var a7 = s.indexOf(W7START), b7 = s.indexOf(W7END) + W7END.length + 1;
  s = s.slice(0, a7) + block + s.slice(b7);
  applied.push("2. re-inlined wave7-ideas.js");
} else if(s.indexOf(W6START) > -1){
  var a6 = s.indexOf(W6START), b6 = s.indexOf(W6END) + W6END.length + 1;
  s = s.slice(0, a6) + block + s.slice(b6);
  applied.push("2. replaced the wave6-enrich block with wave7-ideas.js");
} else {
  var HOOK = "/* ---------- result view ---------- */\nfunction whyPrimary(c){";
  if(count(s, HOOK) !== 1) throw new Error("could not find the result-view script header exactly once");
  s = s.replace(HOOK, "/* ---------- result view ---------- */\n" + block + "function whyPrimary(c){");
  applied.push("2. inlined wave7-ideas.js into the result block");
}

/* ---------- 3. SKETCH_VERSION ---------- */
/* version-bump aware: replaces an existing constant when VERSION moved,
   inserts it on a fresh file, skips when already current */
var VLINE = 'var SKETCH_VERSION = "' + VERSION + '";   /* set by build-ideas-inline.js — bump VERSION there, never here (see CHANGELOG.md) */';
var VRE = /var SKETCH_VERSION = "[^"]+";[^\n]*/;
if(VRE.test(s)){
  if(s.match(VRE)[0] === VLINE) skipped.push("3a. SKETCH_VERSION already " + VERSION);
  else { s = s.replace(VRE, VLINE); applied.push("3a. SKETCH_VERSION bumped to " + VERSION); }
} else {
  rep("3a. SKETCH_VERSION constant in the state block",
    'var KEY = "snhu-session-sketch-v2";',
    VLINE + '\nvar KEY = "snhu-session-sketch-v2";');
}

/* on a fresh file this adds the version line so 4b's tail anchor matches;
   once 4b has run, the version line lives inside _tail and this must skip */
if(s.indexOf("return ideasHTML(c) + ") > -1){
  skipped.push("3b. version footer (already inside the layer tail)");
} else {
  rep("3b. version in the results footer",
    'h += \'<div class="navrow noprint"><button class="btn btn-ghost" data-go="3">&larr; Change my answers</button></div>\';',
    'h += \'<div class="navrow noprint"><button class="btn btn-ghost" data-go="3">&larr; Change my answers</button></div>\';\n' +
    '  h += \'<div style="margin:18px 2px 0;color:#8b9bad;font-size:11px">Session Sketch \'+esc(SKETCH_VERSION)+\'</div>\';');
}

rep("3c. version in the build prompt",
  'L.push("== BUILD NOTES ==");',
  'L.push("== BUILD NOTES ==");\n' +
  '  L.push("Generated by Session Sketch "+SKETCH_VERSION+".");');

/* ---------- 4. the three layers (Wave 7 §6) ----------
   The ideas section is Layer 1 and renders FIRST, at resultHTML's return —
   not inside the card flow. Everything the page used to show wraps in .l3
   (Layer 3), hidden unless the workshop toggle is on. Starting states
   handled: Wave 6 file (enrich call), the earlier Wave 7 in-body insertion,
   or a pristine file. */
var CAST_ANCHOR = 'if(c.J){\n    var _pool = jobPool(c.k, c.a);';
if(s.indexOf('h += enrichCardHTML(c);\n  ' + CAST_ANCHOR) > -1){
  rep("4a. enrich card call removed from the card flow",
    'h += enrichCardHTML(c);\n  ' + CAST_ANCHOR, CAST_ANCHOR);
} else if(s.indexOf('h += ideasHTML(c);\n  ' + CAST_ANCHOR) > -1){
  rep("4a. in-body ideas call removed from the card flow",
    'h += ideasHTML(c);\n  ' + CAST_ANCHOR, CAST_ANCHOR);
} else {
  skipped.push("4a. no in-body ideas/enrich call to remove");
}

var TAIL_OLD =
  '  h += \'<div class="navrow noprint"><button class="btn btn-ghost" data-go="3">&larr; Change my answers</button></div>\';\n' +
  '  h += \'<div style="margin:18px 2px 0;color:#8b9bad;font-size:11px">Session Sketch \'+esc(SKETCH_VERSION)+\'</div>\';\n' +
  '  return h;\n' +
  '}';
var TAIL_NEW =
  '  /* Wave 7 §6 — three layers: the ideas are the first screen; everything the\n' +
  '     page used to show waits behind the workshop toggle (.l3). The nav and the\n' +
  '     version footer stay visible in both views. */\n' +
  '  var _tail = \'<div class="navrow noprint"><button class="btn btn-ghost" data-go="3">&larr; Change my answers</button></div>\'\n' +
  '            + \'<div style="margin:18px 2px 0;color:#8b9bad;font-size:11px">Session Sketch \'+esc(SKETCH_VERSION)+\'</div>\';\n' +
  '  return ideasHTML(c) + \'<div class="l3">\' + h + \'</div>\' + _tail;\n' +
  '}';
rep("4b. resultHTML returns ideas + .l3 wrap + tail", TAIL_OLD, TAIL_NEW);

rep("4c. .l3 hides unless the workshop toggle is on",
  'body:not(.fac-on) .fac{display:none}',
  'body:not(.fac-on) .fac{display:none}\n' +
  'body:not(.fac-on) .l3{display:none}');

/* ---------- 5. the workshop toggle owns the whole old page now ---------- */
rep("5a. masthead toggle relabelled",
  '>Facilitator notes: off<',
  '>Workshop view: off<');
rep("5b. wizard toggle text relabelled",
  '"Facilitator notes: " + (S.fac?"on":"off")',
  '"Workshop view: " + (S.fac?"on":"off")');
var FACLBL_OLD = 'lbl">Facilitator note</div>', FACLBL_NEW = 'lbl">If you&rsquo;re running this as a workshop</div>';
var relabelled = count(s, FACLBL_OLD);
if(relabelled){ s = s.split(FACLBL_OLD).join(FACLBL_NEW); applied.push("5c. relabelled " + relabelled + " workshop notes"); }
else if(count(s, FACLBL_NEW)){ skipped.push("5c. workshop notes already relabelled"); }
else { throw new Error("5c: found neither facilitator-note label variant"); }

/* ---------- write ---------- */
if(/\b(applyEnrich|enrichCardHTML|runEnrich|enrichSig|enrichPayload)\b/.test(s) || /c\.enriched/.test(s))
  throw new Error("a Wave 6 enrich reference survived the swap — check the reverts");
if(!/<\/html>\s*$/.test(s)) throw new Error("refusing to write: file no longer ends with </html>");
var nBlocks = count(s, "<script>");
if(nBlocks !== 8) throw new Error("expected 8 <script> blocks after patching, got " + nBlocks);
fs.writeFileSync(FILE, s, "utf8");

console.log("wrote " + FILE + "  (" + before + " -> " + s.length + " bytes)");
console.log("  <script> blocks: " + nBlocks + "   ends with </html>: yes   enrich refs: none");
applied.forEach(function(t){ console.log("  applied  " + t); });
skipped.forEach(function(t){ console.log("  already  " + t); });
