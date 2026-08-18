# Session Sketch — change plan

Working document. Nothing below is built yet. Case study is **CIS-255 Applied Data Structure and Database / topic: Joins**, which the tool tagged **Simulate** and should have tagged **Research**.

---

## What happened with Joins

Reverse-engineered from the scores and flags on the output:

| Intake answer | What the faculty member said | Weight today | Proposed weight |
|---|---|---|---|
| Goal for students | Understand it well enough to teach someone else | **3 — decided the outcome** | 2, and the option gets rewritten |
| Competence on the job | Producing work | 2 (to Create) | 1 — it describes the field, not the session |
| What they walk out with | A decision log | 2 (to Compete) | 2 — keep, it is the audience axis |
| Where students get stuck | One tick in each of the four columns | +1.5 to all four — **cancelled out** | 0 — cut or replaced |
| Raw material | A dataset | **0** | **2.5** |
| Topic kind *(new question)* | A technique with a right and wrong way to do it | — | **3, plus a penalty against Simulate** |
| Planted error | Picking the correct join type and what field connects the tables | **0** | **2.5, via a new follow-up** |
| What happens now | Pre-class lecture, then practice problems in MySQL | **0** | a gate, not points |

Final: Simulate 4.5, Create 3.5, Compete 3.5, **Research 1.5 — last place.**

Under the proposed weights the same answers produce **Research 8.0, Compete 2.0, Create 1.0, Simulate 0.0** — decisive, and decided by the content rather than by one preference question.

The output then told a database instructor to have students "build an hour-by-hour walkthrough of Joins from inside one person's experience" and "reconstruct one single scene where Joins is playing out."

The faculty member handed the tool a textbook Research / The Data lab and it was scored out of contention.

---

## Root causes

### 1. The content does not vote

Only the three preference questions and the friction ticks affect the tag. Material, topic, planted error, and current classroom practice are captured, displayed, and then ignored by the decision. A dataset contributed nothing toward Research.

**All four need weight.** How each one earns it:

**Raw material — 2.5, direct pull.** The material is the most reliable signal in the whole intake because faculty cannot get it wrong; they either have a dataset or they do not. A dataset pulls to Research, a case to Simulate, something made to Create, competing claims to Research, a process to Simulate or Compete, documents to Research.

**Topic kind — 3, with a penalty.** The heaviest weight, because it is the one thing that determines whether the activity language will even make sense. It also needs to subtract: a technique with a right answer should actively push *away* from Simulate, which is what would have stopped the Joins result. Pure positive scoring cannot do that.

**Planted error — 2.5, through a new follow-up.** The planted error is free text, so it cannot be scored directly. But the way a student would *catch* it can be, and that single follow-up converts the most valuable answer in the intake into a decisive signal:

> **How would a student catch that mistake?**
> - By running it and seeing the result is wrong → Research, execute and verify
> - By checking it against a source or standard → Research, the source
> - By knowing the field well enough to wince → Research, your expertise, or Simulate
> - By watching the consequence play out → Simulate
> - By running out of time or losing to a rival → Compete

For Joins the answer is the first one, and it names both the tag and the pattern in one click. This may be the highest-value single change in the plan.

**What happens now — a gate, not points.** Current practice should not vote on the tag, but it should suppress activities that duplicate what the class already does. "Practice problems in MySQL" means students already execute queries; the Lab has to add the verification layer, not more practice. Used as points this would double-count the material; used as a gate it stops the tool proposing something the faculty member already assigns.

### 2. "Teach someone else" is a magnet option

It is the heaviest-weighted option in the tool, the only route from the goal question to Simulate, and it is how most instructors in any discipline phrase any learning objective. It will keep pulling unrelated courses into Simulate.

### 3. There is no topic-kind axis — the biggest gap

The tool knows what students *hold* (a dataset). It does not know what the subject *is*. "Joins" is a technique with a correct answer. The Simulate templates assume a lived human situation with a person, a scene, and an hour-by-hour arc. No amount of tag-fixing repairs that mismatch, because the language itself assumes the wrong kind of subject.

Proposed new question, asked in step 1 next to the material: **What kind of thing is this topic?**

The list needs to be wide enough that faculty across the whole catalog find themselves in it, not just wide enough to separate the four tags. Eighteen kinds, grouped so the list stays scannable, each with examples from a different discipline so faculty self-identify by recognition rather than by reading definitions:

**Things done correctly or incorrectly**

