import { useQuery } from "@tanstack/react-query";
import { getCategories, getMenuItems } from "../services/menu-service";
import { authClient } from "@/lib/auth-client";


export function useGetCategories() {
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id

  const data = useQuery({
    queryKey: ['categories', userId],
    queryFn: () => getCategories(userId),
    staleTime: 5 * 60 * 60 * 1000,
    retry: 3,
    enabled: !!userId
  })

  return data;
}

export function useGetMenuItems(searchQuery: string | undefined, categoryId: string | undefined, userId: string | undefined) {
  const queryData = useQuery({
    queryKey: ['menu-items', searchQuery, categoryId, userId],
    queryFn: () => getMenuItems(searchQuery, categoryId, userId),
    staleTime: 60 * 60 * 1000,
    retry: 3,
    enabled: !!userId
  })

  return queryData
}
