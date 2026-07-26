import { FoodFilter, Header } from "@/features/search";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  const { category } = useLocalSearchParams<{ category: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FoodFilter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    gap: 30,
  },
});
