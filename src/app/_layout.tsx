import { useSession } from "@/features/auth/hooks/useSession";
import {
  Quicksand_300Light,
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
  useFonts,
} from "@expo-google-fonts/quicksand";
import { Rubik_700Bold, Rubik_900Black } from "@expo-google-fonts/rubik";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import AppToaster from "@/components/AppToaster";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { data: session } = useSession();

  console.log("session", session);
  const [fontsLoaded] = useFonts({
    Quicksand_300Light,
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    Rubik_900Black,
    Rubik_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const isLoggedIn = !!session?.user;
  const isAccountVerified = !!session?.user?.emailVerified;

  if (!fontsLoaded) return null;

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={!isLoggedIn || !isAccountVerified}>
                <Stack.Screen name="(auth)" />
              </Stack.Protected>

              <Stack.Protected guard={isLoggedIn && isAccountVerified}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="[foodId]" options={{ title: "Food Details" }} />
              </Stack.Protected>

              <Stack.Screen name="+not-found" options={{ title: "Not Found" }} />
            </Stack>
          </BottomSheetModalProvider>
        </KeyboardProvider>
        <AppToaster />
      </GestureHandlerRootView>
      <StatusBar style="dark" />
    </>
  );
}
