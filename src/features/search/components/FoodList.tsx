import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useSession } from "@/features/auth/hooks/useSession";
import { palette, textVariants } from "@/theme/tokens";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useBottomTabBarHeight } from "expo-router/build/react-navigation/bottom-tabs";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useGetMenuItems } from "../hook/useSearch";
import FoodListSkeleton from "./FoodListSkeleton";
import { FOOD_CARD, foodCardStyles } from "./foodCard.styles";
import { QueryParams } from "../types";
import { getEmptyCopy } from "@/utils/menu";





export default function FoodList() {
  const { q, category } = useLocalSearchParams<QueryParams>()
  const tabHeight = useBottomTabBarHeight();
  const { data: userData } = useSession()
  const { data, isPending, isError, refetch } = useGetMenuItems(q, category, userData?.user?.id)


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
        /*each food container*/
        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            return (
              <View
                style={[
                  foodCardStyles.foodContainer,
                  { marginTop: index % 2 === 0 ? 0 : FOOD_CARD.stagger },
                ]}
              >
                <Image source={item.image_url} style={foodCardStyles.foodImage} transition={200} cachePolicy='memory-disk' placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }} />

                <View style={styles.foodDetail}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodPrice}>from ${item.price}</Text>
                </View>

                <Pressable>
                  <Text style={styles.addToCartBtnText}>+ Add to cart</Text>
                </Pressable>

              </View>
            );
          }}

          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyState {...getEmptyCopy(q, category)} />}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            gap: FOOD_CARD.columnGap,
            alignItems: "flex-start",
          }}
          contentContainerStyle={{
            // Lets EmptyState's flex:1 fill the viewport instead of collapsing to the top.
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
