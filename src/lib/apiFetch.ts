import { authClient, type ExpoClientActions } from "@/lib/auth-client";

export async function apiFetch(path: string, init: RequestInit = {}) {
  return fetch(`${process.env.EXPO_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
      // getActions is cast off the client type in auth-client.ts; getCookie still exists at runtime.
      Cookie: (authClient as unknown as ExpoClientActions).getCookie(),
    },
  });
}
