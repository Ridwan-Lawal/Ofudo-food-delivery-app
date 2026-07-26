import { StyleSheet, Text, View } from "react-native";

export default function FoodList() {
  return (
    <View style={styles.container}>
      <Text>FoodList</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});
