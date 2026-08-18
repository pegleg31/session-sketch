# Session Sketch — Wave 5: what AI is cast as

**Handoff-ready as of 17 Aug 2026.** §11 is the implementation contract; read §11.1 for scope, then build in the §9 order. The only authoring left is the 66 run strings named in §11.5.

**Nothing built into the tool yet.** Same process as Wave 2: paper first, review, then build. Twelve castings as of 17 Aug; the data and both comparison artifacts exist (§12) but no engine code has changed.

Written 17 August 2026, after reviewing `Session-Sketch-Portal.html`, `portal.js`, and the engine blocks in `Session-Sketch.html`. Slots in **before** Wave 4 (the Next.js port), because it changes the content model and there is no sense porting the old one.

---

## 1. The finding

The tool tells faculty this, in the Activity tab, in its own words (live text, post-W1-1, with the count now derived from `c.pats.length`):

> Five activities carry the Research tag, one per anchor. They teach the same skill, run on the same phases and timings, and **hit the same wow and failure moments** — only what students verify or make changes.

That line is accurate, and it is the whole problem.

| What varies today | What doesn't |
|---|---|
| The tag (4) | The wow moment — **4 total, one per tag.** Every Create Lab ever generated gets the same wow paragraph; so does every Research Lab, and so on. Written as `wow:function(a){...}` — it is handed every answer and reads none of them |
| The pattern (17) | The failure by design — 4, same structure |
| The topic and material, in 2 sentences | The 51 "How it runs" strings — **zero** contain a topic or material placeholder |
| | What AI is doing in the room — **one job, in all 17 patterns**: produce something plausible that is subtly wrong |
| | The transferable AI skill — implied by the tag, **never named**, so students cannot say afterwards what they learned to do |

**To be unambiguous about what that means.** A Marketing professor doing brand identity for a small business and a Computing professor doing a database schema both land on Create. They answered twenty questions differently — different subject, topic, tool, material, planted error, class size, everything. They receive **byte-identical wow and failure text**:

> *About ten minutes in, a rough but recognizable version of the artifact exists on screen. Students expected this to take a week…*

> *The first output will be competent and completely forgettable — textbook phrasing, no point of view. Do not rescue it…*

The pitch sentence above it differs, because that one takes `{t}` and `{m}`. The moment the session is actually built around does not. That is the same for all four tags, and it is why the output feels generic no matter how precisely the intake is answered.

The framework puts engagement in two required slots — the **wow moment** (item 2: "one specific early moment where AI capability is undeniable; must be guaranteed by structure, not left to chance") and the **failure by design** (item 9). Session Sketch has four of each, hardcoded, ignoring twenty answers.

So the ceiling is not combinatorial. Twenty questions, seventeen patterns, and four possible moments of delight. Adding patterns or subject examples does not move it. **Adding a dimension does.**

## 2. The dimension

**What is AI cast as?**

A note on naming before anything else: `T[tag].roles` already means *student* team roles — Director, Prompter, Curator, Presenter. Do not overload it. Data key: **`AIJOB`**. Faculty-facing wording: **casting** — *"AI is cast as the client who wrote the brief."* Every job carries a short `cast` phrase for exactly this purpose:

| Job | AI is cast as |
|---|---|
| The Oracle | the expert who already has the answer |
| The Ensemble | everyone else in the room |
| The Volume Engine | the drafting room that never tires |
| The Adversary | the one who will not be satisfied |
| The Apprentice | the beginner they have to train |
| The Mirror | the examiner holding the rubric |
| The Provocateur | the colleague from a different field |
| The Commissioner *(Create)* | the client who wrote the brief |
| The Witness *(Research)* | the witness under questioning |
| The Escalator *(Compete)* | the referee running the clock |
| The Ghost Rival *(Compete)* | the team that is not there |
| The Live World *(Simulate)* | the world itself |

Read that column top to bottom and the current output is one line long: today, every Lab casts AI as the expert who already has the answer.

And here is the half the first draft of this document missed — what students actually learn they can *do*:

| AI is cast as | The skill they can name afterwards |
|---|---|
| the expert who already has the answer | Verifying an AI answer against something real before acting on it |
| everyone else in the room | Prompting for genuine disagreement instead of accepting consensus |
| the drafting room that never tires | Generating options at volume, then judging them against criteria you stated first |
| the one who will not be satisfied | Directing AI to argue against you credibly, and using it as practice |
| the beginner they have to train | Specifying a procedure precisely enough that something else can execute it |
| the examiner holding the rubric | Using AI as a critic, and knowing which parts of a critique to reject |
| the colleague from a different field | Using AI to widen the option set, then judging viability yourself |
| the client who wrote the brief | Extracting requirements by questioning rather than guessing at them |
| the witness under questioning | Asking the question that reveals what AI does not know |
| the referee running the clock | Auditing the scorekeeper — asking whose definition of winning is in use |
| the team that is not there | Calibrating a simulation until it is believable enough to learn from |
| the world itself | Keeping a generated world consistent by holding the state AI will not |

Twelve named, transferable moves. The tool currently promises one, implicitly, and never writes it down.

The two dimensions divide cleanly:

- **Pattern** = what students verify or make. The anchor. *(already built, keep it)*
- **Job** = what AI does, and therefore what the room feels. *(new)*

### Two halves, ranked equally

**Correction to the first draft of this document, 17 Aug.** Every casting below was originally derived from the failure slot, which made the whole set read as a catalogue of ways AI breaks. That is the wrong centre of gravity. A Lab exists so students *use the tool for real* and walk out able to name **both** what it genuinely does for them and where it stops. The failure is how the limit gets discovered — it is a mechanism, not the purpose.

So every casting carries six fields, in two matched halves:

| The capability half | The limit half |
|---|---|
| **`lift`** — where AI genuinely helps in this casting | **`limit`** — where it runs out |
| **`wow`** — the moment the lift becomes undeniable, early and guaranteed by structure | **`failline`** — the moment the limit bites, discovered by students rather than announced |

And one field that belongs to neither, because it is the point of the whole series:

- **`aiskill`** — the transferable move students can name afterwards. The framework promises a skill that lasts; this is where it gets written down.
- **`human`** — what only a person can supply.

The framework's required slots are still all present — wow (item 2), failure by design (item 9), human contribution — so nothing is weakened. What changes is which half leads: **capability first, limit second.** That is also the order a student experiences them.

A job also supplies the sentences that are currently generic: `runs[1]`, `runs[2]`, and per-phase task overrides. So this fixes the flat "How it runs" section as a side effect, and it does it better than adding placeholders would.

---

## 3. The seven universal jobs

These work under any of the four tags. Each is written so a tired professor can tell them apart in one read.

### 3.1 The Oracle — *AI knows the answer*
*This is the only job the tool produces today. Naming it is half the value: it turns the default into a visible choice.*

- **AI does:** answers completely, fluently, immediately, with total authority.
- **Where it helps:** Compresses an evening of work into seconds, and usually gets the shape of the answer right.
- **Where it runs out:** Fluency is not evidence. It cannot tell you when it is wrong, and it never sounds less certain.
- **Wow:** an evening of work arrives in nine seconds, and it looks right.
- **Failure by design:** it is wrong in exactly one pre-specified way. Found by checking against the anchor, never by being told.
- **Only the human can:** decide whether the anchor actually supports the claim.
- **The skill they name:** Verifying an AI answer against something real before acting on it.
- **Best when:** `worry = wrong`; material is data or a build.
- **Weakness:** students who have been burned once stop being surprised. Diminishing returns across a sequence of Labs — which is exactly why the other five exist.

