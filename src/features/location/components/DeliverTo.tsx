import { fontFamily, palette, textVariants } from "@/theme/tokens";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useUserLocation } from "../hooks/useUserLocation";
import DeliverToSkeleton from "./DeliverToSkeleton";

interface DeliverToProps {
  accessory?: ReactNode;
}

export default function DeliverTo({ accessory }: DeliverToProps) {
  const { label, hasHydrated, refresh } = useUserLocation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>deliver to</Text>

      {hasHydrated ? (
        <Pressable onPress={refresh} style={styles.locationContainer}>
          <Text style={styles.location}>{label ?? "Set location"}</Text>
          {accessory}
        </Pressable>
      ) : (
        <DeliverToSkeleton />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  title: {
    color: palette.orange,
    fontFamily: fontFamily.bold,
    fontSize: 12,
    textTransform: "uppercase",
  },
  locationContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  location: {
    ...textVariants.value,
    color: palette.almostBlack,
  },
});
