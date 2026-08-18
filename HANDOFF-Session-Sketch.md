# Handoff — SNHU AI Labs / Session Sketch

Written 10 August 2026, for picking this up on a new account. Everything needed to continue is in this folder; nothing lives only in the old chat.

---

## Start here

Paste this to your new assistant:

> I'm continuing work on Session Sketch, a faculty intake tool for the SNHU AI Labs series. Read `HANDOFF-Session-Sketch.md` and `Session-Sketch-change-plan.md` in this folder first, then `Session-Sketch.html`. The `snhu-ai-experience-framework` skill is the source of truth for the series. Don't edit the HTML with the Edit tool — see the gotcha in the handoff.

---

## What this is

**SNHU AI Labs** is the public series name: short, project-based workshops where students use AI to build something real and leave with a skill that lasts. Every Lab carries one of four tags, named for the artifact produced:

| Tag | Engine name (internal) | The artifact |
|---|---|---|
| **Create** | AI Studio | Something they made |
| **Research** | AI Lab | A conclusion plus its evidence trail |
| **Compete** | AI Arena | Something produced against a rival or a clock |
| **Simulate** | AI Quests | An experience someone else navigates |

"Lab" now means *any* session in the series. Research is the verifying tag and must never drift back to being called "Lab."

**Session Sketch** is the tool in this folder. A faculty member answers plain-language questions about their own course; it recommends a tag, picks a concrete activity, generates a one-page concept card, and emits a paste-ready build prompt that an AI uses to construct the actual session. It is not itself a session.

---

## Files in this folder

