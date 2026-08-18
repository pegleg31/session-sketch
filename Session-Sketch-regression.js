/* Regression harness for Session-Sketch.html — run after ANY scoring change.
   Usage: node Session-Sketch-regression.js   (from this folder)
   On this machine node lives at %LOCALAPPDATA%\nodejs-portable\node-v22.12.0-win-x64\node.exe.
   Extracts the seven script blocks, stubs the DOM, and runs the ten known cases
   from HANDOFF-Session-Sketch.md with their full canonical answer sets.
   Expected scores as of 11 Aug 2026 (post W1-6) are recorded in the handoff table. */
const fs = require('fs');

const src = fs.readFileSync('Session-Sketch.html', 'utf8');
const blocks = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (blocks.length !== 8) throw new Error('expected 8 script blocks (7 + Wave 5 block 1a), got ' + blocks.length);
fs.writeFileSync('_b.js', blocks.join('\n').split('"use strict";').join(''));

/* ---- DOM stubs ---- */
function el() {
  return {
    innerHTML: '', textContent: '', style: {}, value: '', disabled: false,
    classList: { toggle() {}, add() {}, remove() {} },
    addEventListener() {}, setAttribute() {}, getAttribute() { return null; },
    focus() {}, click() {}, select() {}, appendChild() {}, removeChild() {}
  };
}
global.document = {
  getElementById: () => el(), createElement: () => el(),
  querySelector: () => null, addEventListener() {},
  body: { classList: { toggle() {} }, appendChild() {}, removeChild() {} },
  activeElement: null, documentElement: { scrollTop: 0 },
  execCommand() { return true; }
};
global.window = { pageYOffset: 0, scrollTo() {}, print() {} };
global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
global.navigator = {};
global.Blob = function () {};
global.URL = { createObjectURL: () => '', revokeObjectURL() {} };
global.confirm = () => false;

eval(fs.readFileSync('_b.js', 'utf8'));

/* ---- the ten cases (full answer sets; reconstructed 2026-08-11 and now canonical) ---- */
const BASE = { length: "75", size: "12-25", exper: "some", remember: "r", teaches: "lecture and practice" };
/* Wave 2: each case's single `kind` is replaced by a (skill, output) pair. */
const CASES = [
 { name: "Joins / CIS-255", must: "lab", state: "confident", pattern: "Execute and Verify",
   a: { subject:"computing", course:"CIS-255", topic:"joins", skill:"perform", output:"build", material:"data",
        compete:"neither", catch:"a join that runs clean but silently drops the rows with no match",
        catchway:"run", worry:"wrong", doDiff:"lab", goeswrong:"lab" } },
 { name: "A disruptive classroom", must: "quests", state: "confident",
   a: { subject:"education", course:"EDU-330", topic:"a disruptive classroom moment", skill:"situation", output:"experience", material:"casefile",
        compete:"neither", catch:"a de-escalation script that reads calm on paper but escalates a power struggle",
        catchway:"consequence", worry:"wrong", doDiff:"quests", goeswrong:"quests" } },
 { name: "Minimum wage and employment", must: "lab", state: "confident", pattern: "The Source",
   a: { subject:"justice", course:"ECO-201", topic:"minimum wage and employment", skill:"interpret", output:"finding", material:"claims",
        compete:"neither", catch:"a causal claim resting on a study of one city with no comparison group",
        catchway:"source", worry:"sources", doDiff:"lab", goeswrong:"lab" } },
 { name: "Brand identity for a small business", must: "studio", state: "confident",
   a: { subject:"design", course:"GRA-310", topic:"brand identity for a small business", skill:"make", output:"designed", material:"made",
        compete:"neither", catch:"a logo that works on screen and falls apart at print sizes",
        catchway:"expertise", worry:"generic", doDiff:"studio", goeswrong:"studio" } },
 { name: "A database schema", must: "studio", state: "confident", notPattern: "Execute and Verify",
   a: { subject:"computing", course:"CIS-320", topic:"designing a database schema", skill:"make", output:"planspec", material:"made",
        compete:"neither", catch:"a schema that normalizes cleanly but cannot answer the one query the business runs daily",
        catchway:"expertise", worry:"thinking", doDiff:"studio", goeswrong:"studio" } },
 { name: "Choosing a significance test", must: "lab", state: "confident",
   a: { subject:"analytics", course:"DAT-220", topic:"choosing a significance test", skill:"perform", output:"finding", material:"data",
        compete:"neither", catch:"a significance test run without checking whether its assumptions hold",
        catchway:"run", worry:"wrong", doDiff:"lab", goeswrong:"lab" } },
 { name: "A live intrusion", must: "arena", state: "confident",
   a: { subject:"cyber", course:"CYB-260", topic:"responding to a live intrusion", skill:"process", output:"decision", material:"process",
        compete:"clock", catch:"triaging by alert volume instead of by asset value",
        catchway:"losing", worry:"thinking", doDiff:"arena", goeswrong:"arena" } },
 { name: "Pitching for a seed fund", must: "arena", stateAny: ["confident","two"],
   a: { subject:"business", course:"BUS-400", topic:"pitching for a seed fund", skill:"judgment", output:"planspec", material:"made",
        compete:"rival", catch:"a financial ask with no stated use of funds",
        catchway:"losing", worry:"generic", doDiff:"studio", goeswrong:"arena" } },
 { name: "Plea negotiation", must: "arena", state: "confident", notFirst: "quests",
   a: { subject:"justice", course:"CRJ-315", topic:"plea negotiation", skill:"situation", output:"decision", material:"casefile",
        compete:"rival", catch:"conceding the strongest count first because it is the scariest",
        catchway:"losing", worry:"thinking", doDiff:"arena", goeswrong:"arena" } },
 { name: "Writing a lesson plan", must: "studio", state: "confident", notFirst: "arena",
   a: { subject:"education", course:"EDU-450", topic:"writing a lesson plan", skill:"perform", output:"planspec", material:"made",
        compete:"clock", catch:"an objective written as an activity description that nothing could ever measure",
        catchway:"expertise", worry:"generic", doDiff:"studio", goeswrong:"studio" } },
 /* Wave 2 guards: the axis-conflict notready path + the 'None' output must both keep working */
 { name: "[guard] situation + working build", mustState: "notready",
   a: { subject:"education", course:"EDU-330", topic:"a classroom build", skill:"situation", output:"build", material:"casefile",
        compete:"neither", catch:"x", catchway:"consequence", worry:"wrong", doDiff:"quests", goeswrong:"quests" } },
 { name: "[guard] titration + none output", must: "lab", state: "confident",
   a: { subject:"sciences", course:"BIO-210", topic:"a titration", skill:"perform", output:"none", material:"data",
        compete:"neither", catch:"a result reported without a control condition",
        catchway:"run", worry:"wrong", doDiff:"lab", goeswrong:"lab" } }
];

