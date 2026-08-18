# Session Sketch — round-3 change plan

Written 11 August 2026, after the third faculty test (Joins, CIS-255, real topic, real professor). Inputs: `Joins pt 3 - SNHU AI Labs.pdf`, the tester's notes, and the decisions taken in conversation the same day. This plan supersedes items 3, 4 and 6 of the handoff's outstanding-work list and absorbs the rest.

---

## 1. What round 3 showed

The engine was right and the writing was wrong. That is the headline, and it drives everything below.

| # | Finding | Evidence |
|---|---|---|
| F1 | **Scoring worked.** Research 10.0, Simulate 2.0, Create 1.5, Compete −4.0; Execute and Verify chosen; the two override rules printed correctly. | PDF pp. 1–2 |
| F2 | **The topic string is echoed verbatim everywhere.** The professor typed "Writing joins with mySQL" and every pitch, run-step and artifact line repeats it word for word — "the raw data on Writing joins with mySQL," "a verified result on Writing joins with mySQL." Reads mechanical, and the tool name is trapped inside the topic. | PDF pp. 1, 4 |
| F3 | **Pattern cards never say what the pattern is in general.** Every card is topic-filled only. A professor comparing "Execute and Verify" to "The Data" sees two Joins sentences, not two shapes of session. | PDF p. 4; tester note 1 |
| F4 | **Count bug.** "Three activities carry the Research tag, one per anchor" — Research has had five since the rebuild. The line is hardcoded `Three/Four`. | PDF p. 4 |
| F5 | **Print bug.** Score bars render as empty outlines in the PDF — print CSS strips the bar fills. | PDF p. 2 |
| F6 | **The topic question needs worked examples.** "If the unit is X, the topic would be Y," per subject. The professor needed the unit→topic move demonstrated, not described. | Tester note 1 |
| F7 | **Current-practice question is missing the stage.** Introducing the topic, reviewing it, or extending it are three different Labs added onto three different classes. Free text doesn't reliably capture it. | Tester note 2 |
| F8 | **Topic kind forces one axis over two.** Joins is a technique (the how) *and* produces a working query (the output). The single choice loses half the truth and the activity language with it. | Tester note 3 |
| F9 | **The audience question misleads.** "Who is the thing they walk out with actually for?" was read as *student level*, not artifact audience. | Tester note 4 |

## 2. Root causes

**The template has one move.** `fill()` substitutes `{t}` and `{m}` into fixed sentences. It cannot shorten a long topic, split a tool name out, vary phrasing across nine consecutive uses, or speak MySQL. Everything in F2–F3 traces here. No amount of better template writing fully escapes it — which is why the AI-role decision below matters more than any single fix.

**One question is carrying two answers.** The topic field carries topic + tool (F2); the kind question carries skill + output (F8). Both fixes are splits.

**Questions were written from the designer's seat.** "Who is it for" is a clean design axis and a bad survey question (F9). The test for every question going forward: what would a tired professor who has never seen the framework think this asks?

## 3. Decisions taken — settled

1. **Interface direction: conversational.** The portal becomes a one-question-at-a-time conversation (Direction A of `UX-direction-mockups.html`): questions asked in sequence, examples in-line, answers acknowledged and played back ("so the topic is joins, worked in MySQL"). The playback move is the structural fix for the whole F9 class of misreads.
2. **AI role: hybrid now, AI-native as the destination.** While testing: the deterministic engine keeps deciding (tag, pattern, phases — all regression-testable) and AI does the writing, via a build prompt promoted to the star of the results page. Once finalized: AI-native, where the conversation itself is model-driven and the concept is written custom.
3. **Deployment trajectory: Vercel + Supabase login once finalized.** The single-file offline HTML remains the vehicle for the testing phase. The conversational prototype should be built so its engine and content data port cleanly into a Next.js app later — engine as data + pure functions, rendering as a swap surface (already true today).
4. **The audience question is removed** (tester decision). Not reworded, not replaced. Consequences handled in W1-6 below.
5. **The kind split is designed on paper first** (section 5), built only after review.

