# Feature 05 — GoF Design Patterns Track

## Goal

A dedicated learning track for the 23 Gang of Four design patterns implemented in **idiomatic JavaScript**. Each pattern has a theory card (the "why"), one or more implementation problems (the "how"), and a real-world anchor (the "where you've already seen this"). The goal is not pattern memorization — it's making the underlying intent so familiar that you recognise it in any codebase.

---

## Learning Flow per Pattern

```
Theory Card          Implementation Problems       Real-World Anchor
─────────────        ─────────────────────────     ──────────────────
What problem    →    Build it from scratch    →    "This is how Zustand /
does this solve?     (2–3 problems, easy→hard)      React / Express does it"
```

After solving → Recall Mode applies (Feature 01) — user reproduces from memory after 48h.
After solving → Explain It Back applies (Feature 03) — user writes one-sentence Feynman note.

---

## The 23 Patterns — Prioritised

### Phase 1 — 8 Core Patterns (highest JS payoff)

| Pattern | Group | Why it's first |
|---|---|---|
| Observer | Behavioral | Underpins all reactive state, event systems, browser APIs |
| Strategy | Behavioral | Kills switch statements; higher-order functions are the JS form |
| Factory Method | Creational | Idiomatic JS object creation; foundational |
| Decorator | Structural | Express middleware, HOCs, method wrapping |
| Iterator | Behavioral | `Symbol.iterator`, generators, `for...of` — baked into the language |
| Proxy | Structural | Vue 3 reactivity, validation layers, meta-programming |
| Command | Behavioral | Redux actions, undo/redo, task queues |
| Singleton | Creational | ES module caching — you're already using this |

### Phase 2 — 8 Intermediate Patterns

| Pattern | Group |
|---|---|
| Composite | Structural |
| Builder | Creational |
| Facade | Structural |
| Chain of Responsibility | Behavioral |
| Template Method | Behavioral |
| State | Behavioral |
| Mediator | Behavioral |
| Adapter | Structural |

### Phase 3 — 7 Advanced / Academic Patterns

| Pattern | Group | Note |
|---|---|---|
| Abstract Factory | Creational | Rare in JS |
| Flyweight | Structural | Performance niche |
| Bridge | Structural | Mostly OOP-heavy |
| Memento | Behavioral | Niche (undo systems) |
| Visitor | Behavioral | Mostly AST manipulation |
| Interpreter | Behavioral | Language/DSL building |
| Prototype | Creational | The lesson is: JS IS prototypal |

---

## Backend

### Problem Model Extensions (`server/src/models/Problem.ts`)

Add optional fields to `ProblemSchema`:

```ts
// Design patterns fields — only populated for design-pattern track problems
theoryCard: {
  type: new Schema({
    intent:    { type: String },   // "What problem does this solve?" — 1–2 sentences
    when:      { type: String },   // "Use this when..." — bullet-list-friendly string
    structure: { type: String },   // Key components (e.g., "Subject, Observer, ConcreteObserver")
    jsNote:    { type: String },   // "In JS specifically..." — how the classic form differs
  }, { _id: false })
}

realWorldExample: {
  type: new Schema({
    library:     { type: String },   // e.g., "Zustand", "Express", "Node.js"
    description: { type: String },   // One sentence on how the library uses this pattern
    code:        { type: String },   // Read-only code snippet (simplified source)
  }, { _id: false })
}

patternGroup: {
  type: String,
  enum: ['creational', 'structural', 'behavioral'],
}

trackId: {
  type: String,
  default: 'general',
  // 'design-patterns' for this track
}
```

---

### Problem Data Files

New directory: `server/data/problems/design-patterns/`

Three files, one per group:
- `server/data/problems/design-patterns/behavioral.json`
- `server/data/problems/design-patterns/creational.json`
- `server/data/problems/design-patterns/structural.json`

Each problem follows the existing JSON shape plus the new fields.

Seed script already handles subdirectories — verify and extend if needed.

---

### Example Problem JSON — Observer Pattern

