import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  const user = auth.currentUser;

  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Debug logs
  console.log("AUTH USER:", user);
  console.log("DB:", db);

  useEffect(() => {
    if (!user) {
      console.log("User not ready yet");
      return;
    }

    const loadUser = async () => {
      try {
        console.log("Fetching Firestore for UID:", user.uid);

        const refDoc = doc(db, "users", user.uid);
        const snap = await getDoc(refDoc);

        console.log("SNAP EXISTS:", snap.exists());
        console.log("SNAP DATA:", snap.data());

        if (snap.exists()) {
          setUserData(snap.data());
        } else {
          const newUser = {
            name: user.displayName || "",
            email: user.email || "",
            phone: user.phoneNumber || "",
            photoURL: user.photoURL || "",
            address: "",
            joined: new Date().toISOString(),
          };

          await setDoc(refDoc, newUser);
          setUserData(newUser);
        }
      } catch (err) {
        console.log("FIRESTORE ERROR:", err);
        setUserData({ error: true });
      }

      setLoading(false);
    };

    loadUser();
  }, [user]);

  // ✅ If Auth is not ready yet
  if (!user) {
    return (
      <View style={styles.loadingBox}>
        <Text style={{ color: "#ff6b00" }}>Loading user...</Text>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  // ✅ If Firestore is loading
  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <Text style={{ color: "#ff6b00" }}>Loading profile...</Text>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  // ✅ If Firestore failed
  if (userData?.error) {
    return (
      <View style={styles.loadingBox}>
        <Text style={{ color: "red", fontSize: 18 }}>
          Firestore Error — Check Console
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ✅ Profile Photo */}
      <TouchableOpacity>
        {userData.photoURL ? (
          <Image source={{ uri: userData.photoURL }} style={styles.avatarImg} />
        ) : (
          <Ionicons name="person-circle-outline" size={130} color="#ff6b00" />
        )}
      </TouchableOpacity>

      {/* ✅ Name */}
      <Text style={styles.nameText}>{userData.name || "User"}</Text>

      {/* ✅ Email */}
      <Text style={styles.emailText}>{userData.email || "No email"}</Text>

      {/* ✅ Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Account Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Name</Text>
          <Text style={styles.infoValue}>{userData.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Email</Text>
          <Text style={styles.infoValue}>{userData.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Phone</Text>
          <Text style={styles.infoValue}>{userData.phone || "Not set"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Address</Text>
          <Text style={styles.infoValue}>{userData.address || "Not set"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Joined</Text>
          <Text style={styles.infoValue}>
            {new Date(userData.joined).toDateString()}
          </Text>
        </View>
      </View>

      {/* ✅ Edit Profile */}
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => router.push("/editProfile")}
      >
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* ✅ Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          auth.signOut();
          router.replace("/login");
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  avatarImg: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#ff6b00",
    marginBottom: 10,
  },

  nameText: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 10,
  },

  emailText: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },

  infoCard: {
    width: "100%",
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    elevation: 3,
  },

  infoLabel: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#ff6b00",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },

  infoValue: {
    fontSize: 16,
    color: "#555",
    maxWidth: "60%",
    textAlign: "right",
  },

  editBtn: {
    marginTop: 30,
    backgroundColor: "#ff6b00",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 14,
  },

  editText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  logoutBtn: {
    marginTop: 20,
    backgroundColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 14,
  },

  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});