### 3.2 The Ensemble — *AI is everyone in the room but them*
- **AI does:** plays many people at once, each with a real and conflicting interest. Four stakeholders, a hostile committee, thirty simulated customers, a family.
- **Where it helps:** Puts perspectives in the room that students have no other way to reach — a hostile committee, thirty customers, a family.
- **Where it runs out:** Left alone it converges. Every voice ends up agreeing, politely.
- **Wow:** four distinct voices with incompatible demands, in under two minutes. There is no non-AI way to get four demanding stakeholders into a 50-minute class.
- **Failure by design:** the voices secretly agree. They are one voice wearing different names and demographics — polite, aligned, interchangeable. Teams have to notice the flattening and re-prompt for genuine conflict. *This is a real and teachable AI literacy point: models regress to consensus unless forced apart.*
- **Only the human can:** name the voice that is missing, and the one that is fake.
- **The skill they name:** Prompting for genuine disagreement instead of accepting consensus.
- **Best when:** material is a case file or a process; `exper = yes` or `some`; output is a decision or an experience.
- **Engagement mechanism:** it puts argument in the room without anyone arguing with the professor.

### 3.3 The Volume Engine — *AI makes fifteen, they judge*
- **AI does:** produces many complete, credible versions fast. The work shifts from producing to judging.
- **Where it helps:** Removes the cost of trying an option, so students can try fifteen instead of defending their first.
- **Where it runs out:** Volume without criteria is noise, and it drifts toward one average idea in many costumes.
- **Wow:** fifteen finished, defensible versions in ten minutes — then the question flips to *which of these is best, and why*, which most students have never once been asked. The wow is the flip, not the volume.
- **Failure by design:** the fifteen turn out to be one version in fifteen costumes. Discovering the sameness is the lesson about generative averaging, and it lands harder than being told.
- **Only the human can:** supply the criteria. Ranking is impossible without them, and the criteria *are* the course content — this job is a criteria assessment wearing a fun hat.
- **The skill they name:** Generating options at volume, then judging them against criteria you stated first.
- **Best when:** `worry = generic`; output is a designed piece, a plan, or a build.
- **Not possible before AI:** no class period has ever compared fifteen professional-grade artifacts side by side. Flag it as an unlock (§6).

### 3.4 The Adversary — *AI is against them*
- **AI does:** rejects, objects, cross-examines, negotiates, refuses to sign off.
- **Where it helps:** Rehearses the hard conversation as many times as they need, with no social cost for getting it wrong.
- **Where it runs out:** It wants to agree with them. Difficulty has to be specified or it evaporates.
- **Wow:** it pushes back and it is *right*. The first objection is one the team had not thought of, and the room goes quiet.
- **Failure by design:** it caves too early — a politeness collapse into "great point, you're absolutely right" — or it objects with nonsense. Teams have to direct it into being *credibly* hard, which means specifying an opponent precisely. A genuine skill and nobody teaches it.
- **Only the human can:** decide which objections are legitimate and which to refuse. Not everything the reviewer says is right, and conceding everything is its own failure.
- **The skill they name:** Directing AI to argue against you credibly, and using it as practice.
- **Best when:** `worry = thinking`; output is a decision, a plan, or a defended finding.

### 3.5 The Apprentice — *they teach, AI attempts, its mistakes are the mirror*
*The inversion. AI is the novice and the student is the expert.*

- **AI does:** attempts the task using only what the student told it, and nothing else.
- **Where it helps:** Follows instructions exactly, which is the fastest way to find out what your instructions actually said.
- **Where it runs out:** It fills gaps silently from training, so it hides omissions unless it is constrained.
- **Wow:** it does exactly what they said and it is still wrong. That is not AI failing; that is their own instructions coming back with the gaps visible. Uncomfortable and unforgettable.
- **Failure by design:** AI over-performs by quietly filling gaps from its own training, which hides the student's omissions. Teams must constrain it — *use nothing I did not tell you* — and the first attempt at that constraint always leaks.
- **Only the human can:** write the procedure. There is no way to fake understanding here, which makes this the strongest assessment in the set.
- **The skill they name:** Specifying a procedure precisely enough that something else can execute it.
- **Best when:** `worry = thinking`; the skill is *perform a technique* or *apply a standard*; `exper = yes` or `some`; works with `output = none`.
- **Note:** this is the one job where the AI literacy skill is *specification*, not verification. Worth having in the series for that reason alone.

### 3.6 The Mirror — *AI grades them, they argue back*
- **AI does:** evaluates their work against the real professional standard or rubric, immediately and specifically.
- **Where it helps:** Specific feedback against a standard, immediately, before anyone else sees the work.
- **Where it runs out:** It flatters, and it cannot tell what is important from what is merely present.
- **Wow:** it grades them before the professor does, with reasons, and one of the reasons stings.
- **Failure by design:** it flatters. Vague generous feedback — "strong work, consider adding more detail" — or it applies the rubric so mechanically it misses the point of the piece. Teams have to catch the flattery, which means they have to know what good actually looks like.
- **Only the human can:** appeal. Defend the work against a critique that is *partly* right, and separate the part that is from the part that isn't.
- **The skill they name:** Using AI as a critic, and knowing which parts of a critique to reject.
- **Best when:** output is a document in a required form, a designed piece, or a plan; late in a course when standards are known.

### 3.7 The Provocateur — *AI is the colleague from a different field*
*Added 17 Aug, after the rebalance. This is the only casting whose purpose is to make the student's thinking **bigger** rather than more correct — which is why the failure-first framing had no room for it.*

- **AI does:** answers a committed first approach with the approaches the student did not consider — other disciplines, other eras, other professions, other value systems.
- **Where it helps:** surfaces the approaches a student's own training never showed them.
- **Where it runs out:** it produces variety, not viability. It cannot tell a real alternative from a costume change.
- **Wow:** their approach turns out to be one of nine, and three of the others are better in ways they cannot dismiss.
- **Failure by design:** the alternatives come back as costume changes — the same idea relabelled — or so absurd they are easy to wave off. Pushing for alternatives that are genuinely *viable* requires knowing the field well enough to judge viability, which is the point.
- **Only the human can:** name the assumption that made their own first answer feel like the only one. AI has no access to what they were thinking.
- **The skill they name:** using AI to widen the option set, then judging viability yourself.
- **Structural requirement — do not skip it:** students commit to their approach **in writing, before AI is opened**. Without that commitment it is ordinary brainstorming and the wow does not exist, because there is nothing for the alternatives to be alternatives *to*. This is the tightest structural guarantee of any casting in the set.
- **Best when:** the skill is *make*, *judgment* or *interpret*; works with `output = none`.
- **Not possible before AI:** nine viable alternatives from four disciplines, in the time it used to take to think of two.

---

## 4. The tag-exclusive jobs

One primary per tag, each depending on that tag's artifact so it cannot be borrowed. This is what gives each tag a signature move.

### Create / AI Studio — **The Commissioner**
*Exclusive because it requires a thing being commissioned. Research has no client; Simulate has no deliverable to accept.*

