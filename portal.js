/* ============================================================
   SESSION SKETCH — conversational portal (Wave 3 prototype)
   ------------------------------------------------------------
   The deterministic engine (SUBJ..concept, score, conflictAxis,
   flags) and the result view (resultHTML/buildPrompt/wireResult)
   are lifted UNCHANGED from the wizard. Only the intake changes:
   the multi-field wizard becomes a one-question-at-a-time chat
   with three playback turns, a progress head, and a review drawer.

   This is the seam the plan calls "AI-native later": every
   playback is a deterministic template keyed off the answer.
   ============================================================ */

/* ---------- portal state (separate persistence from the wizard) ---------- */
var PKEY = "snhu-session-sketch-portal-v2";   /* v2: S.a gained aijob + joblog (Wave 5) */
var PS = {ci:0, drawer:false, view:"result", rtab:"rec"};
try{
  var praw = localStorage.getItem(PKEY);
  if(praw){ var pp = JSON.parse(praw); S.a = pp.a||{}; S.fac = !!pp.fac; PS.ci = pp.ci||0;
    if(pp.view) PS.view = pp.view; if(pp.rtab) PS.rtab = pp.rtab; }
}catch(e){}
function psave(){ try{ localStorage.setItem(PKEY, JSON.stringify({a:S.a, ci:PS.ci, fac:S.fac, view:PS.view, rtab:PS.rtab})); }catch(e){} }

/* ---------- the flow: wizard fields, in order, with playbacks woven in ---------- */
function buildFlow(){
  var flow = [], seq = 0;
  for(var s=0;s<3;s++){
    STEPS[s].fields.forEach(function(f){
      flow.push({kind:"q", f:f, k:f.k, seq:seq++});
      if(f.k==="tool")   flow.push({kind:"pb", id:"topic", fix:"topic"});
      if(f.k==="output") flow.push({kind:"pb", id:"axis",  fix:"skill"});
      if(f.k==="catch")  flow.push({kind:"pb", id:"catch", fix:"catch"});
    });
  }
  return flow;
}
var FLOW = buildFlow();
var QKEYS = FLOW.filter(function(t){ return t.kind==="q"; }).map(function(t){ return t.k; });
var QIDX = {};                                   /* key -> index into FLOW */
FLOW.forEach(function(t,i){ if(t.kind==="q") QIDX[t.k]=i; });
var OPTIONAL = {tool:1, avoid:1};
var SHORTQ = {subject:"Subject", course:"Course", topic:"Topic", tool:"Tool",
  teaches:"In class now", stage:"Topic stage", skill:"Core skill", output:"They produce", material:"Raw material",
  matstate:"Material state", length:"Length", size:"Class size", doDiff:"Should do differently",
  goeswrong:"Goes wrong most", compete:"Competing?", exper:"Student experience", catch:"Planted error",
  catchway:"How it's caught", worry:"AI worry", remember:"Remember in a year", avoid:"Keep out"};

/* WHYQ — plain-language "what this question is and why it matters" walkthroughs.
   Written to be read aloud (an ElevenLabs narration pass can be layered on later). */
