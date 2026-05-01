# JS Loop & Iteration Mastery Trainer — Phased Implementation Plan

> **Goal**: Build a fully client-side SPA for practicing JS loop patterns, inspired by NeetCode's clean dark aesthetic. No backend, localStorage persistence, sandboxed code execution.

---

## Phase 1 — Project Scaffolding & Design Foundation

**Objective**: Vite + React + TS project initialized, all dependencies installed, Tailwind configured dark-only, Google Fonts loaded, global CSS tokens set.

### Tasks

- [ ] **1.1** Scaffold Vite React-TS project in the workspace root (`npx -y create-vite@latest ./ --template react-ts`)
- [ ] **1.2** Install runtime dependencies: `react-router-dom`, `zustand`, `date-fns`, `canvas-confetti`, `lucide-react`, `@monaco-editor/react`
- [ ] **1.3** Install dev dependency: `tailwindcss @tailwindcss/vite`
- [ ] **1.4** Configure Tailwind — `tailwind.config.js` with `darkMode: 'class'`, extend colors with the full design-system palette (background-primary `#0a0a0a` through accent-purple `#a855f7`), extend fontFamily for `inter` and `jetbrains`
- [ ] **1.5** Set up `src/index.css` — import Tailwind layers, import Inter + JetBrains Mono from Google Fonts, set `html` to `dark` class, base font 14px, background `#0a0a0a`, text white
- [ ] **1.6** Clean up Vite boilerplate — remove default `App.css`, demo content in `App.tsx`, favicon
- [ ] **1.7** Create folder structure skeleton (empty files/dirs): `components/layout/`, `components/ui/`, `components/editor/`, `components/problems/`, `components/progress/`, `data/problems/`, `runner/`, `store/`, `types/`, `pages/`, `hooks/`
- [ ] **1.8** Verify `npm run dev` runs with a blank dark page, no errors

### Acceptance

App loads at `localhost:5173`, dark background `#0a0a0a`, Inter font active, no console errors.

---

## Phase 2 — Types, Data Layer & Seed Problems

**Objective**: All TypeScript types defined, category metadata set, 11 category files with 2 seed problems each (22 total), flat index barrel export working.

### Tasks

- [ ] **2.1** Create `src/types/problem.ts` — `Difficulty` type, `Problem` interface, `CategorySlug` union type for all 11 slugs
- [ ] **2.2** Create `src/data/categories.ts` — export array of category objects: `{ slug, title, description, accentColor }` for all 11 categories
- [ ] **2.3** Create `src/data/problems/basic-loops.ts` — 2 seed problems ("Sum an Array", "Find the Max") with full `Problem` shape including description, whatShouldHappen, starterCode, traceTable, skeletonHint, solution, tests, patternTag, patternExplanation, estimatedMinutes
- [ ] **2.4** Create `src/data/problems/reverse-loops.ts` — 2 seed problems
- [ ] **2.5** Create `src/data/problems/for-in-for-of.ts` — 2 seed problems
- [ ] **2.6** Create `src/data/problems/nested-loops.ts` — 2 seed problems
- [ ] **2.7** Create `src/data/problems/array-building.ts` — 2 seed problems
- [ ] **2.8** Create `src/data/problems/object-loops.ts` — 2 seed problems
- [ ] **2.9** Create `src/data/problems/two-pointer.ts` — 2 seed problems
- [ ] **2.10** Create `src/data/problems/prefix-suffix.ts` — 2 seed problems
- [ ] **2.11** Create `src/data/problems/sliding-window.ts` — 2 seed problems
- [ ] **2.12** Create `src/data/problems/polyfills.ts` — 2 seed problems ("Implement forEach", "Implement map")
- [ ] **2.13** Create `src/data/problems/tricky-patterns.ts` — 2 seed problems
- [ ] **2.14** Create `src/data/index.ts` — import all 11 files, merge into single flat `problems` array export + helper functions: `getProblemById(id)`, `getProblemsByCategory(slug)`, `getCategories()`

### Acceptance

`import { problems } from './data'` returns 22 problems. Each matches the `Problem` type. No TS errors.

---

## Phase 3 — State Management (Zustand Store)

**Objective**: Zustand store with localStorage persistence handles solve tracking, streaks, attempts, backup banner dismissal, and import/export.