| File | What it is |
|---|---|
| `Session-Sketch.html` | **The wizard tool.** Multi-field, page-based intake. Always-current working copy of the *wizard*. Open in a browser; no build step, works offline. |
| `Session-Sketch-Portal.html` | **The conversational portal (Wave 3 prototype).** Same engine, one-question-at-a-time chat with playback turns, progress header and a review drawer. This is the version to put in front of a faculty tester. **Generated — do not hand-edit** (see below). Works offline in a browser. |
| `build-jobs-inline.js` | Regenerates Wave 5 **block 1a** in `Session-Sketch.html` from `wave5-jobs.js` (browser-safe `AIJOB`/`AIJOB_BY_KEY`/`ARC`/`ARCPHASE`; `jobsFor()` deliberately not copied — §11.4). Run after editing `wave5-jobs.js`, then `node build-portal.js`. Idempotent (replaces between `wave5-jobs` markers). |
| `portal.css` / `portal.js` / `build-portal.js` | **Source for the portal.** `build-portal.js` lifts the engine + result `<script>` blocks from `Session-Sketch.html` byte-for-byte, drops the wizard renderer, and stitches in `portal.css` (chat styles) + `portal.js` (chat renderer + playbacks + drawer). Edit these, then run `node build-portal.js` to regenerate the HTML. This is the clean way to change the portal without ever touching the fragile generated file. |
| `Session-Sketch-Portal-smoke.js` | Headless test for the portal: stubs the DOM, drives the whole conversation (answering + confirming playbacks), and checks the flow, the three playbacks, the drawer, and that the engine verdict is identical to the wizard's. `node Session-Sketch-Portal-smoke.js`. |
| `Session-Sketch-v2-2026-08-10.html` | Frozen snapshot of the same file. Don't edit. |
| `Session-Sketch-v3-2026-08-11.html` | Frozen snapshot taken just before Wave 1 of the round-3 plan landed. Don't edit. |
| `Session-Sketch-v4-2026-08-12.html` | Frozen snapshot taken just before Wave 2 (the kind split) landed. Don't edit. |
| `Session-Sketch-regression.js` | Runnable regression suite — the ten canonical cases (now `(skill, output)` pairs) plus two Wave 2 guards. `node Session-Sketch-regression.js`. |
| `Session-Sketch-wave2-design.md` | Wave 2 design-for-review: the two-question split, pull tables, conflict rewrite, regression analysis. The reasoning behind what shipped 12 Aug. |
| `Session-Sketch-wave2-prototype.js` | Throwaway validation harness used to design Wave 2's weights before building. Superseded by the live regression, kept for the rationale. |
| `Run-Wave2-Prototype.cmd` | Double-clickable runner for the prototype (points at the portable Node). |
| `_print_test.pdf` | Edge-headless print of the Joins result page, generated for the W1-2 print-bars check. Safe to delete. |
| `Session-Sketch-One-Sheet.html` / `.pdf` | Paper version, 3 pages, for workshops without laptops. The HTML is the editable source; the PDF is generated from it. |
| `Session-Sketch-One-Sheet-v2-2026-08-10.*` | Frozen snapshots. |
| `Session-Sketch-wave5-aijob-design.md` | **Wave 5 — what AI is cast as.** The next wave, designed and approved 17 Aug 2026, not yet built. Adds a casting dimension: twelve things AI can be cast as, each with its own wow, limit, failure and named transferable skill, replacing the four hardcoded per-tag wow/failure pairs. All nine review decisions are recorded in §8. **§11 is the implementation contract** — read §11.1 for scope first. Only remaining authoring is the 66 run strings named in §11.5. |
| `wave5-jobs.js` | **Wave 5 data — the single source of truth for the twelve castings.** Also holds `ARC`/`ARCPHASE` (the five-slot arc all four tags share) and `jobsFor()`, which is for the axis grid only and must not be copied into the engine (see §11.4). Required by both Wave 5 build scripts so they can never disagree. |
| `Session-Sketch-axis-grid.html` / `build-axis-grid.js` | All 72 (skill × output) cells, showing the axis-only tag lead, the failure kind available, and every casting drawn with its ruled-out reason. Click a casting to filter. **Generated** — `node build-axis-grid.js`. Lifts `SKILL`/`OUTPUT` out of `Session-Sketch.html` at build time, so the pull numbers are always the engine's own. |
| `Session-Sketch-job-card.html` / `build-job-card.js` | The twelve castings side by side — where AI genuinely helps, where it runs out, and the skill students can name. Three landscape pages. **Generated** — `node build-job-card.js`. |
| `CHANGELOG.md` | **Versions and history.** Release numbering, the snapshot-file mapping, and every wave with dates. `SKETCH_VERSION` in the engine must match its Unreleased/latest entry. |
| `Session-Sketch-v5-2026-08-18.html` | Frozen snapshot taken just before Wave 6/7 landed (the post-Wave-5 state). Don't edit. *(This is the file the Wave 7 handoff calls `_pre-wave6-backup.html` — renamed during the changelog work, byte-identity verified.)* |
| `wave7-ideas.js` | **Wave 7 source — the idea generator client.** Payload builder (§B2 translation), the Part-A prompt template, `getIdeas()` with both transports, the fourteen checks (`IDEACHECK` config block holds every threshold), the idea cards, Keep toggles, the two log lines. Edit this, never the copy in the HTML. |
| `build-ideas-inline.js` | Inlines `wave7-ideas.js` into the result script block and applies/reverts every inline edit with anchored, twice-idempotent replacements. Run after editing the source, then `node build-portal.js`. |
| `api/ideas.js` + `vercel.json` + `package.json` + `.vercelignore` | The hosted transport: a thin Vercel function holding the API key (env var `ANTHROPIC_API_KEY`), pinning the model, relaying ideas + token usage. `/` serves the portal, `/wizard` the wizard. |
| `Session-Sketch-ideas-test.js` | **Wave 7 harness — 81 assertions.** Part-A parity (anything the hand-tested prompt has that the built prompt lacks is a bug), all fourteen checks, drop-not-repair, log shapes, keep toggles, every degrade state, engine untouchability. `node Session-Sketch-ideas-test.js`. |
| `wave6-enrich.js` / `build-enrich-inline.js` | **Superseded** (Wave 6 rewrite overlay, built and replaced the same day — see CHANGELOG). The build script throws on run so it can't re-inject over Wave 7; both kept as the record and as the source of the revert strings. |
| `HANDOFF-to-code-wave7.md` + `Session-Sketch-idea-prompt.md` + `Session-Sketch-decision-sheet.md` + `Session-Sketch-wave7-results-page-plan.md` | The Wave 7 spec set: the scope change, Part A (the hand-tested prompt) and Part B (the build spec), the settled decisions, the three-layer page plan. |
| `Session-Sketch-change-plan.md` | The design reasoning: the Joins failure analysis, root causes, the 18 topic kinds, the 15 subject families, and the five decisions taken. **Read this second.** |
| `Session Sketches/` | Example outputs from real faculty sessions. |
| `_check_p2.png` | Leftover screenshot from a layout check. Safe to delete. |

An older pre-rebuild copy sits in the sibling `New folder`. Keep it — it is the only version that still reproduces the Joins bug, which is useful for showing before-and-after.

---

## How the tool works