- **AI does:** plays the client who wrote the brief — and the brief is deliberately underspecified. Teams interview it to find out what it actually wants, deliver, and get accepted or rejected.
- **Where it helps:** An interrogable client — students can ask the questions a real client has no patience for.
- **Where it runs out:** It has no taste until they give it some, and it will accept mediocre work.
- **Wow:** it answers questions about its own brief with specifics no rubric would ever give them, and it changes its mind once, the way real clients do.
- **Failure by design:** the brief it writes is bland and it accepts the first delivery too easily. Teams have to push it into having taste and constraints — a client with no preferences is a fake client.
- **Only the human can:** decide when the client is wrong, and say so professionally.
- **The skill they name:** Extracting requirements by questioning rather than guessing at them.
- *Secondary candidate:* **The Constraint Machine** — enforces one hard production limit (word count, budget, sixth-grade reading level, brand voice) and rejects anything violating it. Overlaps The Adversary; note as a variant rather than a seventh job.

### Research / AI Lab — **The Witness**
*Exclusive because the artifact is the evidence trail — here the transcript literally is the deliverable.*

- **AI does:** gets questioned rather than prompted. It answers what it was asked and no more. Asked well, it will name its own limits. Asked lazily, it bluffs.
- **Where it helps:** Asked well, it will show its reasoning and where a claim actually came from.
- **Where it runs out:** Asked lazily it bluffs — confidently, in detail, with citations attached.
- **Wow:** the same question asked two ways comes back with two different confidence levels. Watching a bluff appear and vanish depending on how it was asked is the most startling two minutes available about how these systems actually work.
- **Failure by design:** the lazy question gets a confident bluff, and teams record it as fact — until transcripts get compared with a team that asked better. The failure is discovered by comparison, not by announcement.
- **Only the human can:** design the question that exposes the limit.
- **The skill they name:** Asking the question that reveals what AI does not know.
- *Secondary candidate:* **The Contrarian Panel** — three AI positions on a contested claim; students find where they actually disagree versus only appear to. Overlaps The Ensemble; variant.

### Compete / AI Arena — **The Escalator**
*Exclusive because it needs a clock or a rival.*

- **AI does:** runs the round. Sets the pace, injects new demands, scores, and raises difficulty in response to how teams are actually doing.
- **Where it helps:** Generates live, adaptive pressure that no written scenario can produce.
- **Where it runs out:** Its sense of fair is arbitrary. It scores what it was told to score, not what matters.
- **Wow:** it noticed they were doing well and made it harder. Nothing scripted can do that, and the room feels the difference immediately.
- **Failure by design:** escalation reads as arbitrary and the scoring rewards the wrong thing. Teams audit the scorekeeper and rewrite the scoring mid-race. *(The tool's existing `arena.fail` text already says exactly this — this job formalizes what's there.)*
- **Only the human can:** make the sacrifice call, and appeal the score.
- **The skill they name:** Auditing the scorekeeper — asking whose definition of winning is in use.

### Compete / AI Arena — **The Ghost Rival** *(second exclusive, kept deliberately)*
- **AI does:** plays the absent opposing team, at a skill level the facilitator sets.
- **Where it helps:** A competitor on demand, at any skill level, with no second team needed.
- **Where it runs out:** It plays flawlessly or foolishly, never like a person, until it is calibrated.
- **Wow:** a class of nine competes head-to-head. That was simply not available before.
- **Failure by design:** the ghost plays either flawlessly or stupidly. Calibrating a believable opponent is the students' job, and the first calibration is always wrong.
- **Only the human can:** judge whether the ghost is playing like a real competitor.
- **The skill they name:** Calibrating a simulation until it is believable enough to learn from.
- **Why keep two here:** the tool already asks class size, and `size = <12` is precisely the case where Compete currently collapses. This job is what makes the tag reachable for a small seminar. Direct answer to a live constraint in the intake.

### Simulate / AI Quests — **The Live World**
*Exclusive because the artifact is a navigable experience.*

- **AI does:** holds the world state and responds in character to what participants do. Consequences follow choices. Teams build it, then hand it to a neighbor team to move through.
- **Where it helps:** Reconstructs a setting in navigable, specific detail faster than any team could build it.
- **Where it runs out:** It does not remember. Continuity breaks unless a person holds the state.
- **Wow:** the neighbor team's decisions produce outcomes the builders never wrote. The thing they made in twenty minutes *behaves*.
- **Failure by design:** continuity breaks — the world contradicts what it said five minutes ago. The quests template already has a Fact-holder who owns a correction log; it becomes a continuity log.
- **Only the human can:** hold subject authority and the world's rules.
- **The skill they name:** Keeping a generated world consistent by holding the state AI will not.
- *Secondary candidate:* **The Person Who Was There** — first-person testimony from inside a role, time, or situation, which students interrogate and whose expertise catches what is off. Singular and deep where The Ensemble is plural and broad.

**Totals.** 7 universal + 5 exclusive = **12 castings**. But the number that matters is different: **12 wow moments instead of 4, 12 limits named instead of 0, and 12 transferable skills written down instead of 0.**

---

## 5. How the job gets chosen

**It must not score.** The job is picked *after* the tag, from that tag's legal set. `score()` is untouched, `conflictAxis()` is untouched, the ten regression cases produce identical numbers. Same discipline as `matstate` in Wave 3 iteration 2: it drives the activity, never the tag.

No new question needed. Four signals already in the intake, in strict order of authority — **content votes, preference only refines**, exactly as `score()` already works.

### 5.1 The skill axis gates — as a coherence check, not as the organizing principle

Read §2 first: capability leads. This section is narrower than it looks. It does not say *failure is what matters*; it says a Lab must not promise a failure that cannot happen.

A casting's failure by design has to be *catchable*. Whether it can be caught depends on whether there is anything to catch it against — and that is precisely what Q-A, the skill axis, tells us. The gate exists to stop the tool asking a professor to plant an error on a topic with no right answer, which is what it does today on a third of the grid.

Three failure kinds exist, and they are not interchangeable:

- **Wrong** — there is a ground truth and AI missed it. Catchable by verification.
- **Flat** — there is no ground truth. AI produced the average of everything ever written and it is competent, unobjectionable, and dead. Catchable only by taste and practice knowledge.
- **Narrow** *(added 17 Aug with The Provocateur)* — the answer is neither incorrect nor generic. It is **singular**: one approach where the field has nine. Catchable only by comparison, and available on any skill, because a topic can have a right answer and still have several routes to it. This is the kind that lets a casting widen thinking instead of correcting it.

The tool currently jams both into one slot. Its own text proves it: `lab.fail` says *"AI is wrong in exactly one specified way"* while `studio.fail` says *"competent and completely forgettable — textbook phrasing, no point of view."* The second is not an error. Nothing is wrong with it. Those are two different pedagogical events sharing one field.

The skill axis says which kind is even available:

| Skill (Q-A) | Is there a right answer? | Failure kind | Jobs that work | Jobs that break |
|---|---|---|---|---|
| `perform` — technique/calculation, right and wrong way | Yes, verifiable | Wrong | Oracle, Apprentice, Volume, Mirror | Adversary — nothing to argue about |
| `standard` — regulation, form | Yes, by authority | Wrong | Oracle, Mirror, Apprentice, Adversary | Live World |
| `tooluse` — operate a tool or system | Yes, it works or it doesn't | Wrong | Oracle, Apprentice, Live World, Volume | Ensemble, Commissioner |
| `interpret` — argue, contextualize | Contested by nature | Wrong *about provenance* | **Witness**, Adversary, Ensemble | Apprentice, Volume |
| `make` — design, build, compose something new | No — quality, not correctness | **Flat** | **Commissioner**, Volume, Mirror, Adversary | **Oracle breaks** |
| `situation` — people in it | No single right answer | **Flat** | **Ensemble**, Adversary, Live World | **Oracle breaks** |
| `judgment` — no clean answer | Explicitly no | **Flat** | **Adversary**, Mirror, Ensemble | **Oracle breaks worst** |
| `process` — workflow across people and steps | Partly — order matters | Either | Live World, Escalator, Ensemble, Apprentice | Commissioner |

**The finding.** The Oracle is the only job the tool ships, and it is structurally incoherent for three of the eight skills. A planted error requires a ground truth. Ask for one on a sentencing call, a layoff decision, or a brand identity and there is nothing to plant it against — so the tool produces a verification activity for a topic that cannot be verified. That is a specific, nameable reason Create and Simulate Labs read thin, and it is not a writing problem.

This gate is the same shape as `conflictAxis()` and belongs next to it.

### 5.2 The output axis filters, it does not lead

Q-B is a 2-point tag vote (`build` → studio 2 / lab 1.5, `experience` → quests 2, and so on), so leading with it would mostly re-derive the tag's default — the same collinearity trap as `goeswrong` below. Its honest job is a feasibility check on what the AI job needs to exist:

| Output (Q-B) | Effect on job choice |
|---|---|
| `none` — the point is the doing | Rules out every job needing something handed over: **Commissioner** has nothing to accept, **Mirror** has nothing to grade. Leaves Adversary, Apprentice, Ensemble, Live World, Escalator |
| `experience` | Live World or The Person Who Was There, effectively forced |
| `decision` | Adversary, Escalator, Ensemble |
| `build` | Oracle, Apprentice, Volume |
| `finding` | Witness, Oracle |
| `designed` | Commissioner, Volume, Mirror |
| `formdoc` | Mirror, Apprentice — the standard is external and checkable |
| `planspec` | Commissioner, Adversary, Mirror |
| `population` | Ensemble, Volume |

So: **skill says which failures exist, output says which jobs can deliver an artifact at all.** Between them, most cases are down to two or three candidates before any preference question is consulted.

### 5.3 Then `worry` breaks the tie

Only now, and only among survivors. This is the right place for it — it is a preference question worth 0.5–1, and the engine's whole philosophy is that preference refines rather than decides.

> **What worries you most about students using AI on this topic?**
> — sounds right but is wrong · generic and flattens their voice · skips or invents sources · they let it do the thinking
>
> *Hint text, already written: "Whatever you pick becomes a teaching moment rather than a rule."*

That hint is a promise the tool does not currently keep — `worry` adds half a point and appears as a line in the build prompt. But the job **is** the teaching moment, and the four options separate the survivors cleanly:

| `worry` | Prefers | Why |
|---|---|---|
| `wrong` | **Oracle** | The feared failure becomes the engineered one |
| `generic` | **Volume Engine**, **Commissioner** | Fifteen versions makes the flattening visible; a client with taste rejects it |
| `sources` | **Witness** | The bluff appearing and vanishing depending on how you ask |
| `thinking` | **Apprentice**, **Adversary** | Both make AI structurally unable to do the thinking for them |

Note what the ordering prevents: `worry = wrong` on a `judgment` skill no longer produces an Oracle Lab, because 5.1 already ruled the Oracle out. Under a worry-first rule it would have, and it would have been incoherent. Content first is not a stylistic preference here; it is what keeps the output valid.

### 5.4 Refining signals

| Existing answer | Pulls toward |
|---|---|
| `exper = yes` / `some` (students bring practice knowledge) | Apprentice, Ensemble |
| `exper = no` (new territory) | Oracle, Mirror, Commissioner |
| `output = none` (the point is the doing) | Adversary, Apprentice, Live World |
| `size = <12` **and** tag is Compete | Ghost Rival |
| `material = claims` | Witness |
| `material = casefile` / `process` | Ensemble, Live World |
| `material = made` | Commissioner, Mirror |
| `matstate = messy on purpose` | Oracle, Volume Engine |
| skill = *perform a technique* / *apply a standard* | Apprentice |
| `catchway` | already names a Research pattern; leave that precedence intact |

### 5.5 Why not `goeswrong`

It looks like the obvious signal and it is a trap. Its four option values *are* the four tag keys (`lab`, `studio`, `arena`, `quests`) and it adds +2 to whichever it names. So within a winning tag, `goeswrong` will almost always point at the job that matches the tag it just voted for — it is collinear with the outcome and would mostly re-derive the default.

Where it earns its keep is the **mismatch**: `goeswrong = studio` (correct but generic) while the tag came out Research means the professor's real complaint is genericness inside a verification Lab. That argues for Volume Engine or Mirror *under the Research tag* — a combination the current tool cannot express at all. Use `goeswrong` only when it disagrees with the winning tag, and treat the disagreement as information rather than noise. The intake's own facilitator note already says as much: *"If they answer these two inconsistently, do not smooth it over."*

If a question is added anyway, it goes late, it is optional, and it is phrased for the tired professor: *"In this Lab, would you rather AI be the thing students catch out, the one pushing back at them, or the crowd they have to satisfy?"* Recommend deriving from `worry` first and adding the question only if faculty testing shows the derived pick is wrong more than occasionally.

### 5.6 Data shape

*Illustrative sketch from the first draft. **§11.2 is the authoritative contract** — where the two differ, §11.2 wins.*

```js
var AIJOB = {
  oracle: {
    label:"The Oracle",
    tags:["studio","lab","arena","quests"],   // legal tags
    needsGroundTruth:true,                    // §5.1 gate — fails on make/situation/judgment
    needsArtifact:false,                      // §5.2 filter — survives output:"none"
    does:"…", wow:"…", fail:"…", human:"…",   // the three framework slots
    beats:["…","…"],                          // replaces runs[1] and runs[2]
    tasks:{draft:"…", specific:"…"},          // keyed by the phase's existing w:
    pulls:{worry:["wrong"], material:["data","made"]},
    unlock:""                                 // §6, empty when there isn't one
  }, …
};
```

`concept()` gains `J = AIJOB[jobKey]`, and `P.runs` / `P.tasks` prefer the job's strings where present, falling back to the pattern's. `T[k].wow` and `T[k].fail` become `J.wow` and `J.fail` when a job is set. Additive throughout — no existing string is deleted, so a job that supplies nothing degrades to exactly today's output.

---

## 6. The two surfaces this unlocks

Both are cheap, deterministic, and answer the "help faculty generate ideas or build something they didn't know was possible" ask directly.

**6.1 "Show me three other ways this could run."** A button on the Activity tab that re-renders the same topic, tag and pattern under three different jobs, side by side. Faculty who cannot design a session in the abstract will almost always recognize the right one when they see it — the tool's own facilitator note already says this about patterns. It is the highest-engagement object on the results page and it needs no model.

This also finally delivers Wave 3's deferred `two` state properly: two candidate framings shown side by side rather than one card with a footnote.

**6.2 "Not possible before AI."** One card naming the thing this Lab can now do that it could not have three years ago, when there is one:

- *Your class of nine can run head-to-head — AI plays the opposing team at a level you set.* (Ghost Rival)
- *Your students will compare fifteen finished professional versions in one class period.* (Volume Engine)
- *Four stakeholders with incompatible demands, all in the room, for a 50-minute class.* (Ensemble)

This is the card faculty will screenshot and send to a colleague. It is also, quietly, the strongest argument for the whole series.

---

## 7. Check against the ten regression cases

Every case gets at least two credible alternatives. Current output in italics.

| Case | Tag | Job today | Credible alternatives |
|---|---|---|---|
| Joins / CIS-255 | Research | *Oracle* | **Volume Engine** — fifteen queries that all run, rank them on cost and readability and defend it. **Apprentice** — teach it the join, watch what your instructions left out. |
| Disruptive classroom | Simulate | *Oracle* | **Ensemble** — four students, a parent, an administrator, each with an interest. **Live World** — the room reacts to what you do. |
| Minimum wage / employment | Research | *Oracle* | **Witness** — cross-examine on a contested claim. **Provocateur** — the frames an economist, a historian and a nurse would each bring. |
| Brand identity | Create | *Oracle* | **Commissioner** — the client with taste who changes their mind. **Volume Engine** — fifteen identities, ranked. **Provocateur** — commit to your identity, then meet the nine you did not consider. |
| Database schema | Create | *Oracle* | **Apprentice** — teach it the rules, see which it violates. **Adversary** — the DBA who rejects every schema. |
| Significance test | Research | *Oracle* | **Apprentice** — teach it to choose the test; cannot be faked. **Witness**. |
| Live intrusion | Compete | *Oracle* | **Escalator** — the attacker adapts. **Live World**. |
| Seed fund pitch | Compete | *Oracle* | **Adversary** — the investor panel that won't be charmed. **Provocateur** — the nine business models you did not pitch. |
| Plea negotiation | Compete | *Oracle* | **Adversary** — AI is opposing counsel. **Ghost Rival** if the class is small. |
| Lesson plan | Create | *Oracle* | **Mirror** — graded against the real rubric. **Commissioner** — the client is a teacher with a difficult class. |

Two things this table shows. Every case currently ships the same job, which is the finding in §1 restated as evidence. And no case is short of alternatives, which means the dimension is real rather than decorative.

**Framework acceptance test — every job must pass all four before it ships:**

1. Wow is specific, early, and guaranteed by structure rather than luck
2. Failure is discovered by students, not announced by the facilitator
3. The human contribution cannot be produced by the AI in that job
4. It survives a professor reading the one-line description cold, with no framework knowledge

The Mirror is the weakest on (1) — grading is not early. If it stays, its wow has to be moved forward: AI grades a *deliberately mediocre* example in the first ten minutes, before they build anything.

---

## 8. Decisions — settled 17 Aug 2026

All nine decided in review. Each is recorded with the reasoning that produced it, because the reasoning is what a future reader needs.

| # | Decision |
|---|---|
| 8.1 | Castings sit **beside** the 17 patterns, not replacing them — for now |
| 8.2 | Show the **derived pick plus three alternatives**, not all twelve |
| 8.3 | The Provocateur's commit-first step is **non-negotiable** |
| 8.4 | The failure slot **splits** into wrong / flat / narrow |
| 8.5 | **Keep** the tag-exclusive castings |
| 8.6 | **Override log** now (no button, no server); cross-course tracking waits for Wave 4 |
| 8.7 | **Yes** — specify the wow as tightly as the failure |
| 8.8 | **Gate it** — the skill gate becomes a `notready` trigger |
| 8.9 | **Approved** — the build prompt carries the casting's four lines |

---

### 8.1 ✅ Beside the patterns, not replacing them

Several patterns already *are* castings under another name. "The adversarial pair" is the Adversary. "Execute and Verify" is the Oracle.

**Example.** A professor lands on Research with a dataset.

- *Beside:* the tool offers 5 Research patterns, then separately picks a casting. The professor sees "Execute and Verify, cast as the Oracle" — which says the same thing twice.
- *Replace:* the tool offers one anchor (*the executed result*) and asks what AI is cast as. Same session, half the vocabulary, and 17 hand-written patterns collapse into a handful of anchors.

**Decided: beside.** Castings ship alongside the 17 patterns. The collapse into `anchor × casting` stays on the table but is not this wave's work — faculty behaviour decides it. Watch for the redundancy showing through in copy ("Execute and Verify, cast as the Oracle") and write around it rather than restructuring.

---

### 8.2 ✅ The derived pick plus three alternatives

**Example.** Joins / CIS-255 lands on Research.

- *All twelve:* a grid of twelve options, eight of which are ruled out for this topic. Honest, and probably overwhelming at the end of a twenty-question conversation.
- *Pick plus three:* "Your Lab casts AI as the expert who already has the answer. It could also run as the drafting room that never tires, the beginner they have to train, or the witness under questioning." One click each to see it rewritten.

**Decided: pick plus three.** All twelve stay reachable from the review drawer. This also settles the long-deferred `two` state from Wave 3 — two candidates become two castings shown side by side rather than one card with a footnote.

---

### 8.3 ✅ Non-negotiable

The Provocateur only works if students write their own approach down *before* AI is opened.

**Example.** Brand identity, Marketing.

- *With the step:* teams write their identity concept on paper, then AI returns nine approaches from other fields. Three are better. That sting is the wow.
- *Without it:* AI returns nine approaches and teams pick a favourite. It is brainstorming. There is no wow because there is nothing the alternatives are alternatives *to*.

**Decided: non-negotiable.** The build prompt states it as a hard requirement, at the same strength as the planted error for Research. If a Provocateur Lab is written without the written-first commitment, it is not a Provocateur Lab — it is brainstorming, and the wow does not exist.

---

### 8.4 ✅ Split into three

§5.1 identifies three kinds — *wrong*, *flat*, *narrow* — and the tool currently has one slot for all of them.

**Example.** Two professors, same slot today.

- A statistics professor gets *"AI is wrong in exactly one specified way."* True and useful.
- An ethics professor teaching a layoff decision gets the same instruction — and there is no right answer to be wrong about, so the request is incoherent. What she actually needs is *"AI will produce the most defensible-sounding answer and nothing else."*

**Decided: split.** Three kinds — **wrong**, **flat**, **narrow** — and every casting declares which one it engineers. The immediate payoff is that the build prompt stops asking faculty to plant an error on the 27 cells that have no right answer. Likely its own wave; sequence it after the casting data lands so there is something to attach the kinds to.

---

### 8.5 ✅ Keep the exclusives

Compete has two, the others have one.

**Example.** The Witness is Research-only today, but cross-examining a Create brief works fine — a professor could reasonably want it for a design rationale.

- *Keep exclusives:* each tag has a signature move that cannot be borrowed, which keeps the four tags meaningfully different.
- *Promote the Witness to universal:* Research loses its signature and gets its identity from the anchor instead.

**Decided: keep them.** Each tag keeps a signature move that cannot be borrowed, which is what keeps the four tags meaningfully different rather than four labels on one session. The Witness stays Research-only despite working on a Create brief.

---

### 8.6 ✅ Override log now; cross-course tracking waits

The Oracle stops surprising a student who has met it.

**Example.** A student takes three Labs in one term. All three cast AI as the expert who already has the answer. By the third, "it sounded right and was wrong" is not a revelation, it is a routine.

