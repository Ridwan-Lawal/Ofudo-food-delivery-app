/**
 * Logs an error to the console in development only — production builds stay silent.
 *
 * Intended for the raw error from a service call (a Supabase `PostgrestError`, a Resend
 * error, a thrown exception) which is useful while debugging but should never reach a
 * user. Pair it with a user-facing `Error` thrown to the caller:
 *
 * ```ts
 * if (error) {
 *   logDevError("getCategories", error);
 *   throw new Error("Something went wrong getting categories");
 * }
 * ```
 *
 * @param context Where the error came from — usually the calling function's name.
 * @param error The raw error. Typed `unknown` so it accepts any shape.
 */
export function logDevError(context: string, error: unknown) {
  if (__DEV__) {
    console.error(`[${context}]`, error);
  }
}
