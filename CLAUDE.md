# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

This project uses **npm** (`package-lock.json` is committed; CI runs `npm ci`). There is no
pnpm or yarn lockfile — don't introduce one.

- `npm start` — start the Expo dev server (Metro)
- `npm run android` / `npm run ios` — `expo run:*`, which build and install a **dev build**.
  `expo-dev-client` is a dependency, so Expo Go won't work.
- `npm run rebuild:android` — `expo prebuild --clean` then `expo run:android`. Run it after
  installing a native dependency. The two steps are chained through npm's `prerebuild:android`
  hook rather than `&&` because the configured `script-shell` here is Windows PowerShell 5.1,
  where `&&` is a parse error.
- `npm run web` — `expo start --web`
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — `expo lint`
- `npm run format` / `npm run format:check` — Prettier
- `npm run update-types` — regenerate `src/lib/supabase/database.types.ts` from the Supabase
  project. Written with PowerShell `Out-File`, so it only runs as-is on Windows.

`.husky/pre-commit` and the PR workflow (`.github/workflows/ci.yml`) both run typecheck then
lint — those two are the verification gate for any change.

There is **no test runner** configured. Do not assume `npm test` exists.

`README.md` is still the stock Expo template and is not authoritative — in particular, never run
`reset-project`; `scripts/reset-project.js` isn't in the repo, so the script fails outright.

### Environment

