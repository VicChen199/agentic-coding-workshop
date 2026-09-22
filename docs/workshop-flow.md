# CourseRadar workshop flow

Facilitator script for **Intro to Agentic AI** (14 slides) plus the CourseRadar practice repo. Students are new to agents. Two live demos sit inside the deck. The bugs are intentional. Say that once, out loud, at the start of Demo 1.

Pin one model for rehearsal and the show. A different model is a different demo.

## Slide map

| # | Slide | What you do |
| --- | --- | --- |
| 1 | Title | Open the catalog. Dev server already running. |
| 2 | What is Agentic AI | Lecture. Plan, tools, multi-step actions. |
| 3 | Core Concepts | Lecture. Prompt, context, workflows. |
| 4 | Prompt Engineering | Lecture. Incorrect behavior, then the intended fix, or ask for options. Demo 1 Beat 2 is this slide, live. |
| 5 | Evaluating Output | Lecture. Diff + negative tests. Do not trust a green suite. **Then Demo 1.** |
| — | **Demo 1** | Beats 1–4. About 8 minutes. Cut Beat 1 if you need it under 5. |
| 6 | Rules / Skills | Guardrails vs installable workflows. |
| 7 | Rules / Skills (list) | Define Grill Me: an interview that turns a vague idea into a spec. Promise you will use it on a feature they suggest after the build slide. |
| 8 | AI Modes | Ask cannot edit. Plan cannot edit. Agent edits. Tie Ask back to Demo 1: that is the mode you used when you said not to change anything yet. |
| 9 | Context Management | One chat per task. Promise the handoff live in Demo 2. |
| 10 | How to Classify Tasks | Draw the ladder. Level 0 is a typo. Their idea will be Level 1 or 2 depending on how many disjoint pieces the interview finds. |
| 11 | Orchestrator-Worker | Separate working directories. Workers may not touch the nav. **Then Demo 2.** |
| — | **Demo 2** | About 14 minutes. Close with one sentence into slide 12. |
| 12 | Loop engineering | Lecture. Nothing just merged had a second agent writing tests, or a reviewer on the export route. |
| 13 | Q&A | Questions. |
| 14 | Thank you | Done. |

No live agent between the demos. Do not say Ask mode, Plan mode, rules, or levels during Demo 1. Those slides have not happened. If you need the model not to edit, say “I’m going to ask it not to change anything yet.”

## Before people sit down

- `npm install` is already done. Do not delete `node_modules` to reset.
- `npm run dev` is already running. Catalog is on the projector.
- `npm test` is green on `main`.
- Repo is clean. You are on `main`.
- Two local recovery branches exist: `demo/1-solution` and `demo/2-solution`.
- Grill Me is installed, or you will use the six-question interview at the bottom of this file.
- Editor zoomed. The diff is the demo.
- Optional: pre-record about a minute of three working directories and the merge. If the network stalls during Demo 2, play that and do the handoff from a local chat.

### Reset a failed take

```bash
git restore .
git clean -fd -e node_modules -e .next
```

If the take is dead, check out the matching recovery branch and keep talking. Do not debug a live agent for more than 60 seconds.

```bash
git switch demo/1-solution   # search fixed, real assertions, C++ test on
git switch demo/2-solution   # plus pagination, review label, three tracks wired
git switch main              # planted bugs back
```

## The app (what is on `main`)

Next.js, TypeScript, Tailwind, shadcn/ui, Vitest. Seed in `data/seed.json`: 42 courses, six departments, about 120 reviews. Page size is 10, so four full pages plus two — except pagination is wrong, so the UI says 4 pages and shows 9 per page.

Load-bearing courses:

- **CMSC 220, Programming in C++.** Search landmine.
- **MATH 240, Linear Algebra.** Case-sensitivity landmine.
- **PSYC 100, Intro to Psychology.** Exactly one review, so the card says “1 reviews.”
- **CMSC 250, Discrete Structures.** Index 40. Pagination can never reach it.

Four surfaces: catalog with search and pagination, course detail with reviews, weekly schedule (`localStorage`), a few API routes. No database, no auth, no API keys.

