import { useSession } from "@/features/auth/hooks/useSession";
import { useQuery } from "@tanstack/react-query";
import { getFoodById, getFoodCustomization } from "../service/food-detail-service";


export function useGetCustomizations(foodId: string) {
  const { data } = useSession()
  const userId = data?.user.id;

  const customizations = useQuery({
    queryKey: ['customizations', userId, foodId],
    queryFn: () => getFoodCustomization(foodId, userId),
    staleTime: 5 * 60 * 60 * 1000,
    retry: 2,
    enabled: !!userId
  })

  return customizations
}

export function useGetFoodDetail(foodId: string) {
  const { data } = useSession()
  const userId = data?.user.id

  const foodDetailData = useQuery({
    queryKey: ['food-detail', userId, foodId],
    queryFn: () => getFoodById(foodId, userId),
    staleTime: 5 * 60 * 60 * 1000,
    retry: 2,
    enabled: !!userId
  })

  return foodDetailData;
}
