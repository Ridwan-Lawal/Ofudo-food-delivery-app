import MessageState from "@/components/MessageState";
import { colors, palette } from "@/theme/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function CartEmpty() {
  const router = useRouter();

  return (
    <MessageState
      title="Your cart is empty"
      message="Browse the menu and add something you'd like."
      icon={<Ionicons name="cart-outline" size={30} color={colors.text.inverse} />}
      tint={palette.orange}
      tintSoft={palette.orangeTint}
      onAction={() => router.push("/search")}
      actionLabel="Browse menu"
    />
  );
}
