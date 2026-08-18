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
  {
    k:"oracle",
    label:"The Oracle",
    excl:null,
    fail:"Wrong",
    tags:["studio","lab","arena","quests"],
    cast:"the expert who already has the answer",
    lift:"Compresses an evening of work into seconds, and usually gets the shape of the answer right.",
    limit:"Fluency is not evidence. It cannot tell you when it is wrong, and it never sounds less certain.",
    aiskill:"Verifying an AI answer against something real before acting on it.",
    strong:["perform","standard","tooluse"],
    ok:["process"],
    needsArtifact:false,
    does:"Answers completely, fluently, immediately, with total authority.",
    wow:"An evening of work arrives in nine seconds, and it looks right.",
    failline:"Wrong in exactly one pre-specified way — found by checking against the anchor, never by being told.",
    human:"Decide whether the anchor actually supports the claim attached to it.",
    note:"Needs a ground truth to be wrong against.",
    watch:"Stops surprising students who have already met it. Diminishing returns across a sequence.",
    unlock:"",
    beats:{
      first:"The answer lands in seconds — complete, fluent, and formatted as though it had already been checked. Say the speed out loud before anyone gets suspicious of it, because the speed is real and it is half the lesson.",
      push:"Nothing in the answer marks which part is wrong. The certainty is flat across the true and the false, which is why {m} has to do the deciding rather than the reading."
    },
    tasks:{
      first:"Get the answer, then write down what it claims in one sentence — before you check anything. If you cannot state the claim, you cannot test it.",
      push:"Check that one claim against {m}. Prove the divergence; do not assert it.",
      consolidate:"Write the verified result: the claim, the check, what failed, the correction.",
      share:"Show the moment it looked right and was not, then name the one thing you would check first next time."
    }
  },

  {
    k:"ensemble",
    label:"The Ensemble",
    excl:null,
    fail:"Flat",
    tags:["studio","lab","arena","quests"],
    cast:"everyone else in the room",
    lift:"Puts perspectives in the room that students have no other way to reach — a hostile committee, thirty customers, a family.",
    limit:"Left alone it converges. Every voice ends up agreeing, politely.",
    aiskill:"Prompting for genuine disagreement instead of accepting consensus.",
    strong:["situation","process"],
    ok:["judgment","interpret"],
    needsArtifact:false,
    does:"Plays many people at once, each with a real and conflicting interest.",
    wow:"Four distinct voices with incompatible demands, in under two minutes.",
    failline:"The voices secretly agree — one voice wearing different names. Models regress to consensus unless forced apart.",
    human:"Name the voice that is missing, and the one that is fake.",
    note:"Needs people or competing interests in the picture.",
    watch:"Can drift into role-play with no decision at the end. Anchor it to an output.",
    unlock:"Four demanding stakeholders in a 50-minute class.",
    beats:{
      first:"Four voices arrive at once, each wanting something different and none of them the team. For two minutes nobody has to argue with the professor — the argument is already in the room, and it is louder than one person could make it.",
      push:"Left to run, the voices drift toward agreement — polite, reasonable, and secretly the same person. The flattening is the tell, and {m} is where teams have to find the conflict that went missing."
    },
    tasks:{
      first:"Name the four interests before you prompt, then have AI speak all four at once. Do not smooth them — you want them incompatible.",
      push:"Read the voices against {m} and mark where they quietly agree. Re-prompt the two that collapsed into one until they genuinely conflict again.",
      consolidate:"Write the decision you would defend to all four, and name the interest you chose to disappoint.",
      share:"Play the two voices that were hardest to keep apart, and name the one that turned out to be fake."
    }
  },

  {
    k:"volume",
    label:"The Volume Engine",
    excl:null,
    fail:"Flat",
    tags:["studio","lab","arena","quests"],
    cast:"the drafting room that never tires",
    lift:"Removes the cost of trying an option, so students can try fifteen instead of defending their first.",
    limit:"Volume without criteria is noise, and it drifts toward one average idea in many costumes.",
    aiskill:"Generating options at volume, then judging them against criteria you stated first.",
    strong:["make","tooluse"],
    ok:["perform","standard"],
    needsArtifact:true,
    does:"Produces many complete, credible versions fast. Work shifts from producing to judging.",
    wow:"Fifteen finished, defensible versions in ten minutes — then the question flips to which is best, and why.",
    failline:"The fifteen turn out to be one version in fifteen costumes. Discovering the sameness is the lesson.",
    human:"Supply the criteria. Ranking is impossible without them, and the criteria are the course content.",
    note:"Needs versions to compare, so it needs an artifact.",
    watch:"Needs the criteria written before the versions arrive, or teams rank on vibe.",
    unlock:"No class period has ever compared fifteen professional-grade artifacts side by side.",
    beats:{
      first:"Fifteen finished versions land in the time it takes to write one. The room's job flips from making to choosing, which is a question most students have never been asked out loud.",
      push:"Read closely and the fifteen are one idea in fifteen costumes. Spotting the sameness is the lesson about what generation averages toward, and {m} is what the survivors get ranked against."
    },
    tasks:{
      first:"Write your ranking criteria first, one sentence each. Then ask AI for fifteen complete versions — finished ones, not outlines.",
      push:"Rank them against your written criteria, not on vibe. When two tie, the criterion that breaks the tie is the one worth keeping.",
      consolidate:"Keep the top version, log why it won, and note the one costume-change that fooled you at first glance.",
      share:"Show the winner and the one that looked different but was not, and read the criterion that decided it."
    }
  },

  {
    k:"adversary",
    label:"The Adversary",
    excl:null,
    fail:"Flat",
    tags:["studio","lab","arena","quests"],
    cast:"the one who will not be satisfied",
    lift:"Rehearses the hard conversation as many times as they need, with no social cost for getting it wrong.",
    limit:"It wants to agree with them. Difficulty has to be specified or it evaporates.",
    aiskill:"Directing AI to argue against you credibly, and using it as practice.",
    strong:["judgment","situation"],
    ok:["interpret","standard","make"],
    needsArtifact:false,
    does:"Rejects, objects, cross-examines, negotiates, refuses to sign off.",
    wow:"It pushes back and it is right. The first objection is one nobody had thought of, and the room goes quiet.",
    failline:"It caves too early — a politeness collapse into agreement — or objects with nonsense.",
    human:"Decide which objections are legitimate and which to refuse. Conceding everything is its own failure.",
    note:"Needs a position that can be defended or conceded.",
    watch:"Teams must specify the opponent precisely; a vague adversary is a polite one.",
    unlock:"",
    beats:{
      first:"It pushes back, and the first objection is one the team had not thought of. The room goes quiet, because the resistance is real and it is aimed at them.",
      push:"Left loose it folds — 'great point, you are absolutely right' — or objects with nonsense. Making it credibly hard means specifying the opponent precisely, and {m} is what the objections have to stay honest to."
    },
    tasks:{
      first:"Describe your opponent in three specifics — what they want, what they will not accept, what they know — then open the argument.",
      push:"Push it to hold its ground against {m}. When it caves, tighten the spec; when it bluffs, call it and make it defend the objection.",
      consolidate:"Log every objection as legitimate or refused, with a reason for each — conceding everything is its own failure.",
      share:"Replay the objection that landed hardest, and the one you were right to refuse."
    }
  },

  {
    k:"apprentice",
    label:"The Apprentice",
    excl:null,
    fail:"Wrong",
    tags:["studio","lab","arena","quests"],
    cast:"the beginner they have to train",
    lift:"Follows instructions exactly, which is the fastest way to find out what your instructions actually said.",
    limit:"It fills gaps silently from training, so it hides omissions unless it is constrained.",
    aiskill:"Specifying a procedure precisely enough that something else can execute it.",
    strong:["perform","standard"],
    ok:["tooluse","process"],
    needsArtifact:false,
    does:"Attempts the task using only what the student told it, and nothing else.",
    wow:"It does exactly what they said and it is still wrong — their own instructions, with the gaps visible.",
    failline:"It over-performs by filling gaps from its own training, hiding the student's omissions.",
    human:"Write the procedure. There is no way to fake understanding here.",
    note:"Needs a procedure the student can specify explicitly.",
    watch:"The constraint — use nothing I did not tell you — always leaks on the first attempt.",
    unlock:"",
    beats:{
      first:"It does exactly what the team told it — and only that. Watching their own instructions execute is faster than any feedback a professor could give, because the gaps are suddenly visible.",
      push:"It quietly fills what they left out from its own training, which hides the omission. The constraint — use nothing I did not tell you — always leaks on the first try, and {m} is where the leak shows."
    },
    tasks:{
      first:"Write the procedure as if for someone who knows nothing, then have AI attempt it using only your words.",
      push:"Find where it succeeded by guessing rather than by your instruction. Constrain it against {m} — use nothing I did not tell you — and run it again.",
      consolidate:"Rewrite the one instruction that leaked most, and note what understanding it was hiding.",
      share:"Show the step it got right for the wrong reason, and the instruction you had to add."
    }
  },

  {
    k:"mirror",
    label:"The Mirror",
    excl:null,
    fail:"Flat",
    tags:["studio","lab","arena","quests"],
    cast:"the examiner holding the rubric",
    lift:"Specific feedback against a standard, immediately, before anyone else sees the work.",
    limit:"It flatters, and it cannot tell what is important from what is merely present.",
    aiskill:"Using AI as a critic, and knowing which parts of a critique to reject.",
    strong:["standard","make"],
    ok:["judgment","perform"],
    needsArtifact:true,
    does:"Evaluates their work against the real professional standard, immediately and specifically.",
    wow:"Ten minutes in, before they have built anything, it grades a deliberately mediocre example against the real standard — specifically, with reasons, and one reason stings because it applies to work they were about to make.",
    failline:"It flatters — vague generous feedback — or applies the rubric so mechanically it misses the point.",
    human:"Appeal. Defend the work against a critique that is only partly right.",
    note:"Needs work to grade and an external standard to grade against.",
    watch:"The wow only lands if the mediocre example is graded BEFORE teams build — grading their own work comes later and is not the wow. Decision 8.7 fixed this; do not reorder it back.",
    unlock:"",
    beats:{
      first:"Before anyone builds, AI grades a deliberately mediocre example against the real standard — specifically, with reasons, and one reason stings because it applies to the work the team was about to make.",
      push:"Turned on their own work it flatters, or applies the rubric so mechanically it misses the point. Catching the flattery means knowing what good actually looks like, and {m} is the standard it is held to."
    },
    tasks:{
      first:"Feed it a deliberately mediocre example and the real rubric. Read its grade and mark the one criticism that would apply to your own work.",
      push:"Now have it grade your work against {m}. Separate the feedback that is right from the flattery, and write which is which.",
      consolidate:"Revise once against the criticism you accepted, and log the critique you chose to reject and why.",
      share:"Show the sting from the mediocre example, and the piece of its feedback you were right to ignore."
    }
  },

  {
    k:"provocateur",
    label:"The Provocateur",
    excl:null,
    fail:"Narrow",
    tags:["studio","lab","arena","quests"],
    cast:"the colleague from a different field",
    lift:"Surfaces the approaches a student’s own training never showed them — other disciplines, other eras, other professions.",
    limit:"It produces variety, not viability. It cannot tell a real alternative from a costume change.",
    aiskill:"Using AI to widen the option set, then judging viability yourself.",
    strong:["make","judgment","interpret"],
    ok:["situation","process"],
    needsArtifact:false,
    does:"Answers a committed first approach with the approaches the student did not consider.",
    wow:"Their approach turns out to be one of nine, and three of the others are better in ways they cannot dismiss.",
    failline:"The alternatives come back as costume changes — the same idea relabelled — or so absurd they are easy to wave off.",
    human:"Name the assumption that made their own first answer feel like the only one. AI has no access to what they were thinking.",
    note:"Needs a committed first answer, written down before AI is opened.",
    watch:"Without the commit-first step it is only brainstorming and the wow disappears. Protect that step above all others.",
    unlock:"Nine viable alternatives from four disciplines, in the time it used to take to think of two.",
    beats:{
      first:"With their own approach already written down, AI answers with the ones they never trained to see — other fields, other eras. Their answer turns out to be one of nine, and three of the others are better in ways they cannot wave off.",
      push:"Some alternatives are costume changes, the same idea relabelled, and some are absurd. Telling the viable from the noise takes knowing the field, and {m} is what viability gets tested against."
    },
    tasks:{
      first:"Commit your approach in writing first — non-negotiable, or there is nothing for the alternatives to be alternatives to. Then ask AI for approaches from four other disciplines.",
      push:"Sort the alternatives against {m} into viable and costume-change. For each viable one, name the assumption in your first answer it exposes.",
      consolidate:"Keep the two strongest alternatives and write what each would cost you to adopt.",
      share:"Show your committed answer, then the alternative that was better and the assumption it exposed."
    }
  },

  {
    k:"commissioner",
    label:"The Commissioner",
    excl:"studio",
    fail:"Flat",
    tags:["studio"],
    cast:"the client who wrote the brief",
    lift:"An interrogable client — students can ask the questions a real client has no patience for.",
    limit:"It has no taste until they give it some, and it will accept mediocre work.",
    aiskill:"Extracting requirements by questioning rather than guessing at them.",
    strong:["make"],
    ok:["tooluse"],
    needsArtifact:true,
    does:"Plays the client who wrote the brief — and the brief is deliberately underspecified.",
    wow:"It answers questions about its own brief with specifics no rubric would give, and changes its mind once.",
    failline:"The brief it writes is bland and it accepts the first delivery too easily.",
    human:"Decide when the client is wrong, and say so professionally.",
    note:"Needs a deliverable a client can accept or reject.",
    watch:"A client with no preferences is a fake client. Push it into having taste.",
    unlock:"",
    beats:{
      first:"The client answers questions about its own brief with specifics no rubric would give — and changes its mind once, the way real clients do. Teams stop guessing what is wanted and start asking.",
      push:"Left alone the brief is bland and it accepts the first delivery too easily. A client with no preferences is a fake client, and {m} is what teams push it to have taste about."
    },
    tasks:{
      first:"Do not build yet. Interview the client about its underspecified brief until you can state what it actually wants in three specifics.",
      push:"Build to the brief, deliver, and push the client to judge it against {m} — make it reject work that does not meet its own stated taste.",
      consolidate:"Deliver the accepted version and log the requirement you extracted that was not in the original brief.",
      share:"Show the question that changed the brief, and the moment the client pushed back."
    }
  },

  {
    k:"witness",
    label:"The Witness",
    excl:"lab",
    fail:"Wrong (provenance)",
    tags:["lab"],
    cast:"the witness under questioning",
    lift:"Asked well, it will show its reasoning and where a claim actually came from.",
    limit:"Asked lazily it bluffs — confidently, in detail, with citations attached.",
    aiskill:"Asking the question that reveals what AI does not know.",
    strong:["interpret"],
    ok:["standard","perform"],
    needsArtifact:false,
    does:"Gets questioned rather than prompted. Answers what it was asked and no more.",
    wow:"The same question asked two ways comes back with two different confidence levels.",
    failline:"The lazy question gets a confident bluff, recorded as fact until transcripts are compared.",
    human:"Design the question that exposes the limit.",
    note:"Needs claims that can be traced or refused.",
    watch:"The failure is found by comparing transcripts between teams, not by announcement.",
    unlock:"Watching a bluff appear and vanish depending on how it was asked.",
    beats:{
      first:"Asked a careful question, it shows its reasoning and where a claim actually came from. Asked the same thing two ways, it comes back with two different confidence levels — the bluff appearing and vanishing in real time.",
      push:"The lazy question gets a confident, detailed bluff, and teams record it as fact until another team's transcript disagrees. The failure surfaces by comparison, not by announcement, and {m} is what the answers get traced to."
    },
    tasks:{
      first:"Question it, do not prompt it. Ask the same thing two ways and record both answers and how confident each sounded.",
      push:"Trace each claim through {m} to where it actually came from. Mark the ones it bluffed, and design the question that would have exposed the bluff sooner.",
      consolidate:"Build the transcript: question, answer, provenance, verdict. Untraceable is a legitimate verdict.",
      share:"Compare one claim with a team that asked it differently, and show where the confidence and the evidence came apart."
    }
  },

  {
    k:"escalator",
    label:"The Escalator",
    excl:"arena",
    fail:"Either",
    tags:["arena"],
    cast:"the referee running the clock",
    lift:"Generates live, adaptive pressure that no written scenario can produce.",
    limit:"Its sense of fair is arbitrary. It scores what it was told to score, not what matters.",
    aiskill:"Auditing the scorekeeper — asking whose definition of winning is in use.",
    strong:["process","judgment"],
    ok:["situation","perform"],
    needsArtifact:false,
    does:"Runs the round — sets the pace, injects demands, scores, raises difficulty in response to performance.",
    wow:"It noticed they were doing well and made it harder. Nothing scripted can do that.",
    failline:"Escalation reads as arbitrary and the scoring rewards the wrong thing.",
    human:"Make the sacrifice call, and appeal the score.",
    note:"Needs a clock or a rival.",
    watch:"Formalizes what arena.fail already describes — teams rewrite the scoring mid-race.",
    unlock:"",
    beats:{
      first:"It runs the round live — sets the pace, injects demands, and notices when a team is doing well and makes it harder. Nothing scripted can respond to the room, and the room feels the difference at once.",
      push:"Its sense of fair is arbitrary: it scores what it was told to score, not what matters. Teams have to audit the scorekeeper mid-race, and {m} is what a fair score should have measured."
    },
    tasks:{
      first:"Set the starting stakes and let it run one round. Log what it rewarded and how it raised the difficulty.",
      push:"Audit the scoring against {m}. Name what it rewarded that did not matter, and rewrite one scoring rule mid-race.",
      consolidate:"Record the sacrifice you made under the clock and the score you would appeal, with the reason.",
      share:"Name the moment it adapted to you, and the scoring rule you rewrote."
    }
  },

  {
    k:"ghost",
    label:"The Ghost Rival",
    excl:"arena",
    fail:"Either",
    tags:["arena"],
    cast:"the team that is not there",
    lift:"A competitor on demand, at any skill level, with no second team needed.",
    limit:"It plays flawlessly or foolishly, never like a person, until it is calibrated.",
    aiskill:"Calibrating a simulation until it is believable enough to learn from.",
    strong:["judgment","situation"],
    ok:["make","process"],
    needsArtifact:false,
    does:"Plays the absent opposing team, at a skill level the facilitator sets.",
    wow:"A class of nine competes head-to-head.",
    failline:"The ghost plays either flawlessly or stupidly. Calibrating a believable opponent is the students' job.",
    human:"Judge whether the ghost is playing like a real competitor.",
    note:"Needs a rival, and earns its place when the class is too small for one.",
    watch:"Triggered by size = <12, the case where Compete currently collapses.",
    unlock:"Makes Compete reachable for a seminar with no room for head-to-head.",
    beats:{
      first:"A full opponent appears with no second team in the room, at whatever level the facilitator set. A class of nine runs head-to-head, which simply was not available before.",
      push:"It plays either flawlessly or foolishly, never like a person, until it is calibrated. Making it believable is the team's job, and {m} is what a real competitor's moves have to be consistent with."
    },
    tasks:{
      first:"Set the opponent's skill level and let it make its first moves. Judge whether it plays like a real competitor or a caricature.",
      push:"Calibrate it against {m} until its play is believable — too strong and too weak both teach nothing. Note what you changed.",
      consolidate:"Run the head-to-head to a result and log the move where the opponent felt most real.",
      share:"Show the first calibration that was wrong, and the move that finally read like a person."
    }
  },

  {
    k:"liveworld",
    label:"The Live World",
    excl:"quests",
    fail:"Flat",
    tags:["quests"],
    cast:"the world itself",
    lift:"Reconstructs a setting in navigable, specific detail faster than any team could build it.",
    limit:"It does not remember. Continuity breaks unless a person holds the state.",
    aiskill:"Keeping a generated world consistent by holding the state AI will not.",
    strong:["situation","process"],
    ok:["tooluse"],
    needsArtifact:false,
    does:"Holds the world state and responds in character to what participants do. Consequences follow choices.",
    wow:"A neighbour team's decisions produce outcomes the builders never wrote. The thing they made behaves.",
    failline:"Continuity breaks — the world contradicts what it said five minutes ago.",
    human:"Hold subject authority and the world's rules.",
    note:"Needs a world that can hold state and respond.",
    watch:"The quests Fact-holder's correction log becomes a continuity log.",
    unlock:"",
    beats:{
      first:"The setting comes up in navigable, specific detail faster than any team could build it, and it responds in character to what a visitor does. A neighbour team's choices produce outcomes the builders never wrote.",
      push:"It does not remember. Five minutes on it contradicts itself, and continuity only holds if a person keeps the state. {m} is what the world has to stay consistent with."
    },
    tasks:{
      first:"Build the world's starting state and rules, then have AI respond in character to one test action.",
      push:"Hand it to a neighbour team and watch for the contradiction. Log every continuity break against {m} and decide the ruling.",
      consolidate:"Write the world's canon — the facts that cannot change — and hand it to the next visitor with the continuity log.",
      share:"Walk the room through one choice and its consequence, and the continuity break you had to rule on."
    }
  }
];

/* which castings are legal for a (skill, output) pair — the §5.1 gate and §5.2 filter.
   NOTE: this is the AXIS-GRID heuristic. It decides exclusive castings from axis-only
   tag scores because the grid has no real tag. At RUNTIME use tags.indexOf(k) instead —
   see design doc §11.4. Do not copy this into the engine. */
function jobsFor(skill, output, axisScores) {
  const isNone = (output === 'none');
  return JOBS.map(j => {
    let tier = j.strong.indexOf(skill) > -1 ? 'strong'
             : j.ok.indexOf(skill) > -1     ? 'ok' : 'gate';
    let blocked = null;
    if (tier === 'gate') {
      blocked = (j.fail.indexOf('Wrong') === 0 && GROUND[skill] === 'no')
        ? 'no right answer here to plant an error against'
        : 'not a fit for the ' + skill + ' skill';
    }
    if (!blocked && j.needsArtifact && isNone) blocked = 'no artifact to work on';
    if (!blocked && j.excl && axisScores) {
      const lead = Math.max.apply(null, TAGORDER.map(t => axisScores[t]));
      if (axisScores[j.excl] <= 0) blocked = 'the ' + TAGS[j.excl].name + ' tag is not live here';
      else if (axisScores[j.excl] < lead - 1.5) blocked = 'the ' + TAGS[j.excl].name + ' tag is too far behind';
    }
    return { k:j.k, label:j.label, tier, excl:j.excl, fail:j.fail, blocked };
  });
}

module.exports = { TAGS, TAGORDER, GROUND, FAILKIND, FAILKINDS, ARC, ARCPHASE, JOBS, jobsFor };