var WHYQ = {
 subject:"This just sets the language your finished Lab is written in — the examples, the words, the kind of work. It never changes which type of Lab you get, so pick the closest fit and move on.",
 course:"The course name grounds the Lab in something real and helps tailor the examples to your students. Name and number is plenty.",
 topic:"This is the single unit the Lab lives in. Narrow beats broad: a Lab built on one focused topic gives students something they can actually finish, where a whole-course topic leaves them nowhere to stand.",
 tool:"If students use a specific piece of software or equipment, naming it lets the finished Lab speak their real workflow. It is optional and never affects the type of Lab — leave it blank if there is not one.",
 teaches:"Knowing what you already do on this topic lets the Lab add a new layer instead of repeating your lecture or your practice set. It is the difference between a fresh session and a rerun.",
 stage:"Introducing a topic, reviewing it, and extending past it are three different Labs on three different days. This does not change the tag — it changes how much the Lab has to carry: heavier scaffolding when it is the first exposure, subtler challenge when they already know the material.",
 skill:"This is the core how — the thing students are actually learning to do. It is one of the strongest signals for which kind of Lab fits, so pick the closest even if it is not perfect.",
 output:"This is the thing students walk out holding. Together with the skill, it tells the tool whether this is a making Lab, a verifying Lab, a competing Lab, or a simulating one.",
 material:"Whatever students have in front of them decides how the Lab opens and what the first ten minutes look like. It is the most reliable signal in the whole intake, because it is the one thing hard to get wrong.",
 matstate:"Clean material and messy material make very different sessions. If the mess is the point — if sorting, cleaning, or vetting is where the learning lives — the Lab has to protect that step instead of skipping past it.",
 length:"This sets the pacing and how much fits. Be honest about the time you actually have; a Lab that assumes more time than the room gives you falls apart in the last ten minutes.",
 size:"Class size sets team size and how sharing works at the end. It shapes the logistics, not the design.",
 doDiff:"This is what should be different about your students by the time they walk out. It refines the recommendation rather than deciding it.",
 goeswrong:"Answer this from grading, not from theory — what actually goes wrong in student work. This is the single question that most reliably separates one kind of Lab from another.",
 compete:"Some work has a real rival or a real clock; most does not. This decides whether a competition-style Lab is even on the table — if there is neither, it is ruled out on purpose.",
 exper:"Whether your students bring lived experience changes where the raw material comes from — their own cases, or ones you supply. It tunes the session to the room.",
 catch:"This is the most valuable answer in the whole intake. The one expert-only mistake becomes the error planted in the Lab — the thing AI gets wrong on purpose so students have to catch it. Without it, the Lab flattens into a summary.",
 catchway:"How a student would catch that mistake names both the kind of Lab and the activity inside it. Running it, checking it against a source, or simply knowing the field each point somewhere different.",
 worry:"Whatever worries you most about students using AI here becomes a built-in teaching moment instead of a rule on a slide. Naming it is how the Lab addresses it head-on.",
 remember:"The one thing you would want remembered a year later becomes the closing line of the session. Say it in plain language.",
 avoid:"If there is anything the Lab should stay away from — a debate, a sensitive angle — say so here and the build will route around it. Optional."
};

/* COURSEEG — a subject-appropriate example for the course field's placeholder.
   Illustrative course codes; tune to the catalog when you have it. */
var COURSEEG = {
 acctfin:"e.g. ACC-201 Financial Accounting", business:"e.g. BUS-210 Introduction to Management",
 marketing:"e.g. MKT-205 Introduction to Marketing", sales:"e.g. MKT-315 Professional Selling",
 comms:"e.g. COM-325 Strategic Communication", analytics:"e.g. DAT-220 Data Analysis",
 computing:"e.g. CIS-255 Applied Data Structures & Databases", cyber:"e.g. CYB-250 Cyber Defense",
 game:"e.g. GAM-210 Game Design & Development", engineering:"e.g. CON-220 Construction Methods",
 sciences:"e.g. BIO-210 Anatomy & Physiology I", mathphys:"e.g. MAT-225 Calculus II",
 education:"e.g. EDU-215 Educational Psychology", psychsoc:"e.g. PSY-215 Research Methods in Psychology",
 justice:"e.g. CJ-230 Criminal Procedure", history:"e.g. HIS-200 Applied History",
 humanities:"e.g. ENG-226 Creative Writing", design:"e.g. GRA-215 Typography",
 other:"e.g. your course name and number"
};

/* ---------- small helpers ---------- */
function fieldByKey(k){ return FLOW[QIDX[k]] ? FLOW[QIDX[k]].f : null; }
function stripTags(s){ return String(s==null?"":s).replace(/<[^>]+>/g,""); }
function lc(s){ return s ? s.charAt(0).toLowerCase()+s.slice(1) : s; }
var SHIELD = '<svg width="15" height="17" viewBox="0 0 18 20" aria-hidden="true">'+
  '<path d="M9 1 16.5 3.6v7.1C16.5 15 13.3 17.9 9 19 4.7 17.9 1.5 15 1.5 10.7V3.6L9 1Z" fill="none" stroke="#fdb913" stroke-width="1.4"/>'+
  '<path d="M9 5.6c1.9 1.5 2.8 2.9 2.8 4.3 0 1.1-.7 2-1.8 2.3.5-1.4.1-2.6-1-3.6Z" fill="#009dea"/></svg>';

