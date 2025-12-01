import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Cheese Burger", price: 8.99, qty: 1, img: require("../assets/images/burger.png") },
    { id: 2, name: "Pepperoni Pizza", price: 12.5, qty: 1, img: require("../assets/images/pizza.png") },
    { id: 3, name: "Crispy Fries", price: 4.99, qty: 1, img: require("../assets/images/fries.png") },
  ]);

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [address, setAddress] = useState("");

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  const deleteItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    if (coupon === "CRAZE10") {
      setDiscount(10);
    } else {
      setDiscount(0);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal - discount + 2.99;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      
      <Text style={styles.header}>Your Cart</Text>

      {/* ✅ Cart Items */}
      {cartItems.map((item) => (
        <View 
          key={item.id}
          style={styles.itemCard}
        >
          <Image 
            source={item.img}
            style={styles.itemImg}
          />

          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>

          {/* ✅ Quantity Buttons */}
          <View style={styles.qtyBox}>
            <TouchableOpacity 
              onPress={() => decreaseQty(item.id)}
              style={styles.qtyBtn}
            >
              <Ionicons name="remove" size={20} color="black" />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.qty}</Text>

            <TouchableOpacity 
              onPress={() => increaseQty(item.id)}
              style={[styles.qtyBtn, { backgroundColor: "#ff6b00" }]}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* ✅ Delete Item */}
          <TouchableOpacity 
            onPress={() => deleteItem(item.id)}
            style={styles.deleteBtn}
          >
            <Ionicons name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}

      {/* ✅ Coupon Section */}
      <View style={styles.couponBox}>
        <TextInput
          placeholder="Enter coupon code"
          placeholderTextColor="#777"
          style={styles.couponInput}
          value={coupon}
          onChangeText={setCoupon}
        />

        <TouchableOpacity style={styles.applyBtn} onPress={applyCoupon}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Address Section */}
      <View style={styles.addressBox}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>

        <TextInput
          placeholder="Enter your address"
          placeholderTextColor="#777"
          style={styles.addressInput}
          value={address}
          onChangeText={setAddress}
          multiline
        />
      </View>

      {/* ✅ Summary Section */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount</Text>
          <Text style={styles.summaryValue}>-${discount.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>$2.99</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { fontWeight: "700" }]}>Total</Text>
          <Text style={[styles.summaryValue, { fontWeight: "700" }]}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f2f2f2",
  },

  header: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
  },

  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },

  itemImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  itemName: {
    fontSize: 18,
    fontWeight: "600",
  },

  itemPrice: {
    fontSize: 16,
    color: "#555",
  },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  qtyBtn: {
    backgroundColor: "#ddd",
    padding: 6,
    borderRadius: 6,
  },

  qtyText: {
    fontSize: 18,
    fontWeight: "600",
  },

  deleteBtn: {
    marginLeft: 10,
    backgroundColor: "#ff3b30",
    padding: 6,
    borderRadius: 6,
  },

  couponBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
  },

  couponInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    color: "#333",
  },

  applyBtn: {
    backgroundColor: "#ff6b00",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  addressBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  addressInput: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    minHeight: 60,
  },

  summaryBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  summaryLabel: {
    fontSize: 16,
    color: "#555",
  },

  summaryValue: {
    fontSize: 16,
    color: "#333",
  },

  checkoutBtn: {
    marginTop: 16,
    backgroundColor: "#ff6b00",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});