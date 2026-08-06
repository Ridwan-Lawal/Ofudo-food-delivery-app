import { useSession } from "@/features/auth/hooks/useSession";
import { CartItem } from "@/features/cart/types";
import { authClient } from "@/lib/auth-client";
import { haptics } from "@/utils/haptics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import {
  addFoodToCartAction,
  deleteFoodFromDbAction,
  updateFoodQuantityAction,
} from "../service/cart-service";
import { getFoodById, getFoodCustomization } from "../service/food-detail-service";

interface UpdateFoodData {
  newQuantity: number;
  foodToUpdateId: string;
}

export function useDeleteFoodFromCart() {
  const { data } = authClient.useSession();
  const userId = data?.user?.id;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (foodToDeleteId: string) => deleteFoodFromDbAction(userId, foodToDeleteId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (error) => {
      haptics.error();
      toast.error("Cart operation failed", { description: error.message });
    },
  });

  return mutation;
}

export function useUpdateFoodQuantity() {
  const { data } = authClient.useSession();
  const userId = data?.user?.id;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ foodToUpdateId, newQuantity }: UpdateFoodData) =>
      updateFoodQuantityAction(userId, foodToUpdateId, newQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (error) => {
      haptics.error();
      toast.error("Food quantity error", { description: error.message });
    },
  });

  return mutation;
}

export function useAddFoodToCart() {
  const { data } = authClient.useSession();
  const userId = data?.user?.id;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (cartItem: CartItem) => addFoodToCartAction(userId, cartItem),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (error) => {
      haptics.error();
      toast.error("Cart Error", { description: error.message });
    },
  });

  return mutation;
}

export function useGetCustomizations(foodId: string) {
  const { data } = useSession();
  const userId = data?.user.id;

  const customizations = useQuery({
    queryKey: ["customizations", userId, foodId],
    queryFn: () => getFoodCustomization(foodId, userId),
    staleTime: 5 * 60 * 60 * 1000,
    retry: 2,
    enabled: !!userId,
  });

  return customizations;
}

export function useGetFoodDetail(foodId: string) {
  const { data } = useSession();
  const userId = data?.user.id;

  const foodDetailData = useQuery({
    queryKey: ["food-detail", userId, foodId],
    queryFn: () => getFoodById(foodId, userId),
    staleTime: 5 * 60 * 60 * 1000,
    retry: 2,
    enabled: !!userId,
  });

  return foodDetailData;
}