/* topic with the tool name split back out, exactly as concept() does */
function topicClean(){
  var topic=(S.a.topic||"").trim(), tool=(S.a.tool||"").trim();
  if(tool){
    var tRe=new RegExp("[,\\s]*(?:with|in|using|on|via)\\s+"+tool.replace(/(\W)/g,"\\$1")+"\\s*$","i");
    var st=topic.replace(tRe,"").trim();
    if(st) topic=st;
  }
  return topic;
}

/* one-line, humanised echo of an answer for the chat + drawer summary */
function humanize(k){
  var v=S.a[k];
  if(v==null || (typeof v==="string" && !v.trim())) return OPTIONAL[k] ? "" : "";
  if(k==="subject") return SUBJ[v]?SUBJ[v].label:v;
  if(k==="skill")   return SKILL[v]?SKILL[v].label:v;
  if(k==="output")  return OUTPUT[v]?OUTPUT[v].label:v;
  if(k==="material")return MAT[v]?MAT[v].label:v;
  if(k==="compete") return COMPETE[v]?stripTags(COMPETE[v].label):v;
  if(k==="catchway")return CATCHWAY[v]?CATCHWAY[v].label:v;
  var f=fieldByKey(k);
  if(f && f.opts){ for(var i=0;i<f.opts.length;i++){ if(f.opts[i].v===v) return stripTags(f.opts[i].l); } }
  return String(v);
}

/* the field hint, with the wizard's two dynamic substitutions applied */
function hintFor(f){
  var fh=f.h||"", a=S.a;
  if(fh==="__TOPIC_H__"){
    var su=SUBJ[a.subject]||SUBJ.other;
    fh="One unit, not the whole course — and name the skill, not the software; the tool has its own question next."+
       (su.unitEg ? " If the unit is <b>"+esc(su.unitEg[0])+"</b>, the topic might be <b>"+esc(su.unitEg[1])+"</b>." : " Narrow is better.");
  }
  return fh;
}
function phFor(f){
  var ph=f.ph||"";
  if(ph==="__CATCH_PH__") ph="e.g. "+(SUBJ[S.a.subject]||SUBJ.other).catchEg;
  if(f.k==="course" && COURSEEG[S.a.subject]) ph=COURSEEG[S.a.subject];   /* subject-tailored example */
  return ph;
}

/* ---------- the three playbacks (deterministic; the AI-native seam) ---------- */
function pbText(id){
  var a=S.a;
  if(id==="topic"){
    var topic=topicClean(), tool=(a.tool||"").trim();
    var s="Got it. This Lab lives in <b>"+esc(topic||"your topic")+"</b>";
    s+= tool ? ", and the tool in students’ hands is <b>"+esc(tool)+"</b>. " : ". ";
    s+="Everything after this hangs off that — and notice nothing here is about AI yet.";
    return s;
  }
  if(id==="axis"){
    var sk=a.skill&&SKILL[a.skill]?SKILL[a.skill].label:"";
    var ou=a.output&&OUTPUT[a.output]?OUTPUT[a.output].label:"";
    var s="So the core skill is to <b>"+esc(lc(sk))+"</b>";
    if(a.output==="none") s+=", and the point is the doing itself — there’s no lasting artifact to hand in. That’s a real answer, not a gap.";
    else s+=", and what students walk out holding is <b>"+esc(lc(ou))+"</b>.";
    var cf=(a.skill&&a.output)?conflictAxis(a.skill,a.output,a.material):null;
    if(cf) s+='<span class="pbnote">Heads up — those two can pull toward different Labs. I’ll flag it on your concept page if they do; keep going for now.</span>';
    return s;
  }
  if(id==="catch"){
    var c=(a.catch||"").trim();
    if(!c) return "No planted error yet — and this is the one answer the whole Lab is built around. You can name it now, or come back to it from the review drawer before you build.";
    return "That’s the mistake the whole Lab gets built around — the thing AI will get wrong on purpose so students have to catch it: <i>“"+esc(c)+"”</i>. The sharper and more field-specific, the better the Lab lands.";
  }
  return "";
}

