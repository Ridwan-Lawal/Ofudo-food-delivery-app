import {
  useAddFoodToCart,
  useDeleteFoodFromCart,
  useUpdateFoodQuantity,
} from "@/features/food-details/hooks/useGetFoodDetail";
import { clearCartAction, getUserCart } from "@/features/food-details/service/cart-service";
import { authClient } from "@/lib/auth-client";
import { haptics } from "@/utils/haptics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { toast } from "sonner-native";
import { useCartStore } from "../../store/cart-store";
import { CartItem, FoodDetailType } from "../../types";

export function useClearCart() {
  const { data } = authClient.useSession();
  const userId = data?.user?.id;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => clearCartAction(userId),
    onSuccess: () => {
      haptics.success();
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onError: (error) => {
      haptics.error();
      toast.error("Cart failed to be cleared", { description: error.message });
    },
  });

  return mutation;
}

export function useGetCart() {
  const { data } = authClient.useSession();
  const userId = data?.user?.id;

  const query = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => getUserCart(userId),
    retry: 3,
    staleTime: 5 * 60 * 60 * 1000,
    enabled: !!userId,
  });

  return query;
}

export function useUpdateCart(foodItem: CartItem | undefined) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateItemQuantity);
  const { mutate: deleteFoodFromCart } = useDeleteFoodFromCart();
  const { mutate: updateFoodQuantityInDb } = useUpdateFoodQuantity();

  function handleQuantityIncrease(order: "incr" | "decr") {
    haptics.tap();

    if (foodItem) {
      const updatedQuantity =
        order === "incr"
          ? foodItem.quantity + 1
          : foodItem.quantity > 1
            ? foodItem.quantity - 1
            : foodItem.quantity;

      updateQuantity(foodItem.id, updatedQuantity);
      updateFoodQuantityInDb({ foodToUpdateId: foodItem.id, newQuantity: updatedQuantity });
    } else {
      haptics.error();
      toast.error("Add food to cart before updating quantity");
    }
  }

  function handleFoodItemDeletion() {
    if (foodItem) {
      removeItem(foodItem.id);
      deleteFoodFromCart(foodItem.id, {
        onSuccess: () => {
          haptics.success();
        },
      });
    }
  }

  return { handleQuantityIncrease, handleFoodItemDeletion };
}

export function useAddCart() {
  const { mutate } = useAddFoodToCart();
  const addItem = useCartStore((s) => s.addItem);
  const swapItem = useCartStore((s) => s.swapItem);
  const removeItem = useCartStore((s) => s.removeItem);

  function handleAddFoodToCart(foodData: FoodDetailType, foodId: string) {
    const foodToCart = {
      id: Crypto.randomUUID(),
      name: foodData.name,
      image_url: foodData.image_url ?? "",
      quantity: 1,
      price: foodData.price,
      foodId,
    };
    addItem(foodToCart);

    haptics.success();

    mutate(foodToCart, {
      onSuccess: (data) => {
        const itemFromDb = {
          id: data.id,
          name: data.name,
          quantity: 1,
          price: data.price,
          image_url: data.image_url,
          foodId,
        };

        swapItem(foodToCart.id, itemFromDb);
      },

      onError: () => {
        removeItem(foodToCart.id);
      },
    });
  }

  return { handleAddFoodToCart };
}
