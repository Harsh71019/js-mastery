Here's the complete prompt:

---

**Project: JS Loop & Iteration Mastery Trainer**

Build a fully client-side single page application inspired by the clean, minimal aesthetic of NeetCode. No backend, no server, no database. Everything persists in localStorage with JSON export/import for backup.

---

### Stack

```
React 18 + TypeScript
Vite
Tailwind CSS (dark mode via class strategy, dark by default)
@monaco-editor/react
zustand + zustand/middleware (persist)
date-fns
canvas-confetti
react-router-dom v6
lucide-react
```

---

### Design System

The entire app is dark by default. Do not implement a light/dark toggle — dark only.

**Colors:**

```
Background primary:   #0a0a0a  (page background)
Background secondary: #111111  (cards, panels)
Background tertiary:  #1a1a1a  (editor, inputs, hover states)
Border:               #2a2a2a  (all borders)
Border hover:         #3a3a3a
Text primary:         #ffffff
Text secondary:       #a1a1aa  (muted labels, metadata)
Text tertiary:        #52525b  (placeholders, disabled)
Accent blue:          #3b82f6  (primary actions, links, Beginner badge)
Accent green:         #22c55e  (solved state, pass, Easy badge)
Accent amber:         #f59e0b  (Medium badge, warnings)
Accent red:           #ef4444  (Hard badge, fail state)
Accent purple:        #a855f7  (streak, special callouts)
```

**Typography:**

```
Font: Inter (import from Google Fonts)
Base size: 14px
Code: JetBrains Mono (import from Google Fonts, used in editor and inline code)
```

**Component rules:**

- All cards: `background #111111`, `border 1px solid #2a2a2a`, `border-radius 8px`
- All buttons: no border-radius more than 6px, flat style, no shadows
- Difficulty badges: small pill, 4px border-radius, tight padding, muted background of their color at 15% opacity with full color text
- Solved checkmark: green circle with white checkmark icon, 20px
- All tables: no outer border, only horizontal dividers between rows, header row has slightly brighter background
- Inputs and selects: `background #1a1a1a`, `border #2a2a2a`, clean focus ring in accent blue
- Hover states: subtle background shift to `#1a1a1a`
- Transitions: 150ms ease on all hover/focus states
- No shadows anywhere
- No gradients anywhere
- Consistent 16px gap between cards, 24px section padding

**Layout:**

- Fixed left sidebar navigation on desktop (240px wide)
- Content area fills remaining width
- Max content width 1200px centered
- Mobile: sidebar collapses to bottom tab bar

---

### Navigation Sidebar

Fixed left sidebar, 240px, background `#111111`, right border `1px solid #2a2a2a`.

Top section: App logo — a small loop icon (lucide `repeat-2`) + text "JS Trainer" in white, 16px medium weight. Below logo a thin divider.

Nav links (with lucide icons):

```
Dashboard     (icon: layout-dashboard)
Problems      (icon: code-2)
Progress      (icon: bar-chart-2)
```

Active link: accent blue left border (3px), text white, background `#1a1a1a`. Inactive: text secondary, no background.

Bottom of sidebar: three stat pills stacked:

```
🔥 X day streak    (purple text)
✓  X solved        (green text)
◎  X / total       (muted text)
```

---

### Routes

```
/                     → Dashboard
/problems             → Full problem list (all categories)
/category/:slug       → Problem list filtered to category
/problem/:id          → Solve screen
/progress             → Progress history + calendar heatmap
```

---

### Dashboard (`/`)

No page title. Starts immediately with content.

**Top stats row** — 4 metric cards in a horizontal row:

```
Total Solved    /  total problems
Current Streak  days
Longest Streak  days
Categories      X / 11 started
```

Each card: `#111111` background, left accent border in its color, label in text-secondary 12px, value in white 24px medium.

**Category grid** — below stats, 3-column responsive grid (2 on tablet, 1 on mobile). Each category card contains:

