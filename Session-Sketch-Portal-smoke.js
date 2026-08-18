/* Headless smoke test for the Wave 3 portal: stubs the DOM, evals the
   portal's own script blocks, then drives the conversation the way a
   user would — answering each question and confirming each playback —
   and checks the flow, playbacks, and final result. */
const fs = require('fs');
const src = fs.readFileSync('Session-Sketch-Portal.html', 'utf8');
const blocks = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (blocks.length !== 8) throw new Error('expected 8 script blocks (incl. Wave 5 block 1a), got ' + blocks.length);
fs.writeFileSync('_pb.js', blocks.join('\n').split('"use strict";').join(''));

function el(){ return {
  innerHTML:'', textContent:'', style:{}, value:'', disabled:false,
  classList:{toggle(){},add(){},remove(){}}, addEventListener(){}, setAttribute(){},
  getAttribute(){return null;}, focus(){}, click(){}, select(){}, appendChild(){},
  removeChild(){}, scrollIntoView(){}, querySelector(){return null;} }; }
global.document = {
  getElementById:()=>el(), createElement:()=>el(), querySelector:()=>null,
  querySelectorAll:()=>[], addEventListener(){},
  body:{classList:{toggle(){}}, appendChild(){}, removeChild(){}},
  activeElement:null, documentElement:{scrollTop:0}, execCommand(){return true;} };
global.window = {pageYOffset:0, scrollTo(){}, print(){}};
global.localStorage = {getItem:()=>null, setItem(){}, removeItem(){}};
global.navigator = {}; global.Blob=function(){}; global.URL={createObjectURL:()=>'',revokeObjectURL(){}};
global.confirm=()=>false;

eval(fs.readFileSync('_pb.js','utf8'));

let fails = 0;
function ok(name, cond, extra){ console.log((cond?'ok  ':'FAIL')+' '+name+(extra?'   '+extra:'')); if(!cond) fails++; }

/* ---- structural checks on the flow ---- */
ok('FLOW has 3 playbacks', FLOW.filter(t=>t.kind==='pb').length===3);
ok('21 questions', QKEYS.length===21, QKEYS.join(','));
ok('playback after tool/output/catch',
   FLOW[QIDX.tool+1].kind==='pb' && FLOW[QIDX.output+1].kind==='pb' && FLOW[QIDX.catch+1].kind==='pb');

/* ---- drive the Joins case through the conversation ---- */
const ANS = { subject:'computing', course:'CIS-255', topic:'writing joins with MySQL', tool:'MySQL',
  teaches:'pre-class lecture then practice problems', stage:'intro', skill:'perform', output:'build', material:'data',
  matstate:'messy', length:'two', size:'12-25', doDiff:'lab', goeswrong:'lab', compete:'neither', exper:'some',
  catch:'a join that runs clean but silently drops the rows with no match', catchway:'run',
  worry:'wrong', remember:'the number depends entirely on who you counted', avoid:'' };

let guard=0;
while (PS.ci < FLOW.length){
  if (guard++ > 200) throw new Error('flow did not terminate');
  const turn = FLOW[PS.ci];
  if (turn.kind === 'q'){
    const before = PS.ci;
    answerFrontier(turn.k, ANS[turn.k]);
    if (PS.ci === before) throw new Error('did not advance on '+turn.k);
  } else {
    PS.ci++;               /* "Yes, that's right" */
  }
}
ok('conversation completed', PS.ci===FLOW.length, 'ci='+PS.ci);

/* ---- playback text is sensible ---- */
const tpb = pbText('topic');
ok('topic playback splits the tool out',
   /lives in <b>writing joins<\/b>/.test(tpb) && /MySQL/.test(tpb), tpb.slice(0,90));
const apb = pbText('axis');
ok('axis playback names skill + output', /core skill/.test(apb) && /walk out holding/.test(apb));
const cpb = pbText('catch');
ok('catch playback quotes the mistake', /silently drops the rows/.test(cpb));

/* ---- humanize echoes ---- */
ok('humanize subject', humanize('subject')==='Computing & Software', humanize('subject'));
ok('humanize skill', /Perform a technique/.test(humanize('skill')));
ok('humanize skipped optional is empty', humanize('avoid')==='');

/* ---- the engine verdict survives the portal, identical to the wizard ---- */
const r = score();
ok('Joins scores Research confident', r.ranked[0]==='lab' && r.state==='confident',
   r.ranked[0]+' '+r.state+' Re='+r.sc.lab.toFixed(1));
const c = concept();
ok('activity is Execute and Verify', c.P.name==='Execute and Verify', c.P.name);
const P = buildPrompt(c);
ok('build prompt produced', P.length>1500 && /FACULTY INTAKE/.test(P), P.length+' chars');
const html = resultHTML();
ok('resultHTML renders the recommended tag', /Recommended tag/.test(html) && /Verify It/.test(html));

/* ---- notready path: drop the planted error ---- */
delete S.a.catch;
ok('missing planted error -> notready', score().state==='notready');
S.a.catch = ANS.catch;

console.log(fails ? ('\n'+fails+' FAILED') : '\nAll portal smoke checks pass');
process.exit(fails?1:0);
