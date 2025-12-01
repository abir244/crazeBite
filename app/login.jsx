import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CrazeLogo from "../assets/images/crazeBite.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  /* ✅ REAL EMAIL/PASSWORD LOGIN */
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
      router.push("/"); // redirect to home
    } catch (error) {
      alert(error.message);
    }
  };

  /* ✅ SOCIAL LOGIN PLACEHOLDERS (will upgrade later) */
  const loginWithGoogle = () => console.log("Google Login...");
  const loginWithGithub = () => console.log("GitHub Login...");
  const loginWithFacebook = () => console.log("Facebook Login...");
  const loginWithInstagram = () => console.log("Instagram Login...");

  return (
    <View style={styles.page}>
      <View style={styles.container}>

        {/* ✅ Logo */}
        <Image source={CrazeLogo} style={styles.logo} />

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        {/* ✅ EMAIL INPUT */}
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color="#777" />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        {/* ✅ PASSWORD INPUT */}
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPass}
            style={styles.input}
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

        {/* ✅ LOGIN BUTTON */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* ✅ SIGNUP LINK */}
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.signupText}>
            Don’t have an account?{" "}
            <Text style={{ color: "#ff6b00", fontWeight: "700" }}>Sign up</Text>
          </Text>
        </TouchableOpacity>

        {/* ✅ SOCIAL LOGIN */}
        <View style={styles.socialContainer}>

          <TouchableOpacity style={styles.socialBtn} onPress={loginWithGoogle}>
            <Ionicons name="logo-google" size={22} color="#DB4437" />
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn} onPress={loginWithGithub}>
            <Ionicons name="logo-github" size={22} color="#000" />
            <Text style={styles.socialText}>Continue with GitHub</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn} onPress={loginWithFacebook}>
            <Ionicons name="logo-facebook" size={22} color="#1877F2" />
            <Text style={styles.socialText}>Continue with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn} onPress={loginWithInstagram}>
            <Ionicons name="logo-instagram" size={22} color="#C13584" />
            <Text style={styles.socialText}>Continue with Instagram</Text>
          </TouchableOpacity>

        </View>

      </View>
    </View>
  );
}

/* =====================================================
                  STYLES
===================================================== */
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  container: {
    padding: 24,
    alignItems: "center",
    width: "100%",
  },

  logo: {
    width: Platform.OS === "web" ? 240 : 160,
    height: Platform.OS === "web" ? 180 : 120,
    resizeMode: "contain",
    marginBottom: 10,
  },

  title: {
    fontSize: Platform.OS === "web" ? 34 : 28,
    fontWeight: "800",
    marginTop: 10,
  },

  subtitle: {
    fontSize: Platform.OS === "web" ? 18 : 16,
    color: "#777",
    marginBottom: 30,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: Platform.OS === "web" ? 18 : 14,
    borderRadius: 14,
    width: Platform.OS === "web" ? "40%" : "100%",
    marginBottom: 16,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  loginBtn: {
    backgroundColor: "#ff6b00",
    paddingVertical: 14,
    borderRadius: 20,
    width: Platform.OS === "web" ? "40%" : "100%",
    alignItems: "center",
    marginTop: 10,
  },

  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  signupText: {
    marginTop: 18,
    fontSize: 15,
    color: "#555",
  },

  /* ✅ SOCIAL LOGIN STYLES */
  socialContainer: {
    width: Platform.OS === "web" ? "40%" : "100%",
    marginTop: 30,
    gap: 16,
  },

  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    gap: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: Platform.OS === "web" ? 1 : 0,
    borderColor: "#e6e6e6",
  },

  socialText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});