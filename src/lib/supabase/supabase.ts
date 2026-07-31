import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";

import "expo-sqlite/localStorage/install";
import { Database } from "./database.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Row type for any table in the public schema, straight from the generated types.
 * Regenerating with `npm run update-types` keeps everything built on this in sync.
 *
 * ```ts
 * type MenuItem = Tables<"menu_item">;
 * ```
 */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

/**
 * A single menu item with its category embedded — the shape returned by
 * `getFoodById`:
 *
 * ```ts
 * supabase.from("menu_item").select("*, category(*)").eq("id", foodId).single()
 * ```
 *
 * `category` is non-nullable: `menu_item.category_id` is NOT NULL with a foreign key,
 * so supabase-js infers the embedded row as always present. Verified against
 * `QueryData<typeof query>` rather than assumed.
 */
export type FoodDetail = Tables<"menu_item"> & {
  category: Tables<"category">;
};