```json
{
  "id": "design-observer-1",
  "title": "Build an EventEmitter",
  "category": "design-patterns",
  "difficulty": "Easy",
  "trackId": "design-patterns",
  "patternGroup": "behavioral",
  "patternTag": "observer",
  "patternExplanation": "The Observer pattern defines a one-to-many dependency so that when one object changes state, all its dependents are notified automatically.",
  "estimatedMinutes": 20,
  "status": "published",
  "functionName": "EventEmitter",
  "description": "Implement a simple EventEmitter class with on, off, and emit methods. This is the core of Node.js's event system.",
  "whatShouldHappen": [
    "on(event, listener) registers a listener for the event.",
    "emit(event, ...args) calls all registered listeners for that event.",
    "off(event, listener) removes a specific listener."
  ],
  "theoryCard": {
    "intent": "Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.",
    "when": "When a change to one object requires changing others and you don't know how many objects need to change. When an object should be able to notify other objects without making assumptions about who those objects are.",
    "structure": "Subject (holds list of observers, notifies them) · Observer interface (update method) · ConcreteObserver (reacts to subject changes)",
    "jsNote": "JavaScript has no interfaces. The observer is just a function (callback). The subject is any object that calls those callbacks. This pattern is so common in JS that the browser built it in — addEventListener IS the Observer pattern."
  },
  "realWorldExample": {
    "library": "Node.js EventEmitter",
    "description": "Every Node.js stream, server, and most core modules inherit from EventEmitter. When a TCP socket receives data, it emits 'data' — all listeners registered with .on('data', cb) are called.",
    "code": "const { EventEmitter } = require('events')\nconst emitter = new EventEmitter()\n\nemitter.on('data', (chunk) => console.log('received:', chunk))\nemitter.emit('data', Buffer.from('hello'))\n// → received: <Buffer 68 65 6c 6c 6f>"
  },
  "starterCode": "class EventEmitter {\n  constructor() {\n    // your code here\n  }\n\n  on(event, listener) {\n    // your code here\n  }\n\n  off(event, listener) {\n    // your code here\n  }\n\n  emit(event, ...args) {\n    // your code here\n  }\n}",
  "solution": "class EventEmitter {\n  constructor() {\n    this._listeners = {}\n  }\n\n  on(event, listener) {\n    if (!this._listeners[event]) this._listeners[event] = []\n    this._listeners[event].push(listener)\n    return this\n  }\n\n  off(event, listener) {\n    if (!this._listeners[event]) return this\n    this._listeners[event] = this._listeners[event].filter(l => l !== listener)\n    return this\n  }\n\n  emit(event, ...args) {\n    if (!this._listeners[event]) return false\n    this._listeners[event].forEach(l => l(...args))\n    return true\n  }\n}",
  "skeletonHint": "Store listeners in an object keyed by event name. Each key maps to an array of callback functions.",
  "traceTable": {
    "inputLabel": "emitter.on('click', cb1); emitter.emit('click', 42)",
    "columns": ["call", "_listeners state", "result"],
    "rows": [
      { "call": "on('click', cb1)", "_listeners state": "{ click: [cb1] }", "result": "this" },
      { "call": "emit('click', 42)", "_listeners state": "{ click: [cb1] }", "result": "cb1(42) called" }
    ]
  },
  "tests": [
    { "label": "basic emit", "input": null, "isEval": true },
    { "label": "off removes listener", "input": null, "isEval": true },
    { "label": "multiple listeners", "input": null, "isEval": true },
    { "label": "emit returns false when no listeners", "input": null, "isEval": true }
  ]
}
```

---