/* ---------- input controls (shared by chat 'ask' and drawer 'edit') ---------- */
/* mode: "ask" (chat active turn, click advances) or "edit" (drawer, click just updates) */
function renderInput(f, mode){
  var a=S.a, v=a[f.k], k=f.k;
  var ansAttr = mode==="ask" ? "data-ans" : "data-dans";
  var t=f.t;

  if(t==="select"){                                   /* subject -> chip cloud */
    var h='<div class="chips">';
    f.opts.forEach(function(o){
      h+='<button class="chip'+(v===o.v?" sel":"")+'" '+ansAttr+'="'+k+'" data-val="'+o.v+'">'+esc(o.l)+'</button>';
    });
    return h+'</div>';
  }
  if(t==="pills"){                                     /* length / size -> chips */
    var h='<div class="chips">';
    f.opts.forEach(function(o){
      h+='<button class="chip'+(v===o.v?" sel":"")+'" '+ansAttr+'="'+k+'" data-val="'+o.v+'">'+esc(o.l)+'</button>';
    });
    return h+'</div>';
  }
  if(t==="radio"){                                     /* stacked option cards (labels carry <b>) */
    var h='<div class="optgrid">';
    f.opts.forEach(function(o){
      h+='<button class="optc'+(v===o.v?" sel":"")+'" '+ansAttr+'="'+k+'" data-val="'+o.v+'">'+o.l+'</button>';
    });
    return h+'</div>';
  }
  if(t==="axis"){                                      /* skill / output, per-subject examples */
    var ORD=f.axis==="skill"?SKILLORDER:OUTPUTORDER;
    var DEF=f.axis==="skill"?SKILL:OUTPUT;
    var EGF=f.axis==="skill"?skillEg:outputEg;
    var h='<div class="optgrid">';
    ORD.forEach(function(kk){
      var O=DEF[kk], ex=EGF(a.subject, kk);
      h+='<button class="optc'+(v===kk?" sel":"")+'" '+ansAttr+'="'+k+'" data-val="'+kk+'">'+
         esc(O.label)+(ex?'<span class="ex">'+esc(ex)+'</span>':'')+'</button>';
    });
    return h+'</div>';
  }
  /* text / area */
  var isArea = (t==="area");
  var val = v==null?"":v;
  if(mode==="edit"){
    return isArea
      ? '<textarea class="dctl" data-dtext="'+k+'" placeholder="'+esc(phFor(f))+'">'+esc(val)+'</textarea>'
      : '<input type="text" class="dctl" data-dtext="'+k+'" value="'+esc(val)+'" placeholder="'+esc(phFor(f))+'">';
  }
  var field = isArea
    ? '<textarea data-sendfield="'+k+'" placeholder="'+esc(phFor(f))+'">'+esc(val)+'</textarea>'
    : '<input type="text" data-sendfield="'+k+'" data-enter="1" value="'+esc(val)+'" placeholder="'+esc(phFor(f))+'">';
  var h='<div class="compose">'+field+
        '<button class="send" data-send="'+k+'">Send</button>';
  if(OPTIONAL[k]) h+='<button class="skip" data-skip="'+k+'">Skip</button>';
  return h+'</div>';
}

