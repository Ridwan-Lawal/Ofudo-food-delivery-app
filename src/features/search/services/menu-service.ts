import { supabase } from "@/lib/supabase/supabase";
import { logDevError } from "@/utils/logger";

export async function getCategories(user: string | undefined) {
  if (!user) throw new Error("You need to be signed in to access this data");

  const { data, error } = await supabase.from("category").select("*");

  if (error) {
    logDevError("getCategories", error);

    throw new Error("Something went wrong getting categories");
  }

  return data;
}

export async function getMenuItems(
  searchQuery: string | undefined,
  categoryId: string | undefined,
  userId: string | undefined,
) {
  console.log("query:", searchQuery, "category:", categoryId);

  if (!userId) throw new Error("You need to be signed in to access this data");

  let query = supabase.from("menu_item").select("id,name,image_url,price,category(*)");

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }
  if (categoryId && categoryId !== "all") {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;

  if (error) {
    logDevError("getMenuItems", error);

    throw new Error("Something went wrong getting menu items");
  }

  console.log("data from db", data, error);

  return data || [];
}
