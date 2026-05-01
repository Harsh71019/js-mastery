# Fullstack Migration Plan

JS Trainer moves from a fully static client-side SPA to a client + Express API architecture.
Problems are served from MongoDB Atlas instead of bundled TypeScript files. Progress tracking
stays client-side (Zustand + localStorage) — it is per-user state and has no reason to live on a server.

---

## Motivation

- 200+ problems per category (11 categories = 2000+ problems total) makes static TS files unmanageable
- Problems can be edited, added, or reordered from MongoDB Compass without touching code
- Pagination and server-side filtering keep the frontend bundle lean regardless of problem count
- Single Atlas free-tier cluster, personal local use only — no hosting or ops overhead

---

## Monorepo Structure (post-migration)

```
JS_MASTERY_APP/                  ← git root (unchanged)
├── client/                      ← everything currently at root moves here
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── data/
│   │   │   └── categories.ts    ← stays (static, UI-only)
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── runner/
│   │   ├── store/
│   │   └── types/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts           ← proxy /api → localhost:3001
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   └── tsconfig.node.json
│
├── server/                      ← new
│   ├── src/
│   │   ├── models/
│   │   │   └── Problem.ts       ← Mongoose schema
│   │   ├── routes/
│   │   │   └── problems.ts      ← all /api/problems routes
│   │   ├── seed.ts              ← one-time migration script
│   │   └── index.ts             ← Express app entry
│   ├── .env                     ← MONGODB_URI, PORT (gitignored)
│   ├── .env.example             ← committed, no secrets
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                 ← root: concurrently runs both
├── .gitignore                   ← covers client/ + server/ + root
├── CLAUDE.md
├── FULLSTACK_MIGRATION.md       ← this file
└── PhasesImplementationPlan.md
```

---

## Server Tech Stack

| Package | Purpose |
|---|---|
| `express` | HTTP server |
| `mongoose` | MongoDB ODM |
| `dotenv` | Load `.env` into `process.env` |
| `cors` | Allow requests from Vite dev server |
| `ts-node-dev` | TypeScript hot reload in development |
| `typescript` | Server-side types |
| `@types/express` | Express type definitions |
| `@types/cors` | CORS type definitions |

---

## Environment Variables

### `server/.env` (gitignored, never committed)

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/js-trainer?retryWrites=true&w=majority
PORT=3001
```

### `server/.env.example` (committed)

```env
MONGODB_URI=
PORT=3001
```

---

## Mongoose Schema

Mirrors the `Problem` interface from `client/src/types/problem.ts` exactly.

```typescript
const TestCaseSchema = new Schema({
  input: Schema.Types.Mixed,
  expected: Schema.Types.Mixed,
  label: String,
})

const TraceTableSchema = new Schema({
  inputLabel: { type: String, required: true },
  columns: [String],
  rows: [Schema.Types.Mixed],
})

const ProblemSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Easy', 'Medium', 'Hard'], required: true },
  functionName: { type: String, required: true },
  description: { type: String, required: true },
  whatShouldHappen: [String],
  starterCode: { type: String, required: true },
  solution: { type: String, required: true },
  traceTable: TraceTableSchema,
  skeletonHint: String,
  tests: [TestCaseSchema],
  patternTag: { type: String, required: true },
  patternExplanation: { type: String, required: true },
  estimatedMinutes: { type: Number, required: true },
}, { timestamps: true })
```

---

## API Contract

Base URL (dev): `http://localhost:3001`  
All endpoints return `Content-Type: application/json`.  
Errors always return `{ "error": "<message>" }` with the appropriate status code.

---

### `GET /api/health`

Health check. Used to verify the server is running.

**Response 200**
```json
{ "ok": true }
```

---

### `GET /api/problems`

Paginated, filterable problem list. Returns lightweight fields only (no `solution`, `tests`, `traceTable`, `starterCode`).

**Query params**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number (1-indexed) |
| `limit` | number | `20` | Results per page (max 100) |
| `category` | string | — | Filter by `CategorySlug` |
| `difficulty` | string | — | `Beginner`, `Easy`, `Medium`, `Hard` |
| `search` | string | — | Case-insensitive match on `title` |