/* ---------- render the whole conversation ---------- */
function botBubble(inner){
  return '<div class="bot"><div class="ava">'+SHIELD+'</div><div class="bub">'+inner+'</div></div>';
}
function renderChat(){
  var done = PS.ci>=FLOW.length;
  var h='';

  /* intro */
  h+='<div class="turn">'+botBubble(
    'Let’s turn something you already teach into an <b>SNHU AI Lab</b> — a short, hands-on session where students use AI to build something real. '+
    'I’ll ask one thing at a time, in plain language. You don’t need to know anything about AI; you need to know your students and your material. '+
    'I work out the tag, timings, roles and teaching moments from your answers.')+'</div>';

  var limit = done ? FLOW.length-1 : PS.ci;
  for(var i=0;i<=limit;i++){
    var turn=FLOW[i];
    var active = (!done && i===PS.ci);
    if(turn.kind==="q"){
      var f=turn.f;
      if(active){
        var hint=hintFor(f);
        var why=WHYQ[f.k] ? '<details class="whyq"><summary>Why this question?</summary><p>'+esc(WHYQ[f.k])+'</p></details>' : '';
        h+='<div class="turn" id="active">'+
             botBubble(f.q+(hint?'<span class="qh2">'+hint+'</span>':'')+why)+
             '<div class="ans">'+renderInput(f,"ask")+'</div>'+
           '</div>';
      } else {
        var ans=humanize(f.k);
        var skipped=(ans==="");
        h+='<div class="turn">'+
             botBubble(f.q)+
             '<div class="usr"><div class="ubub'+(skipped?' skip':'')+'" data-edit="'+f.k+'">'+
               (skipped?'(skipped)':esc(ans))+'<span class="pen">edit</span></div></div>'+
           '</div>';
      }
    } else { /* playback */
      if(active){
        h+='<div class="turn" id="active">'+
             botBubble(pbText(turn.id))+
             '<div class="ans"><div class="pbrow">'+
               '<button class="pbyes" data-pbyes="1">Yes, that’s right</button>'+
               '<button class="pbfix" data-pbfix="'+turn.fix+'">Let me fix that</button>'+
             '</div></div>'+
           '</div>';
      } else {
        h+='<div class="turn">'+botBubble(pbText(turn.id))+'</div>';
      }
    }
  }

  if(done){
    h+='<div class="turn">'+botBubble(
      'That’s everything I need. Your Lab concept is ready — the recommended tag, the activity, a paste-ready build prompt, and the full session sketch, laid out in tabs. '+
      'Want to change an answer first? Tap <b>Review</b> in the top bar.')+
      '<div class="ans"><div class="pbrow"><button class="pbyes" data-seeresult="1">See your concept →</button></div></div>'+
      '</div>';
  }
  return h;
}

/* ---------- progress head + drawer ---------- */
function renderHead(){
  var a=S.a;
  var n=QKEYS.filter(function(k){ return QIDX[k]<PS.ci; }).length;
  var m=QKEYS.length;
  var pct=Math.round(n/m*100);
  var meta='';
  if(a.subject) meta+='<b>'+esc(SUBJ[a.subject]?SUBJ[a.subject].label:a.subject)+'</b>';
  if(a.course){ meta+=(meta?'<span class="dot">&middot;</span>':'')+esc(a.course); }
  if(!meta) meta='<span class="none">Your class, once you’ve told me</span>';
  document.getElementById("pmeta").innerHTML=meta;
  document.getElementById("pbarI").style.width=pct+"%";
  document.getElementById("pcount").textContent=n+" of "+m;
  var db=document.getElementById("drawerBtn");
  db.classList.toggle("on", PS.drawer);
}
function renderDrawer(){
  var wrap=document.getElementById("drawer");
  if(!PS.drawer){ wrap.innerHTML=""; return; }
  var reached=QKEYS.filter(function(k){ return QIDX[k]<PS.ci || (S.a[k]!=null && String(S.a[k]).length); });
  var h='<div class="dwtop"><span class="dwt">Your answers</span>'+
        '<button class="dwdone" data-drawer-close="1">Done</button></div>'+
        '<div class="dwlist">';
  if(!reached.length){
    h+='<div class="drow"><div class="dl">Nothing yet</div>Answer the first question and it shows up here — then tap any answer to change it.</div>';
  } else {
    h+='<div class="dhead">Tap a value to change it — the concept updates live.</div>';
    reached.forEach(function(k){
      var f=fieldByKey(k);
      h+='<div class="drow" data-drow="'+k+'"><div class="dl">'+esc(SHORTQ[k]||k)+'</div>'+renderInput(f,"edit")+'</div>';
    });
  }
  wrap.innerHTML=h+'</div>';
}

