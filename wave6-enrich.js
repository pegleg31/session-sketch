/* Wave 6 — the AI rewrite pass. SOURCE FILE.
   Inlined into the result script block of Session-Sketch.html by
   build-enrich-inline.js (which then flows into the portal via build-portal.js).
   Nothing in this file may contain a literal script tag: the portal builder and
   the regression harness both slice the HTML on those, and a tag inside a
   comment would split a block in the wrong place. The build asserts this.
   Do not hand-edit the copy inside the HTML — edit this file and re-run:
       node build-enrich-inline.js && node build-portal.js

   What this does and does not do
   -----------------------------
   The engine decides everything: tag, activity, casting, phases, timings,
   roles, the score bars. This pass rewrites WORDS ONLY — the activity pitch,
   the artifact line, the run beats, the participant tasks, and the wow /
   designed-failure / human-contribution lines — in the subject's own language,
   using the faculty member's topic, course and tool. Nothing here scores, and
   nothing here can move a tag.

   State: S.a.enrich = {sig, pitch, artifact, runs[], tasks[], wow, failure,
   human}. `sig` fingerprints every answer plus the tag, activity and casting,
   so the rewrite self-invalidates the moment any of them changes — faculty can
   never read field-specific prose describing a concept they have since changed.
   Offline (file://) the button is replaced by a note; every surface falls back
   to the template wording, which is why the tool still works with no network. */

var ENRICH_URL = "/api/enrich";
var enrichBusy = false, enrichErr = null;

/* the rewrite needs an origin to POST to; opened as a local file there is none */
function enrichAvailable(){
  try { return typeof fetch === "function" && location.protocol !== "file:"; }
  catch(e){ return false; }
}

/* every input that could make the rewritten prose wrong */
function enrichSig(c){
  var a = c.a;
  return ["v1", a.subject, a.course, a.topic, a.tool, a.teaches, a.stage,
    a.skill, a.output, a.material, a.matstate, a.length, a.size, a.compete,
    a.exper, a.catch, a.catchway, a.worry, a.goeswrong, a.doDiff, a.remember,
    a.avoid, c.k, c.P.name, c.job || "", c.len
  ].join("");
}

/* overlay the stored rewrite onto a freshly built concept, if it still matches */
function applyEnrich(c){
  var E = c.a && c.a.enrich;
  if(!E || E.sig !== enrichSig(c)) return c;
  if(E.pitch) c.P.pitch = E.pitch;
  if(E.artifact) c.P.artifact = E.artifact;
  if(E.runs && E.runs.length === c.P.runs.length) c.P.runs = E.runs.slice();
  if(E.tasks && E.tasks.length === c.P.tasks.length){
    c.P.tasks = E.tasks.slice();
    c.phases.forEach(function(p,i){ if(c.P.tasks[i]) p.task = c.P.tasks[i]; });
  }
  c.EN = {wow:E.wow || null, failure:E.failure || null, human:E.human || null};
  c.enriched = true;
  return c;
}

/* the concept as the templates wrote it — what we send as `current`, so a
   second rewrite never rewrites a rewrite */
function templateConcept(){
  var saved = S.a.enrich;
  if(saved) delete S.a.enrich;
  try { return concept(); }
  finally { if(saved) S.a.enrich = saved; }
}

function enrichPayload(c){
  var a = c.a;
  return {
    course: a.course || "",
    topic: c.topic,
    tool: c.tool || "",
    subject: c.SU.label,
    nouns: c.SU.nouns,
    currentPractice: a.teaches || "",
    stage: a.stage || "",
    skill: c.SK ? c.SK.label : "",
    output: (c.OU && a.output !== "none") ? c.OU.label : "none — the point is the doing, not a deliverable",
    matNoun: c.M.noun,
    matLabel: c.M.label,
    matState: a.matstate === "messy" ? "messy on purpose — sorting or vetting it is part of the work" : "ready to use",
    length: lenLabel(c.len),
    teamSize: c.teamSize,
    tag: c.ty.name,
    tagMeans: c.ty.blurb,
    activity: c.P.name,
    activityWhat: c.P.what || "",
    anchor: c.P.anchor || "",
    aiCastAs: c.J ? c.J.cast : "",
    aiCastLabel: c.J ? c.J.label : "",
    aiLift: c.J ? c.J.lift : "",
    aiLimit: c.J ? c.J.limit : "",
    aiSkill: c.J ? c.J.aiskill : c.t.skill,
    plantedError: (a.catch || "").trim(),
    catchWay: (a.catchway && CATCHWAY[a.catchway]) ? CATCHWAY[a.catchway].label : "",
    competing: (a.compete && COMPETE[a.compete]) ? COMPETE[a.compete].label : "",
    studentExperience: a.exper || "",
    facultyWorry: a.worry || "",
    remember: (a.remember || "").trim(),
    avoid: (a.avoid || "").trim(),
    /* one phase name per entry in current.tasks; current.runs is a shorter,
       non-phase-aligned list of run beats. The endpoint's schema counts them
       separately and clamps anything the model returns at the wrong length. */
    phases: c.phases.map(function(p){ return p.n; }),
    current: {
      pitch: c.P.pitch,
      artifact: c.P.artifact,
      runs: c.P.runs.slice(),
      tasks: c.P.tasks.slice(),
      wow: wowOf(c),
      failure: failOf(c),
      human: humanOf(c)
    }
  };
}