| Topic kind | Example | Pulls toward |
|---|---|---|
| A technique or procedure with a right and wrong way to do it | SQL joins · journal entries · a chemistry titration · a normalization pass | Research — verify by executing |
| A calculation or model that produces a number | a financial forecast · a significance test · a structural load · an error bound | Research — verify the number |
| A regulation, standard, or code that must be applied | GAAP · building code · Title IX · IRB protocol · FERPA | Research — verify against the standard |
| A tool, platform, or system to be operated | a POS system · a CAD package · a learning platform · a statistical package | Create — produce real output with it |

**Things people navigate**

| Topic kind | Example | Pulls toward |
|---|---|---|
| A situation people navigate | a disruptive classroom · a customer complaint · a client intake · a police stop | Simulate |
| A live interaction performed in real time | an interview · a negotiation · a sales call · a courtroom examination | Simulate, or Compete if there is a rival or a clock |
| A process or workflow spanning people and steps | hiring · order fulfillment · a criminal case · a licensure referral | Simulate or Compete |
| A judgment call with no clean answer | a sentencing recommendation · an ethics case · a layoff decision · a conservation tradeoff | Simulate |

**Things understood or argued about**

| Topic kind | Example | Pulls toward |
|---|---|---|
| A body of knowledge or set of competing claims | learning theories · a policy debate · competing economic models | Research — trace to sources |
| A text, work, or artifact to be interpreted | a novel · a film · an artwork · a primary source · a legal opinion | Research or Create |
| A historical event or period to be understood in context | the Dust Bowl · a market crash · a public health crisis | Simulate |
| A population, market, or community to be profiled | a target market · a study population · a service area · a player base | Research — verify the data behind it |

**Things built or designed**

| Topic kind | Example | Pulls toward |
|---|---|---|
| A design or creative brief | brand identity · a UX flow · an exhibit · a menu · a campaign | Create |
| A working build | code · a query · a database schema · an app · a circuit · a spreadsheet model | Create — or Research when the point is that it runs but is silently wrong |
| A product or service to be specified | a product spec · a service offering · a package · a program design | Create |
| A plan or proposal | a business plan · a marketing plan · a lesson plan · a grant proposal · a project charter | Create |
| A system to be architected | a database design · a network · an org structure · a supply chain · a workflow redesign | Create — or Simulate when the point is how it behaves once running |
| A document that follows a required form | a contract · a policy · an IEP · a resume · an audit report · an incident report | Create — or Research when it is verified against a standard |

Six of the eighteen kinds pull toward Create, which is expected: making something is the most common shape a class assignment already takes. The value is not that the split is even, it is that "a database schema" and "a lesson plan" now get different words even though both land on Create.

Joins answers the first one — a technique with a right and wrong way to do it. That single answer should make an hour-by-hour journey unofferable and push execution-and-verification to the front.

**Why eighteen and not five.** Five kinds would separate the tags but would still hand a statistics instructor and a SQL instructor the same words. The point of the wider list is not classification, it is that each kind carries its own vocabulary, its own way of being wrong, and its own way of being checked. A significance test and a join are both techniques, but one is verified against an assumption check and the other against a row count.

**A list this long changes the control.** Eighteen radio options will not work as a flat stack. Two workable patterns: pick the cluster first and then the kind inside it, which is two clicks and keeps the reading short; or one grouped dropdown with the four cluster headers, which is one click but hides the options until opened. My preference is the two-step, because the four cluster names are themselves clarifying — faculty who cannot decide between clusters usually have two sessions hiding inside one topic.

**How this pairs with subject.** The two questions do different jobs and both are needed: topic kind decides the *shape* of the activity, subject decides the *words* it is written in. Keeping them separate is what stops the tool assuming that every Education topic is a classroom scenario. See 3b.

### 3b. Subject belongs on page 1 — but as vocabulary, not as a vote

A subject dropdown next to the course, answered before the topic, asked once.

**It must not score.** Subject does not predict the tag. Education contains a technique (writing a measurable objective), a situation (a disruptive classroom), and a contested claim set (competing learning theories) — three different tags inside one discipline. Any weight on subject would start pushing whole fields toward one tag, which is the same blanket problem in a new place.

**What it should do is drive examples and vocabulary.** Three concrete jobs:

