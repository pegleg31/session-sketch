# Test case 2 — the Joins prompt

Pulled from `Joins pt 3 - SNHU AI Labs.pdf` (round-3 faculty test, 11 Aug 2026). This is the canonical case — the one the whole tool was rebuilt around.

**What this tests:** a different subject (Computing, not Marketing) and **students with no professional experience** — MKT-337 had a handful of experienced students, this class has none. Situations have to be enterable by someone who has never worked in the field.

**What it does *not* test:** this is still a `perform` skill with a verifiable anchor, the easy third of the grid. A `make` / `situation` / `judgment` case is still untested.

Paste everything below the line into a fresh Claude chat.

---

You are helping design one class activity for a university course. Not a lesson plan, not a syllabus — one activity a professor can picture and run next week.

## The class

- **Course:** CIS-255 Analytics & Data (Computing & Software)
- **Topic:** writing joins
- **Software students use:** MySQL
- **What happens in class now:** a pre-class lecture, then practice problem sets to introduce the topic
- **Where students are with the topic:** they have had the lecture and worked some problem sets, so this reinforces it
- **What students are learning to do:** perform a technique that has a right and a wrong way
- **What students produce:** a working build — a query that either runs correctly or does not
- **What they work from:** a dataset, results or records — messy on purpose. Naming what each field actually measures, what is missing or miscoded, and what would have to be cleaned is part of the work.
- **Class length:** 50 minutes
- **Class size:** teams of 4
- **Student experience:** none. This is new territory. These students are workforce-bound and have not done this work professionally, so any situation has to be enterable by someone who has only ever been a customer, a user, a student or an employee — never a practitioner.
- **The mistake only an expert would catch** *(the professor's own words, use them):* "they pick the wrong Join or join on the wrong field"
- **What the professor wants students to remember in a year:** knowing how to go about the process correctly
- **Keep out of it:** nothing specified.

## What has already been decided

This is a **verification** activity. Students check AI's confident work against something real. It is not open-ended research.

**What students check against:** the executed result — what actually happens when you run it.

Write **three separate ideas**. Each one gives AI a different job:

1. **AI as the expert who already has the answer.** It answers fast, fluently, with total confidence. It helps because it compresses an evening of work into seconds. It runs out because fluency is not evidence and it never sounds less certain when it is wrong.
2. **AI as the beginner they have to train.** It follows the students' instructions exactly and nothing more. It helps because watching your own instructions run shows you what you left out. It runs out because it quietly fills gaps from its own training, hiding the omission.
3. **AI as the drafting room that never tires.** It produces many complete versions fast. It helps because trying an option becomes free, so students can compare fifteen instead of defending their first. It runs out because volume without criteria is noise, and it drifts toward one average idea wearing many costumes.

## Hard rules

Every idea must pass all of these. If an idea cannot, throw it away and write a different one.

1. **It has to have a situation.** Who are the students for the next 50 minutes? What just happened? What is in front of them? Not "teams write joins against the dataset" — a real situation with a name, a stake, and someone who wants something.
2. **The situation has to be enterable by a beginner.** These students have no professional experience in this field. They can be a new hire on day one, a volunteer, a temp, an intern — someone whose lack of context is part of the situation rather than a problem to hide.
3. **AI has to be necessary.** State in one sentence what becomes possible that was not possible before AI. If the honest answer is "the same thing, but faster," the idea fails. Throw it away.
4. **Use the professor's mistake, in their words.** Build the activity so students hit it: they pick the wrong join, or join on the wrong field.
5. **Name MySQL where it belongs.** Students are writing real queries, not pseudocode.
6. **Something has to land in the first ten minutes.** A specific moment where AI does something students did not expect it could do. It has to be guaranteed by how the activity is built, not left to luck.
7. **Something only a person can do.** Name it. If AI could do the whole activity, the idea fails.
8. **Five steps that add up to 50 minutes.** Give minutes for each.
9. **Say exactly what the data has to contain.** The moment that lands early has to be guaranteed by how the tables are built — specific duplicate keys, specific orphan rows, specific near-identical column names, specific NULLs. Spell it out, or the activity cannot be run.
10. **Say what the professor has to prepare, and how long it takes.** Be honest. A hidden hour of prep kills the idea.
11. **Any organisation you name must be invented.** Never use a real company.
12. **Any number you quote is a target for whoever builds the data**, not a prediction about what students will find. Say so.

## Write it like this

For each of the three ideas:

**Idea name** — short, memorable, not jargon

**The situation** — three or four sentences. This is the part the professor reads first, so make it something they can picture.

**Why AI has to be here** — one sentence. What is possible now that was not before.

**The five steps** — one line each, with minutes.

**What lands early** — the moment in the first ten minutes, and what makes it certain to happen.

**Where it goes wrong on purpose** — how students hit the wrong join or the wrong field, and how they discover it themselves rather than being told.

**What only a person can do** — one line.

**What students hand in** — one line.

**What they can do next time** — the skill they could name afterwards, one line.

**What the data has to contain** — the specific properties of the tables that make the early moment certain. One line each.

**Prep** — what the professor builds beforehand, and roughly how long it takes.

## Voice

Write for a tired professor at 4pm. Short sentences. Concrete nouns. No jargon and no cheerleading. Never use these words: delve, leverage, robust, unlock, journey, empower, seamless, "in today's fast-paced". Do not name a specific AI product — say "AI" or "the AI tool".

---

## What to look for in the answer

Same five questions as the MKT test, plus two that are specific to this case:

| Ask yourself | If the answer is no |
|---|---|
| Could I picture my Tuesday class doing this? | The situation is too vague |
| Would this be interesting even without the AI angle? | It is a worksheet with AI bolted on |
| Does the AI part feel necessary or decorative? | Rule 3 is not being enforced hard enough |
| Are the three ideas actually different? | The castings are not doing their job |
| Does it use the wrong-join mistake specifically? | Rule 4 needs to be stronger |
| **Could a student who has never worked in data enter this situation?** | Rule 2 is not landing — the model is writing for practitioners |
| **Does the wrong join produce a plausible-looking result rather than an error?** | The data spec is wrong. A query that errors teaches nothing; one that returns 4,000 rows instead of 400 teaches everything. |

That last one is the real test of this case. The planted mistake only works if picking the wrong join **succeeds** — an inner join that silently drops rows, or a join on a non-unique key that multiplies them. If the ideas describe students getting an error message, the data spec has missed the point.

## Comparing the two tests

| | MKT-337 | CIS-255 |
|---|---|---|
| Subject | Marketing | Computing |
| Skill | perform | perform |
| Student experience | some | **none** |
| Planted mistake | long, abstract, two clauses | **short and concrete** |
| Keep out | no Python | nothing |

The planted mistake is the interesting difference. MKT's was two clauses and quite abstract; this one is nine words. If the Joins ideas come back sharper, that answers the open question about whether the MKT error needed tightening — and it would mean the intake should push faculty toward short, concrete mistakes.
