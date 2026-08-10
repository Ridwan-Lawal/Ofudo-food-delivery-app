import { DeliverTo, useUserLocation } from "@/features/location";
import { palette, textVariants } from "@/theme/tokens";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function CartHeader() {
  const { refresh, isLocating } = useUserLocation();

  return (
    <View style={styles.container}>
      <DeliverTo />

      <Pressable onPress={refresh} disabled={isLocating} style={styles.locationChangeBtn}>
        <Text style={styles.locationChangeText}>
          {isLocating ? "Locating…" : "Change Location"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  locationChangeBtn: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 24,
    gap: 8,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: palette.orange,
  },

  locationChangeText: {
    ...textVariants.button,
    fontSize: 12,
    color: palette.orange,
  },
});