- Category title 15px white medium
- Description 13px text-secondary
- Row of two numbers: "X solved" in green, "/ Y total" in text-secondary
- Circular SVG progress ring (40px, 3px stroke) on the right side of the card
- Thin colored left border (4px, color unique per category)
- Clicking navigates to `/category/:slug`

Category accent colors (left border + ring color):

```
basic-loops       #3b82f6
reverse-loops     #8b5cf6
for-in-for-of     #06b6d4
nested-loops      #f59e0b
array-building    #22c55e
object-loops      #f97316
two-pointer       #ec4899
prefix-suffix     #a855f7
sliding-window    #14b8a6
polyfills         #6366f1
tricky-patterns   #ef4444
```

---

### Problems Page (`/problems`)

Full list of all problems across all categories. Same layout as category page but unfiltered.

**Filter bar** — horizontal row, sticky at top of content area:

- Search input (placeholder: "Search problems...") — filters by title in real time
- Difficulty dropdown: All / Beginner / Easy / Medium / Hard
- Category dropdown: All / [each category name]
- Status toggle: All / Solved / Unsolved
- Right side: "X problems" count updates live as filters change

**Problem table:**

Columns:

```
#        (40px, text-tertiary)
Title    (fills remaining width)
Category (badge, 120px)
Pattern  (text-secondary, 140px)
Diff     (badge, 80px)
Time     (text-tertiary, 60px, e.g. "10m")
Status   (40px, green checkmark or empty circle)
```

Row behavior:

- Full row is clickable, navigates to `/problem/:id`
- Hover: row background shifts to `#1a1a1a`
- Solved rows: title has a very subtle green tint, status column shows green filled circle with checkmark
- Date solved shown as tooltip on hover over the status icon ("Solved Jan 3, 2026")
- No outer table border, only `1px solid #2a2a2a` between rows
- Sticky header row: `#111111` background, text-secondary labels, 12px uppercase

---

### Category Page (`/category/:slug`)

Same as Problems page but pre-filtered to that category. Shows category title and description at the top as a small header (not a big hero — just title 20px + description 13px text-secondary + progress "X / Y solved" on the right). Then the same filterable table below.

---

### Solve Screen (`/problem/:id`)

Three-zone layout:

**Top bar** (full width, 48px tall, border-bottom `#2a2a2a`):

- Left: breadcrumb — "Problems / Category name / Problem title" in text-secondary, current page in white
- Center: difficulty badge + pattern tag badge
- Right: previous problem arrow, problem number "12 / 45", next problem arrow. Estimated time "~10 min" in text-tertiary.

**Main area** below top bar — two columns, resizable divider between them (drag to resize, save ratio in localStorage):

**Left column** (default 40% width):

Scrollable. Contains sections separated by thin `#2a2a2a` dividers:

Section 1 — Problem:

- Title 18px white medium
- Description in 14px text-secondary, line-height 1.7
- Example block: dark `#1a1a1a` background, monospace font, shows `Input:` and `Output:` on separate lines, `border-left: 3px solid #3b82f6`

Section 2 — How to think about it:

- Header "How to think about it" 13px text-tertiary uppercase
- Plain English walkthrough, numbered list style but custom styled (no default browser bullets)
- Each step on its own line with a subtle step number in text-tertiary

Section 3 — Trace table (collapsed by default):

- Header row: "Trace table" label left, "Show" / "Hide" toggle right (text link in accent blue, no button style)
- When expanded: proper HTML table, `#1a1a1a` background, alternating rows `#111111` / `#1a1a1a`, column headers in text-secondary 12px uppercase, values in monospace 13px
- Input label above table: e.g. `nums = [1, 2, 3, 4]` in code style

Section 4 — Skeleton hint (hidden by default):

- "I don't know where to start" — text link, accent blue, 13px
- Clicking reveals only the loop structure with blanks as comments, not the solution
- Reveal is animated (smooth height transition)

Section 5 — Solution (hidden until first Run attempt):

- Shows a lock icon + "Run your code first" in text-tertiary until attempted
- After first attempt: "Show solution" text link appears
- Clicking reveals full solution in a Monaco editor instance (read-only, same theme, smaller height)
- Every single line has an inline comment explaining what it does
- "Pattern used" callout below solution: purple left border card, pattern name bold, one sentence explaining what makes this pattern distinct

