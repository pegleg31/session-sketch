# Session Sketch — a limited pilot

*Draft for the five-faculty test invitation. Edit freely; the version footer on
the tool identifies which build produced any feedback you send back.*

---

## What this is

Session Sketch turns a topic you already teach into a runnable class activity
concept. You answer about twenty plain questions about one unit of one course —
no AI knowledge needed, you just need to know your students and your material.
It comes back with three activity ideas written for your class: each one a real
situation students can picture, a specific job for AI inside it, five timed
steps, and exactly what you'd need to prepare.

It's part of **SNHU AI Labs** — short, project-based sessions where students
use AI to build something real and leave with a skill that lasts.

## How it works

1. **You answer the questions** — subject, topic, what happens in class now,
   the mistake only an expert would catch, what students should remember a
   year later. About ten to fifteen minutes.
2. **The tool decides the shape.** A deterministic engine (no AI) recommends
   the type of session and the role AI plays in it, and sets the rules any
   idea must obey.
3. **The writer may ask you something first.** If your answers leave a real
   gap, AI asks up to three short questions before writing. Answer in a
   sentence, or skip.
4. **Three ideas come back** — usually in a minute or two. Every idea is
   checked against hard rules (the AI must be genuinely necessary, your
   planted mistake must be used in your words, the minutes must add up);
   ideas that fail are rejected, not padded.
5. **Keep the ones you'd run.** Keeping one gives you a ready-to-paste prompt
   that writes the full session, and another that builds the class data file.
   Two ideas is a term's worth of material, not indecision.

## What data is involved

- **Your answers stay in your browser.** There are no accounts and no
  database. We only see what you choose to send back.
- **When ideas are written**, your answers are sent to Anthropic's Claude API
  through our hosted service to generate the text. Per Anthropic's API data
  policies, inputs are not used to train models.
- **Follow all SNHU AI & data guidance — enter public information only.**
  No student records, no personal or confidential data, nothing you wouldn't
  put in a syllabus. The tool reminds you of this on every page where you
  type freely.

## The pilot

We're running this as a **limited test with five faculty** to get initial
feedback before anything wider. What we're asking:

- Run it once, alone, on a real topic — no training, no walkthrough. That's
  deliberate: we need to know whether it works without someone explaining it.
- When you finish, hit **⬇ Save concept** and email the file back with three
  quick reactions: *Did the questions make sense? Could you picture your class
  in any of the ideas? Would you actually run one — and if not, what stopped
  you?*
- Total time: about twenty minutes. Costs you nothing; the AI usage is on us.

This is a pilot build — you'll see a version number in the footer, and
occasionally the tool will say it's showing "the standard version" instead of
custom ideas. That honesty is by design. What frustrated you is exactly the
feedback we want.

**Link:** https://session-sketch.vercel.app
**Questions / feedback:** m.aubin@snhu.edu
