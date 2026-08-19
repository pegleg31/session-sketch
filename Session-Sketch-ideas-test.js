/* Wave 7 acceptance tests — the idea generator. Supersedes the Wave 6 enrich
   tests. Usage: node Session-Sketch-ideas-test.js   (from this folder)
   Node on this machine: %LOCALAPPDATA%\nodejs-portable\node-v22.12.0-win-x64\node.exe

   Three claims locked down here:
   1. PART-A PARITY. The prompt built from the MKT-337 answers must carry every
      fact the hand-tested Part A prompt carried — anything Part A has that the
      built prompt lacks is a bug (HANDOFF-to-code-wave7.md step 4).
   2. THE FOURTEEN CHECKS reject exactly what they claim to, and a failing idea
      is dropped, never repaired — fewer ideas shown, never blander ones.
   3. THE ENGINE IS UNTOUCHED. Ideas cannot move a tag, and every state
      (offline, no key, all-rejected, error) degrades to today's tool with a
      plain line, never a blank page. */
const fs = require('fs');

const src = fs.readFileSync('Session-Sketch.html', 'utf8');
const blocks = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (blocks.length !== 8) throw new Error('expected 8 script blocks, got ' + blocks.length);
fs.writeFileSync('_bi.js', blocks.join('\n').split('"use strict";').join(''));

/* ---- DOM stubs (regression-harness shape) ---- */
function el() {
  return {
    innerHTML: '', textContent: '', style: {}, value: '', disabled: false, hidden: false, open: false,
    classList: { toggle() {}, add() {}, remove() {} },
    addEventListener() {}, setAttribute() {}, getAttribute() { return null; },
    focus() {}, click() {}, select() {}, appendChild() {}, removeChild() {},
    querySelector: () => null, querySelectorAll: () => [], scrollIntoView() {}, closest: () => null
  };
}
global.document = {
  getElementById: () => el(), createElement: () => el(),
  querySelector: () => null, querySelectorAll: () => [], addEventListener() {},
  body: { classList: { toggle() {} }, appendChild() {}, removeChild() {} },
  activeElement: null, documentElement: { scrollTop: 0 }, execCommand() { return true; }
};
global.window = { pageYOffset: 0, scrollTo() {}, print() {} };
global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
global.navigator = {};
global.Blob = function () {};
global.URL = { createObjectURL: () => '', revokeObjectURL() {} };
global.confirm = () => false;
global.location = { protocol: 'https:' };
global.fetch = function () { throw new Error('fetch stub not armed'); };

eval(fs.readFileSync('_bi.js', 'utf8'));

let pass = 0, fail = 0;
function ok(name, cond, detail) {
  if (cond) { pass++; console.log('ok   ' + name + (detail ? '   ' + detail : '')); }
  else { fail++; console.log('FAIL ' + name + (detail ? '   ' + detail : '')); }
}

/* ================= the MKT-337 case — the hand-tested Part A answers ====== */
const CATCH = "the assessment of the questions that are driving the data are not aligned with the underlying mechanism — the underlying survey questions do not measure what the analysis claims they measure";
const MKT = {
  subject: 'marketing', course: 'MKT-337 Market Research', topic: 'survey data analysis',
  tool: 'Excel, including the Data Analysis ToolPak',
  teaches: 'the professor walks them through it, then a practice exercise',
  stage: 'review', skill: 'perform', output: 'decision', material: 'data', matstate: 'messy',
  length: '50', size: '12-25', exper: 'some', compete: 'neither',
  catch: CATCH, catchway: 'run', worry: 'wrong', doDiff: 'lab', goeswrong: 'lab',
  remember: 'that the number depends entirely on what the question actually asked',
  avoid: 'No Python. This must be done with Excel tools and the Data Analysis ToolPak.'
};
function setAnswers(extra) { S.a = Object.assign({}, MKT, extra || {}); S.step = 3; }