/* ---------- save the whole concept as a standalone HTML file ---------- */
function downloadConcept(){
  var c=concept(), styles="";
  var ss=document.querySelectorAll("style");
  for(var i=0;i<ss.length;i++) styles+=ss[i].textContent+"\n";
  var tmp=document.createElement("div");
  tmp.innerHTML=resultHTML();
  var np=tmp.querySelectorAll(".noprint");           /* drop the interactive controls */
  for(var j=np.length-1;j>=0;j--) np[j].parentNode.removeChild(np[j]);
  var doc='<!doctype html><html lang="en"><head><meta charset="utf-8">'+
    '<meta name="viewport" content="width=device-width, initial-scale=1">'+
    '<title>'+esc(c.title)+' — SNHU AI Labs</title>'+
    '<link rel="stylesheet" href="https://rsms.me/inter/inter.css">'+
    '<style>'+styles+'</style></head>'+
    '<body class="'+(S.fac?"fac-on":"")+'"><div style="max-width:1000px;margin:0 auto;padding:24px 24px 60px">'+
    tmp.innerHTML+'</div>'+
    '<!-- SESSION-SKETCH-LOG: '+JSON.stringify(S.a.joblog||[])+' -->'+
    '</body></html>';
  var blob=new Blob([doc],{type:"text/html"});
  var u=URL.createObjectURL(blob), a=document.createElement("a");
  a.href=u; a.download="lab-concept-"+c.slug+".html";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(u);
}

/* ---------- the result view (reuses resultHTML/wireResult) ---------- */
function paintResult(){
  var box=document.getElementById("result");
  if(!box) return;
  var r=score();
  if(r.state==="notready"){                         /* short page — no tabs */
    box.innerHTML='<div class="rpage-in">'+resultHTML()+'</div>';
    wireResult(); return;
  }
  var c=concept();
  var tmp=document.createElement("div");
  tmp.innerHTML=resultHTML();
  var panes={rec:[],activity:[],prompt:[],sketch:[]}, footer=[];
  Array.prototype.slice.call(tmp.children||[]).forEach(function(node){
    var tab=node.getAttribute ? node.getAttribute("data-tab") : null;
    if(tab && panes[tab]) panes[tab].push(node); else footer.push(node);
  });
  var TABS=[["rec","Recommendation"],["activity","Activity"],["prompt","Build prompt"],["sketch","Session sketch"]];
  var active=(PS.rtab && panes[PS.rtab]) ? PS.rtab : "rec";
  var head='<div class="rhead"><div class="rhead-top">'+
    '<div class="rttl"><span class="rtag">'+c.ty.icon+' '+esc(c.ty.name)+'</span>'+esc(c.title)+'</div>'+
    '<span class="rhead-btns">'+
      '<button class="btn-back" data-dl-concept="1">⬇ Save concept</button>'+
      '<button class="btn-back" data-go="chat">← Change my answers</button>'+
    '</span></div>'+
    '<div class="rtabs">'+TABS.map(function(t){
      return '<button class="rtab'+(t[0]===active?" on":"")+'" data-rtab="'+t[0]+'">'+esc(t[1])+'</button>';
    }).join("")+'</div></div>';
  box.innerHTML='<div class="rpage-in">'+head+'<div class="rpanes"></div><div class="rfooter"></div></div>';
  var panesEl=box.querySelector(".rpanes");
  if(panesEl){
    TABS.forEach(function(t){
      var pane=document.createElement("div");
      pane.className="rpane"; pane.setAttribute("data-pane",t[0]);
      if(t[0]!==active) pane.hidden=true;
      panes[t[0]].forEach(function(n){ pane.appendChild(n); });
      panesEl.appendChild(pane);
    });
  }
  var foot=box.querySelector(".rfooter");
  if(foot) footer.forEach(function(n){ foot.appendChild(n); });
  wireResult();
}

