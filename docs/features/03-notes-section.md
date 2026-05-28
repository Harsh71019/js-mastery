# Feature 03 — Notes Section

## Goal

Three-layer notes system that covers every stage of learning:

1. **Explain it back** — post-solve prompt using the Feynman technique (per problem, stored)
2. **Scratchpad** — free markdown notes visible *while solving*, per problem
3. **Coding journal** — global daily log for broader learnings, unattached to any problem

All three layers write to the same `Note` model. The distinction is the `type` field.

---

## How It Works (User Flow)

### Explain it back
1. User's tests pass on a coding problem
2. Success panel appears (already exists or new modal step)
3. A text box appears: *"In one sentence, what pattern did you use and why does it work?"*
4. User types, hits Save — stored as `type: 'explain'` linked to that `problemId`
5. When that problem appears in the review queue, their previous explanation is shown

### Scratchpad
1. Sidebar of any problem page has a collapsible "Notes" panel
2. Freeform textarea — autosaves on blur / after 1s debounce
3. Markdown rendered below the textarea (live preview toggle)
4. Persists across sessions — same note always there when they return

### Coding Journal
1. `/journal` page accessible from sidebar nav
2. New entry is pre-created for today with the current date as heading
3. User types freely — markdown supported
4. Past entries grouped by date, collapsible
5. Optionally tag an entry to a `patternTag` for cross-referencing

---

## Backend

### New Model — `Note` (`server/src/models/Note.ts`)

```ts
const NoteSchema = new Schema(
  {
    userId:     { type: String, required: true, default: 'default' },
    type:       { type: String, enum: ['explain', 'scratch', 'journal'], required: true },
    problemId:  { type: String, default: null },    // null for journal entries
    patternTag: { type: String, default: null },    // copied from problem at creation
    content:    { type: String, default: '' },
    date:       { type: String },                   // YYYY-MM-DD, used for journal grouping
  },
  { timestamps: true }
)

NoteSchema.index({ userId: 1, type: 1 })
NoteSchema.index({ userId: 1, problemId: 1 })
NoteSchema.index({ userId: 1, date: 1 })

export const Note = model('Note', NoteSchema)
```

---

### Routes (`server/src/routes/notes.ts`) — new file

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/notes` | List all notes. Query: `?type=&problemId=&date=` |
| `POST` | `/api/notes` | Create a note |
| `PUT` | `/api/notes/:id` | Update content |
| `DELETE` | `/api/notes/:id` | Delete a note |
| `GET` | `/api/notes/journal` | All journal entries, newest first |
| `GET` | `/api/notes/explain/:problemId` | Get the explain-it-back note for a problem |
| `GET` | `/api/notes/scratch/:problemId` | Get the scratchpad note for a problem |

Request body for `POST`:
```ts
{
  type:       'explain' | 'scratch' | 'journal'
  problemId?: string
  patternTag?: string
  content:    string
  date?:      string   // YYYY-MM-DD, required for journal
}
```

---

### Controller (`server/src/controllers/noteController.ts`) — new file

All handlers follow the existing pattern: `async`, `try/catch`, consistent `{ success, data }` response shape.

Business rules:
- `explain` and `scratch` notes are **unique per (userId, type, problemId)** — upsert on create
- `journal` notes are **unique per (userId, type, date)** — upsert on create
- `DELETE` only soft-deletes (set `content: ''`) or hard-deletes — hard delete is fine here

---

### Register in `server/src/index.ts`

```ts
import notesRouter from './routes/notes'
app.use('/api/notes', notesRouter)
```

---

## Frontend

### Types (`client/src/types/note.ts`) — new file

```ts
export type NoteType = 'explain' | 'scratch' | 'journal'