setAnswers();
const c0 = concept();
ok('W0 the MKT case lands a confident verification Lab',
   c0.k === 'lab' && c0.r.state === 'confident', c0.k + ' ' + c0.r.state);

/* ================= 1. Part-A parity ================= */
const payload = ideasPayload(c0);
const prompt = buildIdeaPrompt(payload);

/* every fact Part A carried, greppable in the built prompt */
const PARTA = [
  ['course + subject',        'MKT-337 Market Research (Marketing)'],
  ['topic',                   'survey data analysis'],
  ['software',                'Excel, including the Data Analysis ToolPak'],
  ['what happens now',        'the professor walks them through it, then a practice exercise'],
  ['where students are',      'they have seen it before; this reinforces it'],
  ['the skill',               'Perform a technique'],
  ['the output',              'A decision, committed and defended'],
  ['material messy on purpose','messy on purpose. Cleaning and vetting it is part of the work'],
  ['class length',            '50 minutes'],
  ['teams of 4',              'teams of 4'],
  ['student experience',      'a handful have relevant professional experience'],
  ['planted mistake VERBATIM', CATCH],
  ['professor\'s own words note', "the professor's own words, use them"],
  ['remember in a year',      'the number depends entirely on what the question actually asked'],
  ['keep out',                'No Python'],
  ['type = verification',     "verification activity — students check AI's confident work against something real"],
  ['the anchor',              'executed result'],
  ['three separate ideas',    'Write **three separate ideas**'],
  ['necessity rule',          'the same thing, but faster'],
  ['first-ten-minutes rule',  'first ten minutes'],
  ['human-only rule',         'only a person can do'],
  ['five-steps rule',         'five steps that add up to 50'],
  ['file-spec rule',          'exactly what the file has to contain'],
  ['prep rule',               'what the professor has to prepare'],
  ['fictional-org rule',      'must be invented'],
  ['targets rule',            'target for whoever builds the file'],
  ['voice',                   'tired professor at 4pm'],
  ['banned words listed',     'delve, leverage, robust, unlock, journey, empower, seamless'],
  ['no product names',        'Do not name a specific AI product']
];
PARTA.forEach(([label, needle]) => {
  ok('I1 prompt carries ' + label, prompt.toLowerCase().indexOf(String(needle).toLowerCase()) > -1, cond_detail(needle));
});
function cond_detail(n){ return prompt.toLowerCase().indexOf(String(n).toLowerCase()) > -1 ? '' : 'MISSING: ' + String(n).slice(0, 60); }

ok('I2 three castings sent, derived pick first',
   payload.castings.length === 3 && payload.castings[0].k === c0.job,
   payload.castings.map(j => j.k).join(', '));
ok('I2b every casting carries cast + does + lift + limit',
   payload.castings.every(j => j.cast && j.does && j.lift && j.limit));
ok('I2c each casting is a numbered option in the prompt with helps/runs-out',
   payload.castings.every(j => prompt.indexOf('`' + j.k + '`') > -1) &&
   (prompt.match(/Where it helps:/g) || []).length === 3 &&
   (prompt.match(/Where it runs out:/g) || []).length === 3);
ok('I3 payload never sends raw keys',
   JSON.stringify(payload).indexOf('"lab"') < 0 && payload.skill.indexOf('Perform') === 0 &&
   JSON.stringify(payload).indexOf('doDiff') < 0 && JSON.stringify(payload).indexOf('goeswrong') < 0);
ok('I3b payload sends the catch verbatim, untruncated', payload.catchVerbatim === CATCH);
ok('I3c payload carries the version', payload.v === SKETCH_VERSION);

