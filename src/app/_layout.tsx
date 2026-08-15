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
import OfflineBanner from "@/components/OfflineBanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { onlineManager, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const A_DAY = 1000 * 60 * 60 * 24;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: A_DAY,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

const persister = createAsyncStoragePersister({ storage: AsyncStorage });

onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => setOnline(!!state.isConnected)),
);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { data: session } = useSession();
  const router = useRouter();

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

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const screen = response.notification.request.content.data?.screen;
      if (screen === "cart") router.push("/cart");
    });
    return () => sub.remove();
  }, []);

  const isLoggedIn = !!session?.user;
  const isAccountVerified = !!session?.user?.emailVerified;

  if (!fontsLoaded) return null;

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister, maxAge: A_DAY }}
        >
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
          <OfflineBanner />
        </PersistQueryClientProvider>
      </GestureHandlerRootView>
      <StatusBar style="dark" />
    </>
  );
}
