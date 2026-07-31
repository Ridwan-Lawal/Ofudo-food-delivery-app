import { palette, textVariants } from "@/theme/tokens";
import { PERKS } from "@/utils/constants";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export function FoodDescription({ description }: { description: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.perksContainer}>
        {PERKS.map((perk, idx) => (
          <View key={idx} style={styles.perk}>
            <FontAwesome name={perk.icon} size={15} color={palette.orange} />
            <Text style={styles.perkText}>{perk.text}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.foodDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingHorizontal: 20,
  },
  perksContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "rgba(254, 140, 0, 0.05)",
    flexDirection: "row",
  },
  perk: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  perkText: {
    ...textVariants.value,
    fontSize: 14,
    color: palette.almostBlack,
  },
  foodDescription: {
    ...textVariants.infoLabel,
    color: palette.almostBlack,
  },
});
