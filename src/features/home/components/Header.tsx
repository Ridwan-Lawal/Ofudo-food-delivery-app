import { useCartStore } from "@/features/cart/store/cart-store";
import { DeliverTo } from "@/features/location";
import { palette, textVariants } from "@/theme/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const DropdownIcon = require("@/assets/icons/triangle-down.svg");

export default function HomeHeader() {
  const cart = useCartStore((s) => s.cart);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <DeliverTo accessory={<Image source={DropdownIcon} style={styles.dropdownIcon} />} />

      <Pressable onPress={() => router.push("/cart")} style={styles.secondFlexItem}>
        <View style={styles.cartContainer}>
          <Ionicons name="cart-outline" size={20} color="white" />
        </View>
        <View style={styles.itemCount}>
          <Text style={styles.itemCountText}>{cart?.length ?? 0}</Text>
        </View>
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
