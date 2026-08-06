import { CartItem } from "@/features/cart/types";
import { supabase } from "@/lib/supabase/supabase";
import { logDevError } from "@/utils/logger";

export async function clearCartAction(userId: string | undefined) {
  if (!userId) {
    throw new Error("You need to be signed to carry out this action");
  }

  const { error } = await supabase.from("cart").delete().eq("user_id", userId);

  if (error) {
    logDevError("Delete all Cart Items:", error);
    throw new Error("Something went wrong clearing all cart items");
  }

  return { success: true };
}

export async function getUserCart(userId: string | undefined) {
  if (!userId) {
    throw new Error("You need to be signed to carry out this action");
  }

  const { data, error } = await supabase.from("cart").select("*").eq("user_id", userId);

  if (error) {
    logDevError("Fetch cart", error);
    throw new Error("Something went wrong fetching cart");
  }

  return data;
}

export async function deleteFoodFromDbAction(userId: string | undefined, foodToDeleteId: string) {
  if (!userId) {
    throw new Error("You need to be signed to carry out this action");
  }

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("id", foodToDeleteId)
    .eq("user_id", userId);

  if (error) {
    logDevError("Food deletion from cart:", error);
    throw new Error("Something went wrong deleting item.");
  }

  return { success: true };
}

export async function updateFoodQuantityAction(
  userId: string | undefined,
  foodToUpdateId: string,
  newQuantity: number,
) {
  if (!userId) {
    throw new Error("You need to be signed to carry out this action");
  }

  const { error } = await supabase
    .from("cart")
    .update({ quantity: newQuantity })
    .eq("user_id", userId)
    .eq("id", foodToUpdateId);

  if (error) {
    logDevError("Food quantity:", error);
    throw new Error("Something went wrong updating food quantity");
  }

  return { success: true };
}

export async function addFoodToCartAction(userId: string | undefined, cartItem: CartItem) {
  if (!userId) {
    throw new Error("You need to be signed to carry out this action");
  }

  const { error, data } = await supabase
    .from("cart")
    .insert({ ...cartItem, user_id: userId })
    .select()
    .single();

  if (error) {
    logDevError("Add Food to cart error", error);
    throw new Error("Something went wrong adding food to cart");
  }

  return data;
}
