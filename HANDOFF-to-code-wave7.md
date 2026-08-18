# Handoff to Claude Code — Wave 7 changes the Wave 6 scope

Written 18 August 2026. Paste this whole file, or point Code at it.

---

## Read these two files first

1. `Session-Sketch-wave7-results-page-plan.md` — the reasoning and the five decisions
2. `Session-Sketch-idea-prompt.md` — **Part B is your spec.** Part A is the prompt, already tested by hand.

---

## The headline: the scope changed after you built enrich

Your Wave 6 overlay does what I originally specified: the engine writes the lines, the model rewrites them, and anything the wrong length gets clamped back to the template line.

**That specification was wrong, and we found out why.** Faculty said three things about the activity:

- It isn't clear what students actually do in class
- They don't see how AI fits in
- **It's just what they already do with AI bolted on, so it doesn't feel necessary**

The third one is structural, not cosmetic. The tool sorts answers into 4 types × 17 activities × 12 castings and fills the slots it lands on. But those 17 activities are generic shapes — "Execute and Verify" means *get an AI answer then check it*, which fits joins, survey data, nursing charts, anything. A sorting machine can only hand back the box you fit into. It cannot invent, and an idea is an invention.

**So enrich cannot fix it.** Rewriting a template line in nicer words still produces a template. Worse, a model given the current input writes fluent prose over the top of the problem, so the output reads better and gets harder to diagnose.

### The new split

| Engine | Claude |
|---|---|
| Decides the type and the casting | Invents the situation and the activity |
| States the rules an idea must obey | Writes it |
| Rejects ideas that fail | Returns three to choose from |

**The engine becomes the rubric, not the writer.**

Scoring is untouched. `score()`, the pulls, `conflictAxis()`, `pickJob()` — all stay. The 12 regression cases and your 10 Wave 5 tests must still pass byte-identical. If they don't, something leaked.

## What survives from Wave 6

Most of it. This is a payload and schema change, not a rebuild.

| Keep | Why |
|---|---|
| `api/enrich.js` — the Vercel function, structured output, deploy config | Rename to `api/ideas.js`; the transport is right |
| The validate-then-fall-back discipline | Exactly right, and now there is more to validate |
| `build-enrich-inline.js` — anchored, idempotent, byte-identical on re-run | The pattern is good. Keep the two assertions you added. |
| `Session-Sketch-enrich-test.js` | Same harness, new assertions |
| `package.json`, `vercel.json`, `.vercelignore` | Unchanged |
| `_pre-wave6-backup.html` | Keep it |

**Drop:** the clamp-to-template-line behaviour. There is no template line to clamp to any more. A wrong-shaped idea is rejected, not repaired.

## What changes

### 1. The payload — send answers and rules, not lines to rewrite

Full table in Part B §B1. The rule that matters most is **§B2: translate every key before sending.**

```js
// Not this:
{ skill:"perform", k:"lab", material:"data" }

// This:
{ skill:"perform a technique that has a right and a wrong way",
  type: "a verification activity — students check AI's confident work against something real",
  material: "a dataset, messy on purpose; cleaning it is part of the work" }
```

The model has none of our vocabulary. Every raw key is a chance for it to guess wrong.

**Send `S.a.catch` verbatim.** Never paraphrase it, never truncate it. It is the highest-value answer in the intake.

**Send three castings**, not one: the derived pick from `pickJob()` plus two alternatives from `jobPool()`. For each, send `cast`, `lift` and `limit`. Those three fields are what make the three ideas genuinely different rather than three rewordings.

**Do not send:** score bars, `doDiff`, `goeswrong` (they already chose the type), or the 17 activity descriptions — **except** `c.P.anchor`, which stays.

### 2. The response — three ideas

Schema in Part B §B3. Each idea carries `casting`, `name`, `situation`, `why_ai`, `steps[5]`, `lands_early`, `goes_wrong`, `human_only`, `hand_in`, `next_time`, plus two fields the hand test discovered:

- **`file_spec`** — exactly what the material must contain. The early moment is guaranteed by how the file is built, not by the instructions, so an idea without this cannot be run.
- **`prep`** — what the professor builds beforehand, with a time estimate. Faculty abandon an idea they can't prep and resent one that hid the cost.

### 3. Fourteen checks, and rejection instead of repair

Full list in Part B §B4. The three that carry the most weight:

**Check 5 — the necessity test.** Reject `why_ai` if it is only a speed claim:

```js
/\b(faster|quicker|saves? time|more efficient|in less time)\b/i
```

This is complaint C enforced in code. It would have caught every flat activity the tool has produced.

**Check 6 — the planted mistake is really there.** At least four consecutive significant words from `S.a.catch` must appear in `goes_wrong`.

**Check 8 — the minutes add up.** Exactly five steps, summing within ±3 of the chosen length.

**A failing idea is dropped, not fixed.** Fewer than three passing is fine — show the ones that passed. Two good ideas beat three where one is padding. If none pass, show today's deterministic text with a plain line saying so. Never a blank page, never a silent downgrade.

### 4. One function

`getIdeas(payload)` with the transport behind it. Pasted key in `localStorage` now, `/api/ideas` later, one line to swap.

**No key present → the tool behaves exactly as it does today.** The API is an upgrade, never a dependency.

### 5. Two log lines

Append to the existing `joblog`:

```js
{ e:"ideas",    ok:2, failed:1, reasons:["why_ai was a speed claim"] }
{ e:"ideaKeep", kept:["apprentice","volume"], shown:3 }
```