export interface Note {
  readonly _id:        string
  readonly type:       NoteType
  readonly problemId:  string | null
  readonly patternTag: string | null
  readonly content:    string
  readonly date:       string | null
  readonly createdAt:  string
  readonly updatedAt:  string
}
```

---

### Hook — `useNote` (`client/src/hooks/useNote.ts`) — new file

```ts
export const useNote = (type: NoteType, problemId?: string, date?: string) => {
  // Fetches the single note matching (type, problemId) or (type, date)
  // Returns: { note, updateNote, isLoading, isSaving }
  // updateNote(content) debounces 800ms then PUTs or POSTs
}
```

### Hook — `useJournal` (`client/src/hooks/useJournal.ts`) — new file

```ts
export const useJournal = () => {
  // Returns: { entries: Note[], todayEntry, createEntry, updateEntry, isLoading }
  // entries grouped by date for rendering
}
```

---

### Component — Scratchpad (`client/src/components/editor/Scratchpad.tsx`) — new

Collapsible panel. Lives in the left sidebar of `CodingProblemView`, below the problem description.

```
┌─────────────────────────────────┐
│  NOTES  ▾                        │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ I always forget to handle │  │
│  │ the empty array case...   │  │
│  └───────────────────────────┘  │
│  [Preview]        Saving... ✓   │
└─────────────────────────────────┘
```

- Textarea with `min-h-24`, expandable
- Autosaves on blur + 800ms debounce on change
- "Saving…" / "Saved ✓" indicator
- Uses `useNote('scratch', problem.id)`
- Collapsed by default on first visit, expanded if note has content

---

### Component — Explain It Back (`client/src/components/editor/ExplainItBack.tsx`) — new

Appears as a step in the success flow after tests pass.

Rendered inside the existing `ResultsPanel` (or as a modal overlay if that's cleaner):

```
┌─────────────────────────────────────────────┐
│  ✓ All tests passed                          │
│                                              │
│  Before you go — explain it back:            │
│  ┌───────────────────────────────────────┐  │
│  │ "I used sliding window to track a    │  │
│  │  running sum without nested loops"   │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  [Skip]                        [Save & Go →] │
└─────────────────────────────────────────────┘
```

- Single-line or short textarea input
- "Skip" dismisses without saving
- "Save & Go" saves as `type: 'explain'`, then proceeds
- If a previous explanation exists, it pre-fills with it (useful on revisit)

Wire up in `client/src/components/editor/ResultsPanel.tsx` — after all tests pass, show this step before the "Next Problem →" button.

---

### Modify `CodingProblemView` (`client/src/components/problems/CodingProblemView.tsx`)

Left panel (problem description side):
- Add `<Scratchpad problemId={problem.id} />` below the trace table / skeleton hint section

Right panel (editor side):
- `ResultsPanel` updated to show `ExplainItBack` after solve

---

### Review Queue Integration

In `ReviewCard.tsx`, when rendering a review item:
- Fetch the `explain` note for that `problemId`
- If it exists, show it as a callout:

```
Your previous explanation:
"I used the two-pointer pattern because both pointers move toward each other
 reducing the search space from O(n²) to O(n)."
```

This reinforces the Feynman loop — user sees what they said, then attempts recall.

---

### Page — Journal (`client/src/pages/JournalPage.tsx`) — new

Route: `/journal`

Layout:
```
┌─────────────────────────────────────────────┐
│  CODING JOURNAL                              │
│                                              │
│  ── 2026-05-10 ─────────────────────────    │
│  ┌─────────────────────────────────────┐   │
│  │ [today's entry — editable]          │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ── 2026-05-09 ─────────────────────────    │
│  ┌─────────────────────────────────────┐   │
│  │ [past entry — click to expand/edit] │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

- Today's entry is always expanded and editable
- Past entries collapsed by default, click to expand (and edit)
- Markdown rendered (simple — bold, italic, code, lists only)
- Simple textarea for editing, rendered markdown for viewing
- "New Entry" automatically creates today's if it doesn't exist

---

### Sidebar Nav

Add "Journal" link to `client/src/components/layout/Layout.tsx` sidebar.

---

## Implementation Phases

### Phase 1 — Backend: Note model + CRUD routes
- `server/src/models/Note.ts`
- `server/src/routes/notes.ts`
- `server/src/controllers/noteController.ts`
- Register in `index.ts`

### Phase 2 — Scratchpad per problem
- `useNote` hook
- `Scratchpad` component
- Wire into `CodingProblemView` left panel

### Phase 3 — Explain it back (post-solve)
- `ExplainItBack` component
- Wire into `ResultsPanel` after all-tests-pass state

### Phase 4 — Journal page
- `useJournal` hook
- `JournalPage` component + route
- Sidebar nav link

### Phase 5 — Review queue explanation display
- Show stored explain note on `ReviewCard`
- Pre-fill `ExplainItBack` when revisiting a solved problem
