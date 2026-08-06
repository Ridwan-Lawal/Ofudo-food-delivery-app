import AnimatedPrimaryButton from "@/components/AnimatedPrimaryButton";
import { textVariants } from "@/theme/tokens";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useBottomTabBarHeight } from "expo-router/build/react-navigation/bottom-tabs";
import { useCallback, useRef } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useCartStore } from "../store/cart-store";
import CartEmpty from "./CartEmpty";
import { CartHeader } from "./CartHeader";
import Item from "./Item";
import PaymentSummary from "./PaymentSummary";
import { useClearCart } from "./hooks/useCart";

const successIcon = require("@/assets/images/success.png");

export function CartItems() {
  const orderCompleteModalRef = useRef<BottomSheetModal>(null);
  const tabHeight = useBottomTabBarHeight();
  const cart = useCartStore((s) => s.cart);
  const hasItems = cart.length > 0;
  const openModal = useCallback(() => orderCompleteModalRef.current?.present(), []);
  const closeModal = useCallback(() => orderCompleteModalRef.current?.dismiss(), []);
  const clearCart = useCartStore((s) => s.clearCart);
  const { mutate: clearCartFromDb } = useClearCart();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  function handlePlaceOrder() {
    clearCart();
    openModal();
    clearCartFromDb();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<CartEmpty />}
        contentContainerStyle={[styles.cartList, { paddingBottom: tabHeight + 10 }]}
        renderItem={({ item }) => <Item item={item} />}
        ListHeaderComponent={<CartHeader />}
        ListFooterComponent={
          hasItems ? (
            <>
              <PaymentSummary />
              <AnimatedPrimaryButton onPress={handlePlaceOrder} buttonText="Order Now" />
            </>
          ) : null
        }
      />

      <BottomSheetModal
        ref={orderCompleteModalRef}
        snapPoints={["55%"]}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        backgroundStyle={styles.loginModalContainer}
        handleIndicatorStyle={styles.modalHandle}
      >
        <BottomSheetView style={styles.modalCard}>
          <Image source={successIcon} style={styles.successIcon} transition={200} />

          <View style={styles.textContainer}>
            <Text style={styles.title}>Order Successfully Placed</Text>
            <Text style={styles.subtitle}>You will recieve your order in 24 hours.</Text>
          </View>

          <AnimatedPrimaryButton
            buttonText="Close"
            onPress={() => {
              closeModal();
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
  },

  cartList: {
    flexGrow: 1,
    gap: 20,
  },

  loginModalContainer: {
    borderRadius: 24,
  },
  modalHandle: {
    width: 68,
    backgroundColor: "rgba(0, 0, 0, 0.20)",
  },
  modalCard: {
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 32,
  },
  successIcon: {
    width: 202.622,
    height: 150.343,
  },
  textContainer: {
    gap: 6,
  },
  title: {
    ...textVariants.h1,
    color: "#181c2e",
    textAlign: "center",
  },

  subtitle: {
    ...textVariants.subtitle,
    textAlign: "center",
  },
});