One self-contained HTML file: inline CSS, vanilla JS, no dependencies except the Inter webfont. **Seven `<script>` blocks, and the order matters** — each block's data must be defined before the block that uses it.

| Block | Contains |
|---|---|
| 1 | `SUBJ` (19 subject families + other), `SKILL` (8) / `OUTPUT` (9) — the two-axis kind split, `KINDEG_SKILL` / `KINDEG_OUTPUT` (per-subject examples), `CATCHWAY` (5), `COMPETE` (4) |
| 1a | **Wave 5** — `AIJOB` (12 castings) + `AIJOB_BY_KEY`, `ARC` / `ARCPHASE`. Inlined from `wave5-jobs.js` by `build-jobs-inline.js` (do not hand-edit; re-inline after editing the source). |
| 2 | `MAT` (7 raw materials incl. a no-material option, each with a scoring `pull`) |
| 3 | `PAT` — activity patterns: Create 3, Research 5, Compete 6, Simulate 3 |
| 4 | `TYPES` (the four tags) and `STEPS` (the whole intake definition) |
| 5 | `T` — per-tag session templates: skill, wow, failure, human contribution, phases, roles, AI skill moments, reflection |
| 6 | State, `score()`, `flags()`, `concept()`; **Wave 5** casting selection (`pickJob` / `jobLegal` / `WORRYJOB` / `refinePulls`), the `wowOf`/`failOf`/`humanOf` accessors, and the override log (`logDerived` / `applyJobPick`). |
| 7 | Rendering, event handlers, `resultHTML()`, `buildPrompt()` |

State persists in `localStorage` under `snhu-session-sketch-v2` (bumped from v1 for Wave 5, which added `S.a.aijob` and `S.a.joblog`; the portal uses `snhu-session-sketch-portal-v2`). On a missing key it starts fresh rather than migrating.

### The scoring model — the important part

The failure this tool was rebuilt to fix: the content the faculty member described counted for nothing, and one preference question decided everything. Now **content votes and preference only refines.**

| Input | Weight | Notes |
|---|---|---|
| Topic **skill** (Q-A) | up to **2** | Wave 2 split the single "kind" into two questions. The skill axis carries **all the penalties** — *perform a technique/calculation* pushes *away* from Simulate (−1.5), *handle a situation* away from Create (−1). That negative is the mechanism that fixes the Joins class of failure. |
| Topic **output** (Q-B) | up to **2** | The other half of the old kind. **All positive pulls.** Includes a *"None — the point is the doing"* option that scores 0, so Q-A decides alone (a titration, a live negotiation). Skill + output together weigh ~4, up slightly from the old kind's 3 — offsets the audience question removed in W1-6. |
| Raw material | **2.5** | Most reliable signal — faculty can't get it wrong. |
| How the error is caught | **2.5** | Also names the Research pattern outright. |
| Competing — rival or clock | rival 3.5, clock 3, both 4.5 | `neither` subtracts 4 and rules Compete out. Rival/both raised half a point in round 3 to compensate for the audience question's removal. |
| The two preference questions | 2 each | Refine only. The audience question ("who is the thing for") was removed in round 3 (W1-6) — faculty read it as student level. |

**Wave 2 (the kind split), built 12 Aug 2026.** The single "What kind of thing is this topic?" became two questions: **skill** (the how, 8 options incl. *"Design, build, compose, or prove something new"* — the making skill added for accessibility) and **output** (the thing, 9 options incl. *None*). Conflict detection moved from `conflictPair(kind, material)` to `conflictAxis(skill, output, material)` — headline conflict is a people-skill (*handle a situation*) with a *working build* output. Activity selection now keys on `bestSkill`/`bestOutput` per pattern (was `bestKind`). Full design rationale and the per-cell pull tables are in `Session-Sketch-wave2-design.md`; the throwaway validation prototype is `Session-Sketch-wave2-prototype.js`.
| Worry about AI | 0.5–1 | A nudge. |
| **Subject** | **0 — never scores** | Vocabulary and placeholders only. Subject does not predict the tag: Education contains a technique, a situation, and a contested claim set. |
| What happens in class now | 0 | Intended as a gate, not points. Captured and passed to the build prompt; **the gate logic is not yet implemented.** |

### Three output states

`score()` returns `state` as one of:

- **`confident`** — one tag clear. Recommend it.
- **`two`** — top two within 1.5 points. Names the other candidate.
- **`notready`** — a build slot is missing. Shows what to change and keeps every answer. Triggers: no planted error; topic still a whole unit; skill/output/material axis conflict (see `conflictAxis()`, Wave 2 — e.g. *handle a situation* + *a working build*); or nothing scoring above 4.

Faculty can override the tag. Overrides are honored, never silent, and print what the switch obligates them to add.

---

## Decisions already taken — treat as settled

1. **Three output states**, not one. The tool is allowed to say "not ready yet" with specific fixes.
2. **The subject families** (19 as of 13 Aug 2026, plus "other") derive from the campus catalog, grouped by shared vocabulary rather than by college. They are *not* scoring inputs — subject only supplies vocabulary, examples and the placeholder text — so splitting or merging them is safe and never touches the regression. Split 13 Aug: *Marketing, Sales & Communication* → Marketing / Sales / Communication & PR; *History, English & Writing* → History / English & Writing. To add or split more, edit `SUBJ`, `SUBJORDER`, and the per-subject `KINDEG_SKILL`/`KINDEG_OUTPUT` example maps, then rebuild the portal.
3. **Challenge was renamed Compete**, and its condition widened from a clock to *a clock or a rival*. This brought the tool back in line with the framework, whose Arena definition always included head-to-head competition — the tool had only ever asked about clocks, which is why the tag was reachable in about 10% of cases.
4. **Override allowed, never silent.**
5. **Topic kind renders as all eighteen visible** under four cluster headings, one click. Viable because subject is answered first and shortens every example.

Also settled along the way: no nursing programs on campus, so all clinical examples were removed; US spellings throughout; and the friction question ("where do students get stuck") was cut because every option was true of every class and the effect cancelled out.

---

## Waves 6–7 — the idea generator (built 18 Aug 2026, version 5.0.0-dev)

Wave 6 (an AI pass that rewrote the template wording) was built, then superseded the same day by Wave 7 before it ever released: faculty feedback showed a rewritten template is still a template. What ships now: **the engine decides the type and casting and states the rules; Claude invents three activity ideas; the fourteen checks reject any that fail.** A failing idea is dropped, never repaired. Scoring is untouched — the regression is the proof.

- **Where things live:** `wave7-ideas.js` (client source) → `node build-ideas-inline.js` → `node build-portal.js`. Server: `api/ideas.js`. Tests: `node Session-Sketch-ideas-test.js` plus the regression and the portal smoke — run all three after any change.
- **Transports** (one function, `getIdeas()`): the hosted `/api/ideas` when the page is served; or paste an API key into `localStorage["snhu-sketch-key"]` for direct browser calls (works from `file://`). No key and no origin → the tool behaves exactly as before, and says so plainly.
- **Deploying:** push this folder to GitHub → import in Vercel → Settings → Environment Variables → `ANTHROPIC_API_KEY` (Production + Preview) → deploy. The key never appears in the repo or the browser. `.vercelignore` keeps snapshots/sources/tests off the CDN.
- **Versioning:** `SKETCH_VERSION` ("5.0.0-dev") is set by `build-ideas-inline.js` (edit it there, re-run, rebuild portal). It prints in the results footer, every build prompt, every saved concept, and every `ideas`/`ideaKeep` log entry. Bump to `5.0.0` at release and move the CHANGELOG's Unreleased section under it.
- **Tunables:** every check threshold sits in the `IDEACHECK` block at the top of `wave7-ideas.js` — the two outstanding hand tests (no-right-answer case; shorter planted error) are expected to move them.
- **Still open (Wave 7):** the two hand tests; the three-layer results-page restructure (plan §6); the 22 fallback run strings (decision 11); the "how it went" box (decision 12).

## Outstanding work

Roughly in the order I'd tackle it.