- *Track:* the tool steers away from repeats and the student meets three different limits instead of one three times.
- *Do not track:* simpler, and every Lab is designed in isolation.

**This turned out to be two questions wearing one coat**, and they got different answers.

#### 8.6a Casting variety across a course *(needs accounts — Wave 4)*

Remembering which castings a cohort has already met, so the tool steers away from repeats. This requires identity and persistence; there is no button that achieves it. Design the field now, implement after Wave 4. Until then a single line on the results page — *"if your students have met a Lab before, consider a different casting"* — costs nothing and gets most of the value.

#### 8.6b Feedback capture — **decided: the override log, and nothing else yet**

There is currently **no telemetry at all** — the handoff names this as a Wave 4 gap. But the most valuable feedback signal does not need a button, a server, or an account, because §8.2 already built it:

**The override click is the feedback.** When a faculty member is shown the derived casting plus three alternatives and clicks one of the alternatives, that is a labelled training pair: *derivation said Oracle, the professor wanted the Apprentice.* Far more informative than a thumbs-up, and it follows the rule already settled in the handoff — *override allowed, never silent.*

Three layers, in order of value per unit of effort:

| Layer | What it captures | Cost | Needs a server? |
|---|---|---|---|
| **Override log** | Every casting, tag and pattern override, in sequence | Trivial — `localStorage`, written into the existing ⬇ Save concept file | No |
| **One-line reason** | *Why* they overrode. A click without a reason says almost nothing | Small — an optional text field on the override | No |
| **Real telemetry** | Where faculty stall, abandon, or revise | Wave 4 | Yes |

The offline single file cannot post anywhere, so during testing the override log rides out inside the saved concept HTML and faculty send the file back. Crude, and it works today.

**Student-side feedback, which the rebalance just made free.** The session reflection (`T[tag].refl`) already exists. Two prompts, drawn straight from the casting's two halves:

- *Where did AI genuinely help you today?*
- *Where did it run out, and how did you know?*

That closes the loop on the `aiskill` promise: students name the capability and the limit in their own words, which is exactly what the Labs claim to teach. No infrastructure, two strings per casting.

**Decided: build the override log only.** Silent, no button, no server, no extra question for a faculty member to answer. It rides out inside the existing ⬇ Save concept file.

Deliberately *not* built yet, and why:

- **The one-line reason field.** It asks a tired professor to explain themselves at the exact moment they are already annoyed enough to override. The log alone will show whether overrides are frequent enough to be worth interrupting for. Revisit once there is a pattern to explain.
- **The student reflection prompts.** Good idea, wrong document — they change the session template (`T[tag].refl`), not the casting data. Log them as a separate small change so they are not buried in a Wave 5 review.
- **Real telemetry.** Wave 4.

**What the log records.** Append-only, in order: the derived casting, every override with its replacement, the tag and pattern overrides already offered today, and a timestamp per event. That is enough to answer the only question that matters right now — *how often is the derivation wrong, and what did the professor want instead?* Every override is one labelled training pair for the §5 selection rules.

---

### 8.7 ✅ Yes — equal rigour

The framework details failure by design per type but treats the wow more loosely.

**Example.** The Mirror's wow is "it grades them before the professor does" — but grading happens late in a session, and the framework requires the wow to be *early and guaranteed by structure*. The fix is structural: AI grades a deliberately mediocre example in the first ten minutes, before teams build anything.

**Decided: yes.** Every casting's wow must be specific, early, and guaranteed by structure — checkable, not aspirational. The Mirror is the first thing to fix under the new rule: move its wow forward by grading a deliberately mediocre example in the first ten minutes. This also generates a note back to the `snhu-ai-experience-framework` skill, which currently specifies failure per type in detail and treats the wow loosely.

---

### 8.8 ✅ Gate it

**Example.** A professor answers skill = *handle a situation with people in it* and output = *a working build*. That already fires the axis conflict. But a subtler case — a pair that leaves only one legal casting — currently passes silently, and the professor never learns their topic has almost no room to move.

- *Gate in `conflictAxis()`:* caught during the conversation, with a specific fix.
- *Leave it:* discovered at render time, or never.

**Decided: gate it.** `conflictAxis()` gains the check. **Zero** legal castings is a fourth `notready` trigger. **One** legal casting is not an error but is worth saying out loud — the professor should know their pair leaves almost no room to move, and what to change if they want more.

---

### 8.9 ✅ Approved

Not really a question — more a consequence to approve.

**Example.** Today the prompt carries the tag's generic three lines. Under this design it carries the casting's: *AI is cast as the beginner they have to train · where it helps: it follows instructions exactly · where it runs out: it fills gaps silently · the skill they name: specifying a procedure precisely enough that something else can execute it.*

**Decided: approved.** The build prompt carries the casting's four lines — what AI is cast as, where it helps, where it runs out, and the skill students can name — replacing the tag's generic three. Biggest prompt gain since W1-8, at the cost of one wave of data entry.

---

## 9. If approved, build order

1. `AIJOB` data for the 7 universal castings, Oracle first — it is a pure refactor of what exists and proves the fallback path
2. `concept()` wiring: `J`, with per-phase overrides falling back to the pattern
3. Selection in the §5 order — skill gate (`needsGroundTruth`), output filter (`needsArtifact`), `worry` tiebreak, then `material` / `exper` / `size` refinement. All non-scoring. Run the ten cases and confirm identical numbers
4. The 5 exclusives
5. Results-page surfaces: the three-way comparison (6.1), then the unlock card (6.2)
6. Build prompt: swap in the job's three slots
7. **The override log** (§8.6b) — append-only, `localStorage`, serialized into the ⬇ Save concept file. Build it with step 5 so the alternatives ship instrumented rather than instrumented later
8. `node Session-Sketch-regression.js` and `node Session-Sketch-Portal-smoke.js`, plus a new guard asserting a casting change never changes a tag

---

---

# 11. Implementation contract

**This section is the handoff.** Everything above is reasoning and decisions; everything below is what a coder needs and nothing else. Where the two disagree, this section wins.

Read §11.1 first — it says what is in scope. Then build in the §9 order.

## 11.1 Scope — what Wave 5 does and does not do

**In scope.** The `AIJOB` data (`wave5-jobs.js`, already written except the run copy of §11.5), casting selection, the three alternatives, the casting override with its log, the wow/failure/human/skill swap on the results page and in the build prompt, and the `notready` gate.

**Explicitly NOT in scope, despite being decided:**

| Decision | Deferred to | Do not start it |
|---|---|---|
| 8.4 — split the failure slot into wrong / flat / narrow | Its own wave, after this one | Wave 5 stores `fail` on each casting and prints it. It does **not** restructure `T[tag].fail`, and it does **not** change how the build prompt asks for a planted error. Half-doing this is worse than not doing it. |
| 8.6a — casting variety across a course | Wave 4 (needs accounts) | Ship the static line on the results page only. |
| 8.1 — collapsing the 17 patterns into anchors | Undecided, watch faculty first | Castings sit beside patterns. Do not touch `PAT`. |
| Student reflection prompts | Separate small change | Touches `T[tag].refl`, not casting data. |

**The one invariant.** No scoring changes. `score()`, `SKILL.pull`, `OUTPUT.pull`, `MAT.pull`, `COMPETE`, `conflictAxis()`'s existing rules — all untouched. The ten regression cases must produce byte-identical numbers before and after. If they do not, something in the selection code has leaked into scoring.