1. **Re-render the eighteen topic kinds with examples from that subject.** An education instructor sees a lesson plan, an IEP, a rubric, a disruptive classroom; an accounting instructor sees journal entries, GAAP, an audit report, a forecast. The list stays eighteen but becomes instantly recognizable. This is a better answer to list length than cutting kinds.
2. **Write the planted-error placeholder in their language.** That field is where faculty stall, and a discipline-true example — "an IEP goal written so vaguely nobody could measure it" — does more than any instruction.
3. **Let the generated session use the field's own nouns** — a forecast and its assumptions, a statute and its precedent, a query and its row counts — rather than the generic "your material."

**Cost depends on scope.** One example set per subject is cheap: eighteen short examples each. A full per-subject pattern library is not, and is not needed. Draw the line at examples and nouns; keep the activity patterns shared.

**Two design notes.** The list should come from the actual college and program structure rather than anything I invent, so it matches how faculty already describe themselves. And it needs an "other or interdisciplinary" option that falls back to generic examples, because a required dropdown with no home for a cross-listed course is worse than no dropdown.

**Optional nicety:** the course code is already typed one field earlier, so the tool could pre-select a guess from the prefix — NUR, CIS, ACC — and let faculty correct it. Useful, but prefixes vary enough that it should only ever pre-select, never decide.

### 3c. The subject list, derived from the campus catalog

Fifteen families, grouped by **shared vocabulary** rather than by college, because the dropdown's only job is to supply the right nouns. Programs are listed so the mapping is auditable.

| Subject family | Programs that map in | Nouns the output would use |
|---|---|---|
| Accounting & Finance | Accounting AS/BS/Cert, Accounting & Finance, Professional Accountancy MS, Finance AS/BS, Economics Finance | journal entries, trial balance, GAAP, an audit report, a valuation, a forecast |
| Business & Management | Business Administration BS/BSA and its Entrepreneurship, Operations & Project Management, Hospitality Business, Aviation Management, Sport Management concentrations; Entrepreneurship BS, Sport Management BS, MBA, STEM MBA, International Business PhD | a business plan, a process map, a project schedule, an org structure, a vendor decision |
| Marketing, Sales & Communication | Marketing BS incl. Digital Marketing, Professional Sales, Communication BA incl. Digital Communication | a campaign, a positioning statement, a customer segment, a pitch, a content calendar |
| Analytics & Data | Business Analytics Cert/MS, Data Analytics Fundamentals, Computer Information Systems — Statistical Modeling, the AI for Business Innovation & Strategy concentrations | a dataset, a model, a dashboard, a significance test, a data dictionary |
| Computing & Software | Computer Science AS/BS/MS, Software Engineering, Machine Learning, Artificial Intelligence, Computer Information Systems, Information Technologies BS, Information Technology MS, Management Information Systems | code, a query, a schema, an algorithm, a test suite, a row count |
| Cybersecurity & IT Infrastructure | Cybersecurity BS | a network diagram, a configuration, a log, a threat model, an incident report |
| Game Design & Interactive Media | Game Design and Development BS incl. Game Design, Game Art, Game Programming | a mechanic, a level, a sprite set, a playtest, a design doc |
| Engineering & Construction | Aeronautical, Electrical, Mechanical, Computer Engineering, Engineering Technology AS/BS, Construction Management | a spec, a tolerance, a load calculation, a drawing, a build sequence |
| Natural & Health Sciences | Biology, Biomedical Science, Health Sciences, Environmental Science incl. Wildlife & Conservation Biology | a lab protocol, experimental data, a specimen, a habitat range, a dose-response curve |
| Mathematics & Physics | Mathematics BA, Physics BS | a proof, a derivation, a model, an error bound, a problem set |
| Education & Teaching | Education BA, Education for Licensure and all licensure areas, MEd Early Childhood, Elementary & Special Education, Educational Leadership & Administration, Educational Studies, Educator Practices, Secondary Education, EdD Educational Leadership, TEFL MS, TESOL MA | a lesson plan, an IEP, a rubric, a standard, an assessment, a classroom moment |
| Psychology & Sociology | Psychology BA incl. Child & Adolescent Development, Forensic Psychology, Mental Health; Sociology BA | a study, an instrument, a case formulation, a population, an effect size |
| Justice, Law & Public Policy | Justice Studies BS incl. Crime & Criminology, Law & Legal Process, Policing & Law Enforcement, Terrorism & Homeland Security; Law Politics and Societies BA and its concentrations; Leadership in Public Service; the Crime & Criminology, Law & Legal Process and Policing certificates | a statute, a case file, an incident report, a policy brief, a precedent |
| History, English & Writing | History BA incl. American, European, Military; English BA incl. Literature, Professional Writing; Creative Writing & English BA, Low-Residency MFA, Advanced Graduate Studies in Creative Writing | a primary source, a draft, a passage, an argument, a citation trail |
| Design & Media Arts | Graphic Design & Media Arts BA | a brief, a layout, a visual identity, a critique, a mockup |

