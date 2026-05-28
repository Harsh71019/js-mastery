# Feature 04 — Reading / Resources Section

## Goal

A curated library of articles, blog posts, and videos tagged to `patternTag` values and JS topics. Users can browse by category, mark items as read, and see related reading directly on problem and pattern pages. Treats reading like a first-class learning activity — tracked in stats alongside problem solving.

---

## How It Works (User Flow)

1. User finishes a sliding-window problem → sees "Further Reading" panel with 2–3 linked articles
2. User visits `/resources` → browsable library with tabs: All / JS Engine / Patterns / Articles / Videos
3. User marks an article as read → count tracked in stats
4. Stats page shows: *"Read 12 resources this week"*
5. Pattern page (`/patterns/:tag`) has a "Further Reading" section at the bottom

---

## Content Plan

### Categories

| Category | Description | Examples |
|---|---|---|
| `engine` | JS engine internals | V8 blog posts, event loop, JIT, hidden classes, GC |
| `pattern` | Algorithmic patterns | Sliding window, two-pointer, prefix sum explanations |
| `design` | Design patterns | GoF in JS, functional patterns, async patterns |
| `article` | General JS engineering | Dan Abramov posts, Lydia Hallie, JavaScript.info |
| `video` | Video content | Fireship, JSConf talks, Fun Fun Function |

### Initial Curated List (Phase 1 — 30 resources)

**JS Engine (8)**
- V8: "What's inside the V8 engine"
- Jake Archibald: "In the loop" (event loop talk)
- V8 blog: "Understanding V8's bytecode"
- Lydia Hallie: "JavaScript Visualized: Event Loop"
- MDN: "Memory Management in JavaScript"
- V8: "Optimizing prototypes"
- Philip Roberts: "What the heck is the event loop?" (JSConf)
- V8: "Elements kinds in V8"

**Algorithmic Patterns (10)**
- "The Sliding Window Technique" — NeetCode
- "Two Pointer Problems — A Visual Guide"
- "Prefix Sums Explained"
- "Understanding Recursion — draw the call stack"
- "Nested loops and when to avoid them"
- "For...in vs for...of — when each is correct"
- "Array methods under the hood — map, filter, reduce"
- "Understanding closures in loops — the classic bug"
- "Object.keys / values / entries patterns"
- "Reverse iteration — why and how"

**Design Patterns (7)**
- "JavaScript Design Patterns — Addy Osmani (free book)"
- "The Observer Pattern in JS — how React state works"
- "Factory functions vs Classes in JS"
- "The Module Pattern — why ES modules are singletons"
- "Proxy and Reflect in JavaScript"
- "The Strategy Pattern with higher-order functions"
- "Understanding Decorator in JS and TypeScript"

**Articles (5)**
- "A Complete Guide to useEffect" — Dan Abramov
- "JavaScript Closures — MDN"
- "You Don't Know JS (free online)"
- "How to think in terms of functions"
- "Functional Programming concepts in JavaScript"

---

## Backend

### Data Format

Resources stored as JSON (same pattern as problems).

File: `server/data/resources/resources.json`

```json
[
  {
    "id": "v8-inside-engine",
    "title": "What's Inside the V8 Engine",
    "url": "https://...",
    "description": "Deep dive into how V8 compiles and optimizes JavaScript.",
    "source": "V8 Blog",
    "category": "engine",
    "patternTags": [],
    "difficulty": "intermediate",
    "estimatedMinutes": 15,
    "status": "published"
  },
  {
    "id": "sliding-window-guide",
    "title": "The Sliding Window Technique",
    "url": "https://...",
    "description": "Visual explanation of the sliding window pattern with JS examples.",
    "source": "NeetCode",
    "category": "pattern",
    "patternTags": ["sliding-window"],
    "difficulty": "beginner",
    "estimatedMinutes": 10,
    "status": "published"
  }
]
```

---

### New Model — `Resource` (`server/src/models/Resource.ts`)

```ts
const ResourceSchema = new Schema(
  {
    id:               { type: String, required: true, unique: true },
    title:            { type: String, required: true },
    url:              { type: String, required: true },
    description:      { type: String, required: true },
    source:           { type: String, required: true },
    category:         { type: String, enum: ['engine', 'pattern', 'design', 'article', 'video'], required: true },
    patternTags:      { type: [String], default: [] },
    difficulty:       { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    estimatedMinutes: { type: Number, required: true },
    status:           { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true }
)

ResourceSchema.index({ status: 1, category: 1 })
ResourceSchema.index({ status: 1, patternTags: 1 })

export const Resource = model('Resource', ResourceSchema)
```

---

### Progress Model Changes (`server/src/models/Progress.ts`)

Add to `ProgressSchema`:
```ts
readResources: { type: [String], default: [] }   // array of resource IDs
```

---

