import AnimatedPrimaryButton from "@/components/AnimatedPrimaryButton";
import { authClient } from "@/lib/auth-client";
import { RegisterFormValues, registerSchema } from "@/lib/zod/auth-schema";
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
import AuthFormInput from "./AuthFormInput";

const loginBgImage = require("@/assets/images/login-image.png");
const logo = require("@/assets/icons/adaptive-icon.png");

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { handleSubmit, reset, formState, control } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const { errors } = formState;

  const formValues = useWatch({
    control,
  });

  const areAllFieldsFilled = Object.values(formValues).every((value) => value);

  async function handleRegistration(formData: RegisterFormValues) {
    haptics.tap();

    const { error, data } = await authClient.signUp.email(
      {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          haptics.success();
          toast.success("Account created successfully", { description: "Please verify your mail" });
          router.push({ pathname: "/verify-account", params: { email: formData.email } });
          reset();
        },
        onError: (ctx) => {
          setIsLoading(false);
          haptics.error();
          toast.error("Failed to create account", { description: ctx.error.message });
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

        <KeyboardAwareScrollView contentContainerStyle={styles.inputsContainer} bottomOffset={20}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value, onBlur } }) => (
              <AuthFormInput
                label="Full Name"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                editable={!isLoading}
                onBlur={onBlur}
                error={errors.fullName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <AuthFormInput
                label="Email address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isLoading}
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
                editable={!isLoading}
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
            buttonText={isLoading ? "Registering..." : "Register"}
            onPress={handleSubmit(handleRegistration)}
            buttonStyle={{ opacity: areAllFieldsFilled ? 1 : 0.5 }}
            disabled={!areAllFieldsFilled || isLoading}
          />

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Link href="/login" style={styles.footerTextLink} disabled={isLoading}>
              {" "}
              Sign in
            </Link>
          </Text>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

// continue with the auth feature.

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
