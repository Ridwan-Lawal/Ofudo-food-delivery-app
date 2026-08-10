import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOfflineSupport } from "@/hooks/useOfflineSupport";
import { colors, fontSize, shadow, spacing, textVariants } from "@/theme/tokens";
import { haptics } from "@/utils/haptics";

type ConnectionStatus = "offline" | "reconnected" | null;

export default function OfflineBanner() {
  const isOnline = useOfflineSupport();
  const insets = useSafeAreaInsets();
  const wasOnline = useRef(isOnline);
  const [status, setStatus] = useState<ConnectionStatus>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (wasOnline.current && !isOnline) {
      haptics.warning();
      setStatus("offline");
    } else if (!wasOnline.current && isOnline) {
      haptics.success();
      setStatus("reconnected");
      timeout = setTimeout(() => setStatus(null), 2000);
    }

    wasOnline.current = isOnline;

    return () => clearTimeout(timeout);
  }, [isOnline]);

  if (!status) return null;

  const isOffline = status === "offline";

  return (
    <Animated.View
      entering={SlideInUp}
      exiting={SlideOutUp}
      style={[
        styles.banner,
        {
          paddingTop: insets.top,
          backgroundColor: isOffline ? colors.danger : colors.success,
        },
      ]}
    >
      <Ionicons
        name={isOffline ? "cloud-offline-outline" : "checkmark-circle"}
        size={fontSize.md}
        color={colors.text.inverse}
      />
      <Text style={styles.label}>{isOffline ? "No internet connection" : "Back online"}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    ...shadow.bar,
    zIndex: 100,
    elevation: 10,
  },
  label: {
    ...textVariants.chip,
    color: colors.text.inverse,
  },
});
