import { palette, textVariants } from "@/theme/tokens";
import { Octicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface ItemQuantityControlProps {
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  itemQuantity: number;
}

export default function ItemQuantityControl({
  onIncreaseQuantity,
  onDecreaseQuantity,
  itemQuantity,
}: ItemQuantityControlProps) {
  return (
    <View style={styles.itemQuantityControl}>
      <Octicons name="dash" color={palette.orange} size={20} onPress={onDecreaseQuantity} />
      <Text style={styles.itemQuantity}>{itemQuantity}</Text>
      <Octicons name="plus" color={palette.orange} size={20} onPress={onIncreaseQuantity} />
    </View>
  );
}

const styles = StyleSheet.create({
  itemQuantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    justifyContent: "space-between",
  },
  itemQuantity: {
    ...textVariants.h1,
    fontSize: 20,
    color: palette.almostBlack,
  },
});