Plus **Other or interdisciplinary**, falling back to generic nouns.

**No nursing on campus.** A real correction, and the reason the examples throughout this plan were rewritten: clinical language — dosage math, a discharge conversation, a care plan, HIPAA — matches no campus program. Health here means Health Sciences, Biomedical Science and Biology, which are lab and pre-professional rather than clinical. Every example set in the tool needs rewriting on that basis, and IEPs move to Education.

**Where the catalog is concentrated.** Business and its concentrations account for roughly forty catalog entries once BSBA, BSA, MBA and STEM MBA are counted; Education is second at about twenty; then Justice/Law/Politics, History/English/Writing, and Computing. Write the example sets in that order and the tool will feel finished long before all fifteen families are done.

**Two thin families that should stay separate.** Cybersecurity and Design & Media Arts each map to a single degree, but their vocabulary shares almost nothing with the families they would fold into. Merging them is exactly what produces generic language.

**One optional merge.** Mathematics & Physics could fold into Natural & Health Sciences if fifteen proves too many, at the cost of proofs and lab protocols sharing one word list.

**Prefix pre-selection needs a map.** To pre-select the family from a typed course code we need the catalog's prefix-to-program mapping. If that exports easily, pre-selection is nearly free; if not, it is not worth chasing.

### 4. Disagreement is reported as a verdict

Three mutually contradictory answers produced a confident recommendation and a "Why this type" sentence that concatenated them into nonsense: *"you want students leaving able to understand this well enough to walk someone else through it; competence in this field looks like producing work; you want them holding a decision log."* Those are three different sessions. The tool should say so.

### 5. The friction question is noise

Every option is true of every class, so faculty tick several and the effect cancels. It currently adds no signal while consuming a whole step.

---

## The missing activity class

For techniques with a correct answer, the pattern library has nothing. The activity family that dominates real practice in computing, accounting, statistics, and engineering is absent:

> **AI produces output that looks right and silently fails. You verify by executing it.**

For Joins that is: AI writes the query, the result set looks plausible, the wrong join type has quietly dropped rows, and students catch it by checking row counts against the source tables. That *is* the planted error the faculty member supplied, and it maps cleanly onto the framework's Research engine — anchor is the executed result, error is seeded and specific, artifact is a verified finding plus its evidence.

**Proposed:** add **Execute and Verify** as a fifth Research pattern, with the executed result as its anchor. Consider technique-shaped variants for the other three tags as well, since the same gap exists there.

### Compete needs its patterns rebuilt too

The three current Challenge patterns — an incoming queue, a shrinking window, head to head — were written for a clock. Once rivalry qualifies, head to head stops being the odd one out and becomes the centre, and it needs to be more than one pattern:

| Compete pattern | What makes it a contest | Fits |
|---|---|---|
| Head-to-head negotiation | Two teams want the same deal and only one gets terms they can defend | Business, Marketing, Justice, Accounting |
| The pitch-off | Teams pitch the same limited fund or contract; AI scores against stated criteria | Professional Sales, Entrepreneurship, MBA |
| Race to working | First team to a build that actually runs, not the prettiest one | Computing, Game Design, Engineering |
| The adversarial pair | One side attacks, the other defends, roles swap halfway | Cybersecurity, Justice, Law & Legal Process |
| The incoming queue | Demands arrive faster than they can be handled and accelerate | Business operations, Cybersecurity, Communication |
| The shrinking window | One consequential decision, collapsing time, complications landing | Any field with real deadlines |

Six patterns, and the first four are the ones that were unreachable before. Each still needs AI driving the pace or the scoring rather than holding an opinion, which is the framework's line and does not move.

---

## Proposed changes, in order

