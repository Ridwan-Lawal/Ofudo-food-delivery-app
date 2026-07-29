import { StyleSheet } from "react-native";

/**
 * Geometry shared between the real food card (FoodList) and its loading
 * placeholder (FoodListSkeleton). Keep them in one place so the skeleton
 * can't drift out of alignment with the content it stands in for.
 */
export const FOOD_CARD = {
  imageWidth: 118,
  imageHeight: 107,
  maxWidth: 180,
  /** Vertical offset applied to the right-hand column for the staggered grid. */
  stagger: 60,
  /** Gap between the two columns. */
  columnGap: 20,
  /** Gap between rows. */
  rowGap: 40,
} as const;

export const foodCardStyles = StyleSheet.create({
  foodContainer: {
    borderRadius: 30,
    backgroundColor: "white",
    boxShadow: "0 20px 60px 0 rgba(57, 57, 57, 0.10)",

    alignItems: "center",
    paddingBottom: 23,
    paddingHorizontal: 16,
    flex: 1,
    zIndex: 999,
    maxWidth: FOOD_CARD.maxWidth,
  },

  foodImage: {
    height: FOOD_CARD.imageHeight,
    width: FOOD_CARD.imageWidth,
    position: "relative",
    top: -30,
  },
});