| # | Item | Notes |
|---|---|---|
| 0 | ~~Build Wave 5 (the casting dimension)~~ **✅ BUILT 18 Aug 2026** | Shipped per the §11 contract: `AIJOB` inlined as block 1a (from `wave5-jobs.js` via `build-jobs-inline.js`); all 66 run strings authored; `pickJob`/`jobLegal`/`WORRYJOB` selection (non-scoring); `wowOf`/`failOf`/`humanOf` accessors; results-page casting card with the derived pick + three alternatives (data-job override) + lift/aiskill rows; build prompt carries the casting's four lines; `notready` zero-casting gate + one-casting notice; append-only override log (`S.a.joblog`) serialized into the ⬇ Save concept file. Regression is byte-identical (A1) and A2–A10 all pass. **Deferred exactly as §11.1 says:** failure-slot split into wrong/flat/narrow (8.4), cross-course casting variety (8.6a — only the static results-page line shipped), pattern-collapse (8.1), student reflection prompts, and the one-line override-reason field. |
| 1 | **Update the framework skill to say Compete** | The skill's rename table still says Challenge. The tool and one-sheet say Compete. These will drift apart within a week if not reconciled. The skill is the source of truth, so either change it or change the tool back. **Highest priority — it's a consistency bug, not a feature.** |
| 2 | **Subject-specific topic-kind examples** | Subject currently drives the planted-error placeholder and the build prompt's vocabulary. The eighteen topic kinds still show cross-discipline examples. Full population is 18 × 15 ≈ 270 short strings; the catalog is concentrated enough that Business, Education, Justice, History/English and Computing get most of the value. |
| 3 | **Create's patterns are samey** | Brand identity, a database schema and a lesson plan all default to "The real deliverable." Defensible but thin next to Research's five and Compete's six. Needs two or three more Create patterns, or narrower `bestKind` lists. |
| 4 | **The `two` state is a nudge, not two framings** | It names the other candidate but still renders one concept card. The decision was to show *both* framings side by side and let faculty pick. Not built yet. |
| 5 | **Current-practice gate** | Decided but unimplemented: suppress activities that duplicate what the class already does. |
| 6 | **Page 1 is untested with real faculty** | It now carries subject, course, topic, current practice, topic kind, material, length and size. This is the biggest usability risk in the whole design. Watch one Business or Education faculty member go through it cold before adding anything else. |
| 7 | **Prefix pre-selection** | Guess the subject from a typed course code (NUR, CIS, ACC). Needs the catalog's prefix-to-program export. Should only ever pre-select, never decide. Skip if the export is awkward. |
| 8 | Smaller open questions | Does Sport Management need its own nouns? Should Mathematics & Physics merge into Natural & Health Sciences? The tool offers 90 minutes but the framework's design system specifies a 50/75 toggle only. |

---

## The regression suite — run this after any scoring change

Ten canonical cases plus two Wave 2 guards, **and the ten Wave 5 acceptance tests A1–A10** (§11.9: casting never moves a tag, no-ground-truth skills never get the Oracle, `output:none` excludes artifact-jobs, the override log, etc.). All pass as of 18 Aug 2026. The harness now expects **8** script blocks (the original 7 plus Wave 5 block 1a). **The full answer sets and a runnable harness live in `Session-Sketch-regression.js`** — run `node Session-Sketch-regression.js` from this folder (on this machine Node is at `%LOCALAPPDATA%\nodejs-portable\node-v22.12.0-win-x64\node.exe`; there is no working Python). Each case's old single `kind` is now a **(skill, output)** pair. Expected scores below are the post-Wave-2 numbers.

| Case | (skill, output) | Material | Must land | Expected (Cr / Re / Co / Si) | State |
|---|---|---|---|---|---|
| Joins / CIS-255 | perform, build | dataset | **Research** — Execute and Verify | 3.5 / **13.0** / −3.5 / −1.0 | confident |
| A disruptive classroom | situation, experience | case | **Simulate** | −0.8 / 0.8 / −2.3 / **13.5** | confident |
| Minimum wage and employment | interpret, finding | claims | **Research** — The Source | 0.3 / **13.8** / −3.3 / 0.8 | confident |
| Brand identity for a small business | make, designed | made | **Create** | **11.0** / 2.3 / −3.0 / 1.8 | confident |
| A database schema | make, plan/spec | made | **Create**, and must not reuse the Joins activity | **10.0** / 2.5 / −3.0 / 1.8 | confident |
| Choosing a significance test | perform, finding | dataset | **Research**, and must not read like the SQL session | 1.5 / **13.5** / −4.0 / −0.8 | confident |
| A live intrusion | process, decision | process | **Compete** | 0.8 / 0.3 / **13.8** / 4.3 | confident |
| Pitching for a seed fund | judgment, plan/spec | made | **Compete** ranked first | 6.0 / 1.3 / **10.0** / 1.5 | confident |
| Plea negotiation | situation, decision | case | **Compete**, not Simulate | −1.0 / 0.5 / **13.3** / 5.5 | confident |
| Writing a lesson plan | perform, plan/spec | made | **Create**, and must *not* reach Compete | **9.0** / 4.3 / 3.5 / 0.3 | confident |
| *[guard]* situation + working build | situation, build | case | **notready** (axis conflict fires) | 1.0 / 2.3 / −1.8 / 11.5 | **notready** |
| *[guard]* titration + none output | perform, **none** | dataset | **Research** (Q-A decides; output scores 0) | 1.5 / **11.5** / −4.0 / −1.0 | confident |

