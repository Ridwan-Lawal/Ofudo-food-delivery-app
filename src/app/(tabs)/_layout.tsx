import LoginSuccessModal from "@/features/auth/components/LoginSuccessModal";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="search" options={{ title: "Search" }} />
        <Tabs.Screen name="cart" options={{ title: "Cart" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
      <LoginSuccessModal />
    </>
  );
}

// continue from here
