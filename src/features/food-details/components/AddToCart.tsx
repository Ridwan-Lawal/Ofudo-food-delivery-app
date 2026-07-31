import AnimatedPressable from "@/components/AnimatedPressable";
import { palette, textVariants } from "@/theme/tokens";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AddToCart({ foodPrice }: { foodPrice: number | undefined }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: insets.bottom + 10 }]}>
      <View style={styles.addToCartContainer}>
        <View style={styles.foodQuantityControl}>
          <Octicons name="dash" color={palette.orange} size={30} />
          <Text style={styles.foodQuantity}>2</Text>
          <Octicons name="plus" color={palette.orange} size={30} />
        </View>

        <AnimatedPressable onPress={() => {}} style={styles.addToCartBtn}>
          <Ionicons name="cart-outline" color="white" size={14} />
          <Text style={styles.addToCartText}>Add to cart (${foodPrice})</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingHorizontal: 16,
  },
  addToCartContainer: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    backgroundColor: "white",
    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.10)",

    width: "100%",
  },
  foodQuantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    justifyContent: "space-between",
  },
  foodQuantity: {
    ...textVariants.h1,
    fontSize: 20,
    color: palette.almostBlack,
  },

  addToCartBtn: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.orange,
    borderRadius: 100,
  },
  addToCartText: {
    ...textVariants.button,
  },
});
