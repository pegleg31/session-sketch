/* ============================================================
   WAVE 2 PROTOTYPE — the kind split, for review only.
   NOT wired into Session-Sketch.html. This is the "regression
   analysis on paper" the round-3 plan (section 5) asks for,
   made runnable so the numbers are real, not asserted.

   It reuses the LIVE pulls for material, catchway and compete by
   extracting them from Session-Sketch.html, and replaces only the
   single `kind` contribution with a two-axis (skill, output) pair.

   Usage: node Session-Sketch-wave2-prototype.js
   ============================================================ */
const fs = require('fs');

/* ---- pull the live engine so material/catchway/compete/preference are faithful ---- */
const src = fs.readFileSync('Session-Sketch.html', 'utf8');
const blocks = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
fs.writeFileSync('_b_w2.js', blocks.join('\n').split('"use strict";').join(''));
function el(){return {innerHTML:'',textContent:'',style:{},value:'',disabled:false,
  classList:{toggle(){},add(){},remove(){}},addEventListener(){},setAttribute(){},
  getAttribute(){return null;},focus(){},click(){},select(){},appendChild(){},removeChild(){}};}
global.document={getElementById:()=>el(),createElement:()=>el(),querySelector:()=>null,addEventListener(){},
  body:{classList:{toggle(){}},appendChild(){},removeChild(){}},activeElement:null,
  documentElement:{scrollTop:0},execCommand(){return true;}};
global.window={pageYOffset:0,scrollTo(){},print(){}};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.navigator={}; global.Blob=function(){};
global.URL={createObjectURL:()=>'',revokeObjectURL(){}}; global.confirm=()=>false;
eval(fs.readFileSync('_b_w2.js','utf8'));
fs.unlinkSync('_b_w2.js');
/* now MAT, CATCHWAY, COMPETE, TYPES, ORDER, addPull are in scope */

/* ============================================================
   PROPOSED TWO-AXIS PULLS
   Skill axis: magnitude ~2, carries ALL the penalties (as today).
   Output axis: magnitude ~2, ALL positive (per plan).
   ============================================================ */
var SKILL = {
 /* merged technique+calculation: they scored identically and both mean "a procedure with a right answer" */
 perform:    {label:"Perform a technique, procedure, or calculation with a right and wrong way",
              pull:{lab:2,   studio:0.5, quests:-1.5, arena:0}},
 /* NEW — the generative/making skill. Closes the accessibility gap: design, engineering,
    English composition, art, experiment design, and math proofs had no skill home before.
    "prove/construct" added 12 Aug so math/logic faculty recognize themselves. Pulls Create. */
 make:       {label:"Design, build, compose, or prove something new",
              pull:{studio:2, arena:0.5, lab:0.25,   quests:0}},
 standard:   {label:"Apply a regulation, standard, or required form",
              pull:{lab:1.75,studio:0.5, quests:-1,   arena:0}},
 tooluse:    {label:"Operate a tool, platform, or system",
              pull:{studio:1.5,lab:0.75, quests:-0.5, arena:0}},
 situation:  {label:"Handle a situation or interaction with people in it",
              pull:{quests:2, arena:0.75,lab:0.25,   studio:-1}},
 process:    {label:"Run a process or workflow across people and steps",
              pull:{quests:1.25,arena:1.25,studio:0.25,lab:0}},
 judgment:   {label:"Make a judgment call with no clean answer",
              pull:{quests:1.25,arena:1.5,lab:0.5,    studio:-0.5}},
 interpret:  {label:"Interpret, argue, or contextualize — texts, claims, events",
              pull:{lab:1.75,quests:0.5, studio:0.25, arena:0.25}}
};
var OUTPUT = {
 build:     {label:"A working build (it runs or it doesn't)",
             pull:{studio:2,  lab:1.5,  arena:0.5,  quests:0}},
 finding:   {label:"A verified finding with its evidence",
             pull:{lab:2,     quests:0.25,studio:0, arena:0}},
 planspec:  {label:"A plan, proposal, or spec",
             pull:{studio:1.5,arena:0.5, lab:0.25,  quests:0.25}},
 designed:  {label:"A designed piece (a brief answered)",
             pull:{studio:2,  arena:0.5, quests:0.25,lab:0}},
 formdoc:   {label:"A document in a required form",
             pull:{studio:1.5,lab:1.5,  quests:0,   arena:0}},
 population:{label:"A profile of a population or market",
             pull:{lab:1.5,   quests:0.75,studio:0.5,arena:0}},
 decision:  {label:"A decision, committed and defended",
             pull:{arena:1.5, quests:1,  lab:0.25,  studio:0}},
 experience:{label:"An experience someone else can move through",
             pull:{quests:2,  studio:0.25,lab:0,    arena:0}},
 none:      {label:"None — the point is the doing",
             pull:{}}   /* APPROVED 12 Aug: included, scores 0, so Q-A decides alone */
};

