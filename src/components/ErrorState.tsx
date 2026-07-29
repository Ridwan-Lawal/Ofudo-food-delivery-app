import MessageState from "@/components/MessageState";
import { colors, fontFamily } from "@/theme/tokens";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

interface ErrorStateProps {
  title?: string;
  message?: string;
  /** Retry button is hidden when omitted. */
  onRetry?: () => void;
  retryLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this right now. Please try again.",
  onRetry,
  retryLabel = "Try again",
  style,
}: ErrorStateProps) {
  return (
    <MessageState
      title={title}
      message={message}
      icon={<Text style={styles.glyph}>!</Text>}
      tint={colors.danger}
      tintSoft={colors.dangerSoft}
      onAction={onRetry}
      actionLabel={retryLabel}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  glyph: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    color: colors.text.inverse,
  },
});
