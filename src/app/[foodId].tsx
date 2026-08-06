import { AddToCart, DetailHeader, FoodDescription } from "@/features/food-details";
import { Customization } from "@/features/food-details/components/Customization";
import FoodDetailError from "@/features/food-details/components/FoodDetailError";
import FoodDetailSkeleton from "@/features/food-details/components/FoodDetailSkeleton";
import { useGetFoodDetail } from "@/features/food-details/hooks/useGetFoodDetail";
import { palette } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FoodDetail() {
  const { foodId } = useLocalSearchParams<{ foodId: string }>();
  const { data, isPending, error, refetch } = useGetFoodDetail(foodId);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.backButton}>
          <Link href="/search" asChild dismissTo>
            <Ionicons name="arrow-back" size={20} color={palette.almostBlack} />
          </Link>
        </View>

        {isPending ? (
          <FoodDetailSkeleton />
        ) : error ? (
          <FoodDetailError onRetry={() => refetch()} />
        ) : (
          <>
            <DetailHeader data={data} />
            <FoodDescription description={data?.description ?? ""} />
            <Customization />
          </>
        )}
      </ScrollView>
      {data && <AddToCart foodData={data} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    backgroundColor: "white",
  },
  content: {
    gap: 30,
    paddingVertical: 20,
    flexGrow: 1,
  },
  backButton: {
    paddingHorizontal: 20,
  },
});