## 4. The work, in waves

### Wave 1 — fixes to the current tool (ship while the portal is designed)

| # | Change | Detail | Risk |
|---|---|---|---|
| W1-1 | Fix the pattern-count line | Derive from `c.pats.length`, and drop "one per anchor" when untrue. | Trivial |
| W1-2 | Fix print bars | `print-color-adjust: exact` on `.sb .bar i` (and the verdict block while at it). Regenerate a test PDF. | Trivial |
| W1-3 | Generic pattern blurbs | Each pattern gains a one-line `what:` — what this pattern *is*, no placeholders ("AI produces output that looks right; students catch it by running it"). Cards show `what` first, topic-filled pitch second. Also fixes the "Why this type" sentence, which currently explains nothing a first-timer can use. | Low |
| W1-4 | Split tool out of topic | New optional field on page 1: "Is there a specific tool students use for this?" Feeds vocabulary and the build prompt only — never scores. Topic hint text updated to say *the skill, not the software*. | Low |
| W1-5 | Unit→topic worked examples | `SUBJ` gains per-subject `unitEg` pairs: "If the unit is **database design**, the topic might be **joins**." Rendered into the topic question's hint, switching with subject like the kind examples now do. 15 pairs to write. | Low |
| W1-6 | Remove the audience question | Drop `holding` from STEPS, `score()`, and the audience-override flag. **Rebalance required:** without holding's +2, the pitch-off regression case ties Create 8.0 / Compete 8.0 and sort order would hand it to Create. Proposed compensation: `COMPETE.rival` 3→3.5, `both` 4→4.5 (clock unchanged). Rerun the full suite; the pitch-off may legitimately land in the `two` state — acceptable as long as Compete ranks first. | Medium — every score shifts by up to 2 |
| W1-7 | Topic echo hygiene | Deterministic half-fix for F2: cap the echoed topic at its first few words where it repeats, mention the tool once (from W1-4) instead of never-or-every-time. The real fix is W1-8. | Low |
| W1-8 | Promote the build prompt (the hybrid) | Results page reframes: the concept card is labeled a **draft sketch**; the build prompt becomes the primary output ("this is where your Lab gets written"). The prompt itself gains instructions AI needs for the customization pass: rephrase all template language in the field's own voice, adapt activity language to the named tool (W1-4), vary topic references naturally, and keep the framework's build slots fixed. | Low build, high perceived-quality gain |

Wave 1 order: W1-1/2 first (minutes), then W1-6 (touches scoring — full regression run), then W1-3/4/5/7/8 (content, no scoring).

### Wave 2 — the kind split ✅ BUILT 12 Aug 2026

See section 5. Designed on paper (`Session-Sketch-wave2-design.md`), reviewed, approved, and built into the tool. The single kind question became two — skill (8 options, incl. an added *make* skill for accessibility) and output (9, incl. *None*). Scoring split skill 2 / output 2; `conflictPair`→`conflictAxis`; pattern selection re-keyed to `bestSkill`/`bestOutput`. Regression suite rewritten to `(skill, output)` pairs, all green.

### Wave 3 — the conversational portal (prototype) ✅ BUILT 13 Aug 2026

A new single-file HTML — `Session-Sketch-Portal.html` — same engine (script blocks 1–5 lift across **byte-identical**), chat renderer instead of the wizard. Everything below shipped and is verified (`Session-Sketch-Portal-smoke.js`, all green; the ten-case regression gives identical scores because the engine bytes are unchanged):

