import { CartItems } from "@/features/cart";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cart() {
  return (
    <SafeAreaView style={styles.container}>
      <CartItems />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 30,
    backgroundColor: "#fafafa",
  },
});