let fail = 0;
const rows = [];
CASES.forEach(cs => {
  S.a = Object.assign({}, BASE, cs.a);
  const r = score();
  const c = concept();
  const probs = [];
  if (cs.must && r.ranked[0] !== cs.must) probs.push('landed ' + TYPES[r.ranked[0]].name + ', must be ' + TYPES[cs.must].name);
  if (cs.mustState && r.state !== cs.mustState) probs.push('state ' + r.state + ', must be ' + cs.mustState);
  if (cs.state && r.state !== cs.state) probs.push('state ' + r.state + ', expected ' + cs.state);
  if (cs.stateAny && cs.stateAny.indexOf(r.state) < 0) probs.push('state ' + r.state + ', expected one of ' + cs.stateAny);
  if (cs.pattern && c.P.name !== cs.pattern) probs.push('pattern ' + c.P.name + ', expected ' + cs.pattern);
  if (cs.notPattern && c.P.name === cs.notPattern) probs.push('pattern must not be ' + cs.notPattern);
  if (cs.notFirst && r.ranked[0] === cs.notFirst) probs.push('must not land ' + cs.notFirst);
  /* smoke: result page and build prompt render without throwing */
  const html = resultHTML(); const bp = buildPrompt(c);
  if (!html || !bp) probs.push('render failed');
  const scstr = ORDER.map(k => TYPES[k].name.slice(0,2) + ' ' + r.sc[k].toFixed(1)).join(' | ');
  rows.push((probs.length ? 'FAIL ' : 'ok   ') + cs.name.padEnd(36) + TYPES[r.ranked[0]].name.padEnd(9)
            + r.state.padEnd(10) + scstr + '   pat: ' + c.P.name + (probs.length ? '\n      -> ' + probs.join('; ') : ''));
  if (probs.length) fail++;
});
console.log(rows.join('\n'));
console.log(fail ? '\n' + fail + ' CASE(S) FAILED' : '\nAll ' + CASES.length + ' cases pass');

/* ============ Wave 5 acceptance tests (design doc §11.9) ============
   A1 is the block above: the 12 cases must still land the same tag/state/pattern,
   which they cannot if a casting selection leaked into score(). A2–A10 below. */
