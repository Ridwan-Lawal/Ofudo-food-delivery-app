import Ionicons from "@expo/vector-icons/Ionicons";
import { Toaster } from "sonner-native";

import { colors, fontFamily, fontSize, radius, spacing } from "@/theme/tokens";

export default function AppToaster() {
  return (
    <Toaster
      theme="light"
      position="top-center"
      offset={60}
      duration={4000}
      icons={{
        success: <Ionicons name="checkmark-circle" size={20} color={colors.success} />,
        error: <Ionicons name="close-circle" size={20} color={colors.danger} />,
      }}
      toastOptions={{
        style: {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: "#EEEEEE",
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          gap: spacing.sm,
        },
        titleStyle: {
          fontFamily: fontFamily.semibold,
          fontSize: fontSize.sm,
          color: colors.text.primary,
        },
        descriptionStyle: {
          fontFamily: fontFamily.medium,
          fontSize: fontSize.sm,
          color: colors.text.secondary,
        },
      }}
    />
  );
}