### Tasks

- [ ] **3.1** Create `src/store/useProgressStore.ts` — state shape: `solvedProblems`, `lastActiveDate`, `currentStreak`, `longestStreak`, `dismissedBackupMilestone`
- [ ] **3.2** Implement `markSolved(id)` action — add to `solvedProblems` with ISO timestamp, streak logic using `differenceInCalendarDays` from date-fns
- [ ] **3.3** Implement `incrementAttempts(id)` action
- [ ] **3.4** Implement `resetProgress()` action
- [ ] **3.5** Implement `dismissBackupBanner(milestone)` action
- [ ] **3.6** Wire zustand `persist` middleware — localStorage key `js-trainer-progress`
- [ ] **3.7** Create `src/hooks/useProgress.ts` — derived selectors: `solvedCount`, `totalCount`, `isSolved(id)`, `categoryProgress(slug)`, `streakInfo`, `shouldShowBackupBanner`

### Acceptance

Calling `markSolved` in dev console updates localStorage. Streak increments correctly on consecutive days. `resetProgress` clears everything.

---

## Phase 4 — Shared UI Components

**Objective**: All reusable UI primitives built and visually verified in isolation.

### Tasks

- [ ] **4.1** Create `src/components/ui/Badge.tsx` — difficulty badge (Beginner/Easy/Medium/Hard) with correct color-at-15%-opacity backgrounds + full-color text; also category badge variant
- [ ] **4.2** Create `src/components/ui/ProgressRing.tsx` — circular SVG progress ring, configurable size/stroke/color/progress percentage
- [ ] **4.3** Create `src/components/ui/Toast.tsx` — fixed bottom-right toast, success (green border) / error (red border), auto-dismiss 3s, slide-in animation from right
- [ ] **4.4** Create `src/components/ui/Divider.tsx` — thin `#2a2a2a` horizontal divider
- [ ] **4.5** Create `src/components/ui/Modal.tsx` — centered overlay modal for confirmations (e.g. reset code)
- [ ] **4.6** Create `src/components/progress/StatCard.tsx` — metric card with left accent border, label 12px muted, value 24px white

### Acceptance

Each component renders correctly in a test page with correct colors, spacing, animations per the design system.

---

## Phase 5 — Layout Shell & Navigation

**Objective**: Fixed sidebar, routing, responsive layout, bottom tab bar on mobile — navigating between all routes renders correct empty pages.

### Tasks

- [ ] **5.1** Create `src/components/layout/Sidebar.tsx` — 240px fixed left, `#111111` bg, right border, logo (lucide `Repeat2` + "JS Trainer"), nav links (Dashboard, Problems, Progress) with lucide icons, active state (blue left border + `#1a1a1a` bg), bottom stat pills (streak, solved, total)
- [ ] **5.2** Create `src/components/layout/Layout.tsx` — sidebar + content area wrapper, max-width 1200px centered content, responsive: sidebar collapses to bottom tab bar on mobile (`< 768px`)
- [ ] **5.3** Set up `react-router-dom` in `App.tsx` — `BrowserRouter`, routes: `/`, `/problems`, `/category/:slug`, `/problem/:id`, `/progress`
- [ ] **5.4** Create placeholder page components: `Dashboard.tsx`, `ProblemsPage.tsx`, `CategoryPage.tsx`, `ProblemPage.tsx`, `ProgressPage.tsx` — each shows just a title so routing is verifiable
- [ ] **5.5** Wire sidebar nav links to routes, highlight active link based on current path
- [ ] **5.6** Wire sidebar bottom stats to zustand store (live solved count, streak, total)

### Acceptance

All 5 routes navigable via sidebar. Active link highlights correctly. Mobile shows bottom tab bar. Stats in sidebar reflect store state.

---

## Phase 6 — Dashboard & Problem List Pages

**Objective**: Dashboard with stat cards + category grid, Problems page with full filterable table, Category page with filtered view — all wired to real data.

### Tasks

#### 6A — Dashboard (`/`)

- [ ] **6.1** Build top stats row — 4 `StatCard`s: Total Solved, Current Streak, Longest Streak, Categories Started
- [ ] **6.2** Build category grid — 3-col responsive grid (2 tablet, 1 mobile), each card shows: title, description, solved/total counts, `ProgressRing`, colored left border per category
- [ ] **6.3** Wire category cards to navigate to `/category/:slug` on click
- [ ] **6.4** Implement auto-export backup banner — shows after every 10th solve, dismissable, respects `dismissedBackupMilestone`

