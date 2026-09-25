# Graph Report - agentic-coding-workshop  (2026-09-25)

## Corpus Check
- 39 files · ~14,055 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .mdc 1, (none) 1, .css 1)

## Summary
- 239 nodes · 431 edges · 13 communities (12 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3afa10b0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- seed.ts
- schedule-board.tsx
- package.json
- compilerOptions
- components.json
- course-card.tsx
- next
- CourseRadar workshop flow
- devDependencies
- eslint.config.mjs
- CourseRadar
- postcss.config.mjs
- catalog.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `CourseRadar workshop flow` - 13 edges
3. `cn()` - 11 edges
4. `getCourses()` - 10 edges
5. `reviewsForCourse()` - 9 edges
6. `Course` - 9 edges
7. `Button` - 8 edges
8. `filterCourses()` - 8 edges
9. `readSchedule()` - 8 edges
10. `next` - 8 edges

## Surprising Connections (you probably didn't know these)
- `HomePage()` --calls--> `getReviews()`  [EXTRACTED]
  app/page.tsx → lib/seed.ts
- `SchedulePage()` --calls--> `getCourses()`  [EXTRACTED]
  app/schedule/page.tsx → lib/seed.ts
- `Catalog()` --calls--> `filterCourses()`  [EXTRACTED]
  components/catalog.tsx → lib/filters.ts
- `Catalog()` --calls--> `readSchedule()`  [EXTRACTED]
  components/catalog.tsx → lib/schedule.ts
- `ScheduleBoard()` --calls--> `coursePath()`  [EXTRACTED]
  components/schedule-board.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (13 total, 1 thin omitted)

### Community 0 - "seed.ts"
Cohesion: 0.17
Nodes (15): GET(), HomePage(), SchedulePage(), Catalog(), data_seed, PAGE_SIZE, pageCount(), paginate() (+7 more)

### Community 1 - "schedule-board.tsx"
Cohesion: 0.17
Nodes (18): AddToSchedule(), DAYS, ScheduleBoard(), Button, ButtonProps, buttonVariants, Card, CardContent (+10 more)

### Community 2 - "package.json"
Cohesion: 0.06
Nodes (30): dependencies, class-variance-authority, clsx, lucide-react, next, react, react-dom, tailwind-merge (+22 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 4 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 5 - "course-card.tsx"
Cohesion: 0.27
Nodes (13): CourseRouteProps, GET(), CoursePage(), CoursePageProps, CourseCard(), CourseCardProps, formatCourseDate(), averageRating() (+5 more)

### Community 6 - "next"
Cohesion: 0.20
Nodes (6): app_globals, geistSans, metadata, Nav(), nextConfig, next

### Community 7 - "CourseRadar workshop flow"
Cohesion: 0.06
Nodes (30): Beat 1, 60 seconds, Beat 2, 2 minutes, Beat 3, 2 minutes, Beat 4, 90 seconds, Before people sit down, Between the demos (slides 6–11), Compare three courses, CourseRadar workshop flow (+22 more)

### Community 8 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, @eslint/eslintrc, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+3 more)

### Community 9 - "eslint.config.mjs"
Cohesion: 0.22
Nodes (7): compat, __dirname, eslintConfig, __filename, @eslint/eslintrc, ref_path, ref_url

### Community 10 - "CourseRadar"
Cohesion: 0.50
Nodes (3): CourseRadar, Scripts, Setup

### Community 12 - "catalog.tsx"
Cohesion: 0.13
Nodes (23): CatalogProps, CatalogFilters(), MEETING_DAYS, MIN_RATING_OPTIONS, setMembership(), TIME_OPTIONS, WORKLOAD_OPTIONS, CourseFilters (+15 more)

## Knowledge Gaps
- **121 isolated node(s):** `cmsc220`, `math140`, `engl101`, `phys404`, `catalog` (+116 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 136 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `schedule-board.tsx`, `package.json`, `course-card.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `react` connect `schedule-board.tsx` to `package.json`, `catalog.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `vitest` connect `seed.ts` to `eslint.config.mjs`, `package.json`, `catalog.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `cmsc220`, `math140`, `engl101` to the rest of the system?**
  _121 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._