/* ---------- top-level render ---------- */
function renderAll(keepScroll){
  document.body.classList.toggle("fac-on", S.fac);
  var ft=document.getElementById("facToggle");
  if(ft) ft.textContent="Facilitator notes: "+(S.fac?"on":"off");
  var done=PS.ci>=FLOW.length;
  var showResult=done && PS.view!=="chat";
  document.body.classList.toggle("resultview", showResult);

  var body=document.getElementById("chat");
  var prevTop=body?body.scrollTop:0;
  body.innerHTML=renderChat();
  renderHead();
  var dr=document.getElementById("drawer");
  dr.classList.toggle("open", PS.drawer);
  renderDrawer();

  var box=document.getElementById("result");
  if(showResult) paintResult(); else if(box) box.innerHTML="";

  /* scroll the message area, not the page: pin to newest unless we're just editing */
  if(keepScroll){ body.scrollTop=prevTop; }
  else if(showResult){ window.scrollTo(0,0); }
  else {
    body.scrollTop=body.scrollHeight;
    var input=document.querySelector('#active [data-sendfield]');
    if(input) input.focus({preventScroll:true});
  }
  psave();
}

/* ---------- advancing the conversation ---------- */
function answerFrontier(k, val){
  S.a[k]=val;
  if(PS.ci===QIDX[k]) PS.ci++;          /* only advance when answering the live question */
  renderAll();
}

/* ---------- events ---------- */
document.addEventListener("click", function(e){
  var t;
  /* chat: chip / option-card answer */
  if((t=e.target.closest("[data-ans]"))){
    answerFrontier(t.getAttribute("data-ans"), t.getAttribute("data-val")); return;
  }
  /* chat: text/area send */
  if((t=e.target.closest("[data-send]"))){
    var k=t.getAttribute("data-send");
    var el=document.querySelector('#active [data-sendfield="'+k+'"]');
    var val=el?el.value.trim():"";
    if(!val && !OPTIONAL[k]) { if(el) el.focus(); return; }   /* required: don't advance empty */
    answerFrontier(k, val); return;
  }
  /* chat: skip optional */
  if((t=e.target.closest("[data-skip]"))){
    answerFrontier(t.getAttribute("data-skip"), ""); return;
  }
  /* review panel: close */
  if((t=e.target.closest("[data-drawer-close]"))){ PS.drawer=false; renderAll(true); return; }
  /* conversation done -> open the concept page */
  if((t=e.target.closest("[data-seeresult]"))){ PS.view="result"; renderAll(); return; }
  /* concept page: switch tabs (no full re-render, keeps the prompt box state) */
  if((t=e.target.closest("[data-rtab]"))){
    var tab=t.getAttribute("data-rtab"); PS.rtab=tab;
    var tb=document.querySelectorAll(".rtab");
    for(var i=0;i<tb.length;i++) tb[i].classList.toggle("on", tb[i].getAttribute("data-rtab")===tab);
    var pn=document.querySelectorAll(".rpane");
    for(var j=0;j<pn.length;j++) pn[j].hidden = pn[j].getAttribute("data-pane")!==tab;
    window.scrollTo(0,0); psave(); return;
  }
  /* playback: confirm */
  if((t=e.target.closest("[data-pbyes]"))){ PS.ci++; renderAll(); return; }
  /* playback: fix -> open drawer at the target field */
  if((t=e.target.closest("[data-pbfix]"))){
    PS.drawer=true; renderAll(true);
    var row=document.querySelector('[data-drow="'+t.getAttribute("data-pbfix")+'"]');
    if(row){ row.classList.add("hot"); row.scrollIntoView({block:"center"});
      var fld=row.querySelector('[data-dtext],[data-dans]'); if(fld && fld.focus) fld.focus(); }
    return;
  }
  /* chat: tap an answer to edit it (opens the drawer) */
  if((t=e.target.closest("[data-edit]"))){
    PS.drawer=true; renderAll(true);
    var row2=document.querySelector('[data-drow="'+t.getAttribute("data-edit")+'"]');
    if(row2){ row2.classList.add("hot"); row2.scrollIntoView({block:"center"}); }
    return;
  }
  /* drawer: chip / option-card change (no advance) */
  if((t=e.target.closest("[data-dans]"))){
    S.a[t.getAttribute("data-dans")]=t.getAttribute("data-val"); psave(); renderAll(true); return;
  }
  /* result: tag override (same rule as the wizard) */
  if((t=e.target.closest("[data-tag]"))){
    var tv=t.getAttribute("data-tag"); var _tf=concept().k;
    if(tv===score().ranked[0]) delete S.a.tagOverride; else S.a.tagOverride=tv;
    logTagPat("tag", _tf, concept().k); psave(); paintResult(); return;
  }
  /* result: AI-casting override (Wave 5) */
  if((t=e.target.closest("[data-job]"))){
    if(applyJobPick(t.getAttribute("data-job"))){ psave(); paintResult(); } return;
  }
  /* result: activity-pattern override */
  if((t=e.target.closest("[data-pat]"))){
    var _pf=concept().P.name; S.a["pat_"+t.getAttribute("data-pat")]=t.getAttribute("data-pi"); logTagPat("pat", _pf, concept().P.name); psave(); paintResult(); return;
  }
  /* concept page: save the whole concept as an HTML file */
  if((t=e.target.closest("[data-dl-concept]"))){ downloadConcept(); return; }
  /* concept page: "change my answers" -> back to the conversation, review panel open */
  if((t=e.target.closest("[data-go]"))){
    PS.view="chat"; PS.drawer=true; renderAll();
    return;
  }
});

