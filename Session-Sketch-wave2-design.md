# Session Sketch — Wave 2 design: the kind split

Written 12 August 2026. **Status: BUILT into `Session-Sketch.html` on 12 Aug 2026.** All five decisions in §8 were approved by the reviewer and implemented: the revised skill axis (with the *make* skill and *prove* verb), the "None" output, the pitch-off staying confident Compete, the conflict rewrite (§4), and the pattern-fit split (§7b). The pre-build snapshot is `Session-Sketch-v4-2026-08-12.html`. The live regression (`Session-Sketch-regression.js`, all cases green) is now the source of truth; this document records the design reasoning. Originally the **design-for-review** deliverable the round-3 plan (§5) called for. Per decision 5 of that plan — *"the kind split is designed on paper first, built only after review"* — **nothing in `Session-Sketch.html` has changed.** The numbers below are not asserted on paper; they come from a runnable prototype, `Session-Sketch-wave2-prototype.js`, which reuses the live `MAT` / `CATCHWAY` / `COMPETE` pulls and replaces only the single-`kind` contribution. Run it with `node Session-Sketch-wave2-prototype.js`.

**What needs your approval before any build:** the two pull tables (§3), the conflict rewrite (§4), the resolution of the "none" open question (§6), and the pattern-matching change (§7b). Everything else follows mechanically.

---

## 1. The problem this fixes

