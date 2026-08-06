import { fontFamily, palette, textVariants } from "@/theme/tokens";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function CartHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.firstFlexItem}>
        <Text style={styles.title}>deliver to</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.location}>Lagos, Nigeria</Text>
        </View>
      </View>

      <Pressable style={styles.locationChangeBtn}>
        <Text style={styles.locationChangeText}>Change Location</Text>
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
  firstFlexItem: {
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

  dropdownIcon: {
    width: 10,
    height: 8,
    marginTop: 3,
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
