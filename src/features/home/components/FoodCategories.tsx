import AnimatedPressable from "@/components/AnimatedPressable";
import { fontFamily } from "@/theme/tokens";
import { FOOD_CATEGORIES } from "@/utils/constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useBottomTabBarHeight } from "expo-router/build/react-navigation/bottom-tabs";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const summerComboImage = require("@/assets/images/burger-one.png");
const arrowRightIcon = require("@/assets/icons/arrow-right.png");

export default function FoodCategories() {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ gap: 18, paddingBottom: tabBarHeight + 20 }}>
        <View style={styles.comboCard}>
          <View style={styles.comboText}>
            <Text style={styles.comboTitle}>Summer combo</Text>
            <Text style={styles.comboPrice}>$10.88</Text>
          </View>

          <Image source={summerComboImage} style={styles.comboImage} />
        </View>

        {FOOD_CATEGORIES?.map((category, idx) => (
          <AnimatedPressable
            style={[
              styles.categoryContainer,
              category.name === "pizza" && styles.pizzaCategoryContainer,
              category.name === "burgers" && styles.burgerCategoryContainer,
              category.name === "burrito" && styles.burritoCategoryContainer,
            ]}
            key={idx}
            onPress={() =>
              router.push({ pathname: "/search", params: { category: category.name } })
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
        ))}
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
    height: 190,
    borderRadius: 20,
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
