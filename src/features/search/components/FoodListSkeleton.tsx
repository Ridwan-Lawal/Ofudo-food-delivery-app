import SkeletonBlock from "@/components/SkeletonBlock";
import { radius } from "@/theme/tokens";
import { useBottomTabBarHeight } from "expo-router/build/react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import { FOOD_CARD, foodCardStyles } from "./foodCard.styles";

const PLACEHOLDER_COUNT = 6;

/**
 * Loading placeholder for FoodList. Mirrors the real grid's geometry — same card
 * box, same two-column stagger, same paddings — so nothing shifts when data lands.
 */
export default function FoodListSkeleton() {
  const tabHeight = useBottomTabBarHeight();

  const rows = Array.from({ length: Math.ceil(PLACEHOLDER_COUNT / 2) });

  return (
    <View style={[styles.container, { paddingBottom: tabHeight + 30 }]}>
      {rows.map((_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {[0, 1].map((columnIndex) => (
            <View
              key={columnIndex}
              style={[
                foodCardStyles.foodContainer,
                // Matches FoodList's `index % 2 === 0 ? 0 : stagger`.
                { marginTop: columnIndex === 0 ? 0 : FOOD_CARD.stagger },
              ]}
            >
              <SkeletonBlock
                width={FOOD_CARD.imageWidth}
                height={FOOD_CARD.imageHeight}
                borderRadius={radius.md}
                style={styles.image}
              />

              <View style={styles.detail}>
                <SkeletonBlock width="70%" height={18} />
                <SkeletonBlock width="50%" height={16} />
              </View>

              <SkeletonBlock width="60%" height={16} style={styles.button} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    gap: FOOD_CARD.rowGap,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: FOOD_CARD.columnGap,
  },
  image: {
    position: "relative",
    top: -30,
  },
  detail: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: 6,
  },
  button: {
    marginTop: 14,
  },
});
