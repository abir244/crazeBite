import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase";
import { useRouter } from "expo-router";
import CrazeLogo from "../assets/images/crazeBite.png";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignup = async () => {
    if (!name.trim()) return alert("Please enter your name");
    if (!email.trim()) return alert("Please enter your email");
    if (password.length < 6)
      return alert("Password must be at least 6 characters");
    if (password !== confirm) return alert("Passwords do not match");

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      alert("Account created successfully");
      router.push("/login");
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      
      {/* ✅ CrazeBite Logo */}
      <Image source={CrazeLogo} style={styles.logo} />

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join CrazeBite and start ordering!</Text>

      {/* ✅ Name Input */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={20} color="#ff6b00" />
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* ✅ Email Input */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#ff6b00" />
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* ✅ Password Input */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#ff6b00" />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Ionicons
            name={showPass ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      {/* ✅ Confirm Password */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#ff6b00" />
        <TextInput
          placeholder="Confirm Password"
          style={styles.input}
          secureTextEntry={!showConfirm}
          value={confirm}
          onChangeText={setConfirm}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Ionicons
            name={showConfirm ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      {/* ✅ Modern Button */}
      <TouchableOpacity style={styles.btn} onPress={handleSignup}>
        <Text style={styles.btnText}>
          {loading ? "Creating..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.loginText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",   // ✅ Center vertically
    alignItems: "center",       // ✅ Center horizontally
    padding: 26,
    backgroundColor: "#fff",
  },

  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 4,
    color: "#222",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 30,
    textAlign: "center",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: "#ffe1cc",
    width: "100%",             // ✅ Centered width
    maxWidth: 380,             // ✅ Looks good on web
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },

  btn: {
    backgroundColor: "#ff6b00",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    maxWidth: 380,
    elevation: 4,
  },

  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  loginText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#ff6b00",
    fontWeight: "700",
  },
});