## Planted bugs

**Search compiles the query as a regular expression.** `lib/search.ts` runs `new RegExp(query)` against title and code. `C++` throws `Invalid regular expression: nothing to repeat` and the catalog hits the error boundary. `linear algebra` returns nothing because the pattern is case-sensitive.

The fix an agent reaches for first is `try/catch` around the regex, returning no courses on error. The crash disappears, the tests stay green, and CMSC 220 can never be found.

The fix you want deletes the regex. Trim, lowercase, literal substring over code, title, and instructor. Empty or whitespace-only query returns the full catalog. Escaping also works. It keeps a parser the feature never needed.

**Pagination drops a course per page and hides the last page.** `lib/pagination.ts` slices `start + PAGE_SIZE - 1` and uses `floor` for the page count. The UI says 4 pages and shows 9 per page: 36 of 42 courses. Six are unreachable, including CMSC 250. Correct end state is a full-size slice and `ceil`. Five pages: 10, 10, 10, 10, and 2. Do not let the agent change the page size.

**Dates render a day early.** Seed says `2026-01-20`. Parsing that as a `Date` treats it as UTC midnight, so US timezones render January 19. `lib/dates.ts` prints the raw seed string next to the formatted date. Agents often “fix” this by adding a day, which is wrong east of Greenwich. This bug is a Grill Me prop, and a backup diff if the search fix comes out clean. Do not build it as a demo task.

**Tests that cannot fail.** Keyword search asserts `toBeTruthy()`, which passes on an empty array. Pagination asserts only that the result is an array. A third test expects `C++` to find CMSC 220, and it is skipped. Leave it skipped at the start of Demo 1. Unskip it at the end of Beat 4.

**“1 reviews.”** `components/course-card.tsx` never uses the singular. PSYC 100 makes it visible. This is the Level 0 fix in Demo 2.

## Demo 1, after slide 5

Same bug, three times, getting stricter. Trim to under 5 minutes by cutting Beat 1.

Setup: catalog open, search box visible, tests ready to run, a fresh chat that is allowed to edit, repo clean on `main`.

Say once: the bugs are intentional.

### Beat 1, 60 seconds

Type only: `the search is broken, fix it`. Let it guess. Expect a null check, a UI tweak, or the `try/catch` landmine. Do not narrate while it works. Then type `C++` or `linear algebra` and let the result be dull. Discard the change.

If it somehow produces the real substring fix, praise it in one sentence and review the date bug instead. Do not rerun Beat 1 hoping for a worse answer.

### Beat 2, 2 minutes

New chat. Switch to the mode that cannot edit. Say “I’m going to ask it not to change anything yet.” Paste this:

```
Searching for `C++` throws “Invalid regular expression: nothing to repeat” and the catalog crashes. Searching “linear algebra” in lowercase returns nothing even though MATH 240, Linear Algebra, is in the catalog. Search should be a case-insensitive literal substring match over code, title, and instructor. Characters like `+ ( ) . *` are literal text, not a pattern. An empty or whitespace-only query returns the full catalog. Do not edit anything. Give two or three approaches and the tradeoff for each.
```

Read the options in one breath each. Ask the room which one, then say which one you are taking.

If nobody answers: delete the regex and use a lowercase substring check. Escaping keeps a parser you do not need. A `try/catch` that returns no results hides the bug.

Then a new chat that can edit:

```
Implement search as a case-insensitive literal substring match over code, title, and instructor. Trim the query. An empty or whitespace-only query returns the full catalog. Do not use a regular expression. Do not wrap the old regex in `try/catch`. Do not change tests.
```

That last sentence keeps the weak tests weak so Beat 4 still works. If you are behind, skip the options exchange and paste this implementation prompt directly.

### Beat 3, 2 minutes

Show the diff before you click anything in the app. Ask “What’s wrong with this?” and wait five seconds.

Point at whichever of these is on screen, in this order:

1. A `try/catch` that returns no courses. The page no longer crashes. CMSC 220 can never be found.
2. Tests were edited. An assertion got weaker, or the skipped `C++` test was deleted.
3. The regex was escaped instead of removed. It works. Then show that `toBeTruthy()` would still have passed if the function returned nothing.
4. The diff is actually the substring fix. Praise it. Open `lib/dates.ts` and ask what parsing `2026-01-20` does in this timezone. The tempting fix is “add a day.”

If nobody answers and the common case is on screen: “The crash is gone. Search for C++ now returns an empty catalog, and every test still passes. That’s the bug, still there, just quiet.”

If the landed fix is the bad one, discard it and apply the substring version from `demo/1-solution`, or paste the function. Beat 4 needs a catalog that does not crash, so the negative tests are about behavior. If you are short on time, leave the bad fix in place and let Beat 4 be the crash. Say the suite is about to go green anyway.

### Beat 4, 90 seconds

Run the tests and leave the green summary up. Then type, in order, with no explanation before the first one:

| Input | Half-fixed search | Correct search |
| --- | --- | --- |
| `C++` | Crash, or zero results | CMSC 220 |
| `linear algebra` | Zero results if still case-sensitive | MATH 240 |
| Empty, after a previous query | Stale results, or a crash on an empty pattern | All 42 courses |
| `(` | Crash if a regex is still in the path | No crash, likely zero courses |
| About 5000 characters pasted | Hang, or a regex error | Returns quickly, likely zero courses |

If you ask the room for an input and nobody speaks: `C++`, then `(`, then clear the box.

Close on the skipped test, not a speech. Show that it is skipped in `__tests__/search.test.ts`, unskip it, run the suite, and let it go red or green. One sentence: someone already wrote the test. The suite was green because that test was off.

Stop. Go to slide 6.

## Between the demos (slides 6–11)

No live agent.

- **Slides 6–7.** Rules versus skills. Grill Me interviews you until a vague idea is a spec. Promise you will use it on a feature from the room.
- **Slide 8.** Ask cannot edit. Plan cannot edit. Agent edits. That “do not change anything yet” chat in Demo 1 was Ask.
- **Slide 9.** One chat per task. Promise the handoff live in Demo 2.
- **Slide 10.** Level 0 is a typo. Their idea will be Level 1 or Level 2 depending on how many disjoint pieces the interview finds. Slide copy says Ask → Agent for Level 0, Ask → Plan → Agent for Level 1, Ask → Plan → Build for Level 2.
- **Slide 11.** Orchestrator, workers, separate working directories, merge at the end. Workers are not allowed to touch `components/nav.tsx`, `app/schedule/page.tsx`, or `app/courses/[code]/page.tsx`. Those three edits are the integration.

## Demo 2, after slide 11

Climb the ladder, then let the room supply the feature. Level 0 is always scripted. The audience idea is always grilled. You implement their idea only when it matches a card below. Otherwise you say so and read the matching card. The interview is the skill demo. The card is how the build stays inside the clock.

Setup: repo clean. The Demo 1 search fix can stay. Three terminals. Separate working directories available. Grill Me installed, or the six-question interview below.

### Step 1, Level 0, 60 seconds

No audience. In the mode that cannot edit:

```
Where is course search defined, and what calls it? Do not propose a refactor.
```

Point at `lib/search.ts` and `components/catalog.tsx`. One sentence: this mode cannot edit, so it is how you read a repo you do not know.

New chat, mode that can edit:

```
A course with one review is labeled “1 reviews.” PSYC 100 is the example. Use “1 review” and “N reviews.” Change only that label. Do not touch search, pagination, or tests.
```

The diff should be a handful of lines in `components/course-card.tsx`. If it sprawls into a formatting pass, revert and do the one-line edit yourself. Leave this chat open and messy. You will distill it in Step 4.

### Step 2, audience idea, then Grill Me, 3 minutes

Ask for one sentence: a feature they would add to a course catalog. Take the first idea that is about the app, not about the model. Repeat it in their words. Interview it with this added instruction: one question at a time, no code, no plan yet. Stop when you can state the user, the trigger, the smallest version, what it will not do, which existing data it uses, and one input that should fail.

