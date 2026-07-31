import SkeletonBlock from "@/components/SkeletonBlock";
import { radius } from "@/theme/tokens";
import { StyleSheet, View } from "react-native";
import { FOOD_DETAIL } from "./foodDetail.styles";

const PERKS_HEIGHT = 44;
const DESCRIPTION_LINES = 3;

/**
 * Loading placeholder for the food detail screen. Mirrors DetailHeader's two-column
 * layout and FoodDescription's perks pill so nothing shifts when data lands.
 */
export default function FoodDetailSkeleton() {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerColumn}>
          <SkeletonBlock width="80%" height={28} />
          <SkeletonBlock width="45%" height={18} />
          <SkeletonBlock width="60%" height={18} />
          <SkeletonBlock width="40%" height={28} />

          <View style={styles.nutrients}>
            <SkeletonBlock width={70} height={38} />
            <SkeletonBlock width={70} height={38} />
          </View>

          <SkeletonBlock width={90} height={38} />
        </View>

        <SkeletonBlock
          width={FOOD_DETAIL.imageWidth}
          height={FOOD_DETAIL.imageHeight}
          borderRadius={radius.lg}
        />
      </View>

      <View style={styles.description}>
        <SkeletonBlock height={PERKS_HEIGHT} borderRadius={radius.xl} />

        <View style={styles.descriptionLines}>
          {Array.from({ length: DESCRIPTION_LINES }).map((_, index) => (
            <SkeletonBlock
              key={index}
              width={index === DESCRIPTION_LINES - 1 ? "65%" : "100%"}
              height={14}
            />
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: FOOD_DETAIL.gutter,
    flexDirection: "row",
    alignItems: "center",
  },
  headerColumn: {
    flex: 1,
    gap: 14,
  },
  nutrients: {
    flexDirection: "row",
    gap: 28,
  },
  description: {
    gap: 24,
    paddingHorizontal: FOOD_DETAIL.gutter,
  },
  descriptionLines: {
    gap: 8,
  },
});
