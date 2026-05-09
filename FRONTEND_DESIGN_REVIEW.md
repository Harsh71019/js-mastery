# Frontend Design Review — JS Mastery Trainer

> Reviewed against: `client/src/` — React 19, Tailwind CSS v4, Geist Mono, Lucide icons  
> Date: 2026-05-09

---

## 1. Design Language

The UI commits fully to a **dark terminal / system HUD** aesthetic. Near-black backgrounds, compressed monospace labels, micro-text in all-caps with wide tracking, ambient glow orbs, and glass-morphism panels. The vocabulary reinforces it: "Intelligence Sectors", "System Clusters", "Nodes Verified", "Data Set", "Sector Coverage".

This is a strong, coherent identity. It's memorable and unusual for an educational app. The risk is that it reads as style over clarity — a user who just wants to solve loop problems has to decode "Active Uptime" before realising it means streak days.

---

## 2. Token System

Defined in `index.css` via `@theme {}` — Tailwind v4's native token layer. Well structured.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `bg-primary` | `#050505` | Page background |
| `bg-secondary` | `#0a0a0a` | Panel fills |
| `bg-tertiary` | `#121212` | Input backgrounds, button fills |
| `border-default` | `rgba(255,255,255,0.06)` | All borders at rest |
| `border-hover` | `rgba(255,255,255,0.12)` | Borders on hover |
| `text-primary` | `#ffffff` | Headlines, active labels |
| `text-secondary` | `#a1a1aa` | Body text, descriptions |
| `text-tertiary` | `#52525b` | Muted labels, metadata |
| `accent-blue` | `#3b82f6` | Primary CTA, active states |
| `accent-green` | `#22c55e` | Success, solved, mastered |
| `accent-amber` | `#f59e0b` | Warning, streak, committed |
| `accent-red` | `#ef4444` | Error, danger, due items |
| `accent-purple` | `#a855f7` | Fluent tier, spaced repetition |

**Observation:** The five accents are used semantically — green always means progress/success, red always means urgency. This is consistent across all 30+ components reviewed. No accent is used decoratively for decoration's sake.

**Gap:** Accent hex values are hardcoded as strings in many chart components (`'#22c55e'`, `'#f59e0b'`) instead of referencing the CSS variables. If the palette ever changes, chart colors won't update automatically.

---

## 3. Typography

Three typefaces, each with a specific role:

| Font | Role | Where |
|---|---|---|
| Inter | Body copy, descriptions | `.font-inter` (default) |
| Geist Mono | UI labels, stats, numbers | `.font-geist` |
| JetBrains Mono | Code editor, code display | `.font-jetbrains` |

This is purposeful and well-executed. Geist Mono in all-caps with `tracking-widest` creates the "readout" effect that defines the aesthetic.

### Type Scale Issues

The scale skews extremely small. The most common sizes across the codebase:

```
[8px]   — Sparkline labels, secondary chart meta
[9px]   — Section section labels, category tags, ALL-CAPS metadata (most common size)
[10px]  — Card descriptions, problem titles in compact lists
[11px]  — Some body copy
text-xs — 12px — Standard body copy
text-sm — 14px — Primary body copy, button text
text-base — 16px — Rare, only headings
text-2xl — 24px — StatCard values
```

**8px and 9px text fails WCAG AA contrast requirements** even at white-on-#050505 because the minimum font size for normal-weight text is 14px (or 11px bold) per the standard. The micro-labels throughout StatsPage, FluencyCard, and the Sidebar footer are below this threshold.

**Recommended fix:** Raise the floor to 10px minimum for any text conveying information. 9px bold all-caps in `tracking-widest` has some legibility due to letter spacing, but 8px should be eliminated entirely.

---

## 4. Component Inventory

### Primitives (`components/ui/`)

| Component | Variants | Quality | Notes |
|---|---|---|---|
| `Button` | primary, secondary, ghost, danger × sm/md/lg | ✅ Solid | Loading spinner built-in. `secondary` hover uses `bg-border-default` — visually indistinct from base on some monitors. |
| `Card` | default, hoverable, clickable | ✅ Solid | Smart `div`→`button` swap for clickable cards. Gradient hover overlay is subtle and polished. |
| `Glow` | sm/md/lg/xl | ✅ Solid | Ambient background blobs. Prop-driven color + opacity. Used in every page for depth. |
| `PageContainer` | — | ✅ Solid | Handles sidebar offset, max-width, padding. One source of truth for layout. |
| `Input` | — | Not reviewed | — |
| `Select` | — | Not reviewed | — |
| `Tabs` | — | Not reviewed | — |
| `Badge` | — | Not reviewed | — |
| `Modal` | — | Not reviewed | — |
| `Toast` | — | ⚠️ Unknown | Implemented but no global provider observed. Unclear if it's wired. |
| `ProgressRing` | — | ✅ Solid | SVG ring used on Dashboard category cards. |
| `CommandPalette` | — | Not reviewed | — |