## 11.2 Data contract

`AIJOB` is `wave5-jobs.js` inlined as script block 1a of `Session-Sketch.html`, immediately after `SKILL`/`OUTPUT` and before `MAT`. It must not require anything.

| Field | Type | Notes |
|---|---|---|
| `k` | string | stable key, used in state and the log. Never rename. |
| `label` | string | internal name, e.g. "The Oracle" |
| `cast` | string | faculty-facing: renders after "AI is cast as " |
| `tags` | array | legal tags. Universals carry all four; exclusives carry one. |
| `excl` | string \| null | the exclusive tag, or null. Redundant with `tags` by design — `tags` is the runtime rule, `excl` is for display. |
| `fail` | `"Wrong"` \| `"Flat"` \| `"Narrow"` \| `"Either"` | printed only in Wave 5 |
| `lift` / `limit` | string | the two halves |
| `wow` / `failline` | string | the two moments |
| `aiskill` / `human` | string | the takeaway |
| `note` | string | precondition, starts with "Needs " |
| `watch` | string | facilitator caution |
| `unlock` | string | "not possible before AI" line, `""` when there is none |
| `strong` / `ok` | arrays of skill keys | the §5.1 gate |
| `needsArtifact` | boolean | true ⇒ illegal when `output === "none"` |
| `beats` / `tasks` | objects keyed by arc slot | optional; absent means fall back to the pattern. See §11.5. |

**State keys** (added to `S.a`, which is what persists):

| Key | Meaning |
|---|---|
| `S.a.aijob` | the faculty's chosen casting. **Absent means "use the derived one"** — never write the derived value into state, or a later answer change cannot move it. Same rule `tagOverride` already follows. |
| `S.a.joblog` | the override log, §11.6 |

**localStorage.** Bump both keys, because `S.a` gains fields and old saves must not half-load: `snhu-session-sketch-v1` → `-v2`, and the portal's `snhu-session-sketch-portal-v1` → `-v2`. On a missing key, start fresh rather than migrating; the tool is in testing and no faculty sketch is precious yet.

## 11.3 Selection — deterministic, in this order

`pickJob(k, a)` returns a casting key. It is a pure function of `(k, a)` and must be deterministic: same answers in, same casting out, every time. This is what makes it testable.

```
function pickJob(k, a){
  // 0. explicit override wins, if it is still legal
  if (a.aijob && legal(a.aijob, k, a)) return a.aijob;

  // 1. legality — the §5.1 gate and §5.2 filter
  var pool = AIJOB.filter(j => legal(j.k, k, a));
  if (!pool.length) return null;              // → notready, §11.7

  // 2. skill tier: strong beats workable. If any strong survive, drop the rest.
  var strong = pool.filter(j => j.strong.indexOf(a.skill) > -1);
  if (strong.length) pool = strong;

  // 3. worry breaks the tie (§5.3)
  var wanted = WORRYJOB[a.worry] || [];       // ordered array of keys
  for (var i = 0; i < wanted.length; i++)
    for (var z = 0; z < pool.length; z++)
      if (pool[z].k === wanted[i]) return pool[z].k;

  // 4. refining signals (§5.4), first match wins, in table order
  var refined = pool.filter(j => refinePulls(j, a));
  if (refined.length) pool = refined;

  // 5. FINAL TIE-BREAK: declaration order in AIJOB. Never random, never
  //    alphabetical, never coverage-ranked — order in the array is the rule,
  //    which means reordering AIJOB is a behaviour change and needs a
  //    regression run.
  return pool[0].k;
}

function legal(jk, k, a){
  var j = AIJOB_BY_KEY[jk];
  if (!j) return false;
  if (j.tags.indexOf(k) < 0) return false;                      // tag
  if (j.needsArtifact && a.output === "none") return false;      // §5.2
  if (j.strong.indexOf(a.skill) < 0 &&
      j.ok.indexOf(a.skill) < 0) return false;                   // §5.1 gate
  return true;
}
```

`WORRYJOB`, from §5.3 — ordered, because the order is the tie-break:

```
var WORRYJOB = {
  wrong:    ["oracle", "witness", "apprentice"],
  generic:  ["volume", "commissioner", "provocateur", "mirror"],
  sources:  ["witness", "oracle"],
  thinking: ["apprentice", "adversary", "provocateur"]
};
```

**Note what step 2 does.** It runs *before* `worry`, so a professor who worries about genericness on a `perform` topic gets a strong-fit casting rather than the Volume Engine forced in where it is only workable. Content before preference, again.

## 11.4 The runtime gate is NOT the artifact gate — do not copy it

`jobsFor()` in `wave5-jobs.js` decides exclusive castings from **axis-only** tag scores (`sc[j.excl] <= 0`, `< lead - 1.5`). That heuristic exists because the axis grid has no real tag — it only has two answers out of twenty.

**At runtime the winning tag is already known.** The rule is `j.tags.indexOf(k) > -1` and nothing else. Copying `jobsFor()`'s exclusivity logic into `concept()` would reject legal castings on topics where the axes disagree with the full scoring — which is most Compete cases, since `compete` is worth up to 4.5 and lives outside both axes.

`jobsFor()` is for building the grid. `legal()` is for the tool. They are allowed to differ, and this note is why.

## 11.5 Run copy — keyed by arc slot, not phase name

All four tags share one five-slot arc. Verified against `T[tag].phases`:

| slot | studio | lab | arena | quests |
|---|---|---|---|---|
| `frame` | Frame the make | Set the anchor | Briefing and plan | Set the world |
| `first` | First rough pass | Let AI run | Practice round | First build pass |
| `push` | Push for specific | Verify against anchor | The live race | Depth pass |
| `consolidate` | Finish and label | Build evidence trail | Status check | Playtest a neighbour's |
| `share` | Show and reflect | Present and reflect | Share and reflect | Walk and reflect |

So casting copy is keyed by **slot**, giving one set of strings that covers all four tags — five or six strings per casting instead of twenty. `ARC` and `ARCPHASE` in `wave5-jobs.js` hold this mapping; do not re-derive it.

**The lift lands at `first`. The limit bites at `push`.** That is the rule for where a casting speaks.

Resolution order in `concept()`, per slot: **casting's string → pattern's string → phase description.** A casting that says nothing degrades to exactly today's output, which is what makes partial authoring safe.

`{t}` and `{m}` still work — casting strings go through `fill()` like everything else.

**Status: 1 of 12 written.** The Oracle is done as the voice sample. **66 strings remain** (11 castings × 6). Match the Oracle's register: second person to the facilitator, one concrete instruction per task, no adjectives doing the work of a verb.

## 11.6 The override log

`S.a.joblog`, append-only, serialized into the ⬇ Save concept file. No network, no button.

```
S.a.joblog = [
  { t: 1755432000000, e: "derived",  job: "oracle",  tag: "lab", skill: "perform", output: "build", worry: "wrong" },
  { t: 1755432140000, e: "override", job: "apprentice", from: "oracle" },
  { t: 1755432190000, e: "override", job: "oracle",     from: "apprentice" }
]
```

- `derived` is written once, when the results page first renders, and carries the four inputs the selection used. That is what makes each entry a labelled pair.
- `override` is written on every casting change, including changing back — a switch away and back is a real signal about the copy.
- Never rewrite or compact earlier entries. Sequence is the data.
- Reuse the existing tag/pattern override handlers for the same treatment rather than inventing a second mechanism.

