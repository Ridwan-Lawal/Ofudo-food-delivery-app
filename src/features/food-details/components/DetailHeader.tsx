import { FoodDetail } from "@/lib/supabase/supabase";
import { palette, textVariants } from "@/theme/tokens";
import { placeholderUrl } from "@/utils/constants";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { FOOD_DETAIL } from "./foodDetail.styles";
import Rating from "./Rating";

interface DetailHeaderProps {
  data: FoodDetail | undefined;
}

export function DetailHeader({ data }: DetailHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={{ width: FOOD_DETAIL.width }}>
        {/*name*/}
        <Text style={styles.foodName}>{data?.name}</Text>

        {/*category*/}
        <Text style={styles.foodCategory}>{data?.category?.name}</Text>

        {/*rating*/}
        <Rating rating={data?.rating ?? 0} />

        {/*price*/}
        <Text style={styles.foodPrice}>
          <Text style={styles.dollarSign}>$</Text>
          {data?.price}
        </Text>

        {/*nutrient*/}
        <View style={styles.foodNutrients}>
          <View style={styles.nutrientContainer}>
            <Text style={styles.nutrientTitle}>Calories</Text>
            <Text style={styles.nutrientValue}>{data?.calories}</Text>
          </View>
          <View style={styles.nutrientContainer}>
            <Text style={styles.nutrientTitle}>Protein</Text>
            <Text style={styles.nutrientValue}>{data?.protein}</Text>
          </View>
        </View>

        {/*bun type*/}
        <View style={styles.nutrientContainer}>
          <Text style={styles.nutrientTitle}>Bun Type</Text>
          <Text style={styles.nutrientValue}>Whole Wheat</Text>
        </View>
      </View>
      <Image
        source={data?.image_url}
        style={styles.foodImage}
        placeholder={placeholderUrl}
        cachePolicy="memory-disk"
        transition={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  foodName: {
    ...textVariants.h1,
    color: palette.almostBlack,
    textTransform: "capitalize",
  },
  foodCategory: {
    ...textVariants.label,
    fontSize: 16,
    textTransform: "capitalize",
    marginTop: 10,
    marginBottom: 20,
  },
  foodPrice: {
    ...textVariants.h1,
    color: palette.almostBlack,
    marginTop: 20,
  },
  dollarSign: {
    color: palette.orange,
  },
  foodNutrients: {
    marginTop: 36,
    flexDirection: "row",
    gap: 28,
    marginBottom: 20,
  },
  nutrientContainer: {
    gap: 4,
  },
  nutrientTitle: {
    ...textVariants.label,
    textTransform: "capitalize",
  },
  nutrientValue: {
    ...textVariants.value,
    color: palette.almostBlack,
  },
  foodImage: {
    width: FOOD_DETAIL.imageWidth,
    height: FOOD_DETAIL.imageHeight,
    marginLeft: -20,
  },
});
