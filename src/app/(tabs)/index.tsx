import { FoodCategories, HomeHeader } from "@/features/home";
import { authClient } from "@/lib/auth-client";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/login");
        },
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      <FoodCategories />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 30,
  },
});