/* ============================================================
   CONFLICT LOGIC in axis terms (rewrites conflictPair()).
   A pair is incoherent when the skill is about PEOPLE and the
   output is a THING THAT RUNS, or vice-versa. Plus the existing
   material/axis incoherences carried across.
   Returns a reason string, or null.
   ============================================================ */
function conflictAxis(skill, output, material){
  /* the headline new shape from the plan: people-situation that "produces a working build" */
  var peopleSkills = {situation:1, judgment:1};
  var thingOutputs = {build:1};
  if(peopleSkills[skill] && thingOutputs[output])
    return "You are having students handle a situation with people in it, but the thing they produce is a working build. Those are two different Labs. Pick the one this class is really about.";
  /* a pure-doing performance that also claims an experience-for-others artifact */
  if(skill==="perform" && output==="experience")
    return "A right/wrong technique does not naturally yield an experience for someone else to move through. If the point is the doing, choose 'None' for the output; if it is the walkthrough, the skill is really handling a situation.";
  /* carried-over material incoherences (subset of the old conflictPair, now keyed on output) */
  var bad = {
    data:   ["experience","designed"],
    casefile:["build"],
    made:   [],
    claims: ["build"],
    process:[],
    text:   ["build"]
  };
  if((bad[material]||[]).indexOf(output) > -1)
    return "Students have "+ (MAT[material]?MAT[material].noun.replace(/^the /,""):material) +
           " in front of them, but the output you named does not come out of that material. One of the two is the real Lab.";
  return null;
}

/* ============================================================
   score2 — mirrors the live score() but with the two-axis kind.
   Everything after the kind block is copied from the current engine.
   ============================================================ */
function score2(a){
  var sc = {studio:0,lab:0,arena:0,quests:0};

  /* --- content: the heavy inputs (kind now splits into two axes) --- */
  if(a.skill && SKILL[a.skill]) addPull(sc, SKILL[a.skill].pull);     /* skill axis, up to 2, penalties */
  if(a.output && OUTPUT[a.output]) addPull(sc, OUTPUT[a.output].pull); /* output axis, up to 2, all positive */
  if(a.material && MAT[a.material]) addPull(sc, MAT[a.material].pull);
  if(a.catchway && CATCHWAY[a.catchway]) addPull(sc, CATCHWAY[a.catchway].pull);
  if(a.compete && COMPETE[a.compete]) addPull(sc, COMPETE[a.compete].pull);

  /* --- preference: refines (audience question removed in W1-6) --- */
  if(a.doDiff && sc.hasOwnProperty(a.doDiff)) sc[a.doDiff] += 2;
  if(a.goeswrong && sc.hasOwnProperty(a.goeswrong)) sc[a.goeswrong] += 2;

  /* --- worry: a nudge only --- */
  if(a.worry==="wrong"){ sc.lab+=0.5; sc.quests+=0.5; }
  if(a.worry==="generic") sc.studio+=0.5;
  if(a.worry==="sources") sc.lab+=1;

  var ranked = ORDER.slice().sort(function(x,y){ return sc[y]-sc[x]; });

  var guard=null, ruledOut=null;
  if(a.compete==="neither" && ranked[0]==="arena"){
    ruledOut="arena"; var moved=ranked.shift(); ranked.push(moved);
  }

  /* three output states */
  var top=sc[ranked[0]], second=sc[ranked[1]], gap=top-second;
  var state="confident", notReady=[];
  if(!(a.catch||"").trim()) notReady.push("no planted error");
  var cf = conflictAxis(a.skill, a.output, a.material);
  if(cf) notReady.push(cf);
  if(top < 4) notReady.push("nothing scored above 4");
  if(notReady.length) state="notready";
  else if(gap <= 1.5) state="two";

  return {sc:sc, ranked:ranked, gap:gap, state:state, ruledOut:ruledOut, notReady:notReady};
}

/* ============================================================
   THE SUITE: 10 existing cases restructured to (skill, output),
   plus the 4 new two-axis cases named in the plan, plus the
   headline conflict demonstration (situation + build).
   ============================================================ */
var BASE = {length:"75", size:"12-25", exper:"some", remember:"r", teaches:"t"};
function mk(o){ return Object.assign({}, BASE, o); }