- ✅ One question per turn; chips for radio-type answers, free text (inline composer) for the rest. The two axes (skill 8 / output 9) render all options inline as stacked cards with per-subject examples — this is the "Show all…" grid, now always expanded in the conversation.
- ✅ **Playback turns** after consequential answers: topic/tool split confirmation (splits the tool name back out of the topic, live), skill/output ("kind") confirmation, planted-error reflection. Each playback is a deterministic template keyed off the answer (`pbText()`) — exactly the seam where AI-native slots in later. Each offers *Yes, that's right* / *Let me fix that*.
- ✅ A persistent compact header (subject · course · N of M answered, with a progress bar).
- ✅ An answered-so-far drawer for revisions, replacing the wizard rail. Tapping any past answer (or a playback's *fix*) opens the drawer at that field; edits update the concept live.
- ✅ Results render on their **own page** (swaps in for the chat window; masthead stays) rather than as a long scroll, broken into **four tabs** — Recommendation (verdict + why + score bars + change-tag), Activity, Build prompt, Session sketch — with a persistent header (tag + title) and a "← Change my answers" button that returns to the conversation with the review panel open. The chat's final turn has a "See your concept →" button; the active tab persists across tag/pattern overrides and the round-trip. Reuses `resultHTML`/`buildPrompt`/`wireResult` verbatim: each top-level section just carries a `data-tab` marker (added 13 Aug, inert in the wizard) and the portal groups them into panes. Printing reveals all tabs, so the printout is still the full one-pager.
- ⏳ **Faculty test: one Business or Education faculty member cold, same protocol as this round.** This is the point of the prototype and the only remaining Wave 3 item.

**Iteration 2 (17 Aug 2026).** Five faculty-requested tweaks, all inside Wave 3:
- **Walkthrough blurbs** — every question in the portal has a collapsible "Why this question?" note (the `WHYQ` map in `portal.js`), written to be read aloud. *Not yet wired to audio:* the eventual ElevenLabs narration pass layers onto these strings once the copy is approved (needs an API key + external calls, so deliberately deferred).
- **Subject-tailored course examples** — the course field's placeholder now shows a subject-appropriate course (the `COURSEEG` map in `portal.js`). Codes are illustrative; tune to the catalog when available.
- **"Two class sessions"** replaced the 90-minute option (engine). Chosen model: split one Lab across two meetings with a recap — the build prompt now carries an explicit two-session split instruction, the third timing column is relabeled `2-session`, and all faculty-facing copy uses `lenLabel()`.
- **Save the concept** — the results page header has a "⬇ Save concept" button that writes the whole concept (all tabs, styled, facilitator notes per the toggle) to a standalone `lab-concept-<slug>.html` file.
- **Material state split** — a new *non-scoring* question after raw material: "ready to use" vs. "messy on purpose." It genuinely drives the **activity**, not just copy: each of the six raw materials now has a `openReady`/`beatReady`/(data)`noteReady` variant, and `concept()` picks by `matstate`, so clean data opens with "getting oriented… then putting it straight to work" instead of "what has to be cleaned before it can be used at all." It also gates the "protect the cleaning step" flag (messy only), adds the `Raw material state:` line to the build prompt, and shows in the sketch — never the tag, so the regression is untouched. Portal question count is now 20.

**How it's built (and why).** The portal is *assembled*, not hand-written: `build-portal.js` reads `Session-Sketch.html`, lifts the engine and result `<script>` blocks unchanged, drops the wizard renderer, and stitches in `portal.css` + `portal.js` (the chat layer). This sidesteps the Edit-tool truncation gotcha entirely — never edit `Session-Sketch-Portal.html` by hand; edit `portal.css`/`portal.js` and re-run `node build-portal.js`. It also delivers the plan's Next.js portability requirement for free: engine = data + pure functions (untouched), rendering = swap surface (`portal.js`).

### Wave 4 — AI-native + deployment (after the portal proves out)

- Port to Next.js on Vercel; Supabase auth; sketches persist per user (replacing localStorage), which also finally gives real telemetry on where faculty stall.
- The conversation becomes model-driven server-side: the model interprets each answer, asks the follow-up a designer would, and writes the concept custom. The deterministic engine does not disappear — it becomes the guardrail: the model proposes, the engine's scoring and override rules check, disagreements surface as questions, and the regression suite runs against the engine's verdicts as today.
- Out of scope until then: accounts, hosting, model choice, cost. Decide when Wave 3's test says the conversation shape works.

## 5. The kind split — design for review

**The two questions** (replacing the single "What kind of thing is this topic?"):

> **Q-A. The skill — what is it students are learning to do here?** *(the how)*
> - Perform a technique or procedure that has a right and wrong way
> - Run a calculation or model that produces a number
> - Apply a regulation, standard, or required form
> - Operate a tool, platform, or system
> - Handle a situation or interaction with people in it
> - Run a process or workflow across people and steps
> - Make a judgment call with no clean answer
> - Interpret, argue, or contextualize — texts, claims, events
>
> **Q-B. The output — what would students actually produce?** *(the thing)*
> - A working build (it runs or it doesn't)
> - A verified finding with its evidence
> - A plan, proposal, or spec
> - A designed piece (a brief answered)
> - A document in a required form
> - A profile of a population or market
> - A decision, committed and defended
> - An experience someone else can move through

Eight and eight, each with per-subject examples exactly as the 18 kinds have now (`KINDEG` restructures into two maps; the writing carries over, roughly half to each axis).

**Scoring.** Weight 3 splits: skill-axis 2, output-axis 2 (total content voice rises slightly, preference total having fallen with W1-6 — net balance roughly preserved). Penalties live on the skill axis, as today: *perform a technique* and *run a calculation* still push away from Simulate (−1.5 each); *handle a situation* still pushes away from Create. The output axis is all positive pulls.

**Why this fixes Joins' half-truth:** skill = *perform a technique* (pulls Research), output = *a working build* (pulls Create and Research). Research leads on the pair, and the activity language finally knows both facts: verify by executing, and the thing executed is a build. Under the current single axis the professor had to discard one of those.

**Conflict logic** gets richer and honest: skill *handle a situation* + output *a working build* is the new material/kind conflict shape; the `conflictPair()` table rewrites in axis terms (draft table to be produced with the implementation, tested against all 10 cases plus 4 new two-axis cases: Joins-as-build, disruptive-classroom + formdoc/IEP, pitch + plan, schema + technique).

**Open question for review:** does Q-B need "none — the point is the doing" for pure-performance topics (a negotiation, a titration)? Current lean: yes, scoring 0, so Q-A alone decides — otherwise faculty invent an output to satisfy the form, which is the F9 failure pattern again.

## 6. Regression implications

- W1-6 (audience removal) and the compete reweight change every case's numbers. Must-land tags must hold for all ten; pitch-off may drop to the `two` state with Compete ranked first — record the new expected scores in the handoff table when it lands.
- Wave 2 replaces `kind` in every regression case with a (skill, output) pair — the suite definition itself is part of the Wave 2 deliverable.
- The harness (extract blocks → stub DOM → Node) carries over to the portal unchanged as long as the engine stays in its own blocks. Keep it that way.

## 7. Relation to the handoff's outstanding list

| Handoff item | Status after this plan |
|---|---|
| 1. Skill says Compete | Done (round 3, pre-test) |
| 2. Subject-specific kind examples | Done; extends to unitEg (W1-5) and restructures in Wave 2 |
| 3. Create patterns samey | Absorbed: W1-3's generic blurbs reduce the sameness symptom; the output axis (Wave 2) is the real fix — different outputs stop defaulting to one pattern |
| 4. `two` state side-by-side framings | Deferred to the portal (Wave 3), where "two candidates" becomes a conversational fork |
| 5. Current-practice gate | W1's stage select (F7) supplies the missing input; gate logic lands with it |
| 6. Page 1 untested | Overtaken: the portal replaces page 1; test protocol moves to Wave 3 |
| 7. Prefix pre-selection | Unchanged, low priority; natural fit as a portal playback ("CIS — that's usually Computing & Software, yes?") |
| 8. Smaller questions | Unchanged |

**Missing from the waves above but noted:** F7's select needs wording — proposed: "When this Lab runs, will students be **meeting the topic for the first time**, **reviewing it**, or **pushing past what class covered**?" Feeds the gate and the build prompt; never scores.