The one question it has to answer: **how often is the derivation wrong, and what did the professor want instead?**

## 11.7 `notready`, and the one-casting notice

Two new outcomes in `conflictAxis()` / `flags()`:

- **Zero legal castings** → fourth `notready` trigger. Message names the blocking pair and the fix: *"a people-skill topic with a working build as the output leaves no way for AI to be usefully wrong or usefully thin — change one of the two."*
- **Exactly one legal casting** → not an error. A note on the results page: *"only one casting fits this pair, so there are no alternatives to compare. If you want options, the output answer is the one to revisit."*

Per the grid as built: **0 holes and 1 thin cell** (`tooluse × none`, 2 castings). So the zero-case is currently unreachable and the gate is a guard against future data edits rather than a live path. Test it by temporarily narrowing a `strong`/`ok` list, not by waiting for it.

## 11.8 One accessor, not six edits

`T[k].wow` / `.fail` / `.human` are **functions of `a`**; the casting's are **strings**. Six call sites use them today:

- `buildPrompt()` — lines 1386, 1387, 1389
- `resultHTML()` — lines 1533, 1534, 1537

Do not patch six places. Add three accessors in block 6 beside `concept()` and route every call site through them:

```
function wowOf(c){  return c.J ? c.J.wow      : c.t.wow(c.a);  }
function failOf(c){ return c.J ? c.J.failline : c.t.fail(c.a); }
function humanOf(c){return c.J ? c.J.human    : c.t.human(c.a);}
```

`c.J` is `AIJOB_BY_KEY[c.job]`, set in `concept()`, `null` when no casting resolved. The `T[k]` functions stay as the fallback — deleting them removes the safety net that makes every other step reversible.

The results page gains two rows the tag templates never had: **where it helps** (`c.J.lift`) and **the skill they can name** (`c.J.aiskill`). The build prompt gains all four.

## 11.9 Acceptance tests

Add to `Session-Sketch-regression.js`. All must pass before this ships.

| # | Test | Expected |
|---|---|---|
| A1 | Run the ten canonical cases | **Byte-identical scores** to the table in the handoff. Any drift means selection leaked into scoring. |
| A2 | Set `a.aijob` to each of the 12 keys on the Joins case, re-score | Tag stays **Research** all twelve times. A casting never moves a tag. |
| A3 | `pickJob()` called twice with identical answers | Same key. Determinism. |
| A4 | Every `(skill, output)` pair, all 72 | `pickJob` returns a key or `null`; never `undefined`, never a casting failing `legal()`. |
| A5 | `output = "none"` | Never returns `commissioner`, `volume` or `mirror`. |
| A6 | `skill` in `make` / `situation` / `judgment` | Never returns `oracle`. The headline finding, as a test. |
| A7 | Set a tag override, then read the casting | Casting is legal for the **overridden** tag, not the derived one. |
| A8 | Override a casting, then change `worry` | Override survives if still legal; falls back to derived if not. |
| A9 | A casting with no `beats`/`tasks` | Output matches today's pattern strings exactly. Fallback intact. |
| A10 | `joblog` after derive → override → override back | Three entries, in order, none rewritten. |

Then `node Session-Sketch-Portal-smoke.js` — the portal lifts the engine byte-for-byte, so a green wizard should mean a green portal. If it does not, the engine has leaked into the renderer.

## 11.10 Definition of done

- [ ] `wave5-jobs.js` inlined as block 1a; `node --check` clean; file still ends `</html>`
- [ ] 66 remaining run strings authored (§11.5)
- [ ] `pickJob()` / `legal()` per §11.3, with `WORRYJOB` ordered
- [ ] Three accessors replace all six call sites (§11.8)
- [ ] Results page: casting named, plus lift and aiskill rows; three alternatives, each one click
- [ ] Build prompt carries the casting's four lines (decision 8.9)
- [ ] `notready` and one-casting notice (§11.7)
- [ ] Override log (§11.6), serialized into Save concept
- [ ] A1–A10 green, plus the portal smoke test
- [ ] `node build-portal.js` re-run so the portal picks up the engine change
- [ ] Handoff file table updated

**Do not edit `Session-Sketch.html` with an editor's find-and-replace tool.** It has silently truncated the file's tail more than once, including during this design work — it took the tail off `build-axis-grid.js` on 17 Aug. Use a shell heredoc with an assertion on every anchor, then check the byte count and that the file still ends with `</html>`.

---

## 12. Companion artifacts

Three files, all generated, never hand-edited, and both read their job data from `wave5-jobs.js` so they cannot disagree with each other or with this document.

| File | What it is | Rebuild with |
|---|---|---|
| `wave5-jobs.js` | The twelve castings as data, plus `ARC`/`ARCPHASE` (§11.5) and `jobsFor()` (§11.4 — artifact use only) — cast phrase, wow, failure, human slot, skill fit, gate flags. Single source of truth. | — |
| `Session-Sketch-axis-grid.html` | All 72 (skill × output) cells: axis-only tag lead, failure kind, and every job drawn with its ruled-out reason. Click a part to filter. | `node build-axis-grid.js` |
| `Session-Sketch-job-card.html` | The twelve parts side by side, led by what AI is cast as, with help and limit as equal columns. Prints to three US Letter landscape pages. | `node build-job-card.js` |

Both builders lift `SKILL` and `OUTPUT` out of `Session-Sketch.html` at build time, so the pull numbers are always the engine's own.

## 13. What was verified in the code before writing this

Every claim above was checked against `Session-Sketch.html` and `portal.js` rather than inferred. The checks, so a reviewer can re-run them:

| Claim | Check | Result |
|---|---|---|
| 4 wow moments, none reading the answers | `grep -n "wow:" Session-Sketch.html` | 4 hits, all `wow:function(a){return "…"}`, none reference `a` |
| Same for the failure slot | `grep -n "fail:function"` | 4, same shape |
| 51 "How it runs" strings, zero placeholders | counted `{t}`/`{m}` inside every `runs:[…]` in the `PAT` block | **0 of 51** |
| Task strings barely personalize | same count on `tasks:[…]` | 4 hits total |
| Only pitch and artifact personalize | `fill()` substitutes `{t}` and `{m}` only | confirmed, `concept()` lines building `P` |
| 17 patterns | `name:"…"` inside `PAT` | 17 (Create 3, Research 5, Compete 6, Simulate 3) |
| `roles` already means student roles | `T[tag].roles` | Director / Prompter / Curator / Presenter etc. — hence `AIJOB`, not `ROLE` |
| `worry` scores only 0.5–1 | `score()` | confirmed; four options `wrong` / `generic` / `sources` / `thinking` |
| `goeswrong` values are tag keys | `sc[a.goeswrong] += 2` with option values `lab`/`studio`/`arena`/`quests` | confirmed — the collinearity problem in §5 is real |
| `exper` is three-way, not two | option values | `yes` / `some` / `no` |
| `size = "<12"` exists | `a.size==="<12"` in `concept()` | confirmed — Ghost Rival has a real trigger |
| `matstate` precedent for a non-scoring, activity-driving field | Wave 3 iteration 2 | confirmed — this design follows it exactly |

The portal's Activity tab reuses `resultHTML` verbatim through `build-portal.js`, so all of the above is true of both files and a change made in the engine blocks flows to the portal on the next build.
