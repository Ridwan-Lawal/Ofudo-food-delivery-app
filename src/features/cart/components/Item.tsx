import ItemQuantityControl from "@/components/ItemQuantityControl";
import { fontFamily, palette, textVariants } from "@/theme/tokens";
import { placeholderUrl } from "@/utils/constants";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { CartItem } from "../types";
import { useUpdateCart } from "./hooks/useCart";

interface ItemProps {
  item: CartItem;
}

export default function Item({ item }: ItemProps) {
  const { handleFoodItemDeletion, handleQuantityIncrease } = useUpdateCart(item);

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemImageContainer}>
        <Image
          source={item.image_url}
          style={styles.itemImage}
          transition={200}
          placeholder={placeholderUrl}
        />
      </View>

      <View style={styles.itemDescription}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price * item.quantity}</Text>

        <View style={styles.itemActions}>
          <ItemQuantityControl
            onDecreaseQuantity={() => handleQuantityIncrease("decr")}
            onIncreaseQuantity={() => handleQuantityIncrease("incr")}
            itemQuantity={item.quantity}
          />

          <FontAwesome
            name="trash"
            color={palette.red}
            size={20}
            onPress={handleFoodItemDeletion}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    boxShadow: "6px 6px 60px 0 rgba(0, 0, 0, 0.04)",
  },
  itemImageContainer: {
    paddingVertical: 8,
    paddingHorizontal: 7,
    borderRadius: 8,
    backgroundColor: "rgba(254, 140, 0, 0.10)",
  },
  itemImage: {
    width: 72,
    height: 65,
  },

  itemDescription: {
    gap: 7,
    alignItems: "flex-start",
    flex: 1,
  },

  itemName: {
    ...textVariants.button,
    fontSize: 16,
    color: palette.almostBlack,
    textTransform: "capitalize",
  },

  itemPrice: {
    color: palette.orange,
    fontFamily: fontFamily.bold,
    fontSize: 16,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

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
