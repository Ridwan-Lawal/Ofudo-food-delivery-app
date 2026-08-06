import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useSession } from "@/features/auth/hooks/useSession";
import { palette, textVariants } from "@/theme/tokens";
import { getEmptyCopy } from "@/utils/menu";
import { useLocalSearchParams } from "expo-router";
import { useBottomTabBarHeight } from "expo-router/build/react-navigation/bottom-tabs";
import { FlatList, StyleSheet, View } from "react-native";
import { useGetMenuItems } from "../hook/useSearch";
import { QueryParams } from "../types";
import FoodCard from "./FoodCard";
import FoodListSkeleton from "./FoodListSkeleton";
import { FOOD_CARD } from "./foodCard.styles";

export default function FoodList() {
  const { q, category } = useLocalSearchParams<QueryParams>();
  const tabHeight = useBottomTabBarHeight();
  const { data: userData } = useSession();
  const { data, isPending, isError, refetch } = useGetMenuItems(q, category, userData?.user?.id);

  return (
    <View style={styles.container}>
      {isPending ? (
        <FoodListSkeleton />
      ) : isError ? (
        <ErrorState
          message="We couldn't load the menu. Please try again."
          onRetry={() => refetch()}
        />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item, index }) => <FoodCard item={item} index={index} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyState {...getEmptyCopy(q, category)} />}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            gap: FOOD_CARD.columnGap,
            alignItems: "flex-start",
          }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 20,
            gap: FOOD_CARD.rowGap,
            paddingBottom: tabHeight + 30,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 16,
  },

  foodDetail: {
    gap: 6,
  },
  foodName: {
    ...textVariants.sectionTitle,
    fontSize: 18,
    alignSelf: "stretch",
    color: palette.almostBlack,
    textTransform: "capitalize",
    textAlign: "center",
  },
  foodPrice: {
    ...textVariants.infoLabel,
    fontSize: 16,
    color: palette.labelGray,
    textTransform: "capitalize",
    textAlign: "center",
  },
  addToCartBtnText: {
    ...textVariants.sectionTitle,
    color: palette.orange,
    textAlign: "center",
    marginTop: 14,
  },
});
