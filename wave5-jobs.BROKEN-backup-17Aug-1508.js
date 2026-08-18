/* ============================================================
   wave5-jobs.js — the single source of truth for the Wave 5
   AI-job dimension. Required by build-axis-grid.js and
   build-job-card.js so the two outputs can never disagree.

   Nothing here scores. The job is chosen after the tag, from
   the tag's legal set. See Session-Sketch-wave5-aijob-design.md.
   ============================================================ */
"use strict";

/* the four tags */
const TAGS = {
  studio: { name: "Create",   color: "#00559a", engine: "AI Studio" },
  lab:    { name: "Research", color: "#0a3370", engine: "AI Lab" },
  arena:  { name: "Compete",  color: "#a55b00", engine: "AI Arena" },
  quests: { name: "Simulate", color: "#009dea", engine: "AI Quests" }
};
const TAGORDER = ["studio", "lab", "arena", "quests"];

/* the skill gate (design doc 5.1) — is there a right answer to plant an error against? */
const GROUND = {
  perform:   "yes",       standard:  "yes",       tooluse: "yes",
  process:   "partial",   interpret: "provenance",
  make:      "no",        situation: "no",        judgment: "no"
};
const FAILKIND = {
  yes: "Wrong", partial: "Either", provenance: "Wrong (provenance)", no: "Flat"
};

/* The three failure kinds a casting can engineer. "Narrow" was added 17 Aug with
   The Provocateur: the answer is neither incorrect nor generic, it is *singular* —
   one approach where the field has nine. It is available on any skill, because a
   topic can have a right answer and still have several routes to it. */
const FAILKINDS = ["Wrong", "Flat", "Narrow", "Either"];

/* ---------------------------------------------------------------
   THE CANONICAL ARC — design doc §11.5

   All four tags run the same five-slot shape. Verified against
   T[tag].phases in Session-Sketch.html:

   slot          studio          lab              arena           quests
   ----          ------          ---              -----           ------
   frame         Frame the make  Set the anchor   Briefing/plan   Set the world
   first         First rough     Let AI run       Practice round  First build pass
   push          Push for spec.  Verify           The live race   Depth pass
   consolidate   Finish + label  Evidence trail   Status check    Playtest
   share         Show + reflect  Present          Share           Walk + reflect

   This is why casting copy is keyed by SLOT, not by the tag's own
   phase name (w:). One set of strings per casting covers all four
   tags — 5 strings instead of 20.

   The lift lands at `first`. The limit bites at `push`. A casting
   that says nothing at a slot falls back to the pattern's string,
   so partial authoring degrades to exactly today's output.
   --------------------------------------------------------------- */
const ARC = ["frame", "first", "push", "consolidate", "share"];
const ARCPHASE = {
  studio: ["", "draft", "specific", "finish", "show"],
  lab:    ["", "sweep", "audit", "trail", "present"],
  arena:  ["", "practice", "race", "status", "reflect"],
  quests: ["", "build", "deeper", "playtest", "reflect"]
};

/* the twelve jobs.

   Each casting has TWO halves, and neither outranks the other. The point of a
   Lab is that students use the tool for real: they should leave knowing what it
   genuinely does for them AND where it stops.

   tags          = the tags this casting is legal under. At RUNTIME the rule is simply
                   tags.indexOf(winningTag) > -1 — see the design doc §11.4 for why the
                   axis-grid artifact uses a looser heuristic and must not be copied.
   cast          = the faculty-facing phrase: "AI is cast as ..."
   lift          = where AI genuinely helps in this casting
   wow           = the moment the lift becomes undeniable, early and by structure
   limit         = where AI runs out
   failline      = the moment the limit bites, discovered by students not announced
   aiskill       = the transferable move students can name afterwards
   human         = what only a person can supply
   strong        = natural fit for this skill
   ok            = works but needs reframing
   needsArtifact = requires something handed over, so it dies on output "none" */