The first tells you whether the prompt needs work or the checks are too strict. The second tells you which ideas get kept together, and whether the ordering is wrong — if faculty always keep the third and never the first, something is off.

## Decisions settled 18 Aug — build to these

| # | Decision | What it means for you |
|---|---|---|
| 3 | The tool gives the file spec **plus a prompt faculty run** to build the file | Each idea's `file_spec` renders twice: the properties in plain words, and a **Build my file** button that copies a prompt containing them. Same pattern as the existing build prompt — no new mechanism. |
| 4 | With no key, **say so plainly** | One line above the output: *"Showing the standard version — the custom ideas need a connection."* Never a silent downgrade. |
| 5 | **Measure the cost** on the first live call | Print the token counts once so we can price a run. |
| 9 | Opening an idea is **not** a commitment | See below — this changes the interaction. |
| 11 | Only **22 run strings**, not 66 | Two per casting (`first` and `push`). The Oracle already has all six. Nothing for you to do; noting it so the fallback isn't assumed complete. |
| 12 | The **"how it went" box** ships, but later | Not this pass. |

### Decision 9 in detail — keeping more than one idea

I had assumed picking one idea meant choosing it. That was wrong. A professor who likes two isn't undecided — they teach the topic every term, or two sections, or one idea suits first-years and the other suits seniors. **Two ideas is a term's worth of material.**

| Not this | This |
|---|---|
| *"Pick this one"*, and the other two go away | *"See the detail"* — expands that card. Any number can be open. |
| One build prompt for the chosen idea | A **Keep** toggle per card. Each kept idea gets its own copy button. |
| Saved file holds one Lab | Saved file holds every kept idea — two ideas, two Labs, one file. |

Nothing on the first screen changes. Cards stay ~90 words, everything closed by default.

**So the log line changes too.** Instead of one pick, record the set:

```js
{ e:"ideaKeep", kept:["apprentice","volume"], shown:3 }
```

Which ideas get kept *together* is better data than which one wins. It also means the cross-course casting-variety problem from Wave 5 solves itself — a professor who keeps two ideas with different castings already has two Labs that don't repeat the same AI job.

## Also needed, and small

### `SKETCH_VERSION`

Not in the file anywhere yet, and it is now urgent. Add a constant, print it in the results footer, and write it into **every saved concept and every log entry.**

Without it, the moment two faculty send back results from two versions, the feedback can't be told apart. It also tells you which prompt produced which idea, which matters as soon as the prompt starts changing.

### The results page, in three layers

Wave 7 plan §6. Not required for the API work, but it is what the ideas land in:

- **Layer 1** — three idea cards, about 90 words each: name, situation, why AI has to be here, prep. Nothing else on the first screen.
- **Layer 2** — each idea they open: five steps with minutes, the two moments in plain words, the file spec plus **Build my file**, what only a person can do, and a **write my Lab** button. More than one can be open, and more than one can be kept.
- **Layer 3** — behind the existing `S.fac` toggle: full prompt text, the 20-row sketch as-is, score bars, workshop notes, Pillars 2 and 4.

Two wording rules that come out of decision 5:

- **The page is written for faculty working alone.** Anything that describes faculty in the third person is now a bug. *"Read all three aloud and watch which one they react to"* becomes *"Pick the one you can already picture in your room."*
- **Any statistic inside an idea is a target for whoever builds the file, not a prediction.** Render it that way, or the first professor whose data behaves differently stops trusting the page.

## The hand test, so you know the bar

Part A was run against the real MKT-337 case before any of this was specified. Three ideas came back — a brand tracker handoff, a press-release review desk, a budget cut forcing 12 survey items down to 4. All three passed every rule: minutes exact at 50, no speed claims, the professor's mistake quoted verbatim, Excel and the ToolPak named correctly, a fictional client with a real deadline in each, and `C(12,4) = 495` was right.

It also went deeper into the subject than the intake did. Nobody typed "Cronbach's alpha" anywhere — the model inferred it from Marketing plus survey data analysis plus a committed decision. **That is the bar.** If the wired-up version produces less than that, the payload is losing something the hand test had.

## Suggested order

1. Your two failing assertions (E17, E24) — finish those first, they are unrelated to this
2. `SKETCH_VERSION`
3. Rename and repoint: `api/enrich.js` → `api/ideas.js`, `getIdeas(payload)`
4. The payload builder, with §B2 translation — **compare its output against Part A's filled prompt.** Anything Part A has that the payload lacks is a bug.
5. The 14 checks, with rejection and fallback
6. The two log lines
7. Layer 1 rendering: three cards
8. Re-run everything — 12 regression cases, 10 Wave 5 tests, the portal smoke test, `node build-portal.js`

## One environment note

My shell was reading a **stale partial copy** of `Session-Sketch.html` from the OneDrive cache — 146KB and truncated, while the real file is 192KB and fine. I nearly "repaired" a file that was never broken, which would have wiped your Wave 6 work.

If anything ever reports that file as truncated or missing `resultHTML`, check `_pre-wave6-backup.html` first: it is 181KB, so any current reading below that is a stale cache, not damage.

## Open, not decided

- The prompt has only been tested on a `perform` skill with a verifiable anchor — the easy third of the grid. It has **not** been tested on `make`, `situation` or `judgment`, where there is no right answer and the failure can only be flat. Worth one more hand test there before the checks are tuned, since that is where the ideas are most likely to go soft.
