# CourseRadar

A small university course catalog for the Intro to Agentic AI workshop. Browse courses, read reviews, and pin sections onto a weekly schedule.

There is no account, no database, and no API key. Courses and reviews come from a JSON seed. The schedule stays in this browser’s `localStorage`.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev    # catalog at localhost:3000
npm test       # Vitest
npm run build  # production build
```

That is the whole install. If a workshop take goes sideways, discard uncommitted changes and leave `node_modules` alone:

```bash
git restore .
git clean -fd -e node_modules -e .next
```

Facilitators: the live demo script and slide map live in `docs/workshop-flow.md`.
