import { palette, textVariants } from "@/theme/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

export default function FoodFilter() {
  const categories = ["all", "burgers", "pizza", "burrito"];

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.inputContainer}
            value=""
            onChangeText={() => {}}
            placeholder="Search for any food"
            placeholderTextColor={palette.labelGray}
          />
          <Ionicons name="search" color={palette.almostBlack} size={20} />
        </View>
      </View>

      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <View style={[styles.pillContainer, styles.activePillContainer]}>
            <Text style={[styles.categoryText, styles.activeCategoryText]}>{item}</Text>
          </View>
        )}
        keyExtractor={(item) => item}
        horizontal={true}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
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
    height: "auto",
    alignItems: "flex-start",
    paddingLeft: 16,
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
