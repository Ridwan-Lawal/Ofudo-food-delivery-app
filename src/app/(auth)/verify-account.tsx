import AnimatedPrimaryButton from "@/components/AnimatedPrimaryButton";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { authClient } from "@/lib/auth-client";
import { colors, fontFamily, fontSize, radius, spacing, textVariants } from "@/theme/tokens";
import { haptics } from "@/utils/haptics";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyAccount() {
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [restartToken, setRestartToken] = useState(0);
  const { email } = useLocalSearchParams<{ email: string }>();
  const openLoginSuccessModal = useAuthStore((s) => s.onToggleLoginSuccessModal);
  const [isVerifying, setIsVerifying] = useState(false);
  const { refetch } = useSession();

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [restartToken]);

  const canResend = secondsLeft === 0;
  const isComplete = code.length === OTP_LENGTH;

  function handleChange(text: string) {
    setCode(text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH));
  }

  async function handleResend() {
    if (!canResend) return;
    setCode("");
    setSecondsLeft(RESEND_SECONDS);
    setRestartToken((t) => t + 1);
    inputRef.current?.focus();

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    if (error) {
      haptics.error();
      toast.error("Failed to send verification OTP", { description: error.message });
    } else {
      haptics.success();
      toast.success("OTP successfully send", { description: "Check your mailbox" });
    }
  }

  async function handleVerify() {
    setIsVerifying(true);
    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp: code,
    });

    if (error) {
      setIsVerifying(false);
      haptics.error();
      toast.error("OTP verification failed", { description: error.message });
    } else {
      await refetch();
      setIsVerifying(false);
      haptics.success();
      toast.success("Welcome");
      setCode("");
      openLoginSuccessModal(true);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify your account</Text>
          <Text style={styles.subtitle}>
            Enter the {OTP_LENGTH}-digit code we just sent to {email} to confirm it&apos;s you.
          </Text>
        </View>

        <Pressable style={styles.otpRow} onPress={() => inputRef.current?.focus()}>
          {Array.from({ length: OTP_LENGTH }).map((_, i) => {
            const char = code[i] ?? "";
            const active = isFocused && (i === code.length || (isComplete && i === OTP_LENGTH - 1));
            return (
              <View
                key={i}
                style={[styles.cell, char !== "" && styles.cellFilled, active && styles.cellActive]}
              >
                <Text style={styles.cellText}>{char}</Text>
              </View>
            );
          })}

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChange}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            style={styles.hiddenInput}
            caretHidden
            autoFocus
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Pressable>

        <View style={styles.timerRow}>
          {canResend ? (
            <Pressable onPress={handleResend} hitSlop={8}>
              <Text style={styles.resendActive}>Resend code</Text>
            </Pressable>
          ) : (
            <Text style={styles.timerText}>
              Resend code in{" "}
              <Text style={styles.timerCount}>0:{secondsLeft.toString().padStart(2, "0")}</Text>
            </Text>
          )}
        </View>

        <AnimatedPrimaryButton
          buttonText={isVerifying ? "Verifying..." : "Verify"}
          onPress={handleVerify}
          disabled={!isComplete || isVerifying}
          buttonStyle={!isComplete && styles.buttonDisabled}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: spacing.xxl,
    gap: spacing.xl,
  },
  header: {
    gap: spacing.xs,
    alignItems: "center",
  },
  title: {
    ...textVariants.h1,
    color: colors.text.primary,
    textAlign: "center",
  },
  subtitle: {
    ...textVariants.body,
    textAlign: "center",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    position: "relative",
  },
  cell: {
    flex: 1,
    height: 56,
    maxWidth: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: "#cbcbcb",
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  cellFilled: {
    borderColor: colors.primary,
  },
  cellActive: {
    borderColor: colors.primary,
  },
  cellText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.text.primary,
  },
  hiddenInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },
  timerRow: {
    alignItems: "center",
  },
  timerText: {
    ...textVariants.label,
    fontSize: fontSize.md,
  },
  timerCount: {
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
  resendActive: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
