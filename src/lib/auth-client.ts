import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

// On a device/emulator, "localhost" is the device itself, not the dev machine.
// In development, target the Expo dev server host the app was loaded from (it also
// serves the /api/auth route). Fall back to the env var for production builds.
const hostUri = Constants.expoConfig?.hostUri;
const baseURL = hostUri ? `http://${hostUri}` : process.env.EXPO_PUBLIC_BETTER_AUTH_URL;

export const authClient = createAuthClient({
  baseURL, // Base URL of your Better Auth backend.
  plugins: [
    emailOTPClient(),
    // @better-auth/expo@1.6.24's expoClient() has a getActions() signature that is
    // structurally incompatible with better-auth@1.6.24's BetterAuthClientPlugin, which
    // collapses client plugin inference and drops `authClient.emailOtp`. Casting away just
    // the offending `getActions` satisfies the constraint while preserving the rest of the
    // plugin's type, so both `emailOtp` and session inference stay intact. `getActions` only
    // exposes `getCookie` (unused here) and the cast is type-only — runtime is unaffected.
    expoClient({
      scheme: "ofudo",
      storagePrefix: "ofudo",
      storage: SecureStore,
    }) as Omit<ReturnType<typeof expoClient>, "getActions">,
  ],
});
