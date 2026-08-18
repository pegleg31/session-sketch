# Decision sheet — 18 August 2026

Thirteen things to settle. Each one is: what it means, then the two ways it could go.

**Settled 18 Aug:** 3 = C (spec plus a prompt they run) · 4 = B (say it plainly) · 5 = B (measure on the first live call) · 9 = keeping more than one idea, see below · 11 = B (22 strings, not 66) · 12 = yes, long term.

**Still to run:** 1 and 2, the two hand tests.

Tick the column you want. Three of them change what the tool produces; the rest are housekeeping.

---

## TEST FIRST — costs one chat each

### 1. Does the prompt work when there is no right answer?

**What it means.** The MKT test was the easy case: a technique with a right and wrong way, and a number to check. A third of your grid has no right answer at all — a disruptive classroom, a sentencing call, a brand identity. There is nothing to verify, so the failure can only be *flat* (AI produced the average of everything) instead of *wrong*.

| It looked like this | It might look like this |
|---|---|
| *"AI followed your instructions exactly and produced a confident alpha of .84 about a population that doesn't exist."* Specific. Checkable. A moment you can see. | *"AI plays four students in the room. Teams discuss what happened."* Soft. No guaranteed moment. Could be any Tuesday. |

**How to settle it.** Run Part A once with an Education or Justice case. If the second column is what comes back, the prompt needs an extra rule for flat-failure topics before Code tunes anything.

---

### 2. Is the planted mistake too long?

**What it means.** Check 6 requires four consecutive words of the professor's mistake to appear in the idea. That is hard to satisfy honestly when the sentence is thirty words of abstraction.

| Now | Tightened |
|---|---|
| *"the assessment of the questions that are driving the data are not aligned with the underlying mechanism — the underlying survey questions do not measure what the analysis claims they measure"* | *"the survey questions don't measure what the analysis says they measure"* |

Same meaning. The second one is quotable, and a model can build an activity around it without paraphrasing it into mush.

**How to settle it.** Run Part A twice, once with each. If the short one produces better ideas, the intake needs a nudge telling faculty to keep it to one sentence.

---

## DECIDE — these three change the product

### 3. ✅ C — the tool gives the spec plus a prompt they run

**What it means.** Every good idea from the test depends on a **file built with specific flaws in it** — a 99 code for "prefer not to say", one seven-point item hiding among five-point items, two questions that are secretly the same. The early moment is guaranteed by the data, not the instructions. No file, no activity.

That file is 20–40 minutes of work.

| A. Faculty build it | B. The tool builds it |
|---|---|
| The idea says: *"You'll need a 220-row file with three blank cells, a 99 code, and one seven-point item. About 30 minutes."* | The tool hands them a finished CSV with the flaws already in it, plus an answer key. |
| Tool stays simple. Nothing new to get wrong. | Much higher chance the session actually runs. |
| **Risk:** they don't do it, and the Lab quietly dies on the shelf. | **Cost:** a second generation step, and the data has to be genuinely correct or the class breaks live. |

**Decided: C.** The tool gives the precise spec *plus* a paste-ready prompt the faculty member runs to build the file. No new code path, no data-correctness risk on us, and prep drops from 30 minutes to about five.

In practice each idea's `file_spec` becomes two things on the page: the properties in plain words, and a **Build my file** button that copies a prompt containing those properties. Same pattern as the build prompt that already exists, so there is no new mechanism to invent.

---

### 4. ✅ B — say it plainly

**What it means.** The tool has to work offline. So there are two versions of the output, and faculty need to know which one they got.

| A. Say nothing | B. Say it plainly |
|---|---|
| They get the old template text. It looks like the product. | One line: *"Showing the standard version — the custom ideas need a connection."* |
| Feels seamless. | Feels honest. |
| **Problem:** two faculty tell you "the ideas were vague" and you cannot tell whether either of them ever saw the real thing. | Your feedback stays interpretable. |

**Decided: B.** The whole point of the follow-up loop is knowing what they actually saw.

---

### 5. ✅ B — measure it on the first live call

**What it means.** Three ideas is one call with a long answer, every time a faculty member finishes the questions. Nobody has measured it.

| A. Find out from the bill | B. Measure it on the first live call |
|---|---|
| — | Code prints the token count. You multiply. |
| | *If it's 10¢ a run and 50 faculty run it twice: about £10. If it's £1 a run: a different conversation.* |