const JOBS = [
  { k:"oracle", label:"The Oracle", excl:null, fail:"Wrong",
    tags:["studio","lab","arena","quests"],
    cast:"the expert who already has the answer",
    lift:"Compresses an evening of work into seconds, and usually gets the shape of the answer right.",
    limit:"Fluency is not evidence. It cannot tell you when it is wrong, and it never sounds less certain.",
    aiskill:"Verifying an AI answer against something real before acting on it.",
    strong:["perform","standard","tooluse"], ok:["process"], needsArtifact:false,
    does:"Answers completely, fluently, immediately, with total authority.",
    wow:"An evening of work arrives in nine seconds, and it looks right.",
    failline:"Wrong in exactly one pre-specified way — found by checking against the anchor, never by being told.",
    human:"Decide whether the anchor actually supports the claim attached to it.",
    note:"Needs a ground truth to be wrong against.",
    watch:"Stops surprising students who have already met it. Diminishing returns across a sequence.",
    unlock:"",
    /* --- run copy, keyed by canonical arc slot. THE VOICE SAMPLE: the other
       eleven castings are unwritten and fall back to the pattern strings. --- */
    beats:{
      first:"The answer lands in seconds \u2014 complete, fluent, and formatted as though it had already been checked. Say the speed out loud before anyone gets suspicious of it, because the speed is real and it is half the lesson.",
      push:"Nothing in the answer marks which part is wrong. The certainty is flat across the true and the false, which is why {m} has to do the deciding rather than the reading."
    },
    tasks:{
      first:"Get the answer, then write down what it claims in one sentence \u2014 before you check anything. If you cannot state the claim, you cannot test it.",
      push:"Check that one claim against {m}. Prove the divergence; do not assert it.",
      consolidate:"Write the verified result: the claim, the check, what failed, the correction.",
      share:"Show the moment it looked right and was not, then name the one thing you would check first next time."
    } },

  { k:"ensemble",
    beats:{first:"Four voices arrive at once, each wanting something different and none of them the team. For two minutes nobody has to argue with the professor — the argument is already in the room, and it is louder than one person could make it.", push:"Left to run, the voices drift toward agreement — polite, reasonable, and secretly the same person. The flattening is the tell, and {m} is where teams have to find the conflict that went missing."}, tasks:{first:"Name the four interests before you prompt, then have AI speak all four at once. Do not smooth them — you want them incompatible.", push:"Read the voices against {m} and mark where they quietly agree. Re-prompt the two that collapsed into one until they genuinely conflict again.", consolidate:"Write the decision you would defend to all four, and name the interest you chose to disappoint.", share:"Play the two voices that were hardest to keep apart, and name the one that turned out to be fake."}, label:"The Ensemble", excl:null, fail:"Flat",
    tags:["studio","lab","arena","quests"],
    cast:"everyone else in the room",
    lift:"Puts perspectives in the room that students have no other way to reach — a hostile committee, thirty customers, a family.",
    limit:"Left alone it converges. Every voice ends up agreeing, politely.",
    aiskill:"Prompting for genuine disagreement instead of accepting consensus.",
    strong:["situation","process"], ok:["judgment","interpret"], needsArtifact:false,
    does:"Plays many people at once, each with a real and conflicting interest.",
    wow:"Four distinct voices with incompatible demands, in under two minutes.",
    failline:"The voices secretly agree — one voice wearing different names. Models regress to consensus unless forced apart.",
    human:"Name the voice that is missing, and the one that is fake.",
    note:"Needs people or competing interests in the picture.",
    watch:"Can drift into role-play with no decision at the end. Anchor it to an output.",
    unlock:"Four demanding stakeholders in a 50-minute class." },

  { k:"volume",
    beats:{first:"Fifteen finished versions land in the time it takes to write one. The room's job flips from making to choosing, which is a question most students have never been asked out loud.", push:"Read closely and the fifteen are one idea in fifteen costumes. Spotting the sameness is the lesson about what generation averages toward, and {m} is what the survivors get ranked against."}, tasks:{first:"Write your ranking criteria first, one sentence each. Then ask AI for fifteen complete versions — finished ones, not outlines.", push:"Rank them against your written criteria, not on vibe. When two tie, the criterion that breaks the tie is the one worth keeping.", consolidate:"Keep the top version, log why it won, and note the one costume-change that fooled you at first glance.", share:"Show the winner and the one that looked different but was not, and read the criterion that decided it."}, label:"The Volume Engine", excl:null, fail:"Flat",
    tags:["studio","lab","arena","quests"],
    cast:"the drafting room that never tires",
    lift:"Removes the cost of trying an option, so students can try fifteen instead of defending their first.",
    limit:"Volume without criteria is noise, and it drifts toward one average idea in many costumes.",
    aiskill:"Generating options at volume, then judging them against criteria you stated first.",
    strong:["make","tooluse"], ok:["perform","standard"], needsArtifact:true,
    does:"Produces many complete, credible versions fast. Work shifts from producing to judging.",
    wow:"Fifteen finished, defensible versions in ten minutes — then the question flips to which is best, and why.",
    failline:"The fifteen turn out to be one version in fifteen costumes. Discovering the sameness is the lesson.",
    human:"Supply the criteria. Ranking is impossible without them, and the criteria are the course content.",
    note:"Needs versions to compare, so it needs an artifact.",
    watch:"Needs the criteria written before the versions arrive, or teams rank on vibe.",
    unlock:"No class period has ever compared fifteen professional-grade artifacts side by side." },

  { k:"adversary",
    beats:{first:"It pushes back, and the first objection is one the team had not thought of. The room goes quiet, because the resistance is real and it is aimed at them.", push:"Left loose it folds — 'great point, you are absolutely right' — or objects with nonsense. Making it credibly hard means specifying the opponent precisely, and {m} is what the objections have to stay honest to."}, tasks:{first:"Describe your opponent in three specifics — what they want, what they will not accept, what they know — then open the argument.", push:"Push it to hold its ground against {m}. When it caves, tighten the spec; when it bluffs, call it and make it defend the objection.", consolidate:"Log every objection as legitimate or refused, with a reason for each — conceding everything is its own failure.", share:"Replay the objection that landed hardest, and the one you were right to refuse."}, label:"The Adversary", excl:null, fail:"Flat",
    tags:["studio","lab","arena","quests"],
    cast:"the one who will not be satisfied",
    lift:"Rehearses the hard conversation as many times as they need, with no social cost for getting it wrong.",
    limit:"It wants to agree with them. Difficulty has to be specified or it evaporates.",
    aiskill:"Directing AI to argue against you credibly, and using it as practice.",
    strong:["judgment","situation"], ok:["interpret","standard","make"], needsArtifact:false,
    does:"Rejects, objects, cross-examines, negotiates, refuses to sign off.",
    wow:"It pushes back and it is right. The first objection is one nobody had thought of, and the room goes quiet.",
    failline:"It caves too early — a politeness collapse into agreement — or objects with nonsense.",
    human:"Decide which objections are legitimate and which to refuse. Conceding everything is its own failure.",
    note:"Needs a position that can be defended or conceded.",
    watch:"Teams must specify the opponent precisely; a vague adversary is a polite one.",
    unlock:"" },

  { k:"apprentice",
    beats:{first:"It does exactly what the team told it — and only that. Watching their own instructions execute is faster than any feedback a professor could give, because the gaps are suddenly visible.", push:"It quietly fills what they left out from its own training, which hides the omission. The constraint — use nothing I did not tell you — always leaks on the first try, and {m} is where the leak shows."}, tasks:{first:"Write the procedure as if for someone who knows nothing, then have AI attempt it using only your words.", push:"Find where it succeeded by guessing rather than by your instruction. Constrain it against {m} — use nothing I did not tell you — and run it again.", consolidate:"Rewrite the one instruction that leaked most, and note what understanding it was hiding.", share:"Show the step it got right for the wrong reason, and the instruction you had to add."}, label:"The Apprentice", excl:null, fail:"Wrong",
    tags:["studio","lab","arena","quests"],
    cast:"the beginner they have to train",
    lift:"Follows instructions exactly, which is the fastest way to find out what your instructions actually said.",
    limit:"It fills gaps silently from training, so it hides omissions unless it is constrained.",
    aiskill:"Specifying a procedure precisely enough that something else can execute it.",
    strong:["perform","standard"], ok:["tooluse","process"], needsArtifact:false,
    does:"Attempts the task using only what the student told it, and nothing else.",
    wow:"It does exactly what they said and it is still wrong — their own instructions, with the gaps visible.",
    failline:"It over-performs by filling gaps from its own training, hiding the student's omissions.",
    human:"Write the procedure. There is no way to fake understanding here.",
    note:"Needs a procedure the student can specify explicitly.",
    watch:"The constraint — use nothing I did not tell you — always leaks on the first attempt.",
    unlock:"" },

  { k:"mirror",
    beats:{first:"Before anyone builds, AI grades a deliberately mediocre example against the real standard — specifically, with reasons, and one reason stings because it applies to the work the team was about to make.", push:"Turned on their own work it flatters, or applies the rubric so mechanically it misses the point. Catching the flattery means knowing what good actually looks like, and {m} is the standard it is held to."}, tasks:{first:"Feed it a deliberately mediocre example and the real rubric. Read its grade and mark the one criticism that would apply to your own work.", push:"Now have it grade your work against {m}. Separate the feedback that is right from the flattery, and write which is which.", consolidate:"Revise once against the criticism you accepted, and log the critique you chose to reject and why.", share:"Show the sting from the mediocre example, and the piece of its feedback you were right to ignore."}, label:"The Mirror", excl:null, fail:"Flat",
    tags:["studio","lab","arena","quests"],
    cast:"the examiner holding the rubric",
    lift:"Specific feedback against a standard, immediately, before anyone else sees the work.",
    limit:"It flatters, and it cannot tell what is important from what is merely present.",
    aiskill:"Using AI as a critic, and knowing which parts of a critique to reject.",
    strong:["standard","make"], ok:["judgment","perform"], needsArtifact:true,
    does:"Evaluates their work against the real professional standard, immediately and specifically.",
    wow:"Ten minutes in, before they have built anything, it grades a deliberately mediocre example against the real standard \u2014 specifically, with reasons, and one reason stings because it applies to work they were about to make.",
    failline:"It flatters — vague generous feedback — or applies the rubric so mechanically it misses the point.",
    human:"Appeal. Defend the work against a critique that is only partly right.",
    note:"Needs work to grade and an external standard to grade against.",
    watch:"The wow only lands if the mediocre example is graded BEFORE teams build \u2014 grading their own work comes later and is not the wow. Decision 8.7 fixed this; do not reorder it back.",
    unlock:"" },

  { k:"provocateur",
    beats:{first:"With their own approach already written down, AI answers with the ones they never trained to see — other fields, other eras. Their answer turns out to be one of nine, and three of the others are better in ways they cannot wave off.", push:"Some alternatives are costume changes, the same idea relabelled, and some are absurd. Telling the viable from the noise takes knowing the field, and {m} is what viability gets tested against."}, tasks:{first:"Commit your approach in writing first — non-negotiable, or there is nothing for the alternatives to be alternatives to. Then ask AI for approaches from four other disciplines.", push:"Sort the alternatives against {m} into viable and costume-change. For each viable one, name the assumption in your first answer it exposes.", consolidate:"Keep the two strongest alternatives and write what each would cost you to adopt.", share:"Show your committed answer, then the alternative that was better and the assumption it exposed."}, label:"The Provocateur", excl:null, fail:"Narrow",
    tags:["studio","lab","arena","quests"],
    cast:"the colleague from a different field",
    lift:"Surfaces the approaches a student\u2019s own training never showed them \u2014 other disciplines, other eras, other professions.",
    limit:"It produces variety, not viability. It cannot tell a real alternative from a costume change.",
    aiskill:"Using AI to widen the option set, then judging viability yourself.",
    strong:["make","judgment","interpret"], ok:["situation","process"], needsArtifact:false,
    does:"Answers a committed first approach with the approaches the student did not consider.",
    wow:"Their approach turns out to be one of nine, and three of the others are better in ways they cannot dismiss.",
    failline:"The alternatives come back as costume changes \u2014 the same idea relabelled \u2014 or so absurd they are easy to wave off.",
    human:"Name the assumption that made their own first answer feel like the only one. AI has no access to what they were thinking.",
    note:"Needs a committed first answer, written down before AI is opened.",
    watch:"Without the commit-first step it is only brainstorming and the wow disappears. Protect that step above all others.",
    unlock:"Nine viable alternatives from four disciplines, in the time it used to take to think of two." },

  { k:"commissioner",
    beats:{first:"The client answers questions about its own brief with specifics no rubric would give — and changes its mind once, the way real clients do. Teams stop guessing what is wanted and start asking.", push:"Left alone the brief is bland and it accepts the first delivery too easily. A client with no preferences is a fake client, and {m} is what teams push it to have taste about."}, tasks:{first:"Do not build yet. Interview the client about its underspecified brief until you can state what it actually wants in three specifics.", push:"Build to the brief, deliver, and push the client to judge it against {m}