### New Routes (`server/src/routes/designPatterns.ts`) — new file

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/patterns/design` | All groups with problem counts and user progress |
| `GET` | `/api/patterns/design/:group` | Problems in a group (`creational`, `structural`, `behavioral`) |

Response for `GET /api/patterns/design`:
```ts
{
  success: true,
  data: Array<{
    group:        'creational' | 'structural' | 'behavioral'
    problemCount: number
    solvedCount:  number    // requires userId context
    patterns:     Array<{
      tag:          string
      name:         string
      problemCount: number
      solved:       boolean
    }>
  }>
}
```

---

## Frontend

### New Page — Design Patterns Landing (`client/src/pages/DesignPatternsPage.tsx`)

Route: `/patterns/design`

Layout — three group cards:

```
┌──────────────────────────────────────────────────────────┐
│  DESIGN PATTERNS TRACK                                    │
│  Learn the 23 GoF patterns in idiomatic JavaScript        │
├──────────────────┬──────────────────┬────────────────────┤
│  CREATIONAL      │  STRUCTURAL      │  BEHAVIORAL        │
│  5 patterns      │  7 patterns      │  11 patterns       │
│  ████░░░ 3/5     │  ██░░░░░ 2/7     │  █░░░░░░ 1/11      │
│                  │                  │                    │
│  Singleton ✓     │  Adapter         │  Observer ✓        │
│  Factory ✓       │  Bridge          │  Strategy          │
│  Builder         │  Composite       │  Command ✓         │
│  Prototype ✓     │  Decorator ✓     │  ...               │
│  Abstract Factory│  Facade          │                    │
└──────────────────┴──────────────────┴────────────────────┘
```

Clicking a group navigates to `/patterns/design/:group`.

---

### New Page — Group Page (`client/src/pages/DesignPatternGroupPage.tsx`)

Route: `/patterns/design/:group`

Problem list using the existing `ProblemTable` component, filtered to `trackId === 'design-patterns'` and the selected group. Same solved/unsolved status indicators.

---

### Component — `TheoryCard` (`client/src/components/problems/TheoryCard.tsx`) — new

Shown at the top of the problem description panel in `CodingProblemView` when `problem.theoryCard` exists.

```
┌─────────────────────────────────────────────────────┐
│  PATTERN THEORY                               [−]   │
├─────────────────────────────────────────────────────┤
│  Intent                                             │
│  Define a one-to-many dependency between objects... │
│                                                     │
│  When to use                                        │
│  • When a change to one object requires changing    │
│    others and you don't know how many               │
│  • When an object should notify others without      │
│    assumptions about who they are                   │
│                                                     │
│  Key components                                     │
│  Subject · Observer · ConcreteObserver              │
│                                                     │
│  In JavaScript                                      │
│  There are no interfaces. The observer is just a    │
│  function. addEventListener IS this pattern.        │
└─────────────────────────────────────────────────────┘
```

- Expanded by default on first visit to a pattern
- Collapsed (shows just title) on return visits if user clicked "Got it"
- State stored in `localStorage` per `problem.patternTag` (just UI state, not progress)

---

### Component — `RealWorldPanel` (`client/src/components/problems/RealWorldPanel.tsx`) — new

Shown in the results area after all tests pass, when `problem.realWorldExample` exists.

```
┌─────────────────────────────────────────────────────┐
│  THIS IS HOW NODE.JS DOES IT                        │
│                                                     │
│  Every stream, server, and core module inherits     │
│  from EventEmitter. When a TCP socket receives      │
│  data, it emits 'data' — exactly what you built.   │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  const { EventEmitter } = require('events') │  │
│  │  const emitter = new EventEmitter()          │  │
│  │  emitter.on('data', (chunk) => {...})        │  │
│  └─────────────────────────────────────────────┘  │
│                    (read-only Monaco snippet)        │
└─────────────────────────────────────────────────────┘
```

- Appears as a panel in `ResultsPanel` after solve, above the "Next Problem →" button
- Code snippet in read-only Monaco (no syntax highlighting config needed — Monaco handles it)
- Collapsed by default, user clicks "See how [Library] uses this →" to expand

---

### Modify `CodingProblemView` (`client/src/components/problems/CodingProblemView.tsx`)

Detect `problem.trackId === 'design-patterns'`:
- Left panel: render `<TheoryCard card={problem.theoryCard} />` above the description
- Right panel / results: render `<RealWorldPanel example={problem.realWorldExample} />` after tests pass

No change to any other problem type rendering.

---

### Sidebar Nav

Add to the "Patterns" section in sidebar:
```
Patterns
  ├─ Algorithmic  → /patterns
  └─ Design       → /patterns/design   ← new
```

---

### Problem Listing Integration

`ProblemsPage` and `QuizPage` filters already support `category`. Design pattern problems have `category: 'design-patterns'` — they appear naturally in the problems list with no changes needed.

---

## Content Spec — Phase 1 (8 patterns × 2–3 problems)

| Pattern | Problem 1 | Problem 2 | Problem 3 |
|---|---|---|---|
| Observer | EventEmitter (on/off/emit) | once() — call listener only once | Reactive object (notify on property change) |
| Strategy | Sort with strategy fn | Form validator with strategies | Rate limiter with strategy |
| Factory Method | Shape factory | User role factory | — |
| Decorator | Function logger decorator | Retry decorator | Memoize decorator |
| Iterator | Range iterator (Symbol.iterator) | Linked list iterator | Infinite sequence generator |
| Proxy | Read-only proxy | Validation proxy | Reactive proxy (auto-notify) |
| Command | Undo/redo stack | Async command queue | — |
| Singleton | Config manager | DB connection pool (mock) | — |

Total Phase 1: ~20 problems

---

## Implementation Phases

### Phase 1 — Model extensions
- Add `theoryCard`, `realWorldExample`, `patternGroup`, `trackId` to `Problem` model
- Update TypeScript types in `server/src/types/`

### Phase 2 — Routes
- `GET /api/patterns/design` — group listing with counts
- `GET /api/patterns/design/:group` — problems by group
- Register in `server/src/index.ts`

### Phase 3 — Content: Phase 1 problem JSONs
- Write all 8 pattern JSON files (behavioral.json, creational.json, structural.json)
- Run `npm run seed` to verify upsert
- Verify all appear in `/api/problems` with `category=design-patterns`

### Phase 4 — Design Patterns landing page
- `DesignPatternsPage` at `/patterns/design`
- `DesignPatternGroupPage` at `/patterns/design/:group`
- Register routes in `App.tsx`
- Sidebar nav links

### Phase 5 — TheoryCard component
- `TheoryCard` component
- Wire into `CodingProblemView` with `trackId` guard

### Phase 6 — RealWorldPanel component
- `RealWorldPanel` component
- Wire into `ResultsPanel` with `trackId` guard

### Phase 7 — Phase 2 + 3 content
- Write remaining 15 pattern problem JSONs
- Seed and verify
