import { FoodFilter, Header } from "@/features/search";
import FoodList from "@/features/search/components/FoodList";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FoodFilter />
      <FoodList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: '#FAFAFA'
  },
});
