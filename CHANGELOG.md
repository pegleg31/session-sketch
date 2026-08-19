# Changelog — Session Sketch (SNHU AI Labs)

All notable changes to the Session Sketch tool: the wizard (`Session-Sketch.html`),
the conversational portal (`Session-Sketch-Portal.html`, generated), the paper
one-sheet, the reference pages, and — from 5.0 — the hosted rewrite backend
(`api/`). Format follows [Keep a Changelog](https://keepachangelog.com); dates
are 2026 throughout.

## How versions work here

Development runs in **waves** (design doc → review → build), and wave numbers do
not line up with version numbers — Wave 4 is a deferred Next.js port that Waves
5–7 deliberately jumped ahead of. Versions below are the **released states**;
each release maps to a wave.

Before git, history was kept as **frozen snapshot files**. Their `vN` names
predate this changelog and follow their own convention — a snapshot is the
state frozen *just before the next change landed*, i.e. a rollback point, not a
release. The mapping:

| Snapshot file | Is the state of | = release |
|---|---|---|
| *(sibling `New folder`, pre-rebuild copy)* | the original tool, with the Joins bug | 1.0.0 |
| `Session-Sketch-v2-2026-08-10.html` (+ One-Sheet v2) | the rebuild, frozen at ship | 2.0.0 |
| `Session-Sketch-v3-2026-08-11.html` | just before Wave 1 landed | 2.0.0 (+1 day drift) |
| `Session-Sketch-v4-2026-08-12.html` | just before Wave 2 landed | 2.1.0 |
| `Session-Sketch-v5-2026-08-18.html` | just before Wave 6 landed | 4.0.0 |

**Going forward:** the repo lives at `github.com/pegleg31/session-sketch`;
Vercel deploys `main` on push. Tag releases (`git tag v5.0.0`) and stop
minting snapshot files — keep the five existing ones forever as the pre-git
record. The version bump rule used below: **major** when scoring, the intake
questions, or the stored-state schema change (a saved concept or regression
case could read differently); **minor** for new surfaces and content.
**Between releases, every deployed build bumps the `-dev.N` counter** —
`SKETCH_VERSION` is set in one place, the `VERSION` constant at the top of
`build-ideas-inline.js`. Two builds that anyone might see must never share a
version string, or the feedback they send back can't be told apart.

---

## [Unreleased] — 5.0.0-dev.N (the current build is the last row below)

`SKETCH_VERSION` now exists (results footer, saved concepts, build prompts,
the saved-file comment, and every `ideas`/`ideaKeep` log entry). Deployed dev
builds so far:

| Build | Deployed | Contains |
|---|---|---|
| `5.0.0-dev` | 18 Aug | Wave 7 first pass — idea generator inside the old tabbed page, button-triggered |
| `5.0.0-dev.2` | 18 Aug | Wave 7 second pass — three-layer page, auto-generation, §7 wording, Workshop view toggle |
| `5.0.0-dev.3` | 18 Aug | Fix: first real generation hit Vercel's 60s function ceiling (HTTP 504) — `maxDuration` raised to 300s; busy copy says "a minute or two" |
| `5.0.0-dev.4` | 18 Aug | Check 7 loosened after the first live acceptance run (104.5s, 3 ideas, $0.19): it rejected an idea that said "ToolPak" throughout but never "Excel" — any distinctive word of the tool string now counts |
| `5.0.0-dev.5` | 18 Aug | Rejection reasons are now shown on the page (all-rejected card gets a "What failed, rule by rule" list; partial rejections name their rule inline) and always printed to the console — a failed run is diagnosable without DevTools archaeology |

Bump the `VERSION` constant at the top of `build-ideas-inline.js` on every
deployed build; drop the `-dev` suffix at release.

### Wave 7 — the model generates the activity; the engine is the rubric (built 18 Aug · 5.0.0-dev)

Faculty said the activity was "what they already do with AI bolted on" — a
sorting machine can only hand back the box you fit into, and a rewritten
template is still a template. So the split changed: the engine decides the
type and the casting, states the rules and rejects; Claude invents the
situation and the activity, three ideas to choose from. Scoring untouched —
regression and Wave 5 tests pass unchanged.

- **Added** `api/ideas.js` (replaces `api/enrich.js`) — a deliberately thin
  Vercel function: holds the key, pins `claude-opus-4-8` at default effort
  (the hand test's bar was set in a plain chat), relays ideas, reports token
  usage (decision 5). No clamp — a malformed idea is the client's to reject.
- **Added** `wave7-ideas.js` + `build-ideas-inline.js` (replaces the Wave 6
  inline pair; reverts every Wave 6 edit with exact inverse strings, verified
  idempotent in both grow and shrink directions). The prompt is assembled
  **client-side** from the hand-tested Part A template, so `SKETCH_VERSION`
  identifies which prompt produced which idea and both transports run the
  same one.
- **Added** the §B2 translation layer — the model never sees a raw key:
  meanings for type/stage/experience/size, labels for skill/output/material,
  the planted mistake verbatim, three castings (derived pick first) each with
  cast/does/lift/limit, and `c.P.anchor` as the one survivor of the seventeen
  activity descriptions.
- **Added** the fourteen acceptance checks (`IDEACHECK` — every threshold in
  one config block, pending the two remaining hand tests): necessity (no
  speed claims), the planted mistake quoted (4 consecutive significant
  words), five steps summing ±3, file-spec specificity, honest prep time,
  fictional orgs (a screen, not a guarantee), statistics-as-targets
  (including leading-dot decimals like ".84"), banned words, product names.
  **A failing idea is dropped, never repaired**; fewer than three is shown
  honestly ("2 of 3 met the bar"); none passing falls back to the standard
  version with a plain line (decision 4). Offline says
  "the custom ideas need a connection" — never a silent downgrade.
- **Added** three idea cards on the Activity tab: ~90-word face (name,
  situation, why-AI, prep), native `details` for the rest. **Opening is not a
  commitment** (decision 9): a Keep toggle per card, kept cards render open
  and travel in the saved concept, each kept idea gets its own build prompt
  ("the idea wins" over the template activity) and a **Build my file** prompt
  (decision 3C — the file spec plus a paste-ready prompt, statistics rendered
  as design targets).
- **Added** the two log lines: `{e:"ideas", ok, failed, reasons, v}` and
  `{e:"ideaKeep", kept:[casting keys], shown, v}` (decision 9 superseded
  §B6's `ideaPick`).
- **Added** transports behind one `getIdeas()`: hosted `/api/ideas` (primary),
  or a pasted key in `localStorage["snhu-sketch-key"]` calling the API direct
  from the browser (works from `file://`).
- **Added** `Session-Sketch-ideas-test.js` — 81 assertions: Part-A parity
  (every fact of the hand-tested prompt greppable in the built prompt),
  accept/reject fixtures for all fourteen checks, drop-not-repair, log
  shapes, keep toggling, all four degrade states, and engine untouchability.
- **Removed** the Wave 6 rewrite overlay before it ever released (all seven
  inline edits reverted; `api/enrich.js` and its test retired;
  `build-enrich-inline.js` neutered with a guard throw so it can't re-inject
  over Wave 7).

### Wave 6 — the AI rewrite pass + hosting (built 18 Aug; superseded by Wave 7 the same day, never released)

The first networked feature: after the deterministic engine decides everything,
one optional API call rewrites the concept's *words* — activity pitch, run
beats, participant tasks, wow, designed failure, human contribution — in the
subject's own professional language. Words only; provably cannot move a tag, a
score, an activity, a casting, a phase or a timing.

- **Added** `api/enrich.js` — Vercel serverless function calling Claude
  (`claude-opus-4-8`, adaptive thinking, structured output against a fixed
  schema; wrong-length arrays clamped back to template lines). API key lives in
  a Vercel env var; the browser never sees it.
- **Added** `wave6-enrich.js` (source) + `build-enrich-inline.js` — inlines the
  client code into the existing result script block (block count stays 8) via
  seven anchored, idempotent edits. Convention matches `build-jobs-inline.js`.
- **Added** rewrite card on the Activity tab: offer → busy → applied states,
  revert to template wording, one-line error handling. Offline (`file:`) the
  card explains instead of showing a dead button; every surface falls back to
  template wording — the tool still works with no network.
- **Added** self-invalidation: the stored rewrite is fingerprinted against
  every answer plus tag/activity/casting and is ignored the moment any of them
  changes — faculty can never read field-specific prose about a concept they
  have since changed.
- **Changed** the build prompt: when a rewrite is present it carries the
  field-specific wording and instructs the builder to keep it rather than
  re-genericize.
- **Added** `Session-Sketch-enrich-test.js` — 47 assertions (overlay reaches
  every surface, moves nothing, invalidates correctly, degrades on malformed
  payloads). 45 pass; the 2 failures are known bad assertions in the *test*,
  fix pending.
- **Added** deploy scaffolding: `package.json`, `vercel.json` (`/` → portal,
  `/wizard` → wizard), `.vercelignore`.
- **Verified** regression byte-identical (12/12 cases, 10/10 Wave 5 tests) and
  portal smoke all green after the patch.

### Wave 7, second pass — the three-layer results page (built 18 Aug · 5.0.0-dev.2)

Plan §6 and §7, plus auto-generation. The page now leads with the class, not
the proof.

- **Changed** the results page to three layers. **Layer 1** — the idea cards
  are the first screen; nothing else on it. **Layer 2** — each card opens to
  its detail (any number open, any number kept). **Layer 3** — everything the
  page used to show (verdict, score bars, casting card, activity card, build
  prompt, sketch, roles, pacing, pillars) sits in an `.l3` wrapper shown only
  when the workshop toggle is on. Nothing deleted; one toggle decides who the
  page is for. The portal's tab row moved inside the workshop layer; the
  wizard wraps at `resultHTML`'s return.
- **Changed** ideas to **generate automatically when the concept opens** —
  once per answer-set (signature-tracked), never auto-retried after an error
  or an all-rejected run; those states offer a manual try-again. Changing any
  answer re-generates on the next results view, which spends tokens per edit
  by design.
- **Changed** wording per §7: "What makes it land, early", "The mistake
  you're planting on purpose", "The part AI can't do for them"; the per-idea
  prompt button is now **Write my Lab**. The "Facilitator notes" toggle is
  now **Workshop view**, and all six third-person facilitator notes are
  relabelled "If you're running this as a workshop" (§11.5 — workshop wording
  lives behind the toggle).
- **Added** 12 assertions (93 total): layer order, footer placement,
  relabelling, plain-word labels, auto-fire-once semantics, no-auto-retry.

### Wave 7 — still open

Decision-sheet hand tests 1 (a no-right-answer case — Education or Justice)
and 2 (a shorter planted error) are still to run; either may move the
`IDEACHECK` thresholds. Decision 11's 22 fallback run strings and decision
12's "how it went" box (plan §9) are authoring/later work, and the notready
page could still use a self-serve wording pass (§11.7). Docs:
`Session-Sketch-wave7-results-page-plan.md`, `Session-Sketch-idea-prompt.md`
(+ `-joins.md`), `Session-Sketch-decision-sheet.md`, `HANDOFF-to-code-wave7.md`.

### Wave 4 — Next.js port (deferred)

Accounts, per-user persistence, model-driven conversation with the engine as
guardrail. Deliberately parked until the portal proves out with faculty; Wave 6
delivered its hosting slice early.

---

## [4.0.0] — 2026-08-18 · Wave 5: what AI is cast as

Rollback point for what came after: `Session-Sketch-v5-2026-08-18.html`.
Designed 17 Aug (`Session-Sketch-wave5-aijob-design.md`, §11 is the contract),
built 18 Aug per that contract.

- **Added** the casting dimension: twelve things AI can be cast as (`AIJOB`),
  each with its own wow, limit, failure line and named transferable skill —
  replacing the four hardcoded per-tag wow/failure pairs. Data single-sourced
  in `wave5-jobs.js`, inlined as script block 1a by `build-jobs-inline.js`
  (block count 7 → 8).
- **Added** non-scoring casting selection (`pickJob`/`jobLegal`/`WORRYJOB`/
  `refinePulls`): content gates first (skill legality, `output:none` excludes
  artifact-castings), worry tie-breaks, deterministic order. A casting can
  never move a tag.
- **Added** results-page casting card: derived pick + three alternatives
  (override via `data-job`), lift/limit/wow/failure rows, "only the human can"
  note; build prompt carries the casting's four lines.
- **Added** `wowOf`/`failOf`/`humanOf` accessors (casting wins, tag template is
  the fallback) and the five-slot arc (`ARC`/`ARCPHASE`) shared by all tags,
  with per-casting beat/task overrides (66 run strings authored).
- **Added** append-only override log (`S.a.joblog`), serialized into the
  ⬇ Save concept file; zero-casting `notready` gate; one-casting notice.
- **Changed** localStorage keys bumped: `snhu-session-sketch-v2`,
  `snhu-session-sketch-portal-v2` (schema gained `S.a.aijob` + `S.a.joblog`;
  old state starts fresh, no migration) — the breaking change this major is
  for.
- **Added** ten acceptance tests A1–A10 to the regression suite (scores
  byte-identical to 3.x; all green).
- **Deferred** per §11.1: failure-slot split (wrong/flat/narrow), cross-course
  casting variety, pattern-collapse, student reflection prompts, override
  reason field.

### Reference pages (17 Aug, alongside the Wave 5 design)

- **Added** `Session-Sketch-axis-grid.html` (`build-axis-grid.js`) — all 72
  (skill × output) cells with tag lead, failure kind, and every casting with
  its ruled-out reason; pulls lifted from the live engine at build time.
- **Added** `Session-Sketch-job-card.html` (`build-job-card.js`) — the twelve
  castings side by side, three landscape pages.

---

## [3.2.0] — 2026-08-17 · Wave 3 iteration 2: five faculty-requested tweaks

- **Added** "Why this question?" collapsible walkthrough blurbs on every portal
  question (`WHYQ`), written to be read aloud (future narration layer).
- **Added** subject-tailored course-code placeholders (`COURSEEG`).
- **Changed** the 90-minute option into **two class sessions**: third timing
  column relabeled `2-session`, build prompt gains an explicit two-meeting
  split instruction, all copy via `lenLabel()`.
- **Added** "⬇ Save concept" — writes the full styled concept to a standalone
  `lab-concept-<slug>.html`.
- **Added** the material-state question (ready vs. messy on purpose) —
  non-scoring, but drives the activity: per-material `openReady`/`beatReady`/
  `noteReady` variants, the protect-the-cleaning-step flag gates on messy, and
  the build prompt carries the state. Portal question count → 20 (21 with tool).

---

## [3.1.0] — 2026-08-13 · Wave 3: the conversational portal

- **Added** `Session-Sketch-Portal.html` — same engine, one-question-at-a-time
  chat: chips and inline composers, always-expanded axis grids with per-subject
  examples, three deterministic playback turns (topic/tool split, skill+output,
  planted-error reflection) each with *yes / let me fix that*, progress header,
  answered-so-far drawer replacing the wizard rail.
- **Added** the assembly model that avoids hand-editing generated HTML:
  `build-portal.js` lifts the engine + result blocks from the wizard
  byte-for-byte, drops the wizard renderer, stitches in `portal.css` +
  `portal.js`. Engine can never drift between the two files.
- **Added** tabbed results page (Recommendation / Activity / Build prompt /
  Session sketch) via inert `data-tab` markers in the shared `resultHTML()`;
  printing reveals all tabs.
- **Added** `Session-Sketch-Portal-smoke.js` — headless drive of the whole
  conversation; asserts the portal's verdict is identical to the wizard's.
- **Changed** subject families 15 → 19 (split Marketing / Sales /
  Communication & PR; History / English & Writing). Vocabulary only — subject
  never scores, regression untouched.

---

## [3.0.0] — 2026-08-12 · Wave 2: the kind split

Rollback point: `Session-Sketch-v4-2026-08-12.html`. Designed on paper first
(`Session-Sketch-wave2-design.md`), numbers validated in a throwaway prototype
(`Session-Sketch-wave2-prototype.js`), reviewed, then built.

- **Changed (breaking)** the single "what kind of thing is this topic?"
  question into two axes: **skill** (the how, 8 options incl. the new *make*
  skill) and **output** (the thing, 9 options incl. *"None — the point is the
  doing"*, which scores 0 so the skill axis decides alone). Skill carries all
  penalties; output is all positive pulls; together ~4 points.
- **Changed** conflict detection `conflictPair(kind, material)` →
  `conflictAxis(skill, output, material)`; headline conflict is *handle a
  situation* + *a working build*.
- **Changed** activity selection to key on `bestSkill`/`bestOutput` per pattern
  (was `bestKind`).
- **Changed** the regression suite itself: every case's `kind` became a
  `(skill, output)` pair — the suite definition was part of the deliverable.
  The pitch-off became a clean confident Compete (was a `two` tie); Joins'
  Create score became visible at 3.5 (the "it's also a build" half the single
  axis discarded — the reason Wave 2 exists).

---

## [2.1.0] — 2026-08-11 · Wave 1: round-3 fixes

Rollback point: `Session-Sketch-v3-2026-08-11.html`. Driven by the third
faculty test (Joins, real professor): *the engine was right and the writing was
wrong* (`Session-Sketch-round3-plan.md`).

- **Fixed** the hardcoded pattern-count line (W1-1) and print-stripped score
  bars (`print-color-adjust: exact`, W1-2).
- **Added** generic one-line `what:` blurbs to every pattern card, shown before
  the topic-filled pitch (W1-3).
- **Added** the optional working-tool question — splits the software out of the
  topic ("joins with MySQL"), feeds vocabulary and the build prompt, never
  scores (W1-4).
- **Added** per-subject unit→topic worked examples (`unitEg`) in the topic
  hint (W1-5).
- **Removed (scoring)** the audience question ("who is the thing for") —
  faculty read it as student level. Compensated: `COMPETE.rival` 3→3.5, `both`
  4→4.5; full regression re-run (W1-6).
- **Changed** topic echo hygiene: long topics capped to a short form on
  repeated surfaces (W1-7).
- **Changed** the results page to promote the **build prompt as the primary
  output**; the concept card is labeled a draft sketch; the prompt gains the
  customization-pass instructions (rephrase in the field's voice, adapt to the
  tool, vary topic references, never change structure) (W1-8).
- **Added** the stage question (introducing / reviewing / extending), carried
  into the build prompt.

---

## [2.0.0] — 2026-08-10 · The rebuild

The ground-up rework after the original tool mis-tagged the canonical Joins
case (told a database instructor to build an "hour-by-hour walkthrough of
Joins from inside one person's experience"; Research scored last). Reasoning in
`Session-Sketch-change-plan.md`. Shipped state preserved as
`Session-Sketch-v2-2026-08-10.html`.

- **Changed (breaking)** the scoring model: **content votes, preference only
  refines.** Raw material 2.5, error-catch method 2.5, topic kind up to 3 with
  penalties (technique pushes away from Simulate — the mechanism that fixes the
  Joins class of failure), preference questions 2 each, subject **never
  scores**.
- **Added** the three output states: `confident` / `two` / `notready` — the
  tool is allowed to say "not ready yet" with specific fixes, keeping every
  answer.
- **Added** tag override: honored, never silent, prints what the switch
  obligates.
- **Changed** Challenge → **Compete**, widened from a clock to *a clock or a
  rival* (realigning with the framework's Arena definition; the tag had been
  reachable in ~10% of cases).
- **Added** the subject families derived from the campus catalog (vocabulary
  and placeholders only), the planted-error follow-up, and the Research
  three-slot engine (anchor / planted error / evidence artifact).
- **Added** `Session-Sketch-One-Sheet.html`/`.pdf` — the 3-page paper version
  for workshops without laptops.
- **Added** the ten-case regression suite with canonical expected scores
  (Joins: Research 13.0 confident — if a change breaks Joins, revert it).
- **Removed** clinical examples (no nursing programs on campus), the friction
  question (cancelled out), non-US spellings.

---

## [1.0.0] — early August 2026 · The original tool

Single-file faculty intake wizard: subject, goal, competence, walk-out
artifact, stuck-points, raw material. One preference question effectively
decided the tag; content counted for almost nothing. Produced the Joins
failure that drove the rebuild. Preserved in the sibling `New folder` — kept
deliberately as the only copy that still reproduces the bug, for
before-and-after demonstrations.