#### 6B — Problems Page (`/problems`)

- [ ] **6.5** Create `src/components/problems/FilterBar.tsx` — search input, difficulty dropdown, category dropdown, status toggle (All/Solved/Unsolved), live problem count
- [ ] **6.6** Create `src/components/problems/ProblemTable.tsx` — columns: #, Title, Category (badge), Pattern, Difficulty (badge), Time, Status (checkmark/circle). Sticky header, row hover `#1a1a1a`, row click → `/problem/:id`
- [ ] **6.7** Wire filters to table — real-time filtering by search, difficulty, category, status
- [ ] **6.8** Solved rows: subtle green tint on title, green filled checkmark, hover tooltip with solve date

#### 6C — Category Page (`/category/:slug`)

- [ ] **6.9** Build category header — title 20px, description 13px, "X / Y solved" right-aligned
- [ ] **6.10** Reuse `FilterBar` + `ProblemTable` pre-filtered to the category slug from URL params

### Acceptance

Dashboard renders 4 stat cards + 11 category cards with correct colors and progress rings. Problems page filters work in real time. Category page shows only matching problems.

---

## Phase 7 — Solve Screen (Code Editor + Execution Engine)

**Objective**: Full problem-solving experience — description panel, Monaco editor, sandboxed code execution, test results, confetti on success, solution reveal.

### Tasks

#### 7A — Code Execution Engine

- [ ] **7.1** Create `src/runner/executor.ts` — sandboxed iframe pattern: build HTML string with user code + test runner, inject via `srcdoc` in sandbox iframe, `postMessage` results back, 5s timeout, catch syntax/runtime/infinite-loop errors
- [ ] **7.2** Return structured results: `{ input, expected, actual, passed, error }[]`
- [ ] **7.3** Test executor in isolation with a known-good function and known-bad function

#### 7B — Solve Screen Layout

- [ ] **7.4** Create `src/components/layout/TopBar.tsx` — breadcrumb (Problems > Category > Title), difficulty + pattern badges center, prev/next arrows + problem counter + estimated time right
- [ ] **7.5** Build `ProblemPage.tsx` two-column layout with draggable resizer — left panel (description) default 40%, right panel (editor) default 60%, save ratio to localStorage
- [ ] **7.6** Implement `useKeyboardShortcut.ts` hook for `Ctrl+Enter` / `Cmd+Enter` → run code

#### 7C — Left Panel Sections

- [ ] **7.7** Section 1 — Problem description: title, description text, example block (dark bg, blue left border, monospace Input/Output)
- [ ] **7.8** Section 2 — "How to think about it": numbered walkthrough steps, custom styled (no browser bullets)
- [ ] **7.9** Create `src/components/problems/TraceTable.tsx` — Section 3: collapsible trace table, toggle show/hide, alternating row colors, monospace values, input label above
- [ ] **7.10** Create `src/components/problems/SkeletonHint.tsx` — Section 4: "I don't know where to start" link, smooth height reveal animation, shows loop structure with blanks
- [ ] **7.11** Create `src/components/problems/SolutionPanel.tsx` — Section 5: locked until first run attempt, then "Show solution" link reveals read-only Monaco with line-by-line comments + pattern callout card

#### 7D — Right Panel (Editor + Results)

- [ ] **7.12** Create `src/components/editor/CodeEditor.tsx` — Monaco editor configured: vs-dark theme overridden to `#0a0a0a` bg, JetBrains Mono 14px, no minimap, line numbers on, loads starter code, reset code with confirmation modal
- [ ] **7.13** Create `src/components/editor/ResultsPanel.tsx` — 220px bottom panel: default "Run your code" message, after run shows test cards (green/red left border), pass/fail per test with Input/Expected/Got
- [ ] **7.14** Implement "All X tests passed" banner — green tinted bar, `canvas-confetti` fires once, "Next Problem →" button
- [ ] **7.15** Implement Run button — full width, spinner 500ms minimum, "Running..." text, triggers executor, updates results panel
- [ ] **7.16** Wire `markSolved` + `incrementAttempts` to store on run results

