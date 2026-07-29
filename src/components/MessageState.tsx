import AnimatedPrimaryButton from "@/components/AnimatedPrimaryButton";
import { colors, fontFamily, fontSize, radius, shadow, spacing } from "@/theme/tokens";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface MessageStateProps {
  title: string;
  message: string;
  /** Rendered inside the badge circle; caller supplies a fully-styled node. */
  icon: ReactNode;
  /** Badge fill. */
  tint: string;
  /** Halo fill. */
  tintSoft: string;
  /** Action button is hidden when omitted. */
  onAction?: () => void;
  actionLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Centered halo/badge/title/caption block with an optional action button.
 * Shared shell behind ErrorState and EmptyState.
 */
export default function MessageState({
  title,
  message,
  icon,
  tint,
  tintSoft,
  onAction,
  actionLabel,
  style,
}: MessageStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.halo, { backgroundColor: tintSoft }]}>
        <View style={[styles.badge, { backgroundColor: tint }]}>{icon}</View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>{message}</Text>

      {onAction && actionLabel ? (
        <AnimatedPrimaryButton
          onPress={onAction}
          buttonText={actionLabel}
          buttonStyle={styles.actionButton}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  halo: {
    width: 112,
    height: 112,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  badge: {
    width: 62,
    height: 62,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.raised,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.text.primary,
    textAlign: "center",
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    lineHeight: 24,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.sm,
    maxWidth: 300,
  },
  actionButton: {
    marginTop: spacing.xl,
    width: "auto",
    alignSelf: "center",
    paddingHorizontal: spacing.xl,
  },
});
