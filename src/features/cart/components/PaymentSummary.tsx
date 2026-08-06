import { palette, textVariants } from "@/theme/tokens";
import { StyleSheet, Text, View } from "react-native";
import { useCartStore } from "../store/cart-store";

export default function PaymentSummary() {
  const cart = useCartStore((s) => s.cart);
  const totalItems = cart.length;
  const totalItemsPrice = cart.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
  const deliveryFee = totalItemsPrice > 1000 ? 0 : 10;
  const discount = totalItemsPrice > 500 ? totalItemsPrice * 0.05 : 0;
  const totalCostPrice = totalItemsPrice + deliveryFee - discount;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Payment Summary</Text>

      <View style={{ gap: 16 }}>
        <View style={styles.priceTypeContainer}>
          <Text style={styles.name}>Total Items ({totalItems})</Text>
          <Text style={styles.value}>${totalItemsPrice.toFixed(2)}</Text>
        </View>

        <View style={styles.priceTypeContainer}>
          <Text style={styles.name}>Delivery Fee</Text>
          <Text style={styles.value}>{deliveryFee ? `$${deliveryFee}` : "Free"}</Text>
        </View>

        <View style={styles.priceTypeContainer}>
          <Text style={styles.name}>Discount</Text>
          <Text style={[styles.value, { color: palette.green }]}>-${discount}</Text>
        </View>
      </View>
      <View style={styles.totalPrice}>
        <Text style={styles.totalPriceText}>Total</Text>
        <Text style={styles.totalPriceValue}>${totalCostPrice.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    alignItems: "flex-start",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ededed",
  },
  headerText: {
    ...textVariants.h1,
    fontSize: 20,
  },

  priceTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  name: {
    ...textVariants.body,
  },
  value: {
    ...textVariants.button,
    fontSize: 16,
    color: palette.almostBlack,
  },

  totalPrice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  totalPriceText: {
    ...textVariants.button,
    fontSize: 16,
    color: palette.almostBlack,
  },

  totalPriceValue: {
    ...textVariants.button,
    fontSize: 16,
    color: palette.almostBlack,
  },
});