/* ================= 2. the fourteen checks ================= */
const GOOD = {
  casting: payload.castings[0].k,
  name: 'The Handoff',
  situation: 'Northgate Coffee has run the same tracker survey for three years. The analyst who owned it quit on Friday. The CMO expects the quarterly read-out on Thursday, and the raw export just landed in front of your team.',
  why_ai: 'A written analysis procedure used to be something a class argued about in the abstract, and now it executes in front of them while they watch.',
  steps: [
    { minutes: 8,  text: 'Teams read the brief and write their analysis instructions for the AI, naming each Excel step.' },
    { minutes: 10, text: 'Run the instructions; the AI produces a full read-out in the Data Analysis ToolPak workflow.' },
    { minutes: 14, text: 'Execute the same steps yourselves in Excel and compare every number against the AI run.' },
    { minutes: 10, text: 'Trace each mismatch back to the survey items that produced it.' },
    { minutes: 8,  text: 'Commit the decision: which numbers survive, and which the team refuses to report.' }
  ],
  lands_early: 'By minute eight the AI has produced a confident, complete read-out from instructions the team wrote — guaranteed, because the brief requires the instructions to be handed over as written.',
  goes_wrong: 'The read-out is fluent and the alpha is high, but the underlying survey questions do not measure what the analysis claims they measure — teams find it themselves when the tracker items are traced back to the constructs.',
  human_only: 'Deciding which numbers are safe to put in front of the CMO.',
  hand_in: 'One page: the number they will report, the number they refused to, and why.',
  next_time: 'Writing a procedure precisely enough that something else can execute it — and auditing what comes back.',
  file_spec: '220 rows of tracker responses with three blank cells in the satisfaction block\na 99 code for "prefer not to say" left in the raw column\none seven-point item sitting among five-point items so a naive average shifts',
  prep: 'Build the tracker export to the spec above — about 30 minutes.',
  numbers_are_targets: true
};
ok('C0 the good idea passes all fourteen checks', checkIdea(GOOD, payload) === null, checkIdea(GOOD, payload) || '');

function variant(patch){ return Object.assign({}, GOOD, patch); }
/* check 7 counts BOTH halves of a compound tool name — an idea that says
   "ToolPak" but never "Excel" passes (learned from the first live run) */
ok('C0b a ToolPak-only idea satisfies the tool check',
   checkIdea(variant({
     situation: GOOD.situation, why_ai: GOOD.why_ai,
     steps: GOOD.steps.map(s => ({ minutes: s.minutes, text: s.text.replace(/Excel/gi, 'the ToolPak') })),
     lands_early: GOOD.lands_early.replace(/Excel/gi, 'the ToolPak')
   }), payload) === null);

const REJECTS = [
  ['check 2', variant({ prep: '' })],
  ['check 2', variant({ numbers_are_targets: undefined })],
  ['check 3', variant({ casting: 'witness-protection' })],
  ['check 4', variant({ situation: 'Teams analyse the dataset.' })],
  ['check 5', variant({ why_ai: 'It does the same analysis, just faster and saves time.' })],
  ['check 6', variant({ goes_wrong: 'The output is wrong in a way only an expert notices, and teams find it late.' })],
  ['check 7', variant({
      name: 'The Handoff', why_ai: 'A written procedure now executes in front of the class while they watch it run.',
      steps: GOOD.steps.map(s => ({ minutes: s.minutes, text: s.text.replace(/Excel|Data Analysis ToolPak/gi, 'the spreadsheet') })),
      situation: GOOD.situation, lands_early: GOOD.lands_early.replace(/Excel/gi, 'the tool'),
      goes_wrong: GOOD.goes_wrong, file_spec: GOOD.file_spec, prep: GOOD.prep
    })],
  ['check 8', variant({ steps: GOOD.steps.slice(0, 4) })],
  ['check 8', variant({ steps: GOOD.steps.map((s, i) => i === 0 ? { minutes: 3, text: s.text } : s) })],
  ['check 9', variant({ situation: GOOD.situation + ' They leverage the export.' })],
  ['check 10', variant({ lands_early: GOOD.lands_early + ' ChatGPT produces it instantly.' })],
  ['check 11', variant({ file_spec: 'A messy dataset.' })],
  ['check 12', variant({ prep: 'Build the survey file beforehand.' })],
  ['check 13', variant({ situation: GOOD.situation.replace('Northgate Coffee', 'Starbucks') })],
  ['check 14', variant({ goes_wrong: GOOD.goes_wrong + ' The alpha lands at .84 exactly.', numbers_are_targets: false })]
];
REJECTS.forEach(([which, idea]) => {
  const why = checkIdea(idea, payload);
  ok('C ' + which + ' rejects', !!why && why.indexOf(which) === 0, why || 'PASSED but should not');
});