The pitch-off is now a clean *confident* Compete (10.0 vs Create 6.0). Under Wave 1's single axis it was a `two` tie (8.5/8.0); the two-axis split pulled the plan-output's Create share and the judgment-skill's arena share apart. Plea negotiation now picks the **Head-to-head negotiation** activity (Wave 1 picked The adversarial pair) — a better fit for a plea, and allowed since the case only asserts Compete-first / not-Simulate.

**Joins is the canonical case.** Before the original rebuild it produced "build an hour-by-hour walkthrough of Joins from inside one person's experience" as a Simulate, with Research last. It now produces Research / Execute and Verify at **13.0**, Simulate at −1.0 — and, crucially, Create is now visible at **3.5** (was 0.5 under the single axis): that number is the "it's also a build" half the old single kind discarded, which is exactly why Wave 2 exists. If a change breaks Joins, revert it.

---

## Working on the file — read before editing

**Don't use the Edit tool on `Session-Sketch.html`, or on any long generated file.** (It also silently truncated the tail of `build-axis-grid.js` on 17 Aug 2026 — this is not limited to the big HTML.) It silently truncated the file's tail several times during this build, losing everything after the edit point. Use a shell heredoc with Python string replacement and an assertion on every anchor, then verify byte count and that the file still ends with `</html>`.

**The portal (`Session-Sketch-Portal.html`) is generated — never edit it directly.** Edit `portal.css` / `portal.js`, then run `node build-portal.js`. The builder re-lifts the engine from `Session-Sketch.html`, so any scoring change made to the wizard's blocks 1–5 flows into the portal automatically on the next build — the two files can never drift on the engine. After building, run `node Session-Sketch-Portal-smoke.js`. Node on this machine is at `%LOCALAPPDATA%\nodejs-portable\node-v22.12.0-win-x64\node.exe`. (There is no `file://` access from the sandboxed browser; to preview, serve the folder over HTTP — a two-line `http.createServer` on any port works.)

**Testing without a browser.** Extract the script blocks, stub the DOM, and run the logic in Node:

```bash
python3 -c "
import re
s=open('Session-Sketch.html',encoding='utf-8').read()
b=re.findall(r'<script>(.*?)</script>', s, re.S)
open('_b.js','w',encoding='utf-8').write(chr(10).join(b).replace('\"use strict\";',''))
print('blocks',len(b))"
node --check _b.js
```

Then stub `document`, `window`, `localStorage`, `navigator`, `Blob` and `URL`, eval `_b.js`, set `S.a = {…answers…}`, and call `score()`, `concept()`, `resultHTML()` or `buildPrompt()` directly. This catches everything except CSS layout.

**Checking layout without a browser.** Render the result HTML into a standalone page with the tool's own styles, then WeasyPrint it to PDF and view the pages as images. Note WeasyPrint doesn't support CSS grid or run JavaScript, so grids and score bars look broken in the preview but are fine in a real browser.

**Two traps that bit me.** Searching for a short key like ` text:{label:"` matches the KIND block before the MAT block and silently writes to the wrong object — always scope replacements to the block you mean. And em dashes in the source are literal `—`, not `—`, so anchor strings must match exactly.

**Regenerating the one-sheet PDF:**

```bash
pip install weasyprint --break-system-packages -q
python3 -c "from weasyprint import HTML; HTML(filename='Session-Sketch-One-Sheet.html').write_pdf('Session-Sketch-One-Sheet.pdf')"
```

The paper sheet is tightly fitted to three pages. Adding a question will push it to four, so remove something of similar height or accept the extra page.

---

## Context to bring across

- **Skills:** `snhu-ai-experience-framework` (source of truth), `snhu-brand-kit` (ATSD tokens — Ink Blue `#00244e`, Golden Yellow `#fdb913`, 4px radius, flat cards, no shadows), `snhu-strip-it-down` (the skeleton/swap split this tool implements), and the Lane 1 and Lane 2 skills.
- **The campus program list**, which the fifteen subject families were derived from. Reproduced in the change plan's section 3c with each program mapped.
- **The Joins output PDF** if you still have it — it is the clearest single artifact showing why the rebuild was needed.
