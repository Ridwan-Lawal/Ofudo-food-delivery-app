import AnimatedPressable from "@/components/AnimatedPressable";
import SkeletonBlock from "@/components/SkeletonBlock";
import { colors, palette, textVariants } from "@/theme/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useGetCategories } from "../hook/useSearch";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { QueryParams } from "../types";


const PILL_HEIGHT = 45;
const SKELETON_PILL_WIDTHS = [64, 88, 76, 100];

function CategoryPill({ label, onPress, isActive }: { label: string, onPress: () => void, isActive: boolean }) {
  return (
    <Pressable style={[styles.pillContainer, isActive && styles.activePillContainer]} onPress={onPress}>
      <Text style={[styles.categoryText, isActive && styles.activeCategoryText]}>{label}</Text>
    </Pressable>
  );
}

function CategoriesSkeleton() {
  return (
    <View style={styles.categoryRow}>
      {SKELETON_PILL_WIDTHS.map((width, index) => (
        <SkeletonBlock key={index} width={width} height={PILL_HEIGHT} borderRadius={50} />
      ))}
    </View>
  );
}

export default function FoodFilter() {
  const router = useRouter()
  const { data, isPending, error, refetch } = useGetCategories()
  const { q, category } = useLocalSearchParams<QueryParams>()
  const [foodName, setFoodName] = useState(q ?? '')
  const [selectedCategoryId, setSelectedCategoryId] = useState(category ?? 'all')
  const categories = [{ id: "all", name: "all" }, ...data?.map(categories => ({ id: categories.id, name: categories.name })) ?? []];


  function handleFoodSearch(food: string) {
    console.log('food:', food)
    if (food) {
      router.setParams({ q: food })
    } else {
      router.setParams({ q: undefined })
    }
  }

  function handleCategoryChange(categoryId: string) {
    setSelectedCategoryId(categoryId)
    if (categoryId !== 'all') {
      router.setParams({ category: categoryId })
    } else {
      router.setParams({ category: undefined })
    }
  }

  const debouncedHandleFoodSearch = useDebouncedCallback((food: string) => handleFoodSearch(food), 300)



  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.inputContainer}
            value={foodName}
            onChangeText={(text) => {
              setFoodName(text)
              debouncedHandleFoodSearch(text)
            }}
            placeholder="Search for any food"
            placeholderTextColor={palette.labelGray}
          />
          <Ionicons name="search" color={palette.almostBlack} size={20} />
        </View>
      </View>

      {isPending ? (
        <CategoriesSkeleton />
      ) : error ? (
        <View style={styles.categoryRow}>
          <CategoryPill label="all" onPress={() => handleCategoryChange('all')} isActive={selectedCategoryId === 'all'} />

          <AnimatedPressable style={styles.retryChip} onPress={() => refetch()}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
            <Text style={styles.retryChipText}>Couldn&apos;t load · Retry</Text>
          </AnimatedPressable>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={({ item }) => <CategoryPill label={item.name} onPress={() => handleCategoryChange(item.id)} isActive={item.id === selectedCategoryId} />}
          keyExtractor={(item) => item.id}
          horizontal={true}
          contentContainerStyle={styles.categoryList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 30,
    backgroundColor: '#fafafa',
    paddingTop: 30

  },
  formContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 40,
    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.10)",
  },
  inputContainer: {
    flex: 1,
    ...textVariants.subtitle,
    color: palette.almostBlack,
  },
  categoryList: {
    gap: 10,
    alignItems: "flex-start",
    paddingLeft: 16,
    backgroundColor: '#fafafa',
    paddingBottom: 25
  },
  // categoryList is a FlatList contentContainerStyle, so it carries no flexDirection —
  // the skeleton and error rows are plain Views and need their own.
  categoryRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    paddingLeft: 16,
  },
  retryChip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.dangerSoft,
    borderWidth: 2,
    borderColor: "transparent",
  },
  retryChipText: {
    ...textVariants.chip,
    fontSize: 14,
    color: colors.danger,
  },
  pillContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    boxShadow: "12px 12px 30px 0 rgba(150, 150, 154, 0.10);",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#f6f6f6",
  },

  activePillContainer: {
    backgroundColor: palette.orange,
    borderWidth: 0,
  },
  categoryText: {
    ...textVariants.chip,
    fontSize: 14,
    textTransform: "capitalize",
    color: palette.labelGray,
  },
  activeCategoryText: {
    color: "white",
  },
});