**Right column** (default 60% width):

Top sub-bar (within the column, 40px):

- Language indicator "JavaScript" in text-tertiary
- Right side: "Reset code" text link (restores starter code after confirmation), keyboard hint "Ctrl + Enter to run" in text-tertiary 12px

Monaco editor:

- Theme: vs-dark but override background to `#0a0a0a` to match app
- Language: javascript
- Font: JetBrains Mono 14px
- Line numbers: on
- Minimap: off
- Word wrap: off
- Scrollbar: thin, auto-hide
- Fills available height minus the results panel below

Results panel (bottom of right column, 220px, border-top `#2a2a2a`):

Default state (before any run): single line of text "Run your code to see results" in text-tertiary, centered.

After running: test case cards in a horizontal scroll row if few, or stacked list if many (>4). Each test card:

```
background: #1a1a1a
border-left: 3px solid green (pass) or red (fail)
border-radius: 6px
padding: 10px 12px
```

Card content:

```
Input:    [value in monospace]
Expected: [value in monospace]
Got:      [value in monospace, red if wrong]
```

"All X tests passed" banner — full width green tinted bar (`#052e16` background, `#22c55e` text) that appears when all pass. canvas-confetti fires once. "Next Problem →" button appears right-aligned inside the banner.

Run button — full width, `#1a1a1a` background, `#2a2a2a` border, white text "Run Code". On click: shows spinner for minimum 500ms, text becomes "Running...". On completion shows pass/fail summary.

---

### Progress Page (`/progress`)

**Page header**: "Progress" title left, two buttons right: "Export Progress" (outline style) and "Import Progress" (outline style).

**Stats row** — 3 cards:

```
Current Streak   X days   (purple accent)
Longest Streak   X days   (blue accent)
Total Solved     X / total (green accent)
```

**Calendar heatmap:**

- GitHub contribution graph style
- SVG rendered, 52 columns (weeks) × 7 rows (days)
- Each cell 12px × 12px, 3px gap
- Colors:
  ```
  0 problems: #1a1a1a
  1 problem:  #14532d
  2 problems: #15803d
  3+ problems:#22c55e
  ```
- Month labels above, day-of-week labels (M W F) on left
- Hover tooltip on each cell: "May 1, 2026 — 3 problems solved" listing problem titles
- Last 52 weeks shown

**Solve history:**

- Section header "Solve history" + total count right-aligned
- List sorted by date descending, grouped by date
- Date group header: "May 1, 2026" in text-secondary 12px, thin divider
- Each solve row: problem title left, category badge + difficulty badge center, time of solve right in text-tertiary
- Clicking a row navigates to that problem

**Export / Import behavior:**

Export: serializes zustand store to JSON, triggers download as `js-trainer-progress-YYYY-MM-DD.json`.

Import: file picker, FileReader, parse JSON, validate shape (check `solvedProblems` key exists), call `useProgressStore.setState(parsed)`, show success toast bottom-right ("Progress restored successfully"). On invalid file show error toast ("Invalid file — progress unchanged").

Toast component: fixed bottom-right, `#111111` background, left border green (success) or red (error), auto-dismisses after 3 seconds, slide-in animation from right.

Auto-export reminder: after every 10th problem solved, show a dismissable banner below the top stats on Dashboard: "You've solved X problems — download a backup so you don't lose your progress." with a "Download now" link and an × to dismiss. Do not show again until next 10-problem milestone. Store dismissed milestone in localStorage.

---

### Zustand Store (`src/store/useProgressStore.ts`)

State:

```typescript
solvedProblems: Record<string, { solvedAt: string; attempts: number }>;
lastActiveDate: string;
currentStreak: number;
longestStreak: number;
dismissedBackupMilestone: number;
```

Actions:

- `markSolved(id)` — adds to solvedProblems with ISO timestamp, calls streak logic
- `incrementAttempts(id)` — increments attempt count
- `resetProgress()` — clears all state
- `dismissBackupBanner(milestone)` — stores dismissed milestone

