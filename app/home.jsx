import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { categories } from "../data/categories.js";
import { foods } from "../data/foods";
import CrazeLogo from "../assets/images/crazeBite.png";

import { auth } from "../firebase";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const user = auth.currentUser;
  const filteredFoods = foods.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.container}>

        {/* ✅ HEADER */}
        <View style={styles.header}>

          {/* ✅ Left: Greeting or Login */}
          {user ? (
            <View style={styles.greetingBox}>
              <Text style={styles.greetingText}>
                Hi, {user.displayName || "User"} 👋
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          )}

          {/* ✅ Center: Bigger CrazeBite Logo */}
          <Image source={CrazeLogo} style={styles.logo} />

          {/* ✅ Right: Avatar → Profile Page */}
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => router.push("/profile")}
          >
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatarImg} />
            ) : (
              <Ionicons name="person-circle-outline" size={48} color="#ff6b00" />
            )}
          </TouchableOpacity>

        </View>

        {/* ✅ Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#777" />
          <TextInput
            placeholder="Search food..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* ✅ Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={{ marginRight: 16 }}
              onPress={() => router.push(`/category/${cat.key}`)}
            >
              <ImageBackground
                source={cat.image}
                style={styles.categoryCard}
                imageStyle={{ borderRadius: 18 }}
              >
                <View style={styles.categoryOverlay} />
                <Text style={styles.categoryText}>{cat.title}</Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 30 }} />

        {/* ✅ Popular Foods */}
        <Text style={styles.sectionTitle}>Popular Foods</Text>

        {filteredFoods.map((item) => (
          <View key={item.id} style={styles.foodCard}>
            <Image source={item.img} style={styles.foodImg} />

            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodPrice}>${item.price}</Text>
            </View>

            <TouchableOpacity style={styles.addBtn}>
              <MaterialIcons name="add-shopping-cart" size={20} color="#fff" />
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}

      </View>

      {/* ✅ Floating Cart Button */}
      <TouchableOpacity
        onPress={() => router.push("/cart")}
        style={styles.cartBtn}
      >
        <Ionicons name="cart-outline" size={22} color="#fff" />
        <Text style={styles.cartText}>Cart</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    padding: 18,
  },

  /* ===========================
        HEADER  
  ============================*/
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  greetingBox: {
    backgroundColor: "#ff6b00",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
    elevation: 5,
  },

  greetingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  loginBtn: {
    backgroundColor: "#ff6b00",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
    elevation: 5,
  },

  loginText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  logo: {
    width: Platform.OS === "web" ? 260 : 170,
    height: Platform.OS === "web" ? 180 : 120,
    resizeMode: "contain",
  },

  avatarBtn: {
    padding: 4,
  },

  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#ff6b00",
  },

  /* ===========================
        SEARCH BAR  
  ============================*/
  searchBar: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 14,
    elevation: 2,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },

  /* ===========================
        SECTIONS  
  ============================*/
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 12,
  },

  /* ===========================
        CATEGORY CARD  
  ============================*/
  categoryCard: {
    width: 150,
    height: 100,
    justifyContent: "flex-end",
    padding: 12,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 3,
  },

  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  categoryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  /* ===========================
        FOOD CARD  
  ============================*/
  foodCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 22,
    alignItems: "center",
    elevation: 3,
  },

  foodImg: {
    width: 75,
    height: 75,
    borderRadius: 12,
  },

  foodName: {
    fontSize: 18,
    fontWeight: "600",
  },

  foodPrice: {
    fontSize: 16,
    color: "#777",
    marginTop: 4,
  },

  /* ===========================
        ADD BUTTON  
  ============================*/
  addBtn: {
    backgroundColor: "#ff6b00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  addText: {
    color: "#fff",
    fontWeight: "600",
  },

  /* ===========================
        FLOATING CART  
  ============================*/
  cartBtn: {
    position: "absolute",
    bottom: 22,
    right: 22,
    backgroundColor: "#ff6b00",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 40,
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});