/* rejection, not repair: the envelope */
const v1 = validateIdeas([GOOD, variant({ why_ai: 'The same numbers, just faster and quicker.' }), variant({ name: 'The Second Desk', situation: GOOD.situation.replace('Northgate Coffee', 'Halverson Research Partners') })], payload);
ok('C15 a failing idea is dropped, the others survive untouched',
   v1.ideas.length === 2 && v1.reasons.length === 1 && v1.reasons[0].indexOf('check 5') === 0,
   v1.ideas.length + ' kept, reasons: ' + v1.reasons.join(' | '));
ok('C15b the kept ideas are NOT modified (no repair)',
   JSON.stringify(v1.ideas[0]) === JSON.stringify(GOOD));
const v2 = validateIdeas([GOOD, GOOD, GOOD, GOOD], payload);
ok('C16 check 1: more than three ideas rejects the envelope',
   v2.ideas.length === 0 && v2.reasons[0].indexOf('check 1') === 0);

/* ================= 3. run, store, log, render, degrade ================= */
function armFetch(ideas) {
  global.fetch = function (url) {
    return Promise.resolve({
      ok: true, status: 200,
      text: () => Promise.resolve(JSON.stringify({ ideas: ideas, usage: { input_tokens: 1234, output_tokens: 2345 } }))
    });
  };
}
const IDEA2 = variant({ casting: payload.castings[1].k, name: 'The Second Desk', situation: GOOD.situation.replace('Northgate Coffee', 'Halverson Research Partners') });
const BADIDEA = variant({ why_ai: 'It is quicker and more efficient.' });

