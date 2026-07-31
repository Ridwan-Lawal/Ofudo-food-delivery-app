import { Tables } from "@/lib/supabase/supabase";
import { palette, radius, shadow, textVariants } from "@/theme/tokens";
import { CUSTOMIZATION_IMAGES, placeholderUrl } from "@/utils/constants";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useGetCustomizations } from "../hooks/useGetFoodDetail";
import CustomizationError from "./CustomizationError";
import CustomizationSkeleton from "./CustomizationSkeleton";
import { CUSTOMIZATION_CARD, customizationStyles } from "./customizationCard.styles";

function CustomizationList({ title, data }: { title: string; data: Tables<"customization">[] }) {
  return (
    <View style={customizationStyles.section}>
      <Text style={customizationStyles.headerText}>{title}</Text>

      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={customizationStyles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.labelCard}>
              <Text style={styles.labelText} numberOfLines={1}>
                {item.name}
              </Text>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={CUSTOMIZATION_IMAGES[item.name]}
                style={styles.image}
                contentFit="contain"
                transition={200}
                placeholder={placeholderUrl}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

export function Customization() {
  const { foodId } = useLocalSearchParams<{ foodId: string }>();
  const { data, isPending, error, refetch } = useGetCustomizations(foodId);

  const toppings = data?.filter((customization) => customization.type === "topping") ?? [];
  const sides = data?.filter((customization) => customization.type === "side") ?? [];

  return (
    <View style={styles.container}>
      {isPending ? (
        <CustomizationSkeleton />
      ) : error ? (
        <CustomizationError onRetry={() => refetch()} />
      ) : (
        <>
          {toppings.length > 0 && <CustomizationList title="Toppings" data={toppings} />}
          {sides.length > 0 && <CustomizationList title="Side options" data={sides} />}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    gap: 30,
    paddingBottom: 100,
  },
  card: {
    width: CUSTOMIZATION_CARD.width,
    height: CUSTOMIZATION_CARD.height,
  },
  labelCard: {
    position: "absolute",
    top: CUSTOMIZATION_CARD.labelOffset,
    left: 0,
    width: CUSTOMIZATION_CARD.width,
    height: CUSTOMIZATION_CARD.labelHeight,
    borderRadius: radius.md,
    backgroundColor: palette.cocoa,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  labelText: {
    ...textVariants.chip,
    textAlign: "center",
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CUSTOMIZATION_CARD.width,
    height: CUSTOMIZATION_CARD.imageHeight,
    borderRadius: radius.md,
    backgroundColor: palette.white,
    justifyContent: "center",
    alignItems: "center",
    ...shadow.card,

    elevation: 10,
  },
  image: {
    width: CUSTOMIZATION_CARD.imageSize,
    height: CUSTOMIZATION_CARD.imageSize,
  },
});