/* Enter to send a single-line text answer */
document.addEventListener("keydown", function(e){
  if(e.key==="Enter"){
    var el=e.target;
    if(el.getAttribute && el.getAttribute("data-enter")){
      e.preventDefault();
      var k=el.getAttribute("data-sendfield");
      var val=el.value.trim();
      if(!val && !OPTIONAL[k]){ return; }
      answerFrontier(k, val); return;
    }
  }
  /* keyboard access for result override cards */
  if(e.key==="Enter" || e.key===" "){
    var tg=e.target.closest && e.target.closest("[data-tag]");
    if(tg){ e.preventDefault(); var tv=tg.getAttribute("data-tag");
      if(tv===score().ranked[0]) delete S.a.tagOverride; else S.a.tagOverride=tv;
      psave(); paintResult(); return; }
    var pa=e.target.closest && e.target.closest("[data-pat]");
    if(pa){ e.preventDefault(); S.a["pat_"+pa.getAttribute("data-pat")]=pa.getAttribute("data-pi"); psave(); paintResult(); return; }
    var jb=e.target.closest && e.target.closest("[data-job]");
    if(jb){ e.preventDefault(); if(applyJobPick(jb.getAttribute("data-job"))){ psave(); paintResult(); } }
  }
});

/* drawer text edits commit on blur/change */
document.addEventListener("change", function(e){
  var el=e.target;
  if(el.getAttribute && el.getAttribute("data-dtext")!=null){
    S.a[el.getAttribute("data-dtext")]=el.value; psave(); renderAll(true);
  }
});

/* header + masthead controls */
document.getElementById("drawerBtn").addEventListener("click", function(){ PS.drawer=!PS.drawer; renderAll(true); });
var facBtn=document.getElementById("facToggle");
if(facBtn) facBtn.addEventListener("click", function(){ S.fac=!S.fac; psave(); renderAll(true); });
var resetBtn=document.getElementById("resetBtn");
if(resetBtn) resetBtn.addEventListener("click", function(){
  if(confirm("Clear every answer and start the conversation over?")){ S.a={}; PS.ci=0; PS.drawer=false; psave(); renderAll(); }
});

renderAll(true);