/* The portal repaints via paintResult, the wizard via the renderer named on the
   next line. The portal is built by lifting these blocks out of the wizard, so
   pick at runtime, not at build time. Dispatch through a variable on purpose:
   build-portal.js greps for a bare call to the wizard renderer to find and strip
   its bootstrap line, so this file must never spell one out. */
function enrichRepaint(){
  var fn = (typeof paintResult === "function") ? paintResult
         : (typeof draw === "function") ? draw : null;
  if(fn) fn();
}
function enrichSave(){
  var fn = (typeof psave === "function") ? psave
         : (typeof save === "function") ? save : null;
  if(fn) fn();
}

function runEnrich(){
  if(enrichBusy || !enrichAvailable()) return;
  if(score().state === "notready") return;
  var c = templateConcept(), sig = enrichSig(c), body = enrichPayload(c);
  enrichBusy = true; enrichErr = null; enrichRepaint();
  fetch(ENRICH_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  }).then(function(res){
    return res.text().then(function(txt){
      var j = null;
      try { j = JSON.parse(txt); } catch(e){}
      if(!res.ok) throw new Error((j && j.error) || ("The rewrite service returned HTTP " + res.status + "."));
      if(!j || !j.pitch) throw new Error("The rewrite service sent back nothing usable.");
      return j;
    });
  }).then(function(j){
    j.sig = sig;
    S.a.enrich = j;
    enrichBusy = false;
    enrichSave(); enrichRepaint();
  }).catch(function(e){
    enrichBusy = false;
    enrichErr = (e && e.message) || "Could not reach the rewrite service.";
    enrichRepaint();
  });
}

function clearEnrich(){
  if(S.a.enrich) delete S.a.enrich;
  enrichErr = null;
  enrichSave(); enrichRepaint();
}

function enrichCardHTML(c){
  var subj = esc(c.SU.label), h = '<div class="card hero" data-tab="activity">';
  h += '<div class="eb">' + (c.enriched ? "Written for your field" : "Template wording") + '</div>';
  h += '<h2>' + (c.enriched ? "Rewritten for " + subj : "Make this read like " + subj) + '</h2>';

  if(!enrichAvailable()){
    h += '<p class="lead">The wording below is template-written, so it is deliberately generic. Opened online, this page offers a one-click rewrite that puts the activity, the run beats, the participant tasks and the wow into ' + subj +
         ' language for this exact topic. Opened as a local file there is no service to call, so the template wording stands — which is by design: the tool has to work with no network. The build prompt already instructs your AI tool to do the same rewrite.</p>';
    h += '</div>';
    return h;
  }

  if(enrichBusy){
    h += '<p class="lead">Rewriting the activity, the beats, the tasks and the wow around ' + esc(c.topicShort) +
         ' in ' + subj + ' language. This usually takes twenty to forty seconds — leave the page open.</p>';
    h += '<div class="noprint"><button class="btn btn-ink" disabled>Rewriting…</button></div>';
  } else if(c.enriched){
    h += '<p class="lead">The activity pitch, the run beats, the participant tasks, the wow, the designed failure and the human contribution are now written in ' + subj +
         ' language for ' + esc(c.topicShort) + '. No decision moved: the tag, the casting, the activity, the phases and the timings are exactly what the engine chose — only the words changed. The build prompt below carries the rewritten text.</p>';
    h += '<div class="noprint"><button class="btn btn-ghost" data-enrich="run">Rewrite again</button>' +
         '<button class="btn btn-ghost" data-enrich="clear" style="margin-left:8px">Back to template wording</button></div>';
  } else {
    h += '<p class="lead">Everything below is written from templates, so it is deliberately generic — that is the single biggest complaint about this page. This rewrites the wording only: the activity pitch, the run beats, the participant tasks, the wow, the designed failure and the human contribution, all in ' + subj +
         ' language using your topic, your course' + (c.tool ? ' and ' + esc(c.tool) : '') + '. It changes no decision — the tag, the casting, the activity, the phases and the timings stay as they are.</p>';
    h += '<div class="noprint"><button class="btn btn-ink" data-enrich="run">Rewrite for ' + subj + '</button></div>';
  }

  if(enrichErr){
    h += '<div class="warn" style="margin-top:12px"><div class="lbl">The rewrite did not run</div>' + esc(enrichErr) +
         ' Nothing is lost — the template wording below still stands, and the build prompt still produces a fully written session.</div>';
  }
  h += '<div class="fac"><div class="lbl">Facilitator note</div>Treat the rewrite as a drafting aid, not an authority. Read the beats before you run them: if a line misstates how the work is actually done in your field, fix that line or go back to the template wording. It clears itself whenever you change an answer, the tag, the activity or the casting, so you can never be reading field-specific prose about a concept you have since changed.</div>';
  h += '</div>';
  return h;
}

document.addEventListener("click", function(e){
  var b = (e.target && e.target.closest) ? e.target.closest("[data-enrich]") : null;
  if(!b) return;
  var v = b.getAttribute("data-enrich");
  if(v === "run") runEnrich();
  else if(v === "clear") clearEnrich();
});