Answer briefly, steering toward the nearest card the whole time. When it stops, classify out loud. Do not take a vote unless you have 20 spare seconds.

- One behavior, about four files, no new service, no accounts: **Level 1.** Plan, then one agent.
- Two or three pieces that do not share files or the nav: **Level 2.** Orchestrator and separate working directories.
- One file or a copy change: say it is **Level 0**, same shape as the review label. Do it only if it is truly one line. Otherwise park it and pull the Level 1 pagination card.
- Auth, a new backend, payments, a native app, or a live model API: park it. One sentence why, then a card.

If nobody offers an idea: “Students want to compare three courses side by side before they register.” That is the compare card. Grill it anyway, with short answers, so the skill is still on screen. If you would rather show parallel work that day, offer export, a workload chart, and a stats page instead, and say why: one behavior versus three directories that do not share files. Pick which silence you prefer before the session. Default is the compare feature.

If the idea is still muddy after 3 minutes, stop. “We’re keeping the part we can land.” Read the closest card. Do not keep interviewing.

### Step 3a, their idea is Level 1, 3 minutes

Plan mode. Paste the card, swapping their noun in where the card allows it. When the plan comes back, edit it on the projector: delete one step, add one constraint from the card. Say that a wrong sentence is cheaper than a wrong refactor.

Then a new chat, agent mode, on the edited plan. If the plan touches more than about six files or adds a dependency, stop. “Bigger than this slot.” Revert. Run the pagination card, which is rehearsed.

If the edit will take a minute, start it and go to Step 4. Come back to the diff before the merge.

### Step 3b, their idea is Level 2

You need three tracks that do not share files. Use the export / histogram / stats split unless their idea maps cleanly onto the review split. Say the constraint before you launch: workers may not edit the nav, the schedule page, or the course detail page. Those three edits are the integration, and they happen after the merge, by you.

Launch all three. Do not watch them. If you cannot name three disjoint directories in 30 seconds, it is not a Level 2 idea today. Say that, and run Level 1 pagination or compare instead.

### Step 4, distill, 3 minutes, while agents run

In the messy Level 0 chat, ask for a handoff you can paste into a brand new chat. Only decisions already made, files already changed, and open questions. No encouragement. No restatement of the whole project.

Open a new chat, paste it, and ask what is still wrong with the catalog and which code owns it. Do not edit. You want it to say pagination, 36 of 42 courses. If the handoff was good, it knows that without the old chat.

If the Level 1 work already finished, do this anyway. It is the point of slide 9, not filler.

### Step 5, merge, 3 minutes

For Level 1, show the diff and run that card’s check.

For Level 2, list the working directories so three real directories are on screen. Merge each branch. Then only these integration lines, by you or one orchestrator chat that is allowed to touch the nav:

- A button on the schedule that downloads the calendar file.
- Mount the workload histogram on the course page, passing reviews that page already has.
- One nav link to the stats page.

If a worker edited the nav anyway, show the conflict. That is the lesson. Keep your nav and their page.

Close, then slide 12: nothing just merged had a second agent writing tests against a written-down behavior, or a reviewer looking for an auth hole on the export route.

Under 8 minutes: Level 0, then straight into the pagination card. Plan, edit the plan, agent. Skip the interview only if you already showed the skill. Skip the parallel directories. Still say the one sentence into slide 12.

## Fallback cards

Read a card. Do not write a new prompt on stage. Swapping their noun means changing the feature name and leaving the rest.

### Pagination

Use when their idea will not fit, when a Level 1 plan sprawls, or when you need a rehearsed win.

```
The catalog seed has 42 courses. The UI says 4 pages and only 36 are reachable. Page size is 10. CMSC 250 is one of the missing courses. Find the off-by-one in pagination and in the page count. Fix both so every course is reachable and the page count is 5. Do not change the page size. Do not edit search. Add a test that fails on the current code: page size 10, 42 items, the last page returns 2 items, and the page count is 5. Touch only the pagination helper, the page-count display, the catalog API, and that test.
```

