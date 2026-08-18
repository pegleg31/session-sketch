# The idea prompt

Two things in this file:

- **Part A** — a prompt you can paste into a normal Claude chat today, already filled in with the MKT-337 answers. Test it before any code gets written.
- **Part B** — the handoff spec for Claude Code: every value that has to be passed, where it comes from, what comes back, and what gets checked.

---

# PART A — Test this in a chat right now

Paste everything in the box below into a new Claude conversation. It is already filled in with the real MKT-337 session, taken from `lab-concept-survey-data-analysis (1).html`.

Judge the result on one question: **would a Marketing professor be interested?**

---

You are helping design one class activity for a university course. Not a lesson plan, not a syllabus — one activity a professor can picture and run next week.

## The class

- **Course:** MKT-337 Market Research (Marketing)
- **Topic:** survey data analysis
- **Software students use:** Excel, including the Data Analysis ToolPak
- **What happens in class now:** the professor walks them through it, then a practice exercise
- **Where students are with the topic:** they have seen it before; this reinforces it
- **What students are learning to do:** perform a technique that has a right and a wrong way
- **What students produce:** a decision, committed and defended
- **What they work from:** a dataset — messy on purpose. Cleaning and vetting it is part of the work.
- **Class length:** 50 minutes
- **Class size:** about 20, so teams of 4
- **Student experience:** a handful have relevant professional experience; most do not
- **The mistake only an expert would catch** *(the professor's own words, use them):* "the assessment of the questions that are driving the data are not aligned with the underlying mechanism — the underlying survey questions do not measure what the analysis claims they measure"
- **What the professor wants students to remember in a year:** that the number depends entirely on what the question actually asked
- **Keep out of it:** no Python. This must be done with Excel tools and the Data Analysis ToolPak.

## What has already been decided

This is a **verification** activity. Students check AI's confident work against something real. It is not open-ended research.

**What students check against:** the executed result — what actually happens when you run it.

Write **three separate ideas**. Each one gives AI a different job:

1. **AI as the beginner they have to train.** It follows the students' instructions exactly and nothing more. It helps because watching your own instructions run shows you what you left out. It runs out because it quietly fills gaps from its own training, hiding the omission.
2. **AI as the expert who already has the answer.** It answers fast, fluently, with total confidence. It helps because it compresses an evening of work into seconds. It runs out because fluency is not evidence and it never sounds less certain when it is wrong.
3. **AI as the drafting room that never tires.** It produces many complete versions fast. It helps because trying an option becomes free, so students can compare fifteen instead of defending their first. It runs out because volume without criteria is noise, and it drifts toward one average idea wearing many costumes.

## Hard rules

Every idea must pass all of these. If an idea cannot, throw it away and write a different one.

1. **It has to have a situation.** Who are the students for the next 50 minutes? What just happened? What is in front of them? Not "teams analyse the dataset" — a real situation with a name, a stake, and someone who wants something.
2. **AI has to be necessary.** State in one sentence what becomes possible that was not possible before AI. If the honest answer is "the same thing, but faster," the idea fails. Throw it away.
3. **Use the professor's mistake, in their words.** It is the most valuable thing they told us. Build the activity so students hit it.
4. **Name Excel where it belongs.** Students are working in Excel, not in the abstract.
5. **Something has to land in the first ten minutes.** A specific moment where AI does something students did not expect it could do. It has to be guaranteed by how the activity is built, not left to luck.
6. **Something only a person can do.** Name it. If AI could do the whole activity, the idea fails.
7. **Five steps that add up to 50 minutes.** Give minutes for each.
8. **Respect what they said to keep out.** No Python.
9. **Say exactly what the file has to contain.** The moment that lands early has to be guaranteed by how the material is built — specific blanks, specific codes, specific redundant items. Spell it out, or the activity cannot be run.
10. **Say what the professor has to prepare, and how long it takes.** Be honest. A hidden hour of prep kills the idea.
11. **Any organisation you name must be invented.** Never use a real company.
12. **Any statistic you quote is a target for whoever builds the file**, not a prediction about what students will find. Say so.

## Write it like this

For each of the three ideas:

**Idea name** — short, memorable, not jargon

**The situation** — three or four sentences. This is the part the professor reads first, so make it something they can picture.

**Why AI has to be here** — one sentence. What is possible now that was not before.

**The five steps** — one line each, with minutes.

**What lands early** — the moment in the first ten minutes, and what makes it certain to happen.

**Where it goes wrong on purpose** — how students hit the professor's mistake, and how they discover it themselves rather than being told.

**What only a person can do** — one line.

**What students hand in** — one line.

**What they can do next time** — the skill they could name afterwards, one line.

**What the file has to contain** — the specific properties of the material that make the early moment certain. One line each.

**Prep** — what the professor builds beforehand, and roughly how long it takes.

## Voice

Write for a tired professor at 4pm. Short sentences. Concrete nouns. No jargon and no cheerleading. Never use these words: delve, leverage, robust, unlock, journey, empower, seamless, "in today's fast-paced". Do not name a specific AI product — say "AI" or "the AI tool".

---

## How to judge what comes back

| Ask yourself | If the answer is no |
|---|---|
| Could I picture my Tuesday class doing this? | The situation is too vague |
| Would this be interesting even without the AI angle? | It is a worksheet with AI bolted on |
| Does the AI part feel necessary or decorative? | Rule 2 is not being enforced hard enough |
| Are the three ideas actually different, or one idea three ways? | The castings are not doing their job |
| Does it use my planted mistake, or a generic one? | Rule 3 needs to be stronger |

If ideas come back good: the plan holds, and Part B is buildable.

If they come back flat: fix the prompt here, in a chat, where it costs nothing. Do not write code first.

---

---

# The test result — 17 Aug 2026

**It worked.** Three ideas came back on the MKT-337 case: The Handoff (Northgate Coffee brand tracker), The Signature (Halverson press release), Four Questions Left (Rivertown Credit Union budget cut).

Checked against the rules:

| Check | Result |
|---|---|
| Minutes add to the session length | 50, 50, 50 — all exact |
| `why_ai` is not a speed claim | All three pass. *"A written procedure used to be something a class argued about in the abstract, and now it executes."* |
| Planted mistake used verbatim | All three quote the professor's sentence |
| Excel and the ToolPak named | Yes — Descriptive Statistics, Correlation, Anova: Two-Factor |
| Situation with a stake | Yes — all three invented a named client with a deadline |
| Maths | `C(12,4) = 495` is correct |

It also went **deeper into the subject than the intake did.** Nobody typed "Cronbach's alpha" anywhere. The model inferred it from Marketing plus survey data analysis plus a committed decision. No template could have done that.

**Decision 1 is confirmed.** Generate, don't reword.

## What the test changed

Four things the plan did not have. All four are now requirements below.

### 1. The dataset has to be engineered — and the idea has to say how

Every one of the three ideas depends on a **specifically built file**:

- Idea 1: blank cells, a `99` code for "prefer not to say", and one seven-point item sitting among five-point items
- Idea 2: `TRUST_6` asks about parking and wait time; `TRUST_2` and `TRUST_3` are the same question reworded, correlating at .93
- Idea 3: three of the twelve items are near-paraphrases of each other

**The wow is guaranteed by the data, not by the instructions.** That is what makes it structural rather than lucky — and it means an idea is unrunnable without the file spec. New required output field: **`file_spec`**.

### 2. Prep time has to be honest

Building that file is 20–40 minutes of work before class. Faculty will abandon an idea they cannot prepare, and they will resent one that hid the cost. New required output field: **`prep`** — what they have to build beforehand, in one line, with a time estimate.

### 3. The invented client is a feature, and needs a rule

Northgate Coffee, Halverson Research Partners, Rivertown Credit Union. The named fictional organisation is most of why these feel real. Make it a requirement — and require it to be **fictional**, so we never put words in a real company's mouth.

### 4. The numbers are design targets, not predictions

Alpha ≈ .84, .91, .94; r = .70, .20, .93. These are targets for whoever builds the file, not forecasts about what students will find. If the page presents them as predictions, the first professor whose data behaves differently loses trust in the whole thing. Label them.

## What it changed about the page

Each idea came back at roughly **330 words**. Three ideas is about **980 words**, and the Wave 7 plan set Layer 1 at under 400.

Both can be true, because the three cards do not show the whole idea:

| Card, on the first screen | Revealed after they pick |
|---|---|
| Name | The five steps |
| The situation, 3–4 sentences | What lands early |
| Why AI has to be here, one line | Where it goes wrong on purpose |
| Prep time, one line | What only a person can do |
| | What they hand in, what they can do next time |
| | The file spec |

That is about **90 words per card, 270 total** on the first screen. Layer 1 holds.

## One risk worth naming

These ideas are good enough that the deterministic fallback now looks much worse by comparison. When the API is unavailable, the page has to say so plainly rather than quietly serving the old text as though it were the same product.

---

# PART B — Handoff spec for Claude Code

## B1. What has to be passed in

Everything comes from `S.a` (the answers) and `concept()` (what the engine decided). Nothing new needs collecting.

### From the faculty answers — `S.a`

| Field | Key | Pass as | Notes |
|---|---|---|---|
| Subject family | `subject` | label from `SUBJ` | For vocabulary. Never pass the key. |
| Course | `course` | raw text | |
| Topic | `topic` | raw text | Already split from the tool by `concept()` — pass the split version |
| Software they use | `tool` | raw text | Optional. Omit the line if empty. |
| What happens now | `teaches` | raw text | |
| Where students are | `stage` | label, not key | intro / review / extend |
| Core skill | `skill` | label from `SKILL` | |
| What they produce | `output` | label from `OUTPUT` | If `none`, say "no lasting artifact — the point is the doing" |
| Raw material | `material` | `MAT[k].noun` + the state sentence | |
| Material state | `matstate` | "messy on purpose" or "ready to use" | Drives whether cleaning is part of the work |
| Length | `length` | `lenLabel()` | 50 / 75 / two sessions |
| Class size | `size` | plus team size | `teamSize` is already computed in `concept()` |
| Student experience | `exper` | label | yes / some / no |
| **The planted mistake** | `catch` | **raw text, verbatim** | The single most important input. Never paraphrase it. |
| How it gets caught | `catchway` | label from `CATCHWAY` | |
| What they worry about | `worry` | label | |
| Remember in a year | `remember` | raw text | Omit if empty |
| Keep out of it | `avoid` | raw text | Omit if empty |

### From the engine — `concept()`

| Field | Source | Notes |
|---|---|---|
| The type | `c.k` → `TYPES[k].name` | Pass what it *means*, not the label. See B2. |
| What students check against | `c.P.anchor` | The one thing kept from the seventeen activities |
| The three castings | `pickJob()` + `jobPool()` | Derived pick first, then two alternatives |
| Per casting | `cast`, `lift`, `limit` | Pass all three fields. These are the constraint that makes the ideas differ. |
| Phase count and timings | `c.phases` | Five slots and the minutes for the chosen length |
| Team size | `c.teamSize` | |

### Deliberately NOT passed

- Score bars and tag scores — irrelevant to writing an idea
- `doDiff` and `goeswrong` — they already did their job choosing the type
- The seventeen activity descriptions — **except** the anchor
- `T[tag].wow` / `.fail` / `.human` — Claude writes these now; they stay only as the fallback

## B2. Translate keys before sending

Never send `skill: "perform"` or `k: "lab"`. Send what they mean.

```js
// Not this:            { skill:"perform", k:"lab", material:"data" }
// This:
{
  skill: "perform a technique that has a right and a wrong way",
  type:  "a verification activity — students check AI's confident work against something real",
  material: "a dataset, messy on purpose; cleaning it is part of the work"
}
```

The model has no access to our vocabulary. Every key it receives raw is a chance for it to guess wrong.

## B3. What comes back

One call, three ideas, JSON only.

```json
{
  "ideas": [
    {
      "casting": "apprentice",
      "name": "The Instruction Handoff",
      "situation": "3-4 sentences.",
      "why_ai": "One sentence: what is possible now that was not before.",
      "steps": [
        { "minutes": 8,  "text": "one line" },
        { "minutes": 10, "text": "one line" },
        { "minutes": 14, "text": "one line" },
        { "minutes": 10, "text": "one line" },
        { "minutes": 8,  "text": "one line" }
      ],
      "lands_early": "The moment, and what makes it certain.",
      "goes_wrong": "How students hit the professor's mistake and find it themselves.",
      "human_only": "One line.",
      "hand_in": "One line.",
      "next_time": "One line.",
      "file_spec": "Exactly what the material must contain for the wow to be guaranteed. Bullet-style, one line per property.",
      "prep": "What the professor has to build before class, with a time estimate.",
      "numbers_are_targets": true
    }
  ]
}
```

`casting` must be one of the keys we sent. It is how the page ties each idea back to the casting data.

## B4. Checks before anything is shown

Run these on each idea. A failing idea is dropped, not fixed.

| # | Check | How |
|---|---|---|
| 1 | Valid JSON, `ideas` is an array of 1–3 | parse |
| 2 | Every field present and non-empty | keys |
| 3 | `casting` is one of the keys sent | lookup |
| 4 | `situation` is 2–5 sentences | sentence count |
| 5 | **`why_ai` exists and is not a speed claim** | reject if it matches `/\b(faster|quicker|saves? time|more efficient|in less time)\b/i` **and** nothing else. This is the necessity test in code. |
| 6 | The planted mistake appears | at least 4 consecutive significant words from `S.a.catch` appear in `goes_wrong` |
| 7 | The tool appears at least once | if `S.a.tool` is set, it appears somewhere in the idea |
| 8 | Exactly 5 steps, minutes sum within ±3 of the chosen length | sum |
| 9 | No banned words | *delve, leverage, robust, unlock, journey, empower, seamless, in today's fast-paced* |
| 10 | No AI product names | reject *ChatGPT, Copilot, Gemini, Claude* in faculty-facing text |
| 11 | **`file_spec` present and specific** | must name at least two concrete properties of the material. Reject vague ones like "a messy dataset". Without this the idea cannot be run. |
| 12 | **`prep` present with a time estimate** | must contain a number and a unit. Faculty abandon ideas whose cost is hidden. |
| 13 | **Any organisation named is fictional** | reject a match against a list of real company names. Fictional clients only. |
| 14 | Any statistic quoted is labelled a target | if the idea contains a decimal statistic, `numbers_are_targets` must be true and the page must render them as design targets |

**If fewer than 3 pass, show the ones that did.** Two good ideas beat three with padding.

**If none pass, show today's deterministic text** and a quiet line: *"Showing the standard version — the custom ideas did not meet the bar."* Never a blank page, never an error.

## B5. Where the key lives

The offline single file cannot hold an API key. Two ways:

| | How | Good for |
|---|---|---|
| **Now** | Faculty-or-you pastes a key once; stored in `localStorage`; called direct from the browser with `anthropic-dangerous-direct-browser-access: true` | Your own machine, and your own testing this week |
| **Wave 4** | A `/api/ideas` function on Vercel holding the key in an env var | Everyone else. The real answer. |

Write it as **one function**, `getIdeas(payload)`, with the transport behind it. Then swapping from pasted key to hosted endpoint is a one-line change and nothing else moves.

**No key present → the tool works exactly as it does today.** The API is an upgrade, never a dependency.

## B6. Two things to log

Add to the existing `joblog`:

- `{ e:"ideas", ok:2, failed:1, reasons:["why_ai was a speed claim"] }` — so you learn which check fires most. That tells you whether the prompt needs work or the checks are too strict.
- `{ e:"ideaPick", name:"The Instruction Handoff", casting:"apprentice", position:2 }` — which of the three they chose. If faculty always pick the third one, the ordering is wrong.

## B7. Order to build it

1. Get Part A producing good ideas in a chat. **No code until this is true.**
2. Move the filled-in prompt into a template function with the B1 values substituted.
3. `getIdeas()` with the pasted-key transport.
4. The ten checks in B4, with the fallback.
5. Render three cards; picking one opens the detail (Wave 7 plan §6).
6. The two log lines in B6.
7. Version stamp, if it is not in by then — the ideas make follow-up feedback much more valuable, and without a version number you cannot tell which prompt produced which idea.