(async function () {
  /* happy path: 2 pass, 1 rejected */
  setAnswers();
  armFetch([GOOD, IDEA2, BADIDEA]);
  runIdeas();
  await new Promise(r => setTimeout(r, 20));
  const I = S.a.ideas;
  ok('R1 two ideas stored, the third rejected', I && I.ideas.length === 2 && I.kept.length === 0);
  ok('R1b usage captured for the cost question', I.usage && I.usage.input_tokens === 1234 && I.usage.output_tokens === 2345);
  ok('R1c version stamped on the stored set', I.v === SKETCH_VERSION);
  const ilog = (S.a.joblog || []).filter(e => e.e === 'ideas');
  ok('R2 the ideas log line: ok/failed/reasons/version',
     ilog.length === 1 && ilog[0].ok === 2 && ilog[0].failed === 1 &&
     ilog[0].reasons[0].indexOf('check 5') === 0 && ilog[0].v === SKETCH_VERSION,
     JSON.stringify(ilog[0] && { ok: ilog[0].ok, failed: ilog[0].failed, v: ilog[0].v }));

  /* the cards */
  const c1 = concept();
  ok('R3 stored ideas survive a concept rebuild (sig matches)', !!ideasFor(c1));
  const html = ideasHTML(c1);
  ok('R4 both cards render: names, situations, keep buttons, detail closed',
     html.indexOf('The Handoff') > -1 && html.indexOf('The Second Desk') > -1 &&
     (html.match(/data-ikeep=/g) || []).length === 2 &&
     (html.match(/<details class="ideadt"(?! open)/g) || []).length === 2);
  ok('R4b honesty line: 2 of 3 met the bar', html.indexOf('2 of 3 met the bar') > -1);
  ok('R4c cost note carries tokens and version', html.indexOf('1234') > -1 && html.indexOf('2345') > -1 && html.indexOf(SKETCH_VERSION) > -1);
  ok('R4d opening is not choosing (copy present)', html.indexOf('opening is not choosing') > -1);

  /* keep is a toggle on the SET, and it logs */
  toggleIdeaKeep(0); toggleIdeaKeep(1); toggleIdeaKeep(0);
  const klog = (S.a.joblog || []).filter(e => e.e === 'ideaKeep');
  ok('R5 three keep-toggles logged, final set is the second idea only',
     klog.length === 3 && S.a.ideas.kept.length === 1 && S.a.ideas.kept[0] === 1,
     'kept=' + JSON.stringify(S.a.ideas.kept));
  ok('R5b the log records casting KEYS, with shown and version',
     klog[2].kept.length === 1 && klog[2].kept[0] === IDEA2.casting && klog[2].shown === 2 && klog[2].v === SKETCH_VERSION,
     JSON.stringify(klog[2].kept));
  const html2 = ideasHTML(concept());
  ok('R5c a kept card renders open and marked',
     html2.indexOf('✓ kept') > -1 && (html2.match(/<details class="ideadt" open/g) || []).length === 1);

  /* the per-idea prompts */
  const bp = buildPromptForIdea(concept(), S.a.ideas.ideas[1]);
  ok('R6 the idea build prompt: idea wins, steps carried, version inside',
     bp.indexOf('THE CHOSEN IDEA') > -1 && bp.indexOf('the idea wins') > -1 &&
     bp.indexOf('Halverson Research Partners') > -1 && bp.indexOf('Generated by Session Sketch ' + SKETCH_VERSION) > -1);
  const fp = buildFilePrompt(concept(), S.a.ideas.ideas[1]);
  ok('R7 the file prompt: spec lines, targets rule, keep-out, answer key',
     fp.indexOf('99 code') > -1 && fp.indexOf('DESIGN TARGET') > -1 &&
     fp.indexOf('No Python') > -1 && fp.indexOf('answer key') > -1);

  /* self-invalidation */
  S.a.topic = 'pricing analytics';
  ok('R8 stale ideas are ignored the moment an answer changes', ideasFor(concept()) === null);
  S.a.topic = MKT.topic;

  /* all-rejected → the standard version, said plainly (decision 4) */
  setAnswers();
  armFetch([BADIDEA]);
  runIdeas();
  await new Promise(r => setTimeout(r, 20));
  ok('R9 none pass: nothing stored, fallback flag set', !S.a.ideas && (function(){ return true; })());
  const html3 = ideasHTML(concept());
  ok('R9b the plain line: did not meet the bar, standard version stands',
     html3.indexOf('did not meet the bar') > -1 && html3.indexOf('rejected rather than repaired') > -1);
  ok('R9c the rejected card names the rule each idea broke',
     html3.indexOf('What failed, rule by rule') > -1 && html3.indexOf('check 5') > -1);

  /* transport error → plain warning, tool intact */
  global.fetch = function () { return Promise.reject(new Error('boom')); };
  runIdeas();
  await new Promise(r => setTimeout(r, 20));
  const html4 = ideasHTML(concept());
  ok('R10 a failed call degrades to a warning, never a blank page',
     html4.indexOf('The ideas did not arrive') > -1 && html4.indexOf('your answers are kept') > -1);

  /* offline: no key, file:// → decision 4's exact line, no dead button */
  global.location = { protocol: 'file:' };
  const html5 = ideasHTML(concept());
  ok('R11 offline says it plainly and offers no dead button',
     html5.indexOf('need a connection') > -1 && html5.indexOf('data-ideas=') < 0);
  let threw = false;
  try { runIdeas(); } catch (e) { threw = true; }
  ok('R11b runIdeas is a no-op offline', !threw);
  global.location = { protocol: 'https:' };

  /* notready never calls out */
  setAnswers({ catch: '' });
  ok('R12 runIdeas is a no-op while notready', score().state === 'notready' && (function () {
    try { runIdeas(); return true; } catch (e) { return false; }
  })());

  /* ================= 4. the engine is untouched ================= */
  setAnswers();
  armFetch([GOOD, IDEA2]);
  const before = score();
  runIdeas();
  await new Promise(r => setTimeout(r, 20));
  const after = score();
  ok('E1 ideas cannot move a tag or a score',
     before.ranked[0] === after.ranked[0] && before.sc.lab === after.sc.lab);
  ok('E2 the deterministic sketch still renders beneath the ideas',
     (function(){ const h = resultHTML(); return h.indexOf('Draft sketch') > -1 && h.indexOf('The activity') > -1; })());
  ok('E3 the version is in the results footer', resultHTML().indexOf('Session Sketch ' + SKETCH_VERSION) > -1);
  ok('E4 the version is in every build prompt', buildPrompt(concept()).indexOf('Generated by Session Sketch ' + SKETCH_VERSION) > -1);
  ok('E5 SKETCH_VERSION exists and is a dev build until release',
     typeof SKETCH_VERSION === 'string' && /^\d+\.\d+\.\d+/.test(SKETCH_VERSION), SKETCH_VERSION);

  /* ================= 5. the three layers (§6) and self-serve wording ====== */
  const page = resultHTML();   // stored-ideas state from the E-section run
  ok('L1 the ideas section is the first thing on the page',
     page.indexOf('<div class="card hero" data-layer="1"') === 0);
  const l3at = page.indexOf('<div class="l3">');
  ok('L2 every old card sits inside the .l3 wrapper',
     l3at > 0 && page.indexOf('data-tab="rec"') > l3at &&
     page.indexOf('Draft sketch') > l3at && page.indexOf('What AI is cast as') > l3at &&
     page.indexOf('scorebars') > l3at);
  /* the version string also appears INSIDE the build prompt (edit 3c), so the
     footer check must be lastIndexOf */
  ok('L3 the nav and version footer stay outside the workshop layer',
     page.indexOf('navrow noprint') > l3at &&
     page.lastIndexOf('Session Sketch ' + SKETCH_VERSION) > page.indexOf('navrow noprint'));
  ok('L4 workshop notes are relabelled, third-person label gone',
     page.indexOf('If you&rsquo;re running this as a workshop') > -1 &&
     page.indexOf('lbl">Facilitator note</div>') < 0);
  ok('L5 §7 plain words on the idea detail',
     page.indexOf('What makes it land, early:') > -1 &&
     page.indexOf('The mistake you&rsquo;re planting on purpose:') > -1 &&
     page.indexOf('The part AI can&rsquo;t do for them:') > -1 &&
     page.indexOf('Write my Lab') > -1);
  ok('L6 the layer-1 header names the tag and the title',
     page.indexOf('Research Lab') > -1 && page.indexOf(esc(concept().title)) > -1);
  ok('L7 the .l3 CSS rule is wired to the workshop toggle',
     src.indexOf('body:not(.fac-on) .l3{display:none}') > -1);
  ok('L8 the toggle is relabelled in the wizard masthead',
     src.indexOf('>Workshop view: off<') > -1 && src.indexOf('"Workshop view: " + (S.fac?"on":"off")') > -1);

  /* ================= 6. auto-generate on concept open ================= */
  let calls = 0;
  function armCountingFetch(ideas, rejectWith) {
    global.fetch = function () {
      calls++;
      if (rejectWith) return Promise.reject(new Error(rejectWith));
      return Promise.resolve({ ok: true, status: 200,
        text: () => Promise.resolve(JSON.stringify({ ideas: ideas, usage: { input_tokens: 10, output_tokens: 20 } })) });
    };
  }
  setAnswers({ course: 'MKT-338 Consumer Insights' });   // fresh sig
  armCountingFetch([GOOD, IDEA2]);
  const auto1 = ideasHTML(concept());
  const auto2 = ideasHTML(concept());                    // second render before the call lands
  await new Promise(r => setTimeout(r, 30));
  ok('A1 opening the concept generates without a click',
     auto1.indexOf('Writing three ideas') > -1 && S.a.ideas && S.a.ideas.ideas.length === 2);
  ok('A2 it fires exactly once per answer-set, even across re-renders',
     calls === 1 && auto2.indexOf('Writing three ideas') > -1, calls + ' call(s)');
  ok('A3 once stored, re-renders show the cards, no new call',
     ideasHTML(concept()).indexOf('The Handoff') > -1 && calls === 1);

  /* ================= 7. junk tool answers and the clarify loop ============ */
  /* "no" typed into the optional tool question rejected all three ideas live
     (18 Aug): the prompt said "Name no where it belongs" and check 7 demanded
     an unmatchable word. Never again. */
  setAnswers({ tool: 'no' });
  const cNo = concept();
  ok('N1 a "no" tool answer is treated as no tool everywhere',
     cNo.tool === '' && ideasPayload(cNo).tool === '' &&
     buildIdeaPrompt(ideasPayload(cNo)).indexOf('Software students use') < 0 &&
     buildPrompt(cNo).indexOf('Working tool') < 0);
  ok('N1b other junk spellings too',
     ['None', 'N/A', 'n/a', 'nope', '-', 'Nothing'].every(v => toolClean(v) === ''));
  ok('N1c a real tool still passes through untouched', toolClean('MySQL Workbench') === 'MySQL Workbench');
  ok('N2 check 7 skips when the tool has no distinctive words (never unpassable)',
     checkIdea(GOOD, Object.assign({}, payload, { tool: 'no' })) === null);

  setAnswers({ ideasNote: 'Most of my students work full-time at accounting firms; the survey is about our own campus services.' });
  const cNote = concept(), pNote = ideasPayload(cNote), promptNote = buildIdeaPrompt(pNote);
  ok('N3 the clarify note rides into the payload and the idea prompt, verbatim',
     pNote.extra.indexOf('accounting firms') > -1 &&
     promptNote.indexOf('## More from the professor') > -1 &&
     promptNote.indexOf('this wins') > -1 &&
     promptNote.indexOf('accounting firms') > -1);
  ok('N3b the note also rides into the main build prompt',
     buildPrompt(cNote).indexOf('More context from the faculty member') > -1 &&
     buildPrompt(cNote).indexOf('accounting firms') > -1);
  ok('N3c typing the note never wipes stored ideas (not in the signature)',
     ideaSig(cNote) === ideaSig((function(){ setAnswers(); return concept(); })()));
  setAnswers({ ideasNote: 'x' });
  ok('N4 the clarify box renders in the cards, rejected and offer states', (function(){
    /* offer state (fresh sig, auto disabled via consumed autoSig): check the
       textarea markup is present wherever a rewrite can be triggered */
    S.a.ideas = { sig: ideaSig(concept()), v: SKETCH_VERSION, at: 1, ideas: [GOOD], shown: 1, kept: [], usage: null, note: '' };
    const inCards = ideasHTML(concept()).indexOf('data-ideasnote') > -1;
    delete S.a.ideas;
    return inCards;
  })());
  setAnswers();

  setAnswers({ course: 'MKT-339 Brand Strategy' });      // fresh sig again
  calls = 0; armCountingFetch(null, 'boom');
  ideasHTML(concept());
  await new Promise(r => setTimeout(r, 30));
  const afterErr = ideasHTML(concept());
  await new Promise(r => setTimeout(r, 30));
  ok('A4 a failed auto-run is not auto-retried — manual try-again only',
     calls === 1 && afterErr.indexOf('The ideas did not arrive') > -1 &&
     afterErr.indexOf('data-ideas="run"') > -1, calls + ' call(s)');

  try { fs.unlinkSync('_bi.js'); } catch (e) {}
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  if (fail) process.exit(1);
})();