On the plan, delete any step about search or styling. Put the page-size constraint back if the model dropped it. Check: tests pass, the last page shows CMSC 250, the control says 5 pages.

### Compare three courses

Default when nobody speaks, or when the idea was “help me pick” with no UI.

```
A student compares up to three courses before registering. They pick from the catalog and see code, title, credits, average rating, and average workload side by side. A fourth selection does nothing and shows “Compare up to 3 courses.” The view is its own page. Data comes from the existing seed. No new reviews, no accounts. An empty selection shows the picker, not an empty table. Do not edit search, pagination, or the schedule. List the files first. Keep it to about four.
```

Check: MATH 240, CMSC 220, and PSYC 100. A fourth course shows the limit. Ratings match the detail page.

### Filter the catalog

Use for “filter,” “only CS,” “hide low-rated courses,” or “easy A’s.”

```
Filters are department and a minimum average rating. Both narrow the current results. Clearing them restores the full catalog. Search still applies on top. Departments come from the seed, not a second hardcoded list. A minimum of 0 shows every course. A minimum of 6 shows none, because ratings are 1 to 5. Do not change pagination math. Filter first, then paginate, so the page count matches the filtered total. About four pieces: the control, the catalog page, the filter function, one test.
```

Check: department CMSC plus search `C++` still finds CMSC 220. Minimum 6 shows an empty state, not a crash.

### Schedule overlap

Use for “don’t let me double-book” or “conflicts.”

```
On the schedule, warn when two added courses overlap in day and time. Show the pair by course code. Do not block the add. Do not add a calendar library. Overlap means a shared day and intersecting clock times. Back-to-back, one ending when the next starts, is not an overlap. A course overlapping itself is not a warning. Use meeting times already in the seed. About four pieces, plus one test for the back-to-back case.
```

Check: an overlapping pair warns, a back-to-back pair does not. If you do not remember a back-to-back pair from rehearsal, do not use this card. Use pagination.

Rehearsal pair that is back-to-back on this seed: **CMSC 220** Mon 10:00–11:15 and **MATH 410** Mon 11:30–12:45 are *not* back-to-back (gap). A true back-to-back from this seed is **PHYS 121** Mon 10:00–10:50 and **PHYS 122** Mon 11:00–11:50 — still a gap. There is no exact end-equals-start pair in the seed. If you take this card, do not claim a seed pair is back-to-back unless you verified it that morning. Default to pagination.

### Export, histogram, and stats

Default parallel fallback, or when they say “a dashboard” with no sharper edge. One prompt per worker, each in its own chat and working directory. This is what `demo/2-solution` already contains.

**Worker 1 — export route only**

```
Calendar export route only. It returns an .ics file for courses currently on the schedule, one event per course, using seed meeting times. No UI. Do not edit the nav, the schedule page, or course pages. Test that a course code appears in the file body.
```

**Worker 2 — histogram**

```
A workload histogram component that renders only from props: a list of labels and hours. No fetching, no router, no edits outside that component. An empty list renders an empty state and does not throw.
```

**Worker 3 — stats page**

```
A stats page. Average rating by department, and the ten courses with the highest average workload. Read the existing seed. Do not edit the nav, the catalog, or the schedule. Test that a department average uses only that department’s courses.
```

After the merge, by you:

- A button on the schedule that downloads the calendar file.
- Mount the workload histogram on the course page, passing reviews that page already has.
- One nav link to the stats page.

Check: download the calendar file and see a course code in it, the histogram renders on a course that has reviews, and the stats page lists six departments.

### Let me leave a review

Only with this split. Do not let one worker own the course detail page.

- A create-review route. Course code, rating 1 through 5, optional comment up to 500 characters. Reject a missing code, a rating outside 1 to 5, and a comment over 500 characters with a 400 and a one-line reason. Keep the reviews in memory for the life of the process. Do not edit any page or the nav. Test the three rejections.
- A review form component. Props are the course code and a submit callback. Stars, a text area, a submit button. It does not call the network. Submitting with no stars calls nothing and shows “Pick a rating.” No edits outside that component.
- A “my reviews” page that lists what this browser submitted, from local storage. Empty state: “You have not written a review yet.” Do not edit the nav or the course page.