No `.env.example` exists. The app needs `DATABASE_URL`, `BETTER_AUTH_SECRET`,
`EXPO_PUBLIC_BETTER_AUTH_URL`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_KEY` and
`RESEND_KEY`. Anything `EXPO_PUBLIC_*` is inlined into the client bundle — keep secrets off that
prefix.

`/android` and `/ios` are gitignored prebuild output. Don't commit or hand-edit them; change
`app.json` and re-run `expo run:*`.

### Seeding

`seed.mts` lives at the **repo root** and is not wired into `package.json` (its own header
comment says `scripts/seed.mts` — stale). It reads `src/utils/data.ts` and writes through `pg`
on `DATABASE_URL`. Categories and customizations upsert, but `menu_item` inserts
unconditionally, so re-running duplicates every menu item.

`supabase/config.toml` exists for the Supabase CLI, but `update-types` points at the hosted
project id, not a local stack.

## Architecture

Expo SDK 57 app using **Expo Router** (file-based routing) with React 19.2 and React Native 0.86.

- **Source lives under `src/`**, not the repo root. This is a customized layout — the default
  Expo template puts routes in a root `app/` directory; here `expo-router/entry` resolves to
  `src/app/`.
- **`src/app/`** — file-based routes. `_layout.tsx` defines the navigator; each other file is a
  screen. `src/app/api/` holds server routes (`+api.ts`).
- **`src/features/`** — feature-based modules. New domain logic goes here, not in a shared
  top-level `components/` folder. The repo is actively migrating off the stock Expo template
  toward this structure, so prefer adding to `src/features/` over recreating template files.
- **Path aliases** (`tsconfig.json`): `@/*` → `src/*`, plus `@/app/*`, `@/components/*`,
  `@/features/*`, `@/hooks/*`, `@/lib/*`, `@/theme/*`, `@/utils/*`, and `@/assets/*` → `assets/*`.
  Import with `@/features/...` rather than long relative paths. (`src/hooks/` doesn't exist —
  hooks belong to their feature, not a shared folder.)

### Routes

```
(auth)/     login, register, verify-account
(tabs)/     index, search, cart, profile   — tab bar built from TABS_SCREENS in src/utils/constants.ts
[foodId]    food detail — a sibling of (tabs), not a tab
+not-found
```

### Feature module shape

A feature owns its own `index.ts` barrel, `types.ts`, `components/`, `hooks/`, `services/`, and
`store/`. Screens import through the barrel:

```ts
import { CartItems } from "@/features/cart";
```

Cross-feature primitives live in `src/components/` — `SkeletonBlock`, `ErrorState`, `EmptyState`,
`MessageState`, `AnimatedPressable`, `AnimatedPrimaryButton`, `ItemQuantityControl`. Compose these
instead of rebuilding them inside a feature.

### Root layout providers

`src/app/_layout.tsx` nests them outermost-first: `GestureHandlerRootView` →
`QueryClientProvider` → `KeyboardProvider` → `BottomSheetModalProvider` → `Stack`. `<AppToaster />`
renders inside `QueryClientProvider` as a sibling of `KeyboardProvider`; `<StatusBar />` sits
outside everything. The `QueryClient` is module-scoped. New global providers go here, in that
nesting.

### Auth

The Better Auth **server runs inside the app**, not as a separate backend:

- `src/app/api/auth/[...auth]+api.ts` — Expo Router API route re-exporting `auth.handler` as both
  GET and POST.
- `src/lib/auth.ts` — server config. Email + password with `requireEmailVerification`, the
  `emailOTP` plugin (6-digit, 10 min) delivering through `src/features/auth/services/resend.ts`,
  and a `pg` `Pool` on `DATABASE_URL`. Its migrations land in `better-auth_migrations/`.
- `src/lib/auth-client.ts` — client config. `baseURL` is derived from
  `Constants.expoConfig?.hostUri` because on a device `localhost` is the device itself; tokens go
  to `expo-secure-store`. The hostUri fallback and the `expoClient` `getActions` cast both carry
  explanatory comments — they are deliberate, not cleanup targets.
- Read the session with `authClient.useSession()`, or the wrapper in
  `src/features/auth/hooks/useSession.ts`.
- Route access is gated in `src/app/_layout.tsx` with `Stack.Protected` guards keyed on
  `isLoggedIn && isAccountVerified`. Add new screens inside the correct guard rather than writing
  imperative redirects.

### Data layer

**Better Auth owns identity; Supabase owns domain data** (`category`, `menu_item`, `cart`). They
share one Postgres but are separate clients — don't reach for one to do the other's job.

Every feature follows the same three layers:

```
services/*-service.ts   raw supabase-js calls
                        (search/services/menu-service.ts, food-details/service/cart-service.ts)
hooks/use*.ts           TanStack Query wrappers
                        (search/hook/useSearch.ts, cart/components/hooks/useCart.ts)
components/             consume the hook; never call supabase directly
```

- Services take `userId: string | undefined` and throw when it's missing; the hook pairs that with
  `enabled: !!userId` so the query never fires unauthenticated. Query keys include `userId`.
- On a Supabase error, log the raw one with `logDevError(context, error)` from
  `src/utils/logger.ts` and throw a separate user-facing `Error`. The `PostgrestError` should
  never reach the UI.
- Row types come from the generated `database.types.ts` via the `Tables<"menu_item">` and
  `FoodDetail` helpers in `src/lib/supabase/supabase.ts`. Regenerate with `npm run update-types`
  rather than hand-editing the generated file.

Existing features disagree on what to call these folders — `search/hook/` + `search/services/`,
`food-details/hooks/` + `food-details/service/`, `cart/components/hooks/`. Use `hooks/` and
`services/` for new features so the drift doesn't spread.

### Client state

Zustand stores live at `src/features/<feature>/store/<name>-store.ts`. Server cache stays in
TanStack Query; the store holds what the UI mutates optimistically.

`useAddCart` (`src/features/cart/components/hooks/useCart.ts`) is the reference pattern: write to
the store with a `Crypto.randomUUID()` placeholder, fire the mutation, `swapItem` to the real DB
row on success, `removeItem` to roll back on error.

Hydration goes the other way through a null-rendering bridge component:
`src/components/FetchCartFromDb.tsx` reads `useGetCart` and pushes the result into the store with
`addCartFromDb`. Copy that shape rather than calling a query from inside a store.

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

### Forms

React Hook Form with `zodResolver`. Schemas and their inferred types live in `src/lib/zod/` —
`auth-schema.ts` exports `loginSchema` alongside `LoginFormValues`. Fields render through
`Controller` wrapping `AuthFormInput`, and `useWatch` drives the submit button's `disabled` plus
its dimmed opacity. `src/features/auth/components/LoginForm.tsx` is the reference.

### Styling

All colors, spacing, radii, shadows and text variants come from `src/theme/tokens.ts` —
`palette`, `colors`, `spacing`, `radius`, `shadow`, `textVariants`, `fontFamily`, `fontSize`,
`lineHeight`. `palette` holds the raw values and `colors` is the semantic layer over it; most
components reach for `palette` and `textVariants`. No inline hex values or magic numbers. Fonts
(Quicksand, Rubik) load in the root layout.

### User feedback

Surface success and failure with `toast` from `sonner-native`, paired with the matching haptic —
`haptics.success()` next to `toast.success(...)`, `haptics.error()` next to `toast.error(...)`.
`AppToaster` is already mounted once in the root layout; don't add another. Trigger haptics
through the `haptics` helper in `src/utils/haptics.ts`, not `expo-haptics` directly.

Better Auth calls take an `onRequest`/`onResponse`/`onSuccess`/`onError` callback object instead
of try/catch — see `handleLogin` in `LoginForm.tsx`.

## Code style

- **Comment sparingly.** Only comment occasionally, for genuinely complex code — a
  non-obvious platform quirk, a workaround, or a decision the code can't express on its
  own. Don't narrate what the code already says, and don't add section-header or
  restating comments. When a comment does earn its place, keep it to a **single line** —
  short, clear, and straight to the point. No multi-line comment blocks.
- Prettier (`.prettierrc`): double quotes, semicolons, trailing commas, `printWidth: 100`,
  `tabWidth: 2`. `prettier-plugin-organize-imports` rewrites import order on format — don't
  hand-arrange imports.

### Config that affects how you write code

- **Typed routes** are enabled (`app.json` → `experiments.typedRoutes`). Route strings are
  type-checked; keep `href`/navigation targets consistent with files in `src/app/`.
- **React Compiler** is enabled (`app.json` → `experiments.reactCompiler`). Do not hand-add
  `useMemo`/`useCallback` for compiler-handled memoization; write idiomatic components.
- TypeScript is `strict`.