var CASES = [
 {name:"Joins / CIS-255", mustFirst:"lab", note:"perform + working build",
  a:mk({subject:"computing", skill:"perform", output:"build", material:"data", compete:"neither",
        catch:"a join that runs clean but drops unmatched rows", catchway:"run", worry:"wrong",
        doDiff:"lab", goeswrong:"lab"})},
 {name:"A disruptive classroom", mustFirst:"quests", note:"handle a situation + experience",
  a:mk({subject:"education", skill:"situation", output:"experience", material:"casefile", compete:"neither",
        catch:"a de-escalation script that escalates a power struggle", catchway:"consequence", worry:"wrong",
        doDiff:"quests", goeswrong:"quests"})},
 {name:"Minimum wage and employment", mustFirst:"lab", note:"interpret/argue + verified finding",
  a:mk({subject:"justice", skill:"interpret", output:"finding", material:"claims", compete:"neither",
        catch:"a causal claim from one city with no comparison group", catchway:"source", worry:"sources",
        doDiff:"lab", goeswrong:"lab"})},
 {name:"Brand identity for a small business", mustFirst:"studio", note:"design/build/compose + designed piece",
  a:mk({subject:"design", skill:"make", output:"designed", material:"made", compete:"neither",
        catch:"a logo that works on screen and dies at print sizes", catchway:"expertise", worry:"generic",
        doDiff:"studio", goeswrong:"studio"})},
 {name:"A database schema", mustFirst:"studio", note:"design/build/compose + plan/spec",
  a:mk({subject:"computing", skill:"make", output:"planspec", material:"made", compete:"neither",
        catch:"a schema that normalizes cleanly but cannot answer the daily query", catchway:"expertise", worry:"thinking",
        doDiff:"studio", goeswrong:"studio"})},
 {name:"Choosing a significance test", mustFirst:"lab", note:"perform (calculation) + verified finding",
  a:mk({subject:"analytics", skill:"perform", output:"finding", material:"data", compete:"neither",
        catch:"a test run without checking its assumptions hold", catchway:"run", worry:"wrong",
        doDiff:"lab", goeswrong:"lab"})},
 {name:"A live intrusion", mustFirst:"arena", note:"run a process + decision, clock",
  a:mk({subject:"cyber", skill:"process", output:"decision", material:"process", compete:"clock",
        catch:"triaging by alert volume instead of asset value", catchway:"losing", worry:"thinking",
        doDiff:"arena", goeswrong:"arena"})},
 {name:"Pitching for a seed fund", mustFirst:"arena", stateAny:["confident","two"], note:"make a judgment + plan/spec, rival",
  a:mk({subject:"business", skill:"judgment", output:"planspec", material:"made", compete:"rival",
        catch:"a financial ask with no stated use of funds", catchway:"losing", worry:"generic",
        doDiff:"studio", goeswrong:"arena"})},
 {name:"Plea negotiation", mustFirst:"arena", notFirst:"quests", note:"handle a situation + decision, rival",
  a:mk({subject:"justice", skill:"situation", output:"decision", material:"casefile", compete:"rival",
        catch:"conceding the strongest count first", catchway:"losing", worry:"thinking",
        doDiff:"arena", goeswrong:"arena"})},
 {name:"Writing a lesson plan", mustFirst:"studio", notFirst:"arena", note:"perform (right/wrong) + plan/spec — stress-tests a Research-leaning skill still landing Create",
  a:mk({subject:"education", skill:"perform", output:"planspec", material:"made", compete:"clock",
        catch:"an objective written as an activity nothing could measure", catchway:"expertise", worry:"generic",
        doDiff:"studio", goeswrong:"studio"})},

 /* ---- the 4 new two-axis cases named in the plan ---- */
 {name:"[NEW] Joins-as-build", mustFirst:"lab", newcase:true,
  note:"same inputs as Joins; the point is that Create is now visibly non-trivial (build output), so the activity language keeps BOTH facts",
  a:mk({subject:"computing", skill:"perform", output:"build", material:"data", compete:"neither",
        catch:"a join that runs clean but drops unmatched rows", catchway:"run", worry:"wrong",
        doDiff:"lab", goeswrong:"lab"})},
 {name:"[NEW] Disruptive classroom + IEP", mustFirst:"quests", newcase:true,
  note:"situation + required-form document; must NOT flag conflict (a document is a legitimate artifact of a handled situation) and must stay Simulate",
  a:mk({subject:"education", skill:"situation", output:"formdoc", material:"casefile", compete:"neither",
        catch:"an IEP goal too vague to measure", catchway:"consequence", worry:"wrong",
        doDiff:"quests", goeswrong:"quests"})},
 {name:"[NEW] Pitch + plan", mustFirst:"arena", stateAny:["confident","two"], newcase:true,
  note:"same as the pitch-off; confirms plan-output + rival still lands Compete first",
  a:mk({subject:"business", skill:"judgment", output:"planspec", material:"made", compete:"rival",
        catch:"a financial ask with no stated use of funds", catchway:"losing", worry:"generic",
        doDiff:"studio", goeswrong:"arena"})},
 {name:"[NEW] Schema + technique", mustFirst:"studio", newcase:true,
  note:"schema framed as a right/wrong technique producing a build; lands Create on material+preference, but Research is now visibly present (the 'it also runs' half)",
  a:mk({subject:"computing", skill:"perform", output:"build", material:"made", compete:"neither",
        catch:"a schema that cannot answer the daily query", catchway:"expertise", worry:"thinking",
        doDiff:"studio", goeswrong:"studio"})},

 /* ---- accessibility: disciplines that had NO skill home before the 'make' addition ---- */
 {name:"[ACCESS] English composition", mustFirst:"studio", newcase:true,
  note:"creative/analytical writing — 'compose'; previously forced into 'operate a tool'. Must land Create.",
  a:mk({subject:"humanities", skill:"make", output:"designed", material:"made", compete:"neither",
        catch:"a thesis that restates the prompt instead of making a claim", catchway:"expertise", worry:"generic",
        doDiff:"studio", goeswrong:"studio"})},
 {name:"[ACCESS] Engineering design", mustFirst:"studio", newcase:true,
  note:"design a component/structure — 'design'; produces a build that also runs. Create leads, Research visible.",
  a:mk({subject:"engineering", skill:"make", output:"build", material:"made", compete:"neither",
        catch:"a design that meets static load and ignores the dynamic case", catchway:"run", worry:"wrong",
        doDiff:"studio", goeswrong:"studio"})},
 {name:"[ACCESS] Math proof (construct/prove)", mustFirst:"lab", newcase:true,
  note:"construct a proof — the 'prove' verb added 12 Aug. Framed as verifying soundness it lands Research, with the construction half (Create) visible. A prof who frames it as 'make something they couldn't' would push Create up — both are legitimate.",
  a:mk({subject:"mathphys", skill:"make", output:"finding", material:"made", compete:"neither",
        catch:"a proof step that divides by a quantity that can be zero", catchway:"expertise", worry:"wrong",
        doDiff:"lab", goeswrong:"lab"})},
 {name:"[ACCESS] Titration (none output)", mustFirst:"lab", newcase:true,
  note:"pure-doing lab procedure with NO lasting artifact — exercises the 'None' output (scores 0), so Q-A (perform) decides alone. Confirms faculty aren't forced to invent an output.",
  a:mk({subject:"sciences", skill:"perform", output:"none", material:"data", compete:"neither",
        catch:"a result reported without a control condition", catchway:"run", worry:"wrong",
        doDiff:"lab", goeswrong:"lab"})},

 /* ---- the headline conflict shape (must land NOTREADY) ---- */
 {name:"[CONFLICT] Situation + working build", mustState:"notready", newcase:true,
  note:"handle-a-situation skill with a working-build output = incoherent; must land notready",
  a:mk({subject:"education", skill:"situation", output:"build", material:"casefile", compete:"neither",
        catch:"x", catchway:"consequence", worry:"wrong", doDiff:"quests", goeswrong:"quests"})}
];

/* ---- run ---- */
var fail=0, rows=[];
CASES.forEach(function(cs){
  var r=score2(cs.a);
  var probs=[];
  if(cs.mustFirst && r.ranked[0]!==cs.mustFirst) probs.push("landed "+TYPES[r.ranked[0]].name+", must be "+TYPES[cs.mustFirst].name);
  if(cs.notFirst && r.ranked[0]===cs.notFirst) probs.push("must not land "+cs.notFirst);
  if(cs.mustState && r.state!==cs.mustState) probs.push("state "+r.state+", expected "+cs.mustState);
  if(cs.stateAny && cs.stateAny.indexOf(r.state)<0) probs.push("state "+r.state+", expected one of "+cs.stateAny);
  var scstr=ORDER.map(function(k){ return TYPES[k].name.slice(0,2)+" "+r.sc[k].toFixed(2); }).join(" | ");
  rows.push((probs.length?"FAIL ":"ok   ")+cs.name.padEnd(34)+(TYPES[r.ranked[0]]?TYPES[r.ranked[0]].name:"-").padEnd(9)+r.state.padEnd(10)+scstr
            +(probs.length?"\n      -> "+probs.join("; "):""));
  if(probs.length) fail++;
});
console.log(rows.join("\n"));
console.log(fail?("\n"+fail+" CASE(S) FAILED"):"\nAll "+CASES.length+" cases behave as designed");
process.exit(fail?1:0);
