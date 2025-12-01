import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

// ✅ Correct path (because [id].jsx is inside app/category/)
import { foods } from "../../data/foods";

export default function CategoryPage() {
  const { id } = useLocalSearchParams(); // ✅ category key from URL

  // ✅ Filter foods by category
  const filteredFoods = foods.filter((item) => item.category === id);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {id.charAt(0).toUpperCase() + id.slice(1)}
      </Text>

      {filteredFoods.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={item.img} style={styles.foodImg} />

          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodPrice}>${item.price}</Text>
          </View>

          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 20 },

  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },

  foodImg: { width: 70, height: 70, borderRadius: 10 },
  foodName: { fontSize: 18, fontWeight: "600" },
  foodPrice: { fontSize: 16, color: "#555" },

  addBtn: {
    backgroundColor: "#ff6b00",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  addText: { color: "#fff", fontWeight: "600" },
});