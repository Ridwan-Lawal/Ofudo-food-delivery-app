import { fontFamily, palette, textVariants } from "@/theme/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

const DropdownIcon = require("@/assets/icons/triangle-down.svg");

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.firstFlexItem}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.location}>Find your favourite food</Text>
          <Image source={DropdownIcon} style={styles.dropdownIcon} />
        </View>
      </View>

      <View style={styles.secondFlexItem}>
        <View style={styles.cartContainer}>
          <Ionicons name="cart-outline" size={20} color="white" />
        </View>
        <View style={styles.itemCount}>
          <Text style={styles.itemCountText}>2</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
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
  secondFlexItem: {
    position: "relative",
  },
  cartContainer: {
    backgroundColor: palette.almostBlack,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  itemCount: {
    height: 20,
    width: 20,
    backgroundColor: palette.orange,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    position: "absolute",
    top: -7,
    right: -4,
  },
  itemCountText: {
    ...textVariants.button,
    color: "white",
  },
});
