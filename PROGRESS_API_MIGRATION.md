# Progress API Migration Plan

Move progress tracking (solved problems, streaks, attempts) from
Zustand + localStorage to MongoDB Atlas via an Express API. The server
becomes the source of truth. Zustand stays as the local in-memory state
manager (no persist middleware) and syncs on every action.

---

## Why

- Progress survives a localStorage clear or browser reset
- Export/import becomes a server operation — no manual file downloads needed
- Foundation for multi-device sync in future (add auth and it just works)
- Consistent with moving problems to the server — one place for all data

---

## What Changes

| Thing | Before | After |
|---|---|---|
| Progress store | Zustand + localStorage persist | Zustand in-memory only |
| Source of truth | localStorage | MongoDB Atlas |
| On app load | Rehydrate from localStorage | Fetch `GET /api/progress` |
| markSolved | Update local store | POST to API → update store |
| incrementAttempts | Update local store | POST to API → update store |
| Streak calculation | Client-side in store | Server-side in route handler |
| Export | Strip actions, download JSON | `GET /api/progress/export` |
| Import | Parse file, setState | `POST /api/progress/import` |
| Reset | Set INITIAL_STATE in store | `DELETE /api/progress` → clear store |

---

## MongoDB Schema

Single document per user. Since this is personal/local, `userId` is
always `'default'`. Schema is ready for multi-user when auth is added.

```typescript
const SolvedEntrySchema = new Schema({
  solvedAt: { type: String, default: '' },
  attempts: { type: Number, default: 0 },
  title: String,
  category: String,
  difficulty: String,
}, { _id: false })

const ProgressSchema = new Schema({
  userId: { type: String, required: true, unique: true, default: 'default' },
  solvedProblems: { type: Map, of: SolvedEntrySchema, default: {} },
  lastActiveDate: { type: String, default: '' },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  dismissedBackupMilestone: { type: Number, default: 0 },
}, { timestamps: true })
```

---

## API Contract

Base path: `/api/progress`

---

### `GET /api/progress`

Returns the full progress state for the default user.
Creates an empty document if one does not exist yet.

**Response 200**
```json
{
  "solvedProblems": {
    "basic-loops-1": {
      "solvedAt": "2026-05-01T14:22:00.000Z",
      "attempts": 2,
      "title": "Sum an Array",
      "category": "basic-loops",
      "difficulty": "Beginner"
    }
  },
  "lastActiveDate": "2026-05-01",
  "currentStreak": 3,
  "longestStreak": 7,
  "dismissedBackupMilestone": 10
}
```

---

### `POST /api/progress/solve/:problemId`

Marks a problem as solved. Handles streak update server-side.
`solvedAt` is set on first solve only — re-solves only increment attempts.

**Request body**
```json
{ "title": "Sum an Array", "category": "basic-loops", "difficulty": "Beginner" }
```

**Response 200** — returns updated full progress state (same shape as GET)

---

### `POST /api/progress/attempt/:problemId`

Increments attempt count for a problem that was NOT solved (failed run).
Does not update streaks.

**Response 200** — returns updated full progress state

---

### `DELETE /api/progress`

Resets all progress. Replaces the document with a clean initial state.

**Response 200**
```json
{ "ok": true }
```

---

### `PUT /api/progress/dismiss-banner/:milestone`

Stores the milestone number the user dismissed the backup banner at.

**Response 200** — returns updated full progress state

---

### `POST /api/progress/import`

Bulk-replaces progress with the provided state.
Used by the Import Progress button on the Progress page.

**Request body** — same shape as GET response
**Response 200** — returns the imported state

---

### `GET /api/progress/export`

Returns the raw progress JSON as a downloadable file.

**Response 200**
```
Content-Disposition: attachment; filename="js-trainer-progress-YYYY-MM-DD.json"
Content-Type: application/json
```

---

## Client Changes

### `useProgressStore.ts`
- Remove `persist` middleware and `zustand/middleware` import
- Add `loadProgress` action — fetches `GET /api/progress`, sets state
- `markSolved(id, meta)` — POST to API, then update local store on success
- `incrementAttempts(id)` — POST to API, then update local store on success
- `resetProgress()` — DELETE to API, then clear local store
- `dismissBackupBanner(milestone)` — PUT to API, then update local store
- All API actions are **optimistic** — local state updates immediately,
  API call happens in background, rolls back on error

### `App.tsx`
- Call `loadProgress()` on mount (useEffect) to hydrate store from API

### `ProgressPage.tsx`
- Remove manual export/import logic
- Export button hits `GET /api/progress/export` (browser download)
- Import button POSTs file contents to `POST /api/progress/import`

---

## Streak Calculation (moves to server)

The `getUpdatedStreak` function currently lives in the client store.
It moves to `server/src/utils/streak.ts` and is called inside the
`POST /api/progress/solve/:problemId` handler.

```typescript
// server/src/utils/streak.ts
export const getUpdatedStreak = (
  currentStreak: number,
  longestStreak: number,
  lastActiveDate: string,
  today: string,
): { currentStreak: number; longestStreak: number; lastActiveDate: string }
```

---

## Optimistic Update Pattern

Every store action follows this pattern:

```
1. Update local Zustand state immediately (UI feels instant)
2. POST/PUT/DELETE to API in background
3. On success: optionally sync server response back to store
4. On error: log error (for personal local use, server is always up)
```

Since this is local-only and the server is always running, the error
path is just a console.error — no rollback UI needed.

---

## Phase Checklist

- [ ] **Step 1** — Server: Progress Mongoose model + `server/src/utils/streak.ts`
- [ ] **Step 2** — Server: All `/api/progress` routes (GET, POST solve, POST attempt, DELETE, PUT banner, POST import, GET export)
- [ ] **Step 3** — Client: Rewrite `useProgressStore` — remove persist, add `loadProgress`, wire all actions to API
- [ ] **Step 4** — Client: `App.tsx` calls `loadProgress` on mount
- [ ] **Step 5** — Client: `ProgressPage` export/import via API endpoints
- [ ] **Step 6** — Test full flow: solve a problem, check Atlas, reload app, verify state restored from API
