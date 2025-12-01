import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "expo-router";

export default function CreateProfile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    try {
      setLoading(true);

      // ✅ Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      // ✅ Optional: update email if provided
      if (email.trim()) {
        await auth.currentUser.updateEmail(email.trim());
      }

      router.push("/home"); // ✅ Change to your actual home route
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Profile</Text>
      <Text style={styles.subtitle}>Complete your account setup</Text>

      {/* ✅ Name Input */}
      <TextInput
        placeholder="Your Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      {/* ✅ Email Input (Optional) */}
      <TextInput
        placeholder="Email (optional)"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* ✅ Save Button */}
      <TouchableOpacity style={styles.btn} onPress={saveProfile}>
        <Text style={styles.btnText}>{loading ? "Saving..." : "Save Profile"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 12,
    fontSize: 18,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#ff6b00",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});