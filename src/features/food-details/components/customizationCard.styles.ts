import { palette, spacing, textVariants } from "@/theme/tokens";
import { StyleSheet } from "react-native";

/** Shared by the real card and its skeleton so the two can't drift apart. */
export const CUSTOMIZATION_CARD = {
  width: 84,
  height: 99,
  imageHeight: 61,
  labelHeight: 69,
  labelOffset: 30,
  imageSize: 48,
} as const;

export const customizationStyles = StyleSheet.create({
  section: {
    gap: 12,
  },
  headerText: {
    ...textVariants.button,
    fontSize: 16,
    color: palette.almostBlack,
  },
  listContent: {
    gap: spacing.xxl,
    paddingVertical: 4,
  },
});
