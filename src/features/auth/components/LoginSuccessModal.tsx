import AnimatedPrimaryButton from "@/components/AnimatedPrimaryButton";
import { textVariants } from "@/theme/tokens";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "../store/auth-store";

const successIcon = require("@/assets/images/success.png");

export default function LoginSuccessModal() {
  const modalRef = useRef<BottomSheetModal>(null);
  const openModal = () => modalRef.current?.present();
  const closeModal = () => modalRef.current?.dismiss();
  const router = useRouter();
  const { isLoginSuccessModalOpen, onToggleLoginSuccessModal } = useAuthStore((s) => s);

  useEffect(() => {
    if (isLoginSuccessModalOpen) {
      openModal();
    } else {
      closeModal();
    }
  }, [router, isLoginSuccessModalOpen]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
        onPress={() => {
          onToggleLoginSuccessModal(false);
          closeModal();
        }}
        style={{ backgroundColor: "black" }}
      />
    ),
    [onToggleLoginSuccessModal],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={["55%"]}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      backgroundStyle={styles.loginModalContainer}
      handleIndicatorStyle={styles.modalHandle}
    >
      <BottomSheetView style={styles.modalCard}>
        <Image source={successIcon} style={styles.successIcon} transition={200} />

        <View style={styles.textContainer}>
          <Text style={styles.title}>Login Successful</Text>
          <Text style={styles.subtitle}>You&apos;re all set to continue where you left off.</Text>
        </View>

        <AnimatedPrimaryButton
          buttonText="Close"
          onPress={() => {
            onToggleLoginSuccessModal(false);
            closeModal();
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
