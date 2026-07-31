import ErrorState from "@/components/ErrorState";
import { StyleSheet } from "react-native";

interface CustomizationErrorProps {
  onRetry: () => void;
}

export default function CustomizationError({ onRetry }: CustomizationErrorProps) {
  return (
    <ErrorState
      message="We couldn't load the customizations. Please try again."
      onRetry={onRetry}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  // MessageState's container is flex:1, so it needs real height to lay out here.
  container: {
    minHeight: 240,
  },
});