| # | Change | Why it matters | Risk |
|---|---|---|---|
| 1 | Add the topic-kind question, eighteen kinds in four clusters | Fixes the Joins failure at its source; unlocks discipline-true language | Low — one new question, but it needs the two-step control |
| 1b | Add a subject dropdown on page 1 — fifteen families from the catalog, driving examples and vocabulary only, never scoring | Makes the eighteen kinds instantly recognizable and the planted-error prompt answerable; makes the output sound like the field | Low to build; populating is the real work at eighteen examples across fifteen families |
| 1c | Rewrite every example in the tool off clinical nursing and onto real campus programs | Nursing is not offered on campus; the current examples describe an audience that does not exist here | Low, but touches all example text |
| 2 | Give all four content inputs weight — material, topic kind, planted error via the catch follow-up, current practice as a gate | The content decides the tag instead of one preference question. Recounts Joins from Research-last to Research-8.0 | Medium — every weight in the tool shifts, needs full retesting |
| 3 | Rewrite the three step-2 questions onto separate axes | Currently they ask one thing three ways; new axes: what students *do*, who the artifact is *for*, whether AI's output is *trusted or audited* | Medium — the third axis is the real Create/Research split and is never asked directly |
| 4 | Add Execute and Verify, plus technique-shaped patterns | Covers the industry-true activity for technical subjects | Medium — new content |
| 5 | Report disagreement honestly | Stop declaring winners off 1.0-point margins; when the axes conflict, name the two candidate sessions | Low |
| 6 | Replace or cut the friction question | Currently contributes nothing | Low |
| 7 | Derive wow, failure, and human contribution from material and topic kind | Removes the interchangeable boilerplate | High effort, biggest gain in perceived specificity |
| 8 | Rename Challenge to Compete and widen its condition to a clock **or** a rival; replace the clock question | Takes the tag from 10.9% reachable to most of the catalog; brings the tool back in line with the framework's own Arena definition | Medium — and it obliges a matching edit to the framework skill and the one-sheet |
| 10 | Three output states — confident, two candidates, not ready yet | Stops the tool declaring a winner off a 1.0-point margin, and gives a stalled intake a next move instead of a bad session | Medium |
| 11 | Tag override with stated obligations | Faculty keep control; missing build slots stay visible instead of being papered over | Low |
| 9 | Fix British spellings | *recognising, centre, neighbouring, sanitised* in a US university's tool | Trivial |

---

## Decisions taken

### 1. Three output states, not one

The tool stops pretending every intake produces a session.

**Confident.** One tag clearly ahead once the content votes. Recommend it, show the runners-up as alternatives.

**Two candidates.** Two tags genuinely close, or the axes disagree. Show both as full framings side by side — not a winner with a footnote — and let the faculty member pick. This is the honest version of what the Joins output should have said.

**Not ready yet.** The intake does not describe an activity or project session at all. Say so plainly and name the specific tweak that would fix it. Never a dead end, always a next move.

Triggers for *not ready*, each with its own fix:

| Trigger | What the tool says to do |
|---|---|
| No planted error named | Name one mistake only someone who knows the field would catch. Nothing builds without it. |
| Topic reads like a whole course or unit sequence | Cut to the single thing students most often get wrong. |
| Material and topic kind conflict — a dataset paired with a live interaction, say | One of these two is the real session. Which one is the class actually about? |
| No tag clears a minimum score | The answers describe a lecture with an activity attached rather than an activity. What would students *produce*? |
| The proposed activity is what the class already does | Current practice already covers this. The Lab has to add a layer — usually verification — not repeat the practice. |

### 2. Subject families — locked

The fifteen in 3c stand as written.

### 3. Challenge becomes Compete

The tag is renamed and its qualifying condition widens from a clock to **a clock or a rival**. Teams negotiating against each other over a business deal, teams racing to be first to a working build, a case competition, a mock trial, a pitch-off, a game jam.

**This brings the tool back in line with the framework rather than away from it.** The Arena definition already reads "race against a clock **or** compete under live, escalating pressure … or a head-to-head challenge against another team with AI keeping score." The tool only ever asked about clocks, which is why the tag was reachable in 10.9% of cases. Competition was always in scope and was never implemented.

**The clock question gets replaced:**

> **Does this work involve competing — for a deal, a contract, a client, a place, or against a deadline?**
> - Yes, against other people or teams — someone wins and someone does not → **Compete**, head to head
> - Yes, against a real clock or queue that does not wait → **Compete**, race
> - Both — a rival and a deadline → **Compete**, strongest case
> - No, the work rewards care over speed and there is no rival → Compete ruled out

Only the last answer rules Compete out. The current guard rules it out unless the first is a hard yes, which is backwards.

