import AnimatedPressable from "@/components/AnimatedPressable";
import { useAddCart, useUpdateCart } from "@/features/cart/components/hooks/useCart";
import { useCartStore } from "@/features/cart/store/cart-store";
import { FoodDetail } from "@/lib/supabase/supabase";
import { palette, textVariants } from "@/theme/tokens";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AddToCart({ foodData }: { foodData: FoodDetail }) {
  const insets = useSafeAreaInsets();
  const { foodId } = useLocalSearchParams<{ foodId: string }>();
  const cart = useCartStore((s) => s.cart);
  const foodItem = cart?.find((item) => item.foodId === foodId);
  const { handleFoodItemDeletion, handleQuantityIncrease } = useUpdateCart(foodItem);
  const isFoodInCart = !!foodItem;
  const { handleAddFoodToCart } = useAddCart();

  const onAddFoodToCart = () => {
    const foodDetail = {
      name: foodData.name,
      price: foodData.price,
      image_url: foodData.image_url,
    };

    handleAddFoodToCart(foodDetail, foodId);
  };

  return (
    <View style={[styles.container, { bottom: insets.bottom + 10 }]}>
      <View style={styles.addToCartContainer}>
        {foodItem && (
          <View style={styles.foodQuantityControl}>
            <Octicons
              name="dash"
              color={palette.orange}
              size={20}
              onPress={() => handleQuantityIncrease("decr")}
            />
            <Text style={styles.foodQuantity}>{foodItem?.quantity}</Text>
            <Octicons
              name="plus"
              color={palette.orange}
              size={20}
              onPress={() => handleQuantityIncrease("incr")}
            />
          </View>
        )}

        <AnimatedPressable
          onPress={isFoodInCart ? handleFoodItemDeletion : onAddFoodToCart}
          style={styles.addToCartBtn}
        >
          <Ionicons name="cart-outline" color="white" size={14} />
          <Text style={styles.addToCartText}>
            {isFoodInCart
              ? `Remove food ($${foodData?.price})`
              : `Add to cart (${foodData?.price})`}
          </Text>
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
