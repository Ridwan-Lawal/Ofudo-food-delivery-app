import FetchCartFromDb from "@/components/FetchCartFromDb";
import LoginSuccessModal from "@/features/auth/components/LoginSuccessModal";
import { palette, textVariants } from "@/theme/tokens";
import { TABS_SCREENS } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: palette.orange,
          tabBarInactiveTintColor: palette.labelGray,
          tabBarStyle: {
            paddingHorizontal: 14,
            borderRadius: 70,
            boxShadow: "0 -10px 30px 0 rgba(0, 0, 0, 0.06)",
            elevation: 0,
            position: "absolute",
            bottom: insets.bottom + 10,
            flex: 1,
            marginHorizontal: 16,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 0,
            height: 86,
          },
          tabBarItemStyle: {
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 14,
            flex: 1,
          },
          tabBarIconStyle: {
            flex: 1,
          },
          tabBarLabelStyle: {
            ...textVariants.infoLabel,
          },
        }}
      >
        {TABS_SCREENS?.map((screen, idx) => (
          <Tabs.Screen
            key={idx}
            name={screen.name}
            options={{
              title: screen.title,
              tabBarIcon: ({ color }) => <Ionicons name={screen.icon} size={28} color={color} />,
            }}
          />
        ))}
      </Tabs>
      <LoginSuccessModal />
      <FetchCartFromDb />
    </>
  );
}

// continue from here