**Where Compete now reaches**, from the catalog: Professional Sales (a pitch-off), MBA and Business Administration (a case competition), Entrepreneurship (a pitch to a limited fund), Justice Studies and Law & Legal Process (a mock trial or a plea negotiation), Game Design (a game jam), Engineering (a design competition against a spec and a budget), Marketing (rival campaigns for the same segment), Cybersecurity (attacker versus defender). That is most of the catalog's weight, which is the point.

**One thing this obligates.** The framework skill's rename table sets the public tag as Challenge. Changing it to Compete is an edit to the naming source of truth, not just to this tool — otherwise the two drift apart within a week. The framework skill, the paper one-sheet, and the Session Sketch all need the same substitution in the same pass.

### 4. Override allowed, never silent

Faculty can change the tag, but the tool states what the change obligates them to supply and does not pretend the result is finished.

- Switching **into Compete** without a rival or a clock: allowed, with "you will need to add one — here is the thinnest version that would work."
- Switching **into Research** without a planted error: allowed, but the concept is marked incomplete and the build prompt says so in writing rather than quietly producing a summary session.
- Switching **into Simulate** on a technique topic: allowed, with the warning that the activity language assumes a lived situation and will need rewriting.
- The activity choice inside a tag stays freely switchable, as it is now.

The principle: the tool never blocks a faculty member, and never lets an override hide a missing build slot.

### 5. Topic-kind control — the information you asked for

Three options, and the right answer changed once the subject dropdown was decided.

**Option A — two steps: pick the cluster, then the kind.** Four large cards, then the four to six kinds inside that cluster.
Two clicks. Reads at most ten items. The cluster names do real diagnostic work, and hesitation between clusters is a genuine signal — it usually means two sessions are hiding in one topic. The cost is that the other fourteen kinds are hidden, so a faculty member who picks the wrong cluster never sees the kind that actually fits, and page 1 gains a second screen.

**Option B — one grouped dropdown.** A single select with the four cluster headers and eighteen options.
One click, very compact. But a dropdown cannot show examples — option text has to stay short, so the discipline examples that make the list recognizable get cut, which removes the main reason for having eighteen kinds. Also poor on a phone and it hides everything until opened.

**Option C — all eighteen visible on one page, grouped under the four headings.** Radio rows, one click, nothing hidden.
Roughly 600 pixels of list plus headings — about one scroll on a laptop.

**Recommendation: C, and the subject dropdown is what makes it viable.** When the examples were generic they needed four or five per kind to cover the disciplines, which made eighteen rows unreadable and pushed toward the two-step. Once subject is answered first, each kind needs only two or three examples *from that field*, so every row is short and the whole list fits in about a screen. Faculty scan the four headings, land in the right neighborhood, and see the alternatives they might otherwise have missed.

**The cheap hedge:** build C, and if it tests long with real faculty, collapse to A without touching the data — the four clusters are already in the structure, so it is a rendering change, not a redesign.

**What I would want to see before committing:** one faculty member from a heavy family — Business or Education — going through page 1 cold while you watch where they stop reading. Page 1 now carries subject, topic, current practice, topic kind, material, length and size. That is the real risk in this plan, not the eighteen kinds.


## Regression cases to test against

Any change gets checked against these before it ships:

- **Joins / CIS-255** — dataset, technique, join-key error. Must land Research / Execute and Verify or The Data.
- **A difficult classroom moment / Education** — case material, situation. Must stay in Simulate or Research / Your Expertise, not become a dataset activity.
- **Minimum wage and employment / Justice, Law & Public Policy** — competing claims. Must land Research / The Source.
- **Brand identity for a small business / Design & Media Arts** — made material, creative brief. Must land Create.
- **A database schema / Computing** — built material, a system to be architected. Must land Create, not Research, and must not reuse the Joins activity.
- **A significance test / Analytics** — a calculation verified against its assumptions rather than a row count. Must land Research and must not read like the SQL session.
- **A live cybersecurity incident / Cybersecurity** — attacker versus defender, real clock. Must reach Compete.
- **A pitch for a limited fund / Entrepreneurship** — a rival but no clock. Must reach Compete under the new condition; would have been ruled out under the old one.
- **A plea negotiation / Justice** — two sides, no timer. Must reach Compete, not Simulate.
- **A lesson plan / Education** — a plan or proposal, no rival, no clock. Must land Create and must *not* reach Compete.
