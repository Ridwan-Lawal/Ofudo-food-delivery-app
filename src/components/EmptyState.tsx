import MessageState from "@/components/MessageState";
import { colors, palette } from "@/theme/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleProp, ViewStyle } from "react-native";

interface EmptyStateProps {
  title?: string;
  message?: string;
  /** Action button is hidden when omitted. */
  onAction?: () => void;
  actionLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export default function EmptyState({
  title = "Nothing here yet",
  message = "There's nothing to show right now.",
  onAction,
  actionLabel,
  style,
}: EmptyStateProps) {
  return (
    <MessageState
      title={title}
      message={message}
      icon={<Ionicons name="restaurant-outline" size={30} color={colors.text.inverse} />}
      tint={palette.labelGray}
      tintSoft={palette.mist}
      onAction={onAction}
      actionLabel={actionLabel}
      style={style}
    />
  );
}