### Acceptance

Can type code in Monaco, run it, see test results. Correct solution triggers confetti + green banner. Solution panel unlocks after first attempt. Trace table and skeleton hint toggle correctly. Prev/Next navigation works between problems.

---

## Phase 8 — Progress Page & Final Polish

**Objective**: Progress page with heatmap + history, export/import working, responsive polish, edge cases handled.

### Tasks

#### 8A — Progress Page

- [ ] **8.1** Build progress page stats row — 3 `StatCard`s (Current Streak, Longest Streak, Total Solved)
- [ ] **8.2** Create `src/components/progress/CalendarHeatmap.tsx` — GitHub-style SVG heatmap, 52 weeks × 7 days, cell 12×12 + 3px gap, 4-level green color scale, month labels top, day labels (M/W/F) left, hover tooltip with date + problem titles
- [ ] **8.3** Create `src/components/progress/SolveHistory.tsx` — reverse-chronological list grouped by date, each row: problem title, category + difficulty badges, time of solve; click navigates to problem
- [ ] **8.4** Implement Export — serialize zustand store to JSON, trigger download as `js-trainer-progress-YYYY-MM-DD.json`
- [ ] **8.5** Implement Import — file picker, FileReader, validate JSON shape (`solvedProblems` key), `setState`, success/error toast

#### 8B — Final Polish

- [ ] **8.6** Responsive audit — test all pages at mobile (375px), tablet (768px), desktop (1280px); fix any layout breaks
- [ ] **8.7** Keyboard accessibility — tab navigation on sidebar, filter bar, problem table rows, modal focus trap
- [ ] **8.8** Loading states — skeleton/placeholder states for editor mount, heatmap render
- [ ] **8.9** Edge cases — empty states (no solved problems, no search results), 0-problem categories
- [ ] **8.10** Performance — React.memo on heavy components (ProblemTable rows, heatmap cells), lazy load Monaco editor
- [ ] **8.11** Final visual QA — verify all colors, spacing, typography, transitions match the design system spec exactly
- [ ] **8.12** Verify `npm run build` succeeds with no errors or warnings

### Acceptance

Full app functional end-to-end. Export downloads valid JSON. Import restores state + shows toast. Heatmap renders solve history correctly. App builds for production without errors.

---

## Phase Dependency Graph

```mermaid
graph LR
    P1[Phase 1<br/>Scaffolding] --> P2[Phase 2<br/>Types & Data]
    P1 --> P3[Phase 3<br/>Zustand Store]
    P1 --> P4[Phase 4<br/>UI Components]
    P2 --> P6[Phase 6<br/>Dashboard & Lists]
    P3 --> P6
    P4 --> P5[Phase 5<br/>Layout & Nav]
    P4 --> P6
    P5 --> P6
    P2 --> P7[Phase 7<br/>Solve Screen]
    P3 --> P7
    P6 --> P7
    P7 --> P8[Phase 8<br/>Progress & Polish]
    P6 --> P8
```

> [!IMPORTANT]
> Phases 2, 3, and 4 can be worked on in parallel after Phase 1 completes. Phase 5 depends on Phase 4. Phase 6 depends on 2+3+4+5. Phase 7 depends on 6. Phase 8 is the final pass.

---

## Summary

| Phase     | Name                            | Est. Tasks | Key Deliverable                             |
| --------- | ------------------------------- | ---------- | ------------------------------------------- |
| 1         | Scaffolding & Design Foundation | 8          | Running Vite app with dark theme            |
| 2         | Types, Data & Seed Problems     | 14         | 22 typed seed problems across 11 categories |
| 3         | State Management                | 7          | Zustand store with persistence + streaks    |
| 4         | Shared UI Components            | 6          | Badge, ProgressRing, Toast, Modal, StatCard |
| 5         | Layout & Navigation             | 6          | Sidebar, routing, responsive shell          |
| 6         | Dashboard & Problem Lists       | 10         | 3 fully functional pages with filters       |
| 7         | Solve Screen & Execution        | 16         | Monaco editor + sandboxed runner + confetti |
| 8         | Progress Page & Polish          | 12         | Heatmap, export/import, responsive QA       |
| **Total** |                                 | **79**     | **Complete app**                            |