Streak logic inside `markSolved`: use date-fns `differenceInCalendarDays`. If today === lastActiveDate do nothing. If difference is 1 increment streak. If difference > 1 reset streak to 1. Always update lastActiveDate to today. Update longestStreak if current exceeds it.

Persist entire store to localStorage key `js-trainer-progress` using zustand persist middleware.

---

### Code Execution (`src/runner/executor.ts`)

No backend. Sandboxed iframe pattern:

1. Build a self-contained HTML string containing user code + test runner script
2. Inject into `<iframe sandbox="allow-scripts">` via srcdoc attribute
3. Iframe runs each test case by calling the user's named function with spread input args
4. Posts `{ type: 'results', results: [...] }` back via `window.parent.postMessage`
5. Parent receives message via `window.addEventListener('message', ...)`
6. Parent destroys iframe after receiving results or after 5 second timeout
7. Catch all errors — syntax errors, runtime errors, infinite loops (via timeout)
8. Return structured result per test: `{ input, expected, actual, passed, error }`

---

### Problem Data Model (`src/types/problem.ts`)

```typescript
export type Difficulty = 'Beginner' | 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string;
  title: string;
  category: CategorySlug;
  difficulty: Difficulty;
  functionName: string;
  description: string;
  whatShouldHappen: string[];
  starterCode: string;
  traceTable: {
    inputLabel: string;
    columns: string[];
    rows: Record<string, string | number>[];
  };
  skeletonHint: string;
  solution: string;
  tests: {
    input: unknown;
    expected: unknown;
    label?: string;
  }[];
  patternTag: string;
  patternExplanation: string;
  estimatedMinutes: number;
}
```

Store problems in `src/data/problems/` one TypeScript file per category. Export and merge all in `src/data/index.ts` as a single flat array. The app never needs to change when new problems are added — just drop objects into the category files.

---

### Folder Structure

```
src/
  components/
    layout/
      Sidebar.tsx
      TopBar.tsx
      Layout.tsx
    ui/
      Badge.tsx
      ProgressRing.tsx
      Toast.tsx
      Modal.tsx
      Divider.tsx
    editor/
      CodeEditor.tsx
      ResultsPanel.tsx
    problems/
      ProblemTable.tsx
      FilterBar.tsx
      TraceTable.tsx
      SolutionPanel.tsx
      SkeletonHint.tsx
    progress/
      CalendarHeatmap.tsx
      SolveHistory.tsx
      StatCard.tsx
  data/
    problems/
      basic-loops.ts
      reverse-loops.ts
      for-in-for-of.ts
      nested-loops.ts
      array-building.ts
      object-loops.ts
      two-pointer.ts
      prefix-suffix.ts
      sliding-window.ts
      polyfills.ts
      tricky-patterns.ts
    categories.ts
    index.ts
  runner/
    executor.ts
  store/
    useProgressStore.ts
  types/
    problem.ts
  pages/
    Dashboard.tsx
    ProblemsPage.tsx
    CategoryPage.tsx
    ProblemPage.tsx
    ProgressPage.tsx
  hooks/
    useProgress.ts
    useKeyboardShortcut.ts
  App.tsx
  main.tsx
```

---

### Seed Data Requirement

Each of the 11 category files must contain exactly 2 seed problems following the full Problem type. These are placeholders so the UI renders correctly end to end. Problems will be bulk-added later. The seed problems should be simple and representative of the category — for example basic-loops gets "sum an array" and "find the max", polyfills gets "implement forEach" and "implement map". Full typed objects, no shortcuts.

---

### What NOT to build

No light mode. No auth. No backend. No API calls of any kind. No component library (shadcn, MUI, Chakra etc). No CSS-in-JS. No Redux. Build every UI component from scratch with Tailwind. No package outside the listed stack.

---

That's the complete prompt. Drop it into Cursor or Claude Code as-is. Once the shell is running come back and we'll generate the full problem bank as a separate data drop.