After the merge, you mount the form on the course page, submit it to the route, append to local storage, and add the nav link. If that integration feels like more than 90 seconds, this was the wrong card. Use the export split next time.

## What they shout, and which card

| What they say | What you do |
| --- | --- |
| Silence | Compare three courses. Or the export split if you want parallel work that day. |
| Help me decide, compare | Compare card. |
| Filter, only CMSC, 4 stars and up | Filter card. |
| Double-booking, conflicts | Overlap card, or pagination if you did not rehearse a back-to-back pair. |
| Fix the missing courses, where is 250 | Pagination card. This is the planted bug. |
| Export to my calendar, and nothing else | One plan, not three workers. The export route plus the schedule button. |
| A stats dashboard, what’s hard | Export / histogram / stats split. |
| I want to leave a review | The review split above. |
| Fix the date, January 19 | Do not build it. It is a one-file trap. Pull pagination or compare. |
| Fix search | Already done. Pull pagination. |
| Dark mode, make it prettier | No behavior to test. Pull compare. |
| Log in with Google, accounts | Will not land live. “Comparing courses doesn’t need an account.” Pull compare. |
| AI summarizes the reviews, chat with the syllabus | A live model call will stall or demand a key. “The honest version today is a stats page over the reviews we already have.” |
| Mobile app, push notifications | Out of the repo. Pull compare. |
| A Level 2 idea whose pieces all sit on the course detail page | Downgrade to Level 1, closest card. Parallel workers on one page is a merge conflict, which is a different lesson. |

If they argue with the classification: “Level 2 means I can name three folders that don’t share files. I can’t name them for this, so it’s a plan, then one agent.” If you can name them, it is Level 2 even if they think it is small.

Other audience beats, if you ask and nobody answers:

- Which search approach: delete the regex, substring match, no `try/catch`.
- What’s wrong with this diff: narrate the `try/catch`, or the assertion that passes on an empty result, whichever is visible.
- What to type in the box: `C++`, then `(`, then clear it.
- What constraint to add to the plan: do not change the page size, do not add a dependency, or do not edit existing assertions, add a new test. Pick the one the plan is most likely to violate.
- Is this level 1 or 2: use the classification rule yourself and state it.

## If Grill Me is not installed

Ask these one at a time. Answer them yourself, toward the card you are steering to. Stop after the sixth. Tell the model not to write code, not to list files yet, and not to propose a stack. Paste their sentence as the idea.

1. Who is in front of the screen, and what just happened that made them want this?
2. What is the smallest version that would still be worth showing?
3. What will this version refuse to do?
4. Which of that can we answer with the courses and reviews already in the seed?
5. Which directories would a change touch? Do any two tasks have to edit the same file?
6. What is one input that should fail, and what should the screen show?

After you answer the sixth, it replies with six lines only: User, Trigger, Smallest version, Non-goals, Data, Failure input. No code.

## Recovery branches

| Branch | What it is |
| --- | --- |
| `main` | Planted bugs. Demo 1 starts here. Suite is green because the honest test is skipped. |
| `demo/1-solution` | Search is a literal substring match. Assertions are real. The `C++` test is on. |
| `demo/2-solution` | Everything in `demo/1-solution`, plus pagination (`ceil`, full slice), `1 review` / `N reviews`, calendar export, workload histogram, stats page, and the three integration lines in the nav / schedule / course page. |

## Stage safety, and what this plan leaves out

If an agent edits during a “do not edit” beat, stop it. The ignored instruction is the lesson.

There is no rules-file before-and-after in Demo 1. Rules stay on slides 6–7. The live skill is Grill Me, inside Demo 2. No token-saving skill, no diagram skill, no test-driven-development skill run. The skipped test is the only testing beat, and it belongs to Demo 1. No loop-engineering agents. Slide 12 stays a lecture, set up by the export-route sentence. No audience idea implemented raw. Their sentence goes through the interview, then through a card. The card may contain their noun. It may not be replaced by an unrehearsed design.
