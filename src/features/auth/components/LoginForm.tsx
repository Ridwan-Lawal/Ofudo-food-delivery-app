import AnimatedPrimaryButton from "@/components/AnimatedPrimaryButton";
import { authClient } from "@/lib/auth-client";
import { LoginFormValues, loginSchema } from "@/lib/zod/auth-schema";
import { palette, textVariants } from "@/theme/tokens";
import { haptics } from "@/utils/haptics";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { toast } from "sonner-native";
import { useSession } from "../hooks/useSession";
import { useAuthStore } from "../store/auth-store";
import AuthFormInput from "./AuthFormInput";

const loginBgImage = require("@/assets/images/login-graphic.png");
const logo = require("@/assets/icons/adaptive-icon.png");

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { refetch } = useSession();
  const openLoginSuccessModal = useAuthStore((s) => s.onToggleLoginSuccessModal);
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isSigningIn, setIsSigningIn] = useState(false);

  const formValues = useWatch({
    control,
  });

  const areAllFieldsFilled = Object.values(formValues).every((value) => value);

  async function handleLogin(formData: LoginFormValues) {
    await authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
        rememberMe: true,
      },
      {
        onRequest: () => setIsSigningIn(true),
        onResponse: () => setIsSigningIn(false),
        onSuccess: async () => {
          haptics.success();
          toast.success("Sign In successful", { description: "Welcome" });
          setIsSigningIn(false);
          reset();
          await refetch();
          openLoginSuccessModal(true);
        },
        onError: async (ctx) => {
          haptics.error();

          setIsSigningIn(false);
          if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
            toast.error("Sign In failed", {
              description: `${ctx.error.message}, Please verify your email`,
            });
            const { error } = await authClient.emailOtp.sendVerificationOtp({
              email: formData.email,
              type: "email-verification",
            });

            if (error) {
              toast.error("Failed to send verification OTP");
            } else {
              router.push({ pathname: "/verify-account", params: { email: formData.email } });
            }

            return;
          }

          toast.error("Sign In failed", {
            description: ctx.error.message,
          });
        },
      },
    );
  }

  return (
    <View style={styles.container}>
      <Image source={loginBgImage} style={styles.bgImage} transition={300} />

      <View style={styles.formContainer}>
        <View style={{ alignItems: "center" }}>
          <Image source={logo} style={styles.logoImage} transition={300} />
        </View>

        <KeyboardAwareScrollView contentContainerStyle={styles.inputsContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <AuthFormInput
                label="Email address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={true}
                keyboardType="email-address"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <AuthFormInput
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={true}
                secureTextEntry={!showPassword}
                autoComplete="password"
                textContentType="password"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.password?.message}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                  size={20}
                  color={palette.bodyGray}
                />
              </AuthFormInput>
            )}
          />

          <AnimatedPrimaryButton
            buttonText={isSigningIn ? "Signing In..." : "Login"}
            onPress={handleSubmit(handleLogin)}
            buttonStyle={{ opacity: areAllFieldsFilled ? 1 : 0.5 }}
            disabled={!areAllFieldsFilled}
          />

          <Text style={styles.footerText}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={styles.footerTextLink}>
              {" "}
              Sign up
            </Link>
          </Text>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  bgImage: {
    width: "100%",
    height: 393,
  },

  logoImage: {
    width: 150,
    height: 150,
    marginTop: -80,
  },

  formContainer: {
    backgroundColor: "white",
    marginTop: -80,
    borderRadius: 30,
    paddingHorizontal: 30,
    flex: 1,
  },
  inputsContainer: {
    gap: 40,
  },
  footerText: {
    ...textVariants.label,
    fontSize: 16,
    textAlign: "center",
    marginTop: -16,
  },

  footerTextLink: {
    color: palette.orange,
  },
});
