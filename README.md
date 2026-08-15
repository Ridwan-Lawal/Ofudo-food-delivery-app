# Ofudo

A food delivery mobile application built with Expo and React Native. Users sign up with an
email-verified account, browse a menu by category, search it, customize an item with toppings and
sides, and manage a cart that updates instantly and reconciles with the server in the background.

The app is unusual in one respect worth calling out up front: it has no separate backend service.
The authentication server, the push-notification endpoints, and the client all live in the same
Expo Router project, deployed as one unit.

Android is the actively developed target. The project is configured for iOS and web, but only
Android has been built and tested.

## Features

**Authentication.** Email and password sign-up with mandatory email verification. Verification
uses a 6-digit one-time code delivered through Resend, valid for 10 minutes with 5 attempts.
Sessions are stored in the device keychain via `expo-secure-store`. Unverified accounts cannot
reach the main app: route access is enforced declaratively with `Stack.Protected` guards rather
than imperative redirects.

**Browse and search.** Menu items are filterable by category and searchable by name. Search input
is debounced so typing does not fire a request per keystroke. Every list has a dedicated skeleton
and error state rather than a spinner.

**Food detail and customization.** Each item shows its nutritional information, rating, and the
toppings and sides available for it, resolved through a join table.

**Cart.** Adding, removing, and changing quantity all apply to local state immediately and write
to the database in the background. A failed write rolls the local state back. Cart contents
survive app restarts.

**Profile.** Users can replace their avatar from the device photo library. The image uploads to
Supabase Storage and the resulting public URL is written back to the session.

**Location.** The delivery city is resolved from device GPS and reverse-geocoded, with the result
cached so the permission prompt appears once rather than on every launch.

**Offline support.** The TanStack Query cache is persisted to `AsyncStorage`, so previously loaded
screens render without a network connection. Connectivity changes are detected by NetInfo and
surfaced through a banner; queries pause while offline and resume when the connection returns.

**Push notifications.** Adding an item to the cart triggers a push notification through Expo's
push service. Tapping it deep-links into the cart tab.

## Tech stack

| Layer               | Choice                                             | Notes                                         |
| ------------------- | -------------------------------------------------- | --------------------------------------------- |
| Framework           | Expo SDK 57, React Native 0.86, React 19.2         | React Compiler and typed routes both enabled  |
| Navigation          | Expo Router                                        | File-based, including server routes           |
| Language            | TypeScript 6 (`strict`)                            |                                               |
| Server state        | TanStack Query v5                                  | Persisted to `AsyncStorage` for offline reads |
| Client state        | Zustand                                            | Holds only what the UI mutates optimistically |
| Authentication      | Better Auth + `@better-auth/expo`                  | Server runs inside this app                   |
| Domain data         | Supabase (`supabase-js`)                           | Postgres and Storage                          |
| Transactional email | Resend                                             | Delivers the verification OTP                 |
| Forms               | React Hook Form + Zod v4                           | Schemas in `src/lib/zod/`                     |
| Animation           | Reanimated 4, `react-native-gesture-handler`       |                                               |
| UI                  | Gorhom Bottom Sheet, `sonner-native`, `expo-image` | Toasts paired with haptics                    |

## Architecture

### The auth server lives inside the app

Better Auth is not deployed separately. `src/lib/auth.ts` configures the server, and
`src/app/api/auth/[...auth]+api.ts` re-exports its handler as an Expo Router API route. The same
project serves the client bundle and handles `/api/auth/*`.

This has a practical consequence during development: on a device or emulator, `localhost` refers
to the device itself, not to your development machine. `src/lib/auth-client.ts` therefore derives
its base URL from `Constants.expoConfig.hostUri` (the dev server the app was loaded from) and only
falls back to `EXPO_PUBLIC_BETTER_AUTH_URL` for production builds.

Two further server routes follow the same pattern. `api/push-token` stores a device's Expo push
token against the user row, and `api/notify-cart` sends a notification to it. Both authenticate
the caller with `auth.api.getSession` and reject unauthenticated requests.

