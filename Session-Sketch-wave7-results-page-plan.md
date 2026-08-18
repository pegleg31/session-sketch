# Wave 7 — The activity needs to be an idea, not a template

**A plan. Nothing built yet.** Written 17 August 2026, updated the same day after faculty feedback.

Two sources. First, a real saved concept I measured: `lab-concept-survey-data-analysis (1).html` — a Research Lab on survey data analysis in Excel, cast as The Apprentice. Second, what faculty actually say when they reach the activity.

---

## 1. What faculty say

Three things, and the third is the real one:

**A. It's not clear what they actually do in class.**

**B. They don't understand how AI fits in.**

**C. The activity is just what they already do, with AI bolted on. It doesn't feel necessary.**

And underneath all three: the tool doesn't give them a *new idea*. It gives them their own topic back with a process wrapped around it.

The test that proves it: if you paste the same twenty answers into a normal Claude chat and ask for classroom ideas, you get something fresh and interesting. The tool has the same information and produces something flat. So the information isn't the problem. What we do with it is.

## 2. Why the tool is guaranteed to produce "your activity plus AI"

This isn't a copy problem. It's built into how the tool works.

The tool sorts. Answers come in, and it picks:

1. One of four **types** (Create, Research, Compete, Simulate)
2. One of seventeen **activities** (Execute and Verify, The real deliverable, and so on)
3. One of twelve **castings** (what AI is cast as)

Then it drops the topic into whichever slots it landed on.

But those seventeen activities are **generic shapes**, not ideas. "Execute and Verify" means *get an AI answer, then check it*. That's a procedure. You can apply it to joins, to survey data, to nursing charts, to anything. Which is exactly why it comes out feeling like "do your normal thing, but AI writes a first draft."

**A sorting machine can only ever hand back the box you fit into.** It can't invent. And an idea is an invention.

That's C, explained. It's also A and B, because a generic shape can't tell you what students *do* in your room, and it can't tell you why AI is needed rather than nice.

## 3. What's actually missing: the situation

Every activity a faculty member would call interesting has a **situation**. Who the students are for the next 50 minutes. What just happened. What's in front of them. What's at stake.

The tool has never had this. It collects everything you'd need to invent one — subject, topic, tool, raw material, whether the data is messy, the mistake only an expert would catch, class size, whether students have real work experience, whether this is their first time seeing the topic — and then throws those ingredients into a template instead of using them to build a situation.

Here is the same Lab, both ways.

**What the tool produces now:**

> AI produces something for survey data analysis that looks right. Teams run it against the dataset and find out that it is not.

**What an idea looks like:**

> The campus food pantry ran a satisfaction survey. 1,200 responses came back, and three of the fields are miscoded.
>
> Teams write the cleaning and analysis instructions in plain English — no formulas yet — and hand them to AI. It does exactly what they said. It produces a confident, well-formatted report about a population that doesn't exist.
>
> Then the pantry director asks them one question they can't answer without going back to the raw file.

Same twenty answers. Same type. Same casting. The second one a professor can picture, and can see why AI has to be there: you can't watch your own instructions run, and you can't put a director in the room who reacts, any other way.

The difference is the situation. Nothing else.

## 4. So the API isn't for rewriting. It's for having the idea.

I scoped this too small last time. I said the engine should decide everything and Claude should only rewrite the sentences in the professor's own vocabulary. That would produce a better-worded form letter. It wouldn't fix C.

**The new split:**

| Engine | Claude |
|---|---|
| Decides the type and the casting | Invents the situation and the activity |
| Says what the idea must include | Writes it |
| Rejects ideas that don't qualify | Offers three to choose from |

**The engine stops being the writer and becomes the rubric.**

This keeps everything worth keeping. The type and the casting are still decided by scoring, so the regression suite still works and still means something. Nothing about the ten test cases changes. What changes is that the engine hands its decisions to Claude as **rules for the idea**, instead of using them to look up paragraphs.

### 4.1 Three ideas, not one — and the casting is what makes them different

Faculty should get three. That's how the Claude-chat version works, and it's most of why it feels generative. Choosing is part of the value.