The cost is probably small. **Whose key it is matters more.** Your personal key works for testing and breaks the moment a stranger uses the tool. That is a real question for whoever owns the SNHU account, not a technical one.

---

## BUILD — Code's list, no decisions needed

### 6. Version number

| Without it | With it |
|---|---|
| Two faculty send back files. Both say the ideas were vague. You cannot tell whether they used the same prompt, or the same castings, or the same anything. | `v1.4.2` in the footer, in every saved file, in every log line. Now you can. |

Do this first. Everything else's feedback depends on it.

### 7. Enrich becomes generate

| What enrich does | What generate does |
|---|---|
| Takes *"Teams run it against the dataset and find out that it is not"* and rewrites it in nicer words. | Invents Northgate Coffee, the analyst who quit on Friday, and the CMO expecting a number. |

### 8. Checks reject instead of repair

| Now | Should be |
|---|---|
| A wrong-shaped answer gets clamped back to the template line. A bad idea silently becomes a bland one. | A bad idea is dropped. Faculty see two good ideas instead of three. |

### 9. ✅ Three cards — and opening one is not a commitment

| Now | Should be |
|---|---|
| 4,601 words. The build prompt and the sketch are 70% of it. The activity is 5%. | Three cards, about 90 words each. Nothing else until they open one. |

**Your question: what if they want two of the three?**

Good catch, and it changes the design. I had assumed picking was a choice. It should not be.

A professor who likes two ideas usually is not undecided. They teach this topic every term, or they teach two sections, or one idea suits the first-years and the other suits the seniors. **Two ideas is not indecision, it is a term's worth of material.**

| What I had | What it should be |
|---|---|
| *"Pick this one"* — one choice, the others go away | *"See the detail"* — opens that card. Open as many as you like. |
| One build prompt, for the chosen idea | A **Keep** toggle on each card. Every kept idea gets its own copy button. |
| Saved file holds one Lab | Saved file holds however many they kept — two ideas, two Labs, one file. |

Nothing on the first screen gets more complicated. The cards stay the same size and everything stays closed until they ask.

**Two useful side effects.**

The log line gets better. Instead of *which one did they pick*, you learn *which ones they kept together* — and combinations tell you more than winners.

And it quietly solves the cross-course tracking problem from Wave 5. If a professor keeps two ideas with different castings, they already have two Labs that do not repeat the same AI job. The tool does not need to remember anything across a term, because the professor just did it themselves.

### 10. Code's two test fixes

Housekeeping, unrelated to any of the above. E17 used a casting that isn't legal for that case. E24 assumed run beats and phases are the same length — they aren't.

---

## ONE THING WE MIGHT DROP

### 11. ✅ B — write 22, not 66

**What it means.** You were going to write beats and tasks for eleven castings — six strings each. That was when the castings *were* the activity. Now Claude writes the activity, so those strings are only the fallback when there is no key.

| A. Write all 66 | B. Write 22 and stop |
|---|---|
| The no-key version is as good as it can be, and they double as examples for the model. | Two per casting — the `first` beat and the `push` beat. Just enough that the offline version isn't broken. |
| Several hours of writing. | About an hour. |

**Decided: B.** Two per casting — the `first` beat and the `push` beat. Twenty-two strings, about an hour, and the offline version still works.

The Oracle already has all six written, so it stays as the voice sample. Eleven castings × 2 = 22 to go. Revisit only if faculty turn out to use the tool without a key.

---

## LATER, BUT DON'T LOSE THEM

### 12. ✅ Yes — build it, long term

| Now | With it |
|---|---|
| You ask faculty in person, sometimes, and remember what they said. | Three questions in the saved file, one email link, and a record you can count. |

**Decided: build it.** Not urgent, but it is the only thing that will ever tell you whether a Lab worked with real students. Three questions, one email link, no server.

### 13. Hosting

| Now | Hosted |
|---|---|
| Files on laptops. Every fix you make reaches nobody. Versions drift apart. | One link, always current. |

This is the real answer to updates. It becomes non-optional the moment faculty use the tool without you.

---

## If you only do three things

1. **Question 1** — one chat, and it could change the checks before Code writes them.
2. **Question 3** — it changes what the tool outputs.
3. **Question 6** — five minutes, and every piece of feedback after it depends on it.
