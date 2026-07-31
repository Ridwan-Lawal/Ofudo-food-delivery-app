import { supabase } from "@/lib/supabase/supabase";
import { logDevError } from "@/utils/logger";

export async function getFoodCustomization(foodId: string, userId: string | undefined) {
  if (!userId) throw new Error("You have be signed in to access this data");

  const { data: menuItemCustomization, error: menuItemCustomizationError } = await supabase
    .from("menu_item_customization")
    .select("*")
    .eq("menu_item_id", foodId);

  if (menuItemCustomizationError) {
    logDevError("Get menu item customization", menuItemCustomizationError);
    throw new Error("Something went wrong getting food item customization ids");
  }

  const customizationIds =
    menuItemCustomization?.map((customization) => customization.customization_id) ?? [];

  const { data: customizationData, error: customizationFetchError } = await supabase
    .from("customization")
    .select("*")
    .in("id", customizationIds);

  if (customizationFetchError) {
    logDevError("Food customizations", customizationFetchError);
    throw new Error("Something went wrong getting food customizations data");
  }

  return customizationData;
}

export async function getFoodById(foodId: string, userId: string | undefined) {
  if (!userId) throw new Error("You have to be signed in to access this data");

  const { data, error } = await supabase
    .from("menu_item")
    .select("*, category(*)")
    .eq("id", foodId)
    .single();

  if (error) {
    logDevError("Get food by Id", error);
    throw new Error("Something went wrong getting food details");
  }

  return data;
}
