# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

This project uses **pnpm** (see `pnpm-lock.yaml` / `node_modules/.pnpm`). Do not use npm or yarn.

- `pnpm start` — start the Expo dev server (Metro)
- `pnpm android` / `pnpm ios` / `pnpm web` — start on a specific platform
- `pnpm lint` — run `expo lint` (ESLint via the Expo config)

There is **no test runner** configured. Do not assume `pnpm test` exists.

## Architecture

Expo SDK 57 app using **Expo Router** (file-based routing) with React 19.2 and React Native 0.86.

- **Source lives under `src/`**, not the repo root. This is a customized layout — the default
  Expo template puts routes in a root `app/` directory; here `expo-router/entry` resolves to
  `src/app/`.
- **`src/app/`** — file-based routes. `_layout.tsx` defines the navigator (currently a
  `Stack`); each other file is a screen.
- **`src/features/`** — feature-based modules (e.g. `src/features/auth/`), each intended to
  own its own `index.ts` barrel and `types.ts`. New domain logic goes here, not in a shared
  top-level `components/` folder. The repo is actively migrating off the stock Expo template
  toward this structure, so prefer adding to `src/features/` over recreating template files.
- **Path aliases** (`tsconfig.json`): `@/*` → `src/*`, `@/assets/*` → `assets/*`. Import with
  `@/features/...` rather than long relative paths.

### Loading and error states

Build them as **separate components inside the owning feature's `components/` folder** —
never inline in the component that fetches. When adding states for a feature, put them
next to the component they serve:

```
src/features/food-details/components/
  Customization.tsx           # fetches, and picks between the three
  CustomizationSkeleton.tsx   # loading
  CustomizationError.tsx      # error
```

The fetching component stays responsible only for choosing which to render. Wrap the
shared `@/components/SkeletonBlock` and `@/components/ErrorState` rather than
rebuilding them, and share any geometry the real component and its skeleton must agree
on via a `*.styles.ts` module (see `src/features/search/components/foodCard.styles.ts`)
so the two can't drift.

## Code style

- **Comment sparingly.** Only comment occasionally, for genuinely complex code — a
  non-obvious platform quirk, a workaround, or a decision the code can't express on its
  own. Don't narrate what the code already says, and don't add section-header or
  restating comments. When a comment does earn its place, keep it clear, concise, and
  straight to the point.

### Config that affects how you write code

- **Typed routes** are enabled (`app.json` → `experiments.typedRoutes`). Route strings are
  type-checked; keep `href`/navigation targets consistent with files in `src/app/`.
- **React Compiler** is enabled (`app.json` → `experiments.reactCompiler`). Do not hand-add
  `useMemo`/`useCallback` for compiler-handled memoization; write idiomatic components.
- TypeScript is `strict`.