But three ideas are only useful if they're genuinely different. This is where the casting work finally pays off:

- **Idea 1** — AI cast as the beginner they have to train
- **Idea 2** — AI cast as everyone else in the room
- **Idea 3** — AI cast as the drafting room that never tires

Three different situations, because AI is doing a different job in each. Not three rewordings of one thing.

This also replaces the two "change your mind" panels. Instead of *here are other castings and other activities you could swap to*, it becomes *here are three ideas, pick one*. Same choice, offered as ideas rather than as a parts catalogue.

### 4.2 What happens to the seventeen activities

They mostly stop being the activity.

They were generic shapes, and generic shapes are what produce "your thing plus AI." What's still useful in them is the **anchor** — the real thing students check their work against. Keep that. Drop the rest, or keep them as examples we feed Claude to show what a session shape looks like.

This settles the question I raised last time about castings sitting beside activities. The answer is neither of the options I offered. **The activity isn't a lookup any more, so there's nothing left to contradict.**

## 5. The rules every idea has to pass

The engine checks each idea Claude sends back. If an idea fails, it doesn't get shown.

| Rule | Why |
|---|---|
| **The necessity test** — the idea must say what becomes possible that wasn't before AI | This is C, as a checkable rule. If the honest answer is "it'd just be slower without AI," AI is decoration and the idea is rejected. |
| It names a situation — who students are, what just happened, what's in front of them | Otherwise it's a procedure again |
| The professor's own planted mistake appears, word for word | It's the most valuable answer in the intake |
| The tool they named appears at least once | Excel, SPSS, whatever they said |
| There's a moment in the first ten minutes that makes it land | The framework requires it |
| There's something only a person can do | Otherwise we've automated the class |
| Five steps that fit the time they chose | So it's runnable |
| No banned phrases (*delve, leverage, robust, in today's fast-paced*) | Credibility |
| **It says what the material must contain** | Learned from the 17 Aug test. The early moment is guaranteed by how the file is built, not by the instructions — so without the file spec the activity cannot be run at all. |
| **It says what the professor must prepare, and how long** | Faculty abandon an idea they cannot prep, and resent one that hid the cost. |
| Any organisation named is invented | Never put words in a real company's mouth. |

**The necessity test is the important one.** It's the rule that would have caught every flat activity the tool has produced so far. You already have a field for it — `unlock`, the "not possible before AI" line. Right now only some castings have one. Make it required per idea instead.

If all three ideas fail, show today's deterministic text and say so. Never a blank page.

**Tested 17 Aug 2026, by hand, before any code.** Three ideas came back on the MKT-337 case and all three passed every rule — minutes exact at 50, no speed claims, the professor's mistake quoted verbatim, Excel and the ToolPak named, a fictional client with a real deadline in each. The model also went deeper into the subject than the intake did: nobody typed "Cronbach's alpha" anywhere, and it inferred the technique from Marketing plus survey data plus a committed decision.

Full result and what it changed: `Session-Sketch-idea-prompt.md`.

## 6. What the page looks like then

### Layer 1 — Three ideas. What they see first.

Three cards, about **90 words each**. Each one:

- **The name**
- **The situation**, three or four sentences
- **Why AI has to be here**, one line — the necessity test, shown to them
- **Prep**, one line with a time estimate — so they can rule one out immediately
- **Pick this one** →

Nothing else on the first screen. No score bars, no sketch, no prompt.

A full idea runs about 330 words, so three is roughly 980. The cards show a quarter of that and the rest arrives when they pick one. That keeps the first screen under 400 words as intended.

### Layer 2 — The one they picked.

Now they get the detail, and it's about *their* choice:

- The five steps, one line each, with minutes
- The two moments marked where they happen, in plain words (§7)
- **What the file has to contain** — the properties that make the early moment certain
- What only a person can do
- What students hand in, and what they can do next time
- One button: **write my Lab** — copies the prompt

Any statistic in an idea is shown as a **target for whoever builds the file**, never as a prediction. The first professor whose data behaves differently would otherwise stop trusting the whole page.

### Layer 3 — Everything else. Behind the toggle you already have.

The `S.fac` toggle exists. Put behind it: the full prompt text, the 20-row sketch as-is, score bars, the workshop notes relabelled *"if you're running this as a workshop,"* Pillars 2 and 4, roles, pacing.

Nothing gets deleted. One toggle decides who the page is for.

**Why this order matters.** Right now the page proves its decision first and describes the class last. Faculty want the class first. The proof is for us.

## 7. Plain words instead of our words

Faculty don't need our terms defined. They need them replaced, with what goes wrong if you skip it.

| Our word | What the page says | Why it matters |
|---|---|---|
| Wow moment | **What makes it land, early** | Skip it and students treat the whole thing as a gimmick. |
| Failure by design | **The mistake you're planting on purpose** | Skip it and they believe whatever AI hands them. That's the opposite of the lesson. |
| Human contribution | **The part AI can't do for them** | This is what you're actually grading. |
| The anchor | **What you check against** | Drop the word. Say it in the step where the checking happens. |
| Transferable skill | **What they can do next time** | Keep. Already reads fine. |
| Pillar 2 / Pillar 4 | Move to Layer 3 | Real rules, wrong moment. Nobody reads policy before they understand the class. |

## 8. Where the words go now (the measurement)

The saved page has **4,601 words** a faculty member can read.

| Part of the page | Words | Share | Really for |
|---|---|---|---|
| The build prompt, in full | 2,137 | 46% | The AI tool, not a person |
| Draft sketch | 1,104 | 24% | Us |
| "Not the one you pictured?" | 393 | 9% | Faculty, too early |
| "Read these first" | 221 | 5% | Faculty |
| **The activity** | **214** | **5%** | Faculty — and it's the whole point |
| "Three other ways this could run" | 166 | 4% | Faculty, too early |
| **What AI is cast as** | **140** | **3%** | Faculty — best block on the page |
| Recommended tag | 132 | 3% | Faculty |
| "Not the tag you want?" | 94 | 2% | Faculty |

**Seven in ten words are the prompt and the sketch.** The two blocks that explain what happens in class are **354 words. Eight percent.**

Two other things the numbers showed. We ask faculty to change their mind twice, in 559 words, before they've understood the first answer once. And some notes talk about the reader as if they're not there — *"do not treat this screen as a failure in front of a faculty member."*

## 9. Getting results back after they teach it

The override log tells us whether the tool picked well. It says nothing about whether the class worked. The second one is what you want.

You already have the delivery method: the saved concept file. Faculty download it and keep it. Add to it:

- A **"How it went"** box. Three questions, nothing more: *Did it land? Did anyone catch the planted mistake? What would you change?*
- They type in the file and save again.
- One email link with the subject already filled in, carrying the Lab name and version number.

No server. Works offline.

Three questions, not a survey. A professor who just taught for 50 minutes will answer three questions in a hallway. They won't open a form.

## 10. Getting updates to faculty

Say it plainly: **a file on someone's laptop can't be updated.** Once faculty have it, they have that version forever. Every fix reaches nobody.

| When | What | Effort | What it buys |
|---|---|---|---|
| **Now** | **Put a version number on it.** In the footer, in every saved file, in every log entry. | Tiny | You can tell which version made a file someone sends back. Without it, feedback from two versions can't be told apart. **Do this before any faculty test.** |
| **Now** | One footer line saying where the newest version lives. | Tiny | Honest about being out of date instead of quiet about it |
| **Wave 4** | **Host it.** One link, always current. | The Vercel work already planned | The real answer. Faculty using it alone is what makes it necessary. |

## 11. Decisions — settled 17 Aug 2026

| # | Decision |
|---|---|
| 1 | **Claude generates the activity.** Not rewording — inventing. |
| 2 | **Three ideas**, made different by giving AI a different job in each. |
| 3 | **The seventeen activities become examples** we show Claude. Faculty stop seeing them. |
| 4 | **The necessity test is a hard rule.** An idea that can't say what AI makes possible gets thrown out. |
| 5 | **The page is written for faculty working alone.** Workshop wording moves behind the toggle. |

### 11.1 ✅ Claude generates the activity

A sorting machine can't invent (§2), so rewording was never going to fix C. The engine keeps deciding the type and the casting, which keeps the scoring and the regression suite meaningful. It hands those decisions to Claude as **rules the idea has to obey**, and Claude invents the situation.

**The engine is the rubric. Claude is the writer.**

### 11.2 ✅ Three ideas, differentiated by casting

Choosing is part of the value. Three rewordings of one idea would be worthless, so each idea gets a different job for AI — the beginner, the room full of people, the tireless drafting room. Three genuinely different classes.

This also replaces both "change your mind" panels. *Here are three ideas, pick one* instead of *here is a parts catalogue.*

### 11.3 ✅ The seventeen activities become examples

They stop being the thing faculty read. They were generic shapes, and generic shapes are what produced "your thing plus AI." Two things survive:

- **The anchor** — the real thing students check against. Keep it as a required part of every idea.
- **The rest** — feed to Claude as examples of what a good session shape looks like, so it has something to pattern against without copying.

### 11.4 ✅ The necessity test is hard

An idea that can't name what becomes possible with AI does not get shown. If all three fail, show today's text and say so — never a blank page.

This means sometimes faculty see two ideas, or one. That's correct. Two good ideas beat three where one is padding.

### 11.5 ✅ The page is written for faculty working alone

**This is only about wording.** Nothing changes in the class itself — not the five phases, not the three ideas, not the necessity test. The only thing that changes is who the sentences talk to.

The same note, both ways:

| | |
|---|---|
| **Today** | *"Read all three aloud and watch which one they react to. Faculty who cannot describe a session in the abstract will almost always recognise the right activity when they hear it."* |
| **Self-serve** | *"Pick the one you can already picture in your room. If none of them fit, your topic might still be too broad — go back a step."* |

Same information. The first is instructions for you, about them. The second talks to them.

**Decided: self-serve is the default.** Workshop wording moves behind the `S.fac` toggle, and the toggle remembers its setting, so you switch it on once when you are running a session.

Everything downstream follows from this: every sentence on the results page gets rewritten to address the reader directly, and anything that describes faculty in the third person is a bug.

## 11.6 The old question list, for reference

Questions 1 to 4 are settled above. Question 5 is expanded below, because "who is the page for" was too vague to answer.

## 11.7 What the self-serve default changes

Six things, all wording:

| | Workshop wording | Self-serve wording |
|---|---|---|
| **Who the page talks to** | About the reader | To the reader |
| **The two big moments** | You explain them out loud | The page explains them |
| **How much choice** | You can steer, so more is fine | Too much choice stalls someone alone |
| **"Not ready yet"** | You reframe it kindly in person | Alone, it reads as being told no — needs rewriting |
| **Density** | Fine, you interpret it | Every extra word is a chance to give up |
| **Follow-up** | You ask them later | The saved file has to ask (§9) |

**The catch, worth naming.** You are in the room for every test right now, so you cannot find out whether self-serve works while you are sitting there explaining it. So the next test is the real one: hand over the link, say nothing, watch. Every time you want to explain something out loud, that is a copy fix — and that list is the most valuable thing the test produces.

## 12. What order to do it in

1. **Version number** (§10). Tiny, and every piece of feedback depends on it.
2. **Decide question 1** (§11). No code. One decision, and it changes the rest.
3. **Write the idea prompt and the checking rules** (§4, §5). Test it by hand in a normal Claude chat first, with the survey-data answers, before writing any code. If the ideas aren't good in a chat window, they won't be good in the tool.
4. **Wire up the API**, three ideas, with the checks and the fallback.
5. **Rebuild the page in three layers** (§6).
6. **Swap our words for plain ones** (§7).
7. **Add the "How it went" box** (§9).
8. **Then test with one faculty member, alone, nobody helping.**

Step 3 is the cheap one that de-risks everything after it. You can do it today, by hand, with no code — and you'll know within an hour whether this plan is right.
