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

### Config that affects how you write code

- **Typed routes** are enabled (`app.json` → `experiments.typedRoutes`). Route strings are
  type-checked; keep `href`/navigation targets consistent with files in `src/app/`.
- **React Compiler** is enabled (`app.json` → `experiments.reactCompiler`). Do not hand-add
  `useMemo`/`useCallback` for compiler-handled memoization; write idiomatic components.
- TypeScript is `strict`.
