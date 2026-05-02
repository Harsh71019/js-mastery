# JS Loop & Iteration Mastery Trainer

A full-stack monorepo application for practicing JavaScript loop patterns and iteration logic. Inspired by the clean, minimal aesthetic of NeetCode, it provides a structured path for mastering algorithmic thinking in JavaScript through interactive coding problems.

## Project Overview

The project is a specialized training platform designed to help developers master common JavaScript patterns (loops, pointers, sliding windows, etc.). It features a sandboxed code execution environment, progress tracking with streaks and heatmaps, and a comprehensive set of curated problems categorized by difficulty and pattern.

### Technology Stack

- **Frontend:**
  - **Framework:** React 19 (TypeScript)
  - **Build Tool:** Vite 8
  - **Styling:** Tailwind CSS v4 (Dark-only theme)
  - **State Management:** Zustand v5
  - **Editor:** @monaco-editor/react (lazy-loaded)
  - **Icons:** Lucide React
  - **Routing:** React Router v7

- **Backend:**
  - **Runtime:** Node.js (Express)
  - **Language:** TypeScript
  - **Database:** MongoDB Atlas (Mongoose)
  - **Data Storage:** Problems are stored as JSON files and seeded into the database.

## Architecture

### Monorepo Structure

- `/client`: React SPA. Contains the UI, code execution runner, and state logic.
- `/server`: Express API. Handles problem serving, progress persistence, and streak logic.
- `/scripts`: Utility scripts for managing problems.

### Data Flow

1. **Problems:** Defined as JSON in `server/data/problems/`.
2. **Seeding:** `npm run seed` upserts these problems into MongoDB.
3. **API:** The client fetches problems and categories via `/api/problems`.
4. **Execution:** User code is executed in a sandboxed iframe on the client (`client/src/runner/executor.ts`).
5. **Progress:** Solved problems and attempts are tracked in Zustand and synced to the server via `/api/progress`.

## Building and Running

### Development

To start both the client and server concurrently:

```bash
# From the root directory
npm install
npm run dev
```

- **Client:** http://localhost:5173
- **Server:** http://localhost:3001 (API proxied via `/api`)

### Database Seeding

To populate the local or remote MongoDB with problem data:

```bash
npm run seed
```

### Production Build

To build the client for production:

```bash
npm run build --prefix client
```

## Development Conventions

### Coding Style & Standards

- **TypeScript:** Use strict typing. Avoid `any`. Interfaces are preferred for data models.
- **Components:** Functional components with React hooks.
- **Styling:** Use Tailwind CSS v4 variables (e.g., `bg-bg-primary`, `text-accent-blue`) defined in `client/src/index.css`.
- **Design System:** Stick to the "Dark-only" design. Use the primary palette:
  - Background: `#0a0a0a` (Primary), `#111111` (Secondary), `#1a1a1a` (Tertiary)
  - Accents: Blue (`#3b82f6`), Green (`#22c55e`), Amber (`#f59e0b`), Red (`#ef4444`), Purple (`#a855f7`)

### Server Rules

- **API Routes:** Parameterized routes (e.g., `/:id`) should follow specific routes (e.g., `/categories/counts`).
- **Logic:** Business logic (streaks, validation) belongs in `server/src/utils/`, not controllers.
- **Sync:** Client uses optimistic updates for progress, but the server is the source of truth for streaks and official records.

### Adding New Problems

1. Add the problem object to the appropriate category JSON in `server/data/problems/`.
2. Ensure it follows the `Problem` type (includes `starterCode`, `solution`, `tests`, etc.).
3. Set `"status": "published"`.
4. Run `npm run seed` to update the database.

## Key Files

- `client/src/runner/executor.ts`: Sandboxed code execution logic.
- `client/src/store/useProgressStore.ts`: Frontend state for progress and streaks.
- `server/src/models/Problem.ts`: Mongoose schema for problems.
- `server/src/routes/problems.ts`: API endpoints for problem management.
- `planning.md` & `PhasesImplementationPlan.md`: Detailed architectural and phase-by-phase documentation.
