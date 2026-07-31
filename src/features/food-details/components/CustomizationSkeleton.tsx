import SkeletonBlock from "@/components/SkeletonBlock";
import { radius } from "@/theme/tokens";
import { StyleSheet, Text, View } from "react-native";
import { CUSTOMIZATION_CARD, customizationStyles } from "./customizationCard.styles";

const SKELETON_COUNT = 4;
const SECTION_TITLES = ["Toppings", "Side options"];

/**
 * Loading placeholder for Customization. Mirrors the real card box and row gaps so
 * nothing shifts when data lands.
 */
export default function CustomizationSkeleton() {
  // A Fragment, not a View — these become direct children of Customization's container
  // so its gap spaces the sections exactly like the real lists.
  return (
    <>
      {SECTION_TITLES.map((title) => (
        <View key={title} style={customizationStyles.section}>
          <Text style={customizationStyles.headerText}>{title}</Text>

          <View style={[customizationStyles.listContent, styles.row]}>
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <SkeletonBlock
                key={index}
                width={CUSTOMIZATION_CARD.width}
                height={CUSTOMIZATION_CARD.height}
                borderRadius={radius.md}
              />
            ))}
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});
