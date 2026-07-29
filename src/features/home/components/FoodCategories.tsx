import AnimatedPressable from "@/components/AnimatedPressable";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import SkeletonBlock from "@/components/SkeletonBlock";
import { useGetCategories } from "@/features/search/hook/useSearch";
import { fontFamily } from "@/theme/tokens";
import { burgerImage, burritoImage, pizzaImage } from "@/utils/constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useBottomTabBarHeight } from "expo-router/build/react-navigation/bottom-tabs";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const summerComboImage = require("@/assets/images/burger-one.png");
const arrowRightIcon = require("@/assets/icons/arrow-right.png");

const CATEGORY_CARD_HEIGHT = 190;
const CATEGORY_CARD_RADIUS = 20;
/** The filter below narrows to Burgers/Pizzas/Burritos. */
const CATEGORY_CARD_COUNT = 3;

function CategoriesSkeleton() {
  // A Fragment, not a View — these become direct children of the ScrollView content
  // container so its gap spaces them exactly like the real cards.
  return (
    <>
      {Array.from({ length: CATEGORY_CARD_COUNT }).map((_, index) => (
        <SkeletonBlock
          key={index}
          height={CATEGORY_CARD_HEIGHT}
          borderRadius={CATEGORY_CARD_RADIUS}
        />
      ))}
    </>
  );
}

export default function FoodCategories() {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const { data, isPending, error, refetch } = useGetCategories();

  const categories = data?.filter(cat => cat.name === 'Burgers' || cat.name === 'Pizzas' || cat.name === 'Burritos').map(cat => ({ ...cat, image: cat.name === 'Pizzas' ? pizzaImage : cat.name === 'Burritos' ? burritoImage : burgerImage }))

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, gap: 18, paddingBottom: tabBarHeight + 20 }}
      >
        <View style={styles.comboCard}>
          <View style={styles.comboText}>
            <Text style={styles.comboTitle}>Summer combo</Text>
            <Text style={styles.comboPrice}>$10.88</Text>
          </View>

          <Image source={summerComboImage} style={styles.comboImage} />
        </View>

        {isPending ? (
          <CategoriesSkeleton />
        ) : error ? (
          <ErrorState
            message="We couldn't load categories. Please try again."
            onRetry={() => refetch()}
            style={styles.stateBlock}
          />
        ) : !categories?.length ? (
          <EmptyState message="No categories to show right now." style={styles.stateBlock} />
        ) : (
          categories.map((category, idx) => (
            <AnimatedPressable
              style={[
                styles.categoryContainer,
                category.name === "Pizzas" && styles.pizzaCategoryContainer,
                category.name === "Burgers" && styles.burgerCategoryContainer,
                category.name === "Burritos" && styles.burritoCategoryContainer,
              ]}
              key={idx}
              onPress={() =>
                router.push({ pathname: "/search", params: { category: category.id } })
              }
            >
              <Image
                source={category.image}
                style={[
                  styles.categoryImage,
                  category.name === "pizza" && { height: 190, width: 210 },
                ]}
              />

              <View style={styles.categoryContent}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Image source={arrowRightIcon} style={styles.linkIcon} transition={200} />
              </View>
            </AnimatedPressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18,
  },
  comboCard: {
    backgroundColor: "#D33B0D",
    borderRadius: 20,
    height: 225,
    flexDirection: "row",
    position: "relative",
  },
  comboText: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },

  comboTitle: {
    color: "white",
    fontFamily: fontFamily.rubik,
    lineHeight: 36,
    textTransform: "uppercase",
    fontSize: 36,
    width: 164,
  },

  comboPrice: {
    color: "white",
    fontFamily: fontFamily.rubik,
    textTransform: "uppercase",
    fontSize: 24,
    lineHeight: 30,
  },
  comboImage: {
    width: 240,
    height: 200,
    flex: 1,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  categoryContainer: {
    height: CATEGORY_CARD_HEIGHT,
    borderRadius: CATEGORY_CARD_RADIUS,
  },
  // ErrorState/EmptyState bottom out in MessageState, whose container is flex:1 — it needs
  // real space inside the ScrollView (paired with flexGrow:1 on the content container).
  stateBlock: {
    minHeight: 320,
  },
  burgerCategoryContainer: {
    backgroundColor: "#eb920c",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
    borderRadius: 20,
  },
  pizzaCategoryContainer: {
    backgroundColor: "#084137",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 16,
    borderRadius: 20,
  },
  burritoCategoryContainer: {
    backgroundColor: "#df5a0c",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: 20,
  },
  categoryImage: {
    width: 170,
    height: 150,
  },
  categoryContent: {
    alignItems: "flex-start",
    gap: 14,
  },
  categoryName: {
    color: "white",
    fontFamily: fontFamily.rubik,
    lineHeight: 36,
    textTransform: "uppercase",
    fontSize: 36,
  },
  linkIcon: {
    width: 33,
    height: 16,
  },
});