### Layout

| Component | Notes |
|---|---|
| `Navbar` | Fixed 48px. Context-aware: switches between page breadcrumb and problem nav modes. Clean. |
| `Sidebar` | Fixed 240px. Frosted glass. Nav items with active glow. Streak + mastery stats at bottom. |
| `Layout` | Composes Navbar + Sidebar + main content with offset. |

**Gap:** No mobile breakpoint exists. The sidebar is `fixed w-60` with no collapse mechanism. On viewports below ~900px, the sidebar overlaps the main content. There is no hamburger menu, no sheet/drawer, no responsive nav.

### Stats Components (new, Phase 1–4)

All follow the same section header pattern:
```
[Icon in colored rounded square]  [UPPERCASE TITLE]  ─────  [Meta label]
[Card: chart content]
```

This is consistent and scannable. The repetition across 10 sections in StatsPage does make it feel monotonous when scrolling the full page. Consider grouping sections under collapsible headings or tabs.

---

## 5. Layout Architecture

```
┌─────────────────────────────────────────────┐
│  Navbar (fixed, h-12, z-50)                  │
├────────────┬────────────────────────────────┤
│  Sidebar   │  Main content area             │
│  (fixed,   │  (margin-left: 240px,          │
│   w-60,    │   padding-top: 48px)           │
│   z-40)    │                                │
│            │  PageContainer                 │
│            │  (max-w, padding, overflow)    │
└────────────┴────────────────────────────────┘
```

`PageContainer` sets `ml-60 pt-12` and `max-w-6xl` (or similar). This is clean and predictable. All pages use `PageContainer` as the root — no exceptions observed.

**Concern:** `z-index` layering: Navbar is `z-50`, Sidebar is `z-40`. This is correct but fragile if modals or overlays don't respect the stack. No z-index tokens/constants are defined — values are set ad-hoc in className strings.

---

## 6. Design Patterns

### Section Header Pattern (universally applied)
```tsx
<div className="flex items-center justify-between px-1">
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-accent-X/5 border border-accent-X/20 flex items-center justify-center text-accent-X">
      <Icon size={16} />
    </div>
    <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">Title</h2>
  </div>
  <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist tracking-tighter">Meta</span>
</div>
```

This pattern appears 10+ times across StatsPage alone and across every feature page. It should be extracted into a `<SectionHeader>` component to reduce duplication and enforce consistency.

### Glow Ambient Background
```tsx
<Glow color="var(--color-accent-green)" size="xl" className="-top-40 -right-20 opacity-[0.05]" />
```

Every page has 2–3 of these. They create subtle depth but are nearly invisible at `opacity-[0.03]`–`opacity-[0.08]`. On monitors without local dimming or OLED, they may not render at all. Worth verifying on a matte LCD.

### Accent Left-Border on Cards
```tsx
<div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: accentColor }} />
```

Used in FluencyCard, StatCard, and several custom cards. Creates consistent category color coding across all views. Elegant.

### Percentage Ring (ScoreRing / ConsistencyRing / ProgressRing)
Three slightly different SVG ring implementations exist:
- `ProgressRing` (ui/) — generic, takes `progress` 0-100
- `ScoreRing` in `FluencyGrid` — hardcoded RADIUS=42, specific styling
- `ConsistencyRing` in `ConsistencyScore` — RADIUS=28, different stroke

These should be unified into one `ProgressRing` component with a `size` or `radius` prop.

---

## 7. Strengths

1. **Token discipline** — every color goes through `@theme` tokens; no raw hex values in component styles (except charts and the Glow component which are intentional dynamic values).

2. **Chart purity** — zero charting libraries. All graphs are pure SVG or CSS div bars. This keeps the bundle lean and gives full design control.

3. **Multi-font intentionality** — Geist Mono for UI readouts, Inter for prose, JetBrains for code. Never mixed carelessly.

4. **Semantic accent usage** — green=success, red=danger, amber=caution, purple=mastery tier. Consistent across 30+ components without a written style guide.

5. **Micro-animation quality** — `transition-all duration-700` on chart bars, `transition-opacity duration-500` on card hover glows, `stroke-dashoffset 1s ease` on SVG rings. All feel deliberate, not default.

6. **Component simplicity** — no component is over-engineered. StatCard is 24 lines. Glow is 33 lines. Card is 34 lines. They do one thing well.

7. **Context-aware Navbar** — switches between page breadcrumb mode and problem navigation mode without any visual jump. Elegant routing-aware rendering.

---

## 8. Issues & Gaps

### Critical
| # | Issue | Location | Impact |
|---|---|---|---|
| 1 | 8px text throughout — WCAG AA fail | StatsPage, FluencyCard, Sidebar | Accessibility |
| 2 | No mobile/responsive layout | Sidebar, Layout | Mobile unusable |
| 3 | `any` type in Dashboard fetch callback | `Dashboard.tsx:36` | Type safety |