**Response 200**
```json
{
  "problems": [
    {
      "id": "sum-array",
      "title": "Sum Array",
      "category": "basic-loops",
      "difficulty": "Beginner",
      "patternTag": "Accumulator",
      "estimatedMinutes": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 143,
    "totalPages": 8
  }
}
```

---

### `GET /api/problems/:id`

Full problem document. Called when a user opens the problem solve screen.

**Response 200**
```json
{
  "id": "sum-array",
  "title": "Sum Array",
  "category": "basic-loops",
  "difficulty": "Beginner",
  "functionName": "sumArray",
  "description": "...",
  "whatShouldHappen": ["..."],
  "starterCode": "function sumArray(arr) {\n\n}",
  "solution": "...",
  "traceTable": { "inputLabel": "...", "columns": [], "rows": [] },
  "skeletonHint": "...",
  "tests": [{ "input": [[1,2,3]], "expected": 6 }],
  "patternTag": "Accumulator",
  "patternExplanation": "...",
  "estimatedMinutes": 5
}
```

**Response 404**
```json
{ "error": "Problem not found" }
```

---

### `GET /api/categories`

Returns each category slug with its total problem count from the DB.

**Response 200**
```json
[
  { "slug": "basic-loops", "count": 18 },
  { "slug": "array-building", "count": 22 }
]
```

---

## Frontend Hook Contracts

These replace the static `getProblemById` / `getAllProblems` helpers.

### `useProblems(filters, page)`

```typescript
interface ProblemFilters {
  category: string
  difficulty: string
  search: string
}

interface UseProblemListResult {
  problems: readonly ProblemSummary[]
  pagination: Pagination
  isLoading: boolean
  error: string | null
}
```

### `useProblem(id)`

```typescript
interface UseProblemResult {
  problem: Problem | null
  isLoading: boolean
  error: string | null
}
```

---

## Vite Proxy Config

Avoids CORS entirely in development. Add to `client/vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': 'http://localhost:3001',
  },
},
```

All fetch calls in the client use `/api/...` (no hardcoded host).

---

## Running Locally

### First-time setup

```bash
# Install root deps (concurrently)
npm install

# Install client deps
cd client && npm install

# Install server deps
cd ../server && npm install

# Copy env file and fill in your Atlas URI
cp .env.example .env

# Seed Atlas from existing static problem files (run once)
npm run seed
```

### Daily development

```bash
# From repo root — starts both client (5173) and server (3001)
npm run dev
```

### Root `package.json` scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix client\" \"npm run dev --prefix server\"",
    "build": "npm run build --prefix client",
    "seed": "npm run seed --prefix server"
  }
}
```

---

## Seed Script

`server/src/seed.ts` — run once after setting up `.env`.

- Reads all problem arrays from the static files currently in `client/src/data/problems/`
- Drops existing `problems` collection (clean slate)
- Bulk-inserts all problems
- Logs count per category and total

```bash
cd server && npm run seed
```

After seeding, verify in MongoDB Compass: database `js-trainer`, collection `problems`.

---

## What Does NOT Move to the Server

| Thing | Stays where |
|---|---|
| Progress (solved problems, streaks) | Zustand + localStorage in client |
| Categories list (slugs + colors) | `client/src/data/categories.ts` |
| Code execution (iframe sandbox) | `client/src/runner/executor.ts` |
| All UI components | `client/src/components/` |

---

## Phase Checklist

- [ ] **Phase 1** — Monorepo restructure: move frontend into `client/`, scaffold `server/`, root `package.json`, root `.gitignore`
- [ ] **Phase 2** — Express server: TypeScript setup, Atlas connection, health endpoint, Problem Mongoose model
- [ ] **Phase 3** — Seed script: migrate all existing static problems into Atlas, verify in Compass
- [ ] **Phase 4** — API routes: `GET /api/problems` (paginated + filtered), `GET /api/problems/:id`, `GET /api/categories`
- [ ] **Phase 5** — Frontend integration: `useProblems` + `useProblem` hooks, update all pages, remove static problem files
- [ ] **Phase 6** — Pagination UI + polish: pagination controls on ProblemsPage, server-side search/filter wired up, loading skeletons

Each phase is committed and reviewed before the next begins.
