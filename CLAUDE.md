# CLAUDE.md — JS Loop & Iteration Mastery Trainer

## Role

You are an expert full-stack engineer with deep knowledge of React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, Monaco Editor, Express, Mongoose, and MongoDB Atlas. You write strongly typed, production-quality code on both client and server. You never scaffold and leave gaps — every function is complete, every edge case handled.

---

## Monorepo structure

```
/
├── client/          React SPA (Vite + TS + Tailwind v4 + Zustand + Monaco)
├── server/          Express API (TS + Mongoose + MongoDB Atlas)
├── package.json     Root: runs both with concurrently
```

`client/CLAUDE.md` holds all client-specific rules. This file covers the server and cross-cutting concerns.

---

## Dev commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts client (5173) + server (3001) concurrently |
| `npm run seed` | Seeds all problems from `server/data/problems/` (upsert-safe) |
| `npm run build` | Vite production build of client |
| `npm run list-titles` | Prints all seeded problem titles |

Vite proxies `/api/*` → `http://localhost:3001`. Never hardcode the server URL in the client.

---

## Stack

**Client**: React 19, TypeScript 6, Vite 8, Tailwind CSS v4 (`@import "tailwindcss"` + `@theme` tokens), Zustand v5, `@monaco-editor/react` (lazy-loaded), `react-router-dom` v7, `date-fns`, `lucide-react`

**Server**: Express 4, Mongoose 8, MongoDB Atlas, `date-fns`, `ts-node-dev`, `dotenv`

**No test runner, no ORM other than Mongoose, no UI library.**

---

## Architecture

### Data flow
1. Problems live as JSON in `server/data/problems/` — one file per category slug.
2. `npm run seed` upserts them into MongoDB (`Problem` collection). Re-running is safe.
3. Client never has local copies of problems. All reads go through the API.
4. Progress is a single `Progress` document per user (`userId: 'default'`) in MongoDB.
5. Client uses optimistic updates (Zustand) then syncs to server in the background.

### Key client hooks
- `useProblem(id)` — fetches `/api/problems/:id`, returns `{ problem, prevId, nextId }`
- `useProblems(filters, page)` — paginated list with cancellation on filter change
- `useProblemCounts()` — fetches `/api/problems/categories/counts`
- `useProgress()` — reads Zustand store (hydrated from `/api/progress` on app mount)

### Progress store (`client/src/store/useProgressStore.ts`)
- No Zustand persist middleware — server is the source of truth.
- `loadProgress` runs once on mount (`App.tsx`).
- `markSolved(id, meta)` and `incrementAttempts(id)` update Zustand immediately, then POST to server.
- Problem metadata (title, category, difficulty) is stored in `SolvedEntry` at solve time because the client has no local problem data.

---

## Server rules

### Route files (`server/src/routes/`)
- Define specific routes before parameterized ones. `/categories/counts` must come before `/:id` or 'categories' matches as an ID.
- Every route handler must be `async` and wrapped in `try/catch`. Never let unhandled promise rejections crash the server.
- Return consistent shapes: success responses always include the full updated state; error responses always include `{ error: string }`.
- No business logic inside route handlers. Extract to `server/src/utils/`.

### Models (`server/src/models/`)
- `Problem`: `id` (unique string slug), `status: 'draft' | 'published'`. Only `published` problems are returned by the API.
- `Progress`: one document per `userId`. `solvedProblems` is a Mongoose `Map`. Streak fields are always recalculated server-side.

### Streak logic
- Lives in `server/src/utils/streak.ts` — `getUpdatedStreak(current, today)`.
- Called on every `POST /api/progress/solve/:id`. Never run streak logic on the client.

### Seed script (`server/src/seed.ts`)
- Uses `updateOne` with `upsert: true` keyed on `id`. Safe to re-run.
- Catches error code `11000` (duplicate title) and counts as skipped, not a crash.
- Source of truth: JSON files in `server/data/problems/<category-slug>.json`.

---

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/problems` | Paginated list (`page`, `limit`, `category`, `difficulty`, `search`) |
| GET | `/api/problems/:id` | Single problem + `prevId` + `nextId` |
| GET | `/api/problems/categories/counts` | `[{ slug, count }]` — published only |
| GET | `/api/progress` | Full progress state for `userId: 'default'` |
| POST | `/api/progress/solve/:problemId` | Mark solved, recalculate streak, return full state |
| POST | `/api/progress/attempt/:problemId` | Increment attempts only, return full state |
| DELETE | `/api/progress` | Reset all progress |
| PUT | `/api/progress/dismiss-banner/:milestone` | Dismiss backup reminder |
| POST | `/api/progress/import` | Bulk replace progress |
| GET | `/api/progress/export` | Download progress JSON |

---

## Adding problems

1. Drop a new object into the relevant `server/data/problems/<category>.json` file.
2. Run `npm run seed`. The upsert picks it up — no other files change.
3. Every problem needs all required fields: `id`, `title`, `category`, `difficulty`, `functionName`, `description`, `whatShouldHappen`, `starterCode`, `solution`, `traceTable`, `skeletonHint`, `tests` (min 4), `patternTag`, `patternExplanation`, `estimatedMinutes`.
4. Set `"status": "published"` or it won't appear in the API.

---

## What never to do

- Never add `localStorage` usage on the client — server is the source of truth.
- Never run streak calculation on the client — always server-side.
- Never import problem data statically on the client — fetch from the API.
- Never define a parameterized route before a specific route at the same path level.
- Never use `eval()` — user code runs in the sandboxed iframe (`client/src/runner/executor.ts`).
- Never install packages outside the approved stack above without discussion.
- Never hardcode `userId` anywhere other than `server/src/routes/progress.ts` — it is `'default'` only until auth is added.