### Two systems, one database

Better Auth and Supabase share a single Postgres instance but own disjoint sets of tables and are
never used interchangeably.

| Owner       | Tables                                                                      |
| ----------- | --------------------------------------------------------------------------- |
| Better Auth | `user`, `session`, `account`, `verification`                                |
| Supabase    | `category`, `menu_item`, `customization`, `menu_item_customization`, `cart` |

Better Auth reaches Postgres through a `pg` connection pool and owns identity. Supabase is used
through `supabase-js` for domain data and file storage. Neither is used to do the other's job.

### Data flows through three layers

Every feature is structured the same way:

```
services/*-service.ts   Raw supabase-js calls. Take `userId: string | undefined` and throw
                        when it is missing. Log the raw PostgrestError with logDevError, then
                        throw a separate user-facing Error so database internals never reach
                        the UI.

hooks/use*.ts           TanStack Query wrappers. Pair the service's userId requirement with
                        `enabled: !!userId` so a query never fires unauthenticated. Query keys
                        include the userId.

components/             Consume the hook. Never call Supabase directly.
```

### Optimistic updates

`useAddCart` in `src/features/cart/components/hooks/useCart.ts` is the reference implementation.
It writes the item to the Zustand store immediately under a locally generated UUID, fires the
mutation, swaps in the real database row on success, and removes the placeholder on failure. The
UI never waits on the network.

Hydration runs in the opposite direction through a null-rendering bridge component:
`src/components/FetchCartFromDb.tsx` reads the query and pushes the result into the store, so
stores never call queries themselves.

## Project structure

Source lives under `src/`, not at the repository root. This is a deliberate departure from the
default Expo template — `expo-router/entry` resolves to `src/app/`.

```
src/
  app/                      File-based routes
    (auth)/                 login, register, verify-account
    (tabs)/                 index, search, cart, profile
    api/                    Server routes
      auth/[...auth]+api.ts Better Auth handler
      push-token+api.ts     Stores a device push token
      notify-cart+api.ts    Sends an add-to-cart notification
    [foodId].tsx            Food detail, a sibling of (tabs) rather than a tab
    _layout.tsx             Providers and route guards

  features/                 Feature modules: auth, cart, food-details, home, location,
                            profile, search. Each owns its components/, hooks/, services/,
                            store/, types.ts, and an index.ts barrel.

  components/               Cross-feature primitives: SkeletonBlock, ErrorState, EmptyState,
                            MessageState, AnimatedPressable, AnimatedPrimaryButton,
                            ItemQuantityControl, OfflineBanner, AppToaster

  lib/                      auth.ts, auth-client.ts, apiFetch.ts, push.ts, server/db.ts,
                            supabase/, zod/
  theme/tokens.ts           Colors, spacing, radii, shadows, text variants
  utils/                    constants, haptics, logger, menu data
```

Screens import through a feature's barrel:

```ts
import { CartItems } from "@/features/cart";
```

Path aliases are configured in `tsconfig.json`: `@/*` maps to `src/*`, with `@/assets/*` mapping
to the root `assets/` directory.

## Getting started

### Prerequisites

- Node.js 22 and npm. The project uses npm; `package-lock.json` is committed and CI runs `npm ci`.
- Android Studio with an emulator, or a physical Android device.
- A Supabase project, a Postgres database, and a Resend account.
- Push notifications require a **physical device**. Emulators cannot receive push tokens.

### Installation

```bash
git clone https://github.com/Ridwan-Lawal/Ofudo-food-delivery-app.git
cd Ofudo-food-delivery-app
npm install
```

Create a `.env` file at the repository root with the variables listed in the next section, then
build and install the development build:

```bash
npm run android
```

> **Expo Go will not work.** `expo-dev-client` is a dependency, and the project relies on native
> modules that Expo Go does not include. You must build a development build with `npm run android`
> or `npm run ios`. Once installed, `npm start` connects to it.

After installing any new native dependency, run `npm run rebuild:android`, which cleans and
regenerates the native project before rebuilding.