Round 3, finding F8: *the single topic-kind question forces one axis over two.* Joins is a technique (the **how** — there's a right and wrong way) **and** it produces a working query (the **thing**). The one-choice question made the professor discard one of those, and the activity language lost it with it. Every "build" topic has the same double nature: a schema is architected *and* it runs; a lesson plan is written to a standard *and* it's a plan.

The split replaces one question with two:

- **Q-A — the skill:** what are students learning to *do*? (carries the penalties, as the single kind does today)
- **Q-B — the output:** what do they actually *produce*? (all positive pulls)

Joins becomes *(perform a technique, a working build)*. Research still leads — but Create is now visibly non-zero (**3.5**, vs 0.5 under the single axis), so the generated activity language knows both facts: *verify by executing, and the thing executed is a build.*

---

## 2. The two questions

**Q-A revised from §5 of the plan (reviewer feedback, 12 Aug):** the plan's 8-option skill list had no home for the *generative* act — *making* something. Design, engineering, English composition, art, experiment design all fell through the cracks (their nearest option was "operate a tool," which is mechanical and misses the craft). Since this tool has to serve every department, that gap is disqualifying. Fix, keeping the list at 8 rather than growing it:

- **Added** option 2, *"Design, build, compose, or prove something new"* — the making skill, the one that pulls **Create on the skill axis** (today Create leans almost entirely on the output axis). The verbs are deliberate discipline hooks: *design* (engineering, art), *build* (computing, engineering), *compose* (English, music, writing), *prove* (math, logic — added 12 Aug so proof-construction has a home alongside "perform a technique").
- **Merged** the plan's separate "perform a technique" and "run a calculation" into one. They scored **identically** (`{lab 2, studio 0.5, quests −1.5}`) and both mean "a procedure with a right answer" — two options a coin-flip apart. Merging them pays for the addition.

> **Q-A. The skill — what are students learning to do here?** *(the how)*
> 1. Perform a technique, procedure, or calculation with a right and wrong way
> 2. **Design, build, compose, or prove something new** ← new; the making skill
> 3. Apply a regulation, standard, or required form
> 4. Operate a tool, platform, or system
> 5. Handle a situation or interaction with people in it
> 6. Run a process or workflow across people and steps
> 7. Make a judgment call with no clean answer
> 8. Interpret, argue, or contextualize — texts, claims, events
>
> *Accessibility check — every discipline now has at least one clear skill home:* English → 2 or 8; biology → 1, 2, or 8; business → 2, 6, 7; math → 1 (routine proof/calculation) or 2 (construct an original proof/model); engineering → 1, 2, or 4; art/design → 2 or 4; computing → 1, 2, or 4; justice/education/psych → 5, 6, 7.

> **Q-B. The output — what would students actually produce?** *(the thing)*
> 1. A working build (it runs or it doesn't)
> 2. A verified finding with its evidence
> 3. A plan, proposal, or spec
> 4. A designed piece (a brief answered)
> 5. A document in a required form
> 6. A profile of a population or market
> 7. A decision, committed and defended
> 8. An experience someone else can move through
> — **None — the point is the doing** ← included (approved §6); scores 0, so Q-A decides alone

---

## 3. Proposed scoring (the part that needs review)

Weight 3 (the old single kind) splits into **skill 2 + output 2**. Content voice from this question therefore rises from 3 → 4, which offsets the preference total falling by 2 when the audience question was removed in W1-6 — net balance roughly preserved (§5). **Penalties live entirely on the skill axis** (as the single kind does today); the **output axis is all positive**.

### 3a. Skill axis (`SKILL`) — magnitude ~2, carries the penalties

| Skill | studio | lab | arena | quests | Note |
|---|--:|--:|--:|--:|---|
| Perform a technique/procedure/calculation | 0.5 | **2** | 0 | **−1.5** | merged; keeps the anti-Simulate penalty that fixes the Joins class |
| **Design, build, compose, or prove something new** | **2** | 0.25 | 0.5 | 0 | **new** — the only skill that pulls Create hard; small arena share (making can be competitive), no penalty |
| Apply a standard/form | 0.5 | **1.75** | 0 | −1 | |
| Operate a tool/system | **1.5** | 0.75 | 0 | −0.5 | Create-lite; distinct from *make* (using a tool ≠ designing something) |
| Handle a situation | **−1** | 0.25 | 0.75 | **2** | keeps the anti-Create penalty |
| Run a process/workflow | 0.25 | 0 | 1.25 | 1.25 | splits Compete/Simulate |
| Make a judgment call | −0.5 | 0.5 | 1.5 | 1.25 | |
| Interpret / argue | 0.25 | **1.75** | 0.25 | 0.5 | |

### 3b. Output axis (`OUTPUT`) — magnitude ~2, all positive

| Output | studio | lab | arena | quests | Note |
|---|--:|--:|--:|--:|---|
| A working build | **2** | 1.5 | 0.5 | 0 | pulls Create **and** Research — this is the Joins fix |
| A verified finding | 0 | **2** | 0 | 0.25 | |
| A plan / spec | **1.5** | 0.25 | 0.5 | 0.25 | |
| A designed piece | **2** | 0 | 0.5 | 0.25 | |
| A required-form document | 1.5 | 1.5 | 0 | 0 | Create **and** Research |
| A population/market profile | 0.5 | **1.5** | 0 | 0.75 | |
| A decision, defended | 0 | 0.25 | **1.5** | 1 | |
| An experience for others | 0.25 | 0 | 0 | **2** | |
| None — the point is the doing | 0 | 0 | 0 | 0 | **included (approved)**; Q-A decides alone (see §6) |

**Design rules used to set these** (so you can sanity-check any cell):
1. Each axis's dominant tag sits at ~2 (was ~3 for the whole kind); the two axes sum back to the old ~3–4 for a coherent pair.
2. Penalties are unchanged in kind and roughly in size from today's `KIND` block — only *perform*, *standard*, *tooluse*, *situation*, *judgment* subtract, all on the skill axis. The new *make* skill carries no penalty.
3. "A working build" and "a required-form document" deliberately pull two tags at once — they are the genuinely double-natured outputs, and that duality is the whole point of the second axis.

---

## 4. Conflict logic in axis terms (rewrites `conflictPair()`)

Today `conflictPair(kind, material)` catches material/kind incoherence. The plan names the new headline shape: **handle-a-situation (people) + a working build (a thing that runs)** — those are two different Labs. Proposed `conflictAxis(skill, output, material)` (prototyped, tested):

1. **People skill + thing-that-runs output** → conflict. `{situation, judgment} × {build}`. *"You are having students handle a situation with people in it, but the thing they produce is a working build. Pick the one this class is really about."*
2. **Pure-doing skill + experience output** → conflict. `{perform} × {experience}`. Steers the faculty member to the "None" output (§6) or to re-reading the skill as *handle a situation*.
3. **Carried-over material incoherence**, now keyed on the output rather than the old kind: `data × {experience, designed}`, `casefile × {build}`, `claims × {build}`, `text × {build}`.

Everything else is coherent — importantly, **situation + required-form document is *not* a conflict** (an IEP is a legitimate artifact of a handled situation), which the regression confirms (case *Disruptive classroom + IEP* lands a clean Simulate, not notready).

---

## 5. Regression analysis — 10 original + 4 new two-axis + 4 accessibility + the conflict demo

Every original case restructured to a `(skill, output)` pair; the suite definition is itself a Wave 2 deliverable (§6 of the plan). **Bold = the must-land tag.** All pass in the prototype.

| Case | (skill, output) | Cr | Re | Co | Si | State | Must-land |
|---|---|--:|--:|--:|--:|---|---|
| Joins / CIS-255 | perform, build | 3.5 | **13.0** | −3.5 | −1.0 | confident | Research ✓ |
| A disruptive classroom | situation, experience | −0.75 | 0.75 | −2.25 | **13.5** | confident | Simulate ✓ |
| Minimum wage & employment | interpret, finding | 0.25 | **13.75** | −3.25 | 0.75 | confident | Research ✓ |
| Brand identity | **make**, designed | **11.0** | 2.25 | −3.0 | 1.75 | confident | Create ✓ |
| A database schema | **make**, plan/spec | **10.0** | 2.5 | −3.0 | 1.75 | confident | Create ✓ |
| Choosing a significance test | perform, finding | 1.5 | **13.5** | −4.0 | −0.75 | confident | Research ✓ |
| A live intrusion | process, decision (clock) | 0.75 | 0.25 | **13.75** | 4.25 | confident | Compete ✓ |
| Pitching for a seed fund | judgment, plan/spec (rival) | 6.0 | 1.25 | **10.0** | 1.5 | confident | Compete first ✓ |
| Plea negotiation | situation, decision (rival) | −1.0 | 0.5 | **13.25** | 5.5 | confident | Compete, not Simulate ✓ |
| Writing a lesson plan | perform, plan/spec (clock) | **9.0** | 4.25 | 3.5 | 0.25 | confident | Create, not Compete ✓ |
| **[NEW] Joins-as-build** | perform, build | 3.5 | **13.0** | −3.5 | −1.0 | confident | Research; Create now 3.5 not 0.5 ✓ |
| **[NEW] Disruptive + IEP** | situation, formdoc | 0.5 | 2.25 | −2.25 | **11.5** | confident | Simulate, **no false conflict** ✓ |
| **[NEW] Pitch + plan** | judgment, plan/spec (rival) | 6.0 | 1.25 | **10.0** | 1.5 | confident | Compete first ✓ |
| **[NEW] Schema + technique** | perform, build | **9.0** | 5.5 | −3.5 | 0.0 | confident | Create; Research now visible at 5.5 ✓ |
| **[ACCESS] English composition** | make, designed | **11.0** | 2.25 | −3.0 | 1.75 | confident | Create — *had no skill home before* ✓ |
| **[ACCESS] Engineering design** | make, build | **11.0** | 5.25 | −3.0 | 0.5 | confident | Create leads, Research visible ✓ |
| **[ACCESS] Math proof** | make (prove), finding | 4.5 | **8.75** | −3.5 | 2.25 | confident | verify-soundness framing → Research; construction (Create 4.5) visible ✓ |
| **[ACCESS] Titration** | perform, **none** | 1.5 | **11.5** | −4.0 | −1.0 | confident | `none` scores 0 → Q-A decides alone ✓ |
| **[CONFLICT] Situation + build** | situation, build | 1.0 | 2.25 | −1.75 | 11.5 | **notready** | must flag conflict ✓ |

**Two results worth your eye:**
- **Pitch-off is now a clean *confident* Compete (10.0 vs 6.0)**, where W1-6's single axis left it a `two` tie (8.5/8.0). The second axis pulled the plan-output's Create share and the judgment-skill's arena share apart cleanly. Compete-first still holds; the state is simply firmer. If you'd rather preserve the honest "this is genuinely a close call" `two` framing for the pitch-off, say so — it's a one-line weight nudge (drop `plan/spec` studio 1.5→2.0) and I'll re-run.
- **Schema + technique** lands Create (9.0) but Research is now visible at 5.5 — the "it also runs and can be verified" half that the single axis flattened to 2.5.

**Joins stays canonical:** Research 13.0 / Simulate −1.0, still first-by-a-mile, penalty intact.

---

## 6. The "None" output — APPROVED, included

*Does Q-B need "None — the point is the doing" for pure-performance topics (a negotiation, a titration)?* **Reviewer approved 12 Aug: included, scoring 0, so Q-A decides alone.**

The rationale it was approved on: without it, a faculty member whose topic is a pure performance (a plea negotiation, a titration — the *doing* is the point, no lasting artifact) is forced to invent an output to satisfy the form, which is exactly the F9 "answer the survey question you think is being asked" failure. Scoring it 0 is safe, and the regression now exercises it directly: the **Titration** case (perform, none) lands Research 11.5 — Q-A carried it, the output contributed nothing. The one caveat to carry into Wave 3 testing: "None" must be visibly the *last* option and worded as a real choice, not an escape hatch, or faculty will over-pick it.

---

## 7. What the build touches (gated on the approvals above)

When approved, the build is mechanical and stays inside the existing script blocks (keeping the Node harness valid, per §6 of the plan):

**a. Block 1 — data.** Replace `KINDCLUSTERS` / `KIND` with `SKILL` and `OUTPUT` (the two tables in §3, already written in the prototype). `CATCHWAY` / `COMPETE` unchanged.

**b. Block 3 — pattern fit.** `patFit()` currently keys off `x.bestKind.indexOf(a.kind)`. Each pattern's `bestKind` list must split into `bestSkill` / `bestOutput`, and `patFit` sums a hit on each axis. This is the one non-obvious change and the reason it's on the approval list — the pattern → activity mapping is what makes the two-axis truth reach the generated language. Draft: `+2` for a `bestSkill` hit, `+2` for a `bestOutput` hit (was `+3` for the single `bestKind`).

**c. Block 4 — `STEPS`.** The one `{k:"kind", t:"kinds", …}` field becomes two. Simplest render: two stacked radio lists of 8 (the `kinds`-grid CSS can be reused as two single-column groups). `stepDone(0)` gate changes `a.kind` → `a.skill && a.output`.

**d. Block 6 — `score()`.** Replace the single `KIND[a.kind]` line with the two `SKILL`/`OUTPUT` lines (verbatim from the prototype's `score2`). `conflictPair` → `conflictAxis` (§4). `whyPrimary` gains the output clause ("…and students produce {output}").

**e. Block 7 — build prompt.** The `Topic kind:` line becomes `Skill (the how):` + `Output (the thing):`, both fed to the customization pass so the generated activity speaks both.

**f. `KINDEG` restructure.** Today's 18-kind per-subject example map splits into `KINDEG_SKILL` (8 keys) and `KINDEG_OUTPUT` (8 keys). The existing strings carry over ~half to each axis by the mapping below; no new writing is *required*, though a build pass should tidy the seams. Worked example (Computing), showing the carry-over is real, not hand-wavy:

| Old kind → | feeds skill | feeds output |
|---|---|---|
| technique ("SQL joins · a normalization pass") | **perform** | — |
| calculation ("algorithm complexity") | **perform** | finding |
| brief ("an app concept · a UX flow") | **make** | designed |
| build ("code · a query · an app") | make / perform | **build** |
| system ("a database design · a network") | make / tooluse | build / plan-spec |
| spec ("an API spec · requirements") | make | **plan-spec** |
| plan ("a sprint plan · a migration plan") | make / judgment | **plan-spec** |
| population ("a user base · telemetry data") | interpret | **population** |

The **make** skill draws its per-subject examples from the generative old kinds (brief, build, spec, system, plan) — the design/compose language already written there carries straight over. Full 18→(skill,output) routing for all 15 subjects is a build-time mechanical pass; the mapping rule is fixed here.

---

## 8. Decisions — status

**Approved 12 Aug:**
1. ✅ **Revised skill axis (§2) + skill pull table (§3a)** — including the added *make* skill (now "Design, build, compose, or **prove** something new"), the technique/calculation merge, and the *prove* verb for math/logic.
3. ✅ **"None" output (§6)** — included, scores 0.
4. ✅ **Pitch-off stays *confident* Compete (10.0 vs 6.0)** — no weight change.

**Still needs an explicit yes before I touch `Session-Sketch.html`:**
2. **The conflict rewrite (§4)** — `conflictPair` → `conflictAxis`, with the people-skill × working-build shape as the headline conflict.
5. **The pattern-fit split (§7b)** — `bestKind` → `bestSkill` / `bestOutput` at +2/+2. This is the one that carries the two-axis truth into the *generated activity language*, so it can't be skipped for a coherent build.

The output pull table (§3b) wasn't called out separately in your approval; it's unchanged from the reviewed version and every case depends on it, so I'm treating it as approved-by-implication — say if you'd rather review it on its own.

**On approval of 2 and 5**, the build is the mechanical pass in §7 (data tables, the two-question STEPS, `score()`, the KINDEG split, the build-prompt lines) plus rewriting `Session-Sketch-regression.js` to the `(skill, output)` case definitions — then the full harness runs before it's called done. **No tool change happens until you say go.**
5. **Pattern-fit split (§7b)** — approve `bestSkill`/`bestOutput` at +2/+2.

On approval I'll implement inside the script blocks, rewrite the regression suite to the `(skill, output)` case definitions above, and run the full harness before anything is considered done. **No tool change happens until then.**
