import ErrorState from "@/components/ErrorState";
import { StyleSheet } from "react-native";

interface FoodDetailErrorProps {
  onRetry: () => void;
}

export default function FoodDetailError({ onRetry }: FoodDetailErrorProps) {
  return (
    <ErrorState
      message="We couldn't load this dish. Please try again."
      onRetry={onRetry}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  // MessageState's container is flex:1, so it needs real height inside the ScrollView.
  container: {
    minHeight: 400,
  },
});