let wf = 0;
function A(name, cond){ console.log((cond ? 'ok   ' : 'FAIL ') + '[W5] ' + name); if (!cond) wf++; }
const SKILLS = ["perform","make","standard","tooluse","situation","process","judgment","interpret"];
const OUTS = ["build","finding","planspec","designed","formdoc","population","decision","experience","none"];
const TAGS4 = ["studio","lab","arena","quests"];
const ALLJOBS = ["oracle","ensemble","volume","adversary","apprentice","mirror","provocateur","commissioner","witness","escalator","ghost","liveworld"];
function joinsA(extra){ return Object.assign({}, BASE, {subject:"computing",course:"CIS-255",topic:"joins",tool:"MySQL",skill:"perform",output:"build",material:"data",matstate:"messy",compete:"neither",doDiff:"lab",goeswrong:"lab",catch:"drops unmatched rows",catchway:"run",worry:"wrong"}, extra||{}); }

(function(){ var ok=true; ALLJOBS.forEach(function(jk){ S.a=joinsA({aijob:jk}); if(score().ranked[0]!=="lab") ok=false; }); A("A2 a casting never moves the tag (Joins stays Research x12)", ok); })();
(function(){ var a=joinsA(); delete a.aijob; A("A3 pickJob deterministic", pickJob("lab",a)===pickJob("lab",a)); })();
(function(){ var undef=0, illegal=0; SKILLS.forEach(function(sk){ OUTS.forEach(function(o){ var a={skill:sk,output:o,worry:"wrong"}; TAGS4.forEach(function(k){ var j=pickJob(k,a); if(j===undefined) undef++; if(j&&!jobLegal(j,k,a)) illegal++; }); }); }); A("A4 all 72x4 pairs return a legal key or null (never undefined/illegal)", undef===0&&illegal===0); })();
(function(){ var bad=false; SKILLS.forEach(function(sk){ TAGS4.forEach(function(k){ if(["commissioner","volume","mirror"].indexOf(pickJob(k,{skill:sk,output:"none",worry:"generic"}))>-1) bad=true; }); }); A("A5 output=none never returns an artifact-only job", !bad); })();
(function(){ var bad=false; ["make","situation","judgment"].forEach(function(sk){ OUTS.forEach(function(o){ TAGS4.forEach(function(k){ if(pickJob(k,{skill:sk,output:o,worry:"wrong"})==="oracle") bad=true; }); }); }); A("A6 no-ground-truth skills never get the Oracle", !bad); })();
(function(){ S.a=joinsA({tagOverride:"studio"}); var c=concept(); A("A7 casting is legal for the overridden tag", c.k==="studio" && jobLegal(c.job,"studio",S.a)); })();
(function(){ S.a=joinsA({aijob:"apprentice"}); var c1=concept(); S.a=joinsA({aijob:"apprentice",worry:"sources"}); var c2=concept(); A("A8 legal override survives a worry change", c1.job==="apprentice" && (jobLegal("apprentice","lab",S.a) ? c2.job==="apprentice" : c2.job!=="apprentice")); })();
(function(){
  S.a=joinsA(); delete S.a.aijob;
  var withBeats=concept();                                   // oracle, beats present
  var saved=AIJOB_BY_KEY.oracle, idx=AIJOB.indexOf(saved);
  var stripped=Object.assign({},saved); delete stripped.beats; delete stripped.tasks;
  AIJOB_BY_KEY.oracle=stripped; if(idx>-1) AIJOB[idx]=stripped;
  var noBeats=concept();                                     // same casting, copy stripped
  AIJOB_BY_KEY.oracle=saved; if(idx>-1) AIJOB[idx]=saved;    // restore
  A("A9 a casting with no beats/tasks falls back to the pattern strings",
    noBeats.P.runs[1]!==withBeats.P.runs[1] && noBeats.P.runs[1].length>0 && noBeats.P.tasks[1].length>0);
})();
(function(){ S.a=joinsA(); delete S.a.aijob; S.a.joblog=[]; logDerived("lab",S.a); applyJobPick("apprentice"); applyJobPick("oracle"); var L=S.a.joblog; A("A10 override log: 3 ordered entries, none rewritten", L.length===3 && L[0].e==="derived" && L[1].e==="override" && L[2].e==="override" && L[1].from===L[0].job && L[2].from==="apprentice"); })();

console.log(wf ? '\n' + wf + ' W5 TEST(S) FAILED' : 'All 10 Wave 5 acceptance tests pass');
process.exit((fail + wf) ? 1 : 0);
