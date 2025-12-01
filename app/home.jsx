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
  FlatList,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { categories } from "../data/categories";
import { foods } from "../data/foods";
import CrazeLogo from "../assets/images/crazeBite.png";
import { WebView } from "react-native-webview";
import { auth } from "../firebase";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const user = auth.currentUser;

  const filteredFoods = foods.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.container}>

          {/* ✅ HEADER */}
          <View style={styles.header}>
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

            <Image source={CrazeLogo} style={styles.logo} />

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

          {/* ✅ YouTube Video */}
          <View style={styles.videoContainer}>
            <WebView
              style={styles.video}
              javaScriptEnabled
              domStorageEnabled
              source={{
                uri: "https://youtu.be/3p3-QKhoa64?si=lY72WfsyVhf7JaHC/embed/VIDEO_ID",
              }}
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

          <FlatList
            data={filteredFoods}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => (
              <View style={styles.foodCardGrid}>
                <Image source={item.img} style={styles.foodImgGrid} />

                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodPrice}>${item.price}</Text>

                <TouchableOpacity style={styles.addBtnGrid}>
                  <MaterialIcons name="add-shopping-cart" size={18} color="#fff" />
                  <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* ✅ More About CrazeBite */}
          <View style={styles.aboutBox}>
            <Text style={styles.aboutTitle}>About CrazeBite</Text>

            <Text style={styles.aboutText}>
              CrazeBite brings your favorite meals right to your doorstep with
              speed, freshness, and love. We partner with top restaurants to
              deliver high‑quality food at affordable prices.
            </Text>

            <Text style={styles.aboutText}>
              Our mission is simple: make food delivery fast, reliable, and
              enjoyable. With secure authentication, personalized profiles, and
              a modern UI, we aim to give you the best food‑ordering experience.
            </Text>

            <TouchableOpacity style={styles.learnMoreBtn}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* ✅ Floating Cart Button */}
      <TouchableOpacity
        onPress={() => router.push("/cart")}
        style={styles.cartBtn}
      >
        <Ionicons name="cart-outline" size={22} color="#fff" />
        <Text style={styles.cartText}>Cart</Text>
      </TouchableOpacity>
    </View>
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

  /* HEADER */
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

  /* SEARCH BAR */
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

  /* VIDEO */
  videoContainer: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#000",
    elevation: 5,
  },

  video: {
    flex: 1,
  },

  /* SECTION TITLE */
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 12,
  },

  /* CATEGORY CARD */
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

  /* FOOD GRID */
  foodCardGrid: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  foodImgGrid: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
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

  addBtnGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },

  addText: {
    color: "#fff",
    fontWeight: "600",
  },

  /* ABOUT SECTION */
  aboutBox: {
    backgroundColor: "#fff7f0",
    padding: 20,
    borderRadius: 16,
    marginTop: 30,
    marginBottom: 40,
    elevation: 3,
  },

  aboutTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ff6b00",
    marginBottom: 10,
  },

  aboutText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 12,
  },

  learnMoreBtn: {
    backgroundColor: "#ff6b00",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 10,
  },

  learnMoreText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  /* FLOATING CART */
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
    zIndex: 999,
  },

  cartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});