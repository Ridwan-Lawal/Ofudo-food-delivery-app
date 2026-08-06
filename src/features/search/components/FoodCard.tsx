import AnimatedPressable from "@/components/AnimatedPressable";
import ItemQuantityControl from "@/components/ItemQuantityControl";
import { useAddCart, useUpdateCart } from "@/features/cart/components/hooks/useCart";
import { useCartStore } from "@/features/cart/store/cart-store";
import { palette, textVariants } from "@/theme/tokens";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getMenuItems } from "../services/menu-service";
import { FOOD_CARD, foodCardStyles } from "./foodCard.styles";

interface FoodCardProps {
  item: Awaited<ReturnType<typeof getMenuItems>>[0];
  index: number;
}

export default function FoodCard({ item, index }: FoodCardProps) {
  const router = useRouter();
  const { handleAddFoodToCart } = useAddCart();
  const cart = useCartStore((s) => s.cart);
  const foodItemFromCart = cart.find((f) => f.foodId === item.id);
  const isFoodInCart = !!foodItemFromCart;
  const { handleQuantityIncrease } = useUpdateCart(foodItemFromCart);

  function onHandleAddFood() {
    const foodItem = {
      name: item.name,
      price: item.price,
      image_url: item.image_url,
    };

    handleAddFoodToCart(foodItem, item.id);
  }

  return (
    <AnimatedPressable
      style={[foodCardStyles.foodContainer, { marginTop: index % 2 === 0 ? 0 : FOOD_CARD.stagger }]}
      onPress={() => {
        router.push({ pathname: "/[foodId]", params: { foodId: item.id } });
      }}
    >
      <Image
        source={item.image_url}
        style={foodCardStyles.foodImage}
        transition={200}
        cachePolicy="memory-disk"
        placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
      />

      <View style={styles.foodDetail}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodPrice}>from ${item.price}</Text>
      </View>

      {isFoodInCart ? (
        <ItemQuantityControl
          onDecreaseQuantity={() => handleQuantityIncrease("decr")}
          onIncreaseQuantity={() => handleQuantityIncrease("incr")}
          itemQuantity={foodItemFromCart.quantity}
        />
      ) : (
        <Pressable onPress={onHandleAddFood}>
          <Text style={styles.addToCartBtnText}>+ Add to cart</Text>
        </Pressable>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  foodDetail: {
    gap: 6,
    marginBottom: 14,
  },
  foodName: {
    ...textVariants.sectionTitle,
    fontSize: 18,
    alignSelf: "stretch",
    color: palette.almostBlack,
    textTransform: "capitalize",
    textAlign: "center",
  },
  foodPrice: {
    ...textVariants.infoLabel,
    fontSize: 16,
    color: palette.labelGray,
    textTransform: "capitalize",
    textAlign: "center",
  },
  addToCartBtnText: {
    ...textVariants.sectionTitle,
    color: palette.orange,
    textAlign: "center",
  },
});