The `android/` and `ios/` directories are gitignored prebuild output. Do not commit or hand-edit
them — change `app.json` and rebuild.

## Environment variables

All seven are required. There is no `.env.example` in the repository.

| Variable                      | Purpose                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                | Postgres connection string, used by Better Auth's `pg` pool and the push-token routes                       |
| `BETTER_AUTH_SECRET`          | Signing secret for Better Auth sessions                                                                     |
| `EXPO_PUBLIC_BETTER_AUTH_URL` | Auth base URL for production builds; ignored in development, where the Expo dev server host is used instead |
| `EXPO_PUBLIC_API_URL`         | Base URL the client uses to reach this project's own API routes                                             |
| `EXPO_PUBLIC_SUPABASE_URL`    | Supabase project URL                                                                                        |
| `EXPO_PUBLIC_SUPABASE_KEY`    | Supabase anon key                                                                                           |
| `RESEND_KEY`                  | Resend API key for verification emails                                                                      |

> Anything prefixed `EXPO_PUBLIC_` is inlined into the client bundle and is readable by anyone who
> has the app. Never put a secret behind that prefix. `DATABASE_URL`, `BETTER_AUTH_SECRET`, and
> `RESEND_KEY` are deliberately unprefixed and stay server-side.

The app also expects a Supabase Storage bucket named `avatars` with public read access, and
`google-services.json` at the repository root for Android push delivery.

## Database

Better Auth generates its own migrations into `better-auth_migrations/`. Apply those to create the
identity tables.

> The push-notification routes read and write a `push_token` column on the `user` table
> (`src/app/api/push-token+api.ts`), but no migration in `better-auth_migrations/` creates it. Add
> the column manually before enabling push, then re-run `npm run update-types`.

Supabase types are generated, not hand-written. Regenerate them after any schema change:

```bash
npm run update-types
```

This writes `src/lib/supabase/database.types.ts`. Note that the script uses PowerShell `Out-File`
and currently only runs as-is on Windows. Row types are consumed through the `Tables<"menu_item">`
and `FoodDetail` helpers in `src/lib/supabase/supabase.ts`; never edit the generated file directly.

### Seeding

`seed.mts` at the repository root populates categories, menu items, and customizations from
`src/utils/data.ts`, writing over `DATABASE_URL`. It is not wired into `package.json` and must be
run directly.

> Categories and customizations upsert, but menu items insert unconditionally. Running the seed
> twice duplicates every menu item.

## Scripts

| Script                    | Description                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| `npm start`               | Start the Expo dev server                                                  |
| `npm run android`         | Build and install the Android development build                            |
| `npm run ios`             | Build and install the iOS development build                                |
| `npm run rebuild:android` | Clean prebuild, then rebuild Android. Run after adding a native dependency |
| `npm run web`             | Start the web build                                                        |
| `npm run typecheck`       | `tsc --noEmit`                                                             |
| `npm run lint`            | ESLint via `expo lint`                                                     |
| `npm run format`          | Format with Prettier                                                       |
| `npm run format:check`    | Check formatting without writing                                           |
| `npm run update-types`    | Regenerate Supabase types (Windows only)                                   |

## Code quality

Type-checking and linting are the verification gate. Both run in `.husky/pre-commit` and again in
CI on every pull request against `main` (`.github/workflows/ci.yml`):

```bash
npm run typecheck
npm run lint
```

There is no test runner configured; `npm test` does not exist.

Formatting is enforced by Prettier — double quotes, semicolons, trailing commas, 100-character
lines, 2-space indentation. `prettier-plugin-organize-imports` rewrites import order on format, so
imports should not be arranged by hand.

Two configuration choices affect how code is written here. **React Compiler** is enabled, so
`useMemo` and `useCallback` should not be added by hand for memoization the compiler already
handles. **Typed routes** are enabled, so navigation targets are type-checked against the files in
`src/app/`.

Design tokens are centralized in `src/theme/tokens.ts` — `palette` holds raw values and `colors`
is the semantic layer over it. Components should not contain inline hex values or unexplained
numeric constants.