### Routes (`server/src/routes/resources.ts`) — new file

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/resources` | List published resources. Query: `?category=&patternTag=&difficulty=` |
| `GET` | `/api/resources/:id` | Single resource |
| `POST` | `/api/progress/resource/:id/read` | Mark resource as read |
| `DELETE` | `/api/progress/resource/:id/read` | Mark resource as unread |

`GET /api/resources` response shape:
```ts
{
  success: true,
  data: Resource[]
}
```

---

### Seed Script Extension (`server/src/seed.ts`)

Add resource seeding alongside problem seeding:
```ts
import resourceData from '../data/resources/resources.json'
// Same upsert pattern as problems, keyed on `id`
```

---

### Register in `server/src/index.ts`

```ts
import resourcesRouter from './routes/resources'
app.use('/api/resources', resourcesRouter)
```

---

## Frontend

### Types (`client/src/types/resource.ts`) — new file

```ts
export type ResourceCategory = 'engine' | 'pattern' | 'design' | 'article' | 'video'
export type ResourceDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Resource {
  readonly id:               string
  readonly title:            string
  readonly url:              string
  readonly description:      string
  readonly source:           string
  readonly category:         ResourceCategory
  readonly patternTags:      readonly string[]
  readonly difficulty:       ResourceDifficulty
  readonly estimatedMinutes: number
}
```

---

### Store Changes (`client/src/store/useProgressStore.ts`)

Add to `ProgressState`:
```ts
readResources: string[]
```

Add actions:
```ts
markResourceRead:   (id: string) => void
markResourceUnread: (id: string) => void
```

Both optimistic-update + server sync, same pattern as `markSolved`.

---

### Hook — `useResources` (`client/src/hooks/useResources.ts`) — new

```ts
interface ResourceFilters {
  category?:   ResourceCategory | 'all'
  patternTag?: string
  difficulty?: ResourceDifficulty | 'all'
}

export const useResources = (filters?: ResourceFilters) => {
  // returns: { resources, isLoading, error }
}
```

### Hook — `usePatternResources` (`client/src/hooks/usePatternResources.ts`) — new

```ts
export const usePatternResources = (patternTag: string) => {
  // Calls useResources({ patternTag })
  // Returns top 3–5 relevant resources for that pattern
}
```

---

### Component — `ResourceCard` (`client/src/components/resources/ResourceCard.tsx`) — new

```
┌─────────────────────────────────────────────────┐
│  [PATTERN]  ·  NeetCode  ·  10 min              │
│                                                  │
│  The Sliding Window Technique                    │
│  Visual explanation with JS examples...          │
│                                                  │
│  ●●○  intermediate          [○ Mark as read]     │
└─────────────────────────────────────────────────┘
```

- Source badge (accent-blue for V8, accent-green for MDN, etc.)
- Difficulty dots (3 dots, filled based on difficulty)
- Estimated time
- Read/unread toggle (star or checkbox icon)
- Clicking the card opens the URL in a new tab

---

### Page — Resources (`client/src/pages/ResourcesPage.tsx`) — new

Route: `/resources`

Layout:
- Category tabs at top: `ALL` / `ENGINE` / `PATTERNS` / `DESIGN` / `ARTICLES` / `VIDEOS`
- Difficulty filter bar below tabs
- Grid of `ResourceCard` components (2 columns on desktop, 1 on mobile)
- Read count at top: *"You've read 8 of 30 resources"*

---

### Pattern Page Integration (`client/src/pages/PatternPage.tsx`)

After the existing problem list, add a "Further Reading" section:

```
─── Further Reading ─────────────────────────────

  [ResourceCard]  [ResourceCard]  [ResourceCard]

```

Uses `usePatternResources(tag)`. If no resources for that tag → section hidden.

---

### Problem Page Integration

In `CodingProblemView.tsx` left panel, below the trace table:

Small "Related Reading" block — shows 1–2 resource titles as links.

```
📖 Related Reading
• The Sliding Window Technique — NeetCode
• Arrays in V8 — V8 Blog
```

Opens in new tab. Uses `usePatternResources(problem.patternTag)`, takes first 2.

---

### Stats Page Addition

Add to `StatsPage.tsx`:
- "Resources read" count in the header stat cards
- Reading trend: articles read per week (bar chart, same style as existing)

---

### Sidebar Nav

Add "Resources" link to sidebar below "Patterns".

---

## Implementation Phases

### Phase 1 — Content + seed
- Write `server/data/resources/resources.json` (30 initial entries)
- `Resource` model
- Extend seed script to handle resources

### Phase 2 — Backend routes
- `GET /api/resources` with filters
- `GET /api/resources/:id`
- `POST/DELETE /api/progress/resource/:id/read`
- Add `readResources` to Progress model

### Phase 3 — Resources page
- `useResources` hook
- `ResourceCard` component
- `ResourcesPage` with tabs + grid
- Sidebar nav link

### Phase 4 — Pattern page integration
- `usePatternResources` hook
- "Further Reading" section on `PatternPage`

### Phase 5 — Problem page integration
- "Related Reading" panel in `CodingProblemView`

### Phase 6 — Stats + store
- `markResourceRead` / `markResourceUnread` in store
- Stats page reading metrics
- Read tracking wired to `ResourceCard` toggle
