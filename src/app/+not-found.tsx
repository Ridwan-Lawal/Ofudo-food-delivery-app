import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontFamily, fontSize, radius, shadow, spacing } from "@/theme/tokens";
import { useRouter } from "expo-router";

export default function NotFound() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <View style={[styles.dot, styles.dotTopLeft]} />
        <View style={[styles.dot, styles.dotTopRight]} />
        <View style={[styles.dot, styles.dotBottom]} />
        <View style={styles.halo}>
          <View style={styles.badge}>
            <Text style={styles.badgeGlyph}>?</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>Page not found</Text>
      <Text style={styles.caption}>
        The page you are looking for does not exist or may have moved.
      </Text>

      <Pressable style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonLabel}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  illustration: {
    width: 172,
    height: 172,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  halo: {
    width: 132,
    height: 132,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.raised,
  },
  badgeGlyph: {
    fontFamily: fontFamily.bold,
    fontSize: 36,
    color: colors.text.inverse,
  },
  dot: {
    position: "absolute",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  dotTopLeft: { width: 12, height: 12, top: 24, left: 18 },
  dotTopRight: { width: 16, height: 16, top: 40, right: 12 },
  dotBottom: { width: 10, height: 10, bottom: 30, left: 40 },
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
    maxWidth: 320,
  },
  button: {
    marginTop: spacing.xxl,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    ...shadow.card,
  },
  buttonLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.text.inverse,
  },
});