### Moderate
| # | Issue | Location | Impact |
|---|---|---|---|
| 4 | Section header duplicated 10+ times | StatsPage, all feature pages | Maintenance debt |
| 5 | 3 separate SVG ring implementations | ProgressRing, FluencyGrid, ConsistencyScore | Inconsistency |
| 6 | Chart accent hex strings hardcoded | All stats components | Token drift risk |
| 7 | Toast system not wired to a global provider | `ui/Toast.tsx` | Feature may be dead code |
| 8 | Category progress uses `id.startsWith(slug)` — fragile | `Dashboard.tsx:181` | Silent bugs if IDs change |
| 9 | StatsPage has 10 sections — no lazy load / grouping | `StatsPage.tsx` | Performance + UX |
| 10 | `button` secondary hover is near-invisible | `Button.tsx:23` | UX |

### Minor
| # | Issue | Location |
|---|---|---|
| 11 | No `focus-visible` styles beyond `outline-none` | `Button.tsx` |
| 12 | `z-index` values ad-hoc, no constants | Layout files |
| 13 | "Terminal HUD" label vocabulary has no plain-English fallback | Sidebar, Dashboard |
| 14 | Glow at `opacity-[0.03]` invisible on non-OLED displays | All pages |
| 15 | `className` concatenation via template literals — inconsistent with `clsx`/`cn` | `Button.tsx`, `Card.tsx` |

---

## 9. Recommendations

### High Priority

**A. Raise minimum text size to 10px**
Replace all `text-[8px]` and `text-[9px]` with `text-[10px]` minimum. The aesthetic survives — the readout-label style is defined by tracking and casing, not by size.

**B. Extract `<SectionHeader>` component**
```tsx
// components/ui/SectionHeader.tsx
interface SectionHeaderProps {
  icon:       React.ReactNode
  title:      string
  meta?:      string
  accentClass: string  // 'accent-green' | 'accent-blue' | ...
}
```
Eliminates ~60 lines of repeated JSX across the app.

**C. Unify SVG ring into one `ProgressRing` prop**
Add a `radius` prop to `ui/ProgressRing` and remove the duplicated inline `ScoreRing` and `ConsistencyRing` implementations.

**D. Fix the Dashboard `any`**
```tsx
// Before
.then(data => { const counts = Object.fromEntries(data.map((c: any) => ...)) })

// After
interface CollectionCount { id: string; count: number }
.then((data: CollectionCount[]) => { const counts = Object.fromEntries(data.map((c) => ...)) })
```

### Medium Priority

**E. Add a StatsPage tab strip**
Ten sections on one scroll is overwhelming. Group into 3 tabs: **Activity** (matrix, consistency, timeline, peak), **Performance** (latency, speed trend, mastery, difficulty), **Health** (repetition, revisit, fluency). Lazy-render inactive tabs.

**F. Wire Chart colors to CSS variables**
```tsx
// Before
background: '#22c55e'

// After
background: 'var(--color-accent-green)'
```

**G. Mobile nav**
Add a `<MobileNav>` sheet/drawer that triggers below `md` breakpoint. The sidebar becomes `hidden md:flex`. This unblocks any tablet/phone usage.

### Low Priority

**H. Add `clsx` / `cn` utility**
Replace manual string concatenation in Button and Card with `cn(...)`. Reduces bugs from conditional class merging.

**I. Add tooltip on HUD vocabulary**
`title="Current day streak"` on the "Active Uptime" stat label. Preserves the aesthetic while making it learnable on first visit.

**J. Verify Glow visibility**
Test on a non-OLED monitor. If the `opacity-[0.03]` glows don't render, bump to `opacity-[0.06]` as a floor.

---

## 10. Summary

The design system is **coherent, disciplined, and original**. The terminal HUD aesthetic is fully committed to and executed well — this is not a generic dark-mode app. The token system is clean, the component API surface is small and focused, and the visual hierarchy uses opacity and typographic weight rather than color noise.

The primary weaknesses are **accessibility** (sub-WCAG text sizes), **mobile** (zero responsive consideration), and **scalability** (pattern duplication, 10-section single-scroll StatsPage). None of these are architectural rewrites — they are incremental fixes.

The charts being pure SVG/CSS with no library dependency is a genuine strength worth preserving as the feature set grows.

| Dimension | Rating | Notes |
|---|---|---|
| Visual Identity | ★★★★★ | Distinctive, fully committed |
| Token Discipline | ★★★★☆ | Strong, but chart hex drift |
| Component Quality | ★★★★☆ | Clean, but duplication |
| Accessibility | ★★☆☆☆ | Sub-WCAG text sizes throughout |
| Responsive Design | ★☆☆☆☆ | Desktop-only, no mobile consideration |
| Performance | ★★★★☆ | No chart libs, but no lazy loading |
| Type Safety | ★★★★☆ | One `any` in Dashboard |
| Maintainability | ★★★☆☆ | Pattern duplication, no SectionHeader |
