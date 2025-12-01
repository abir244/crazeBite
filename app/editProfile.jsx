import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile, updateEmail } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "expo-router";

export default function EditProfile() {
  const router = useRouter();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Load existing user data
  useEffect(() => {
    const loadUser = async () => {
      const refDoc = doc(db, "users", user.uid);
      const snap = await getDoc(refDoc);

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setPhoto(data.photoURL || null);
      } else {
        setName(user.displayName || "");
        setEmail(user.email || "");
        setPhone(user.phoneNumber || "");
        setPhoto(user.photoURL || null);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // ✅ Pick new profile image (Web + Mobile safe)
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission required to select photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      console.log("✅ Selected image:", result.assets[0].uri);
      setPhoto(result.assets[0].uri);
    }
  };

  // ✅ Convert URI → Blob (Web + Mobile)
  const uriToBlob = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob;
    } catch (err) {
      console.log("❌ uriToBlob error:", err);
      throw err;
    }
  };

  // ✅ Save profile changes
  const saveProfile = async () => {
    console.log("✅ saveProfile CALLED");

    if (!user) {
      alert("User not found. Please log in again.");
      return;
    }

    setSaving(true);

    let photoURL = user.photoURL || null;

    try {
      // ✅ Upload new photo if changed
      if (photo && photo !== user.photoURL) {
        console.log("✅ Uploading photo:", photo);

        const imageRef = ref(storage, `users/${user.uid}/profile.jpg`);

        let blob;
        try {
          blob = await uriToBlob(photo);
          console.log("✅ Blob created:", blob);
        } catch (err) {
          alert("Could not read image file.");
          setSaving(false);
          return;
        }

        try {
          await uploadBytes(imageRef, blob);
          photoURL = await getDownloadURL(imageRef);
          console.log("✅ Uploaded photo URL:", photoURL);
        } catch (err) {
          console.log("❌ UPLOAD ERROR:", err);
          alert("Image upload failed. Check console.");
          setSaving(false);
          return;
        }
      }

      // ✅ Update Firebase Auth
      try {
        await updateProfile(user, { displayName: name, photoURL });
      } catch (err) {
        console.log("updateProfile error:", err);
      }

      if (email !== user.email) {
        try {
          await updateEmail(user, email);
        } catch (err) {
          console.log("updateEmail error:", err);
          alert("Could not update email. You may need to re-login.");
        }
      }

      // ✅ Update Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: name || "",
          email: email || "",
          phone: phone || "",
          address: address || "",
          photoURL: photoURL || "",
        },
        { merge: true }
      );

      console.log("✅ Firestore updated");

      setSaving(false);
      router.push("/profile");
    } catch (error) {
      console.log("❌ saveProfile error:", error);
      alert(error.message || "Something went wrong while saving your profile.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {/* ✅ Profile Photo */}
      <TouchableOpacity onPress={pickImage}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatarImg} />
        ) : (
          <Ionicons name="person-circle-outline" size={130} color="#ff6b00" />
        )}
      </TouchableOpacity>

      {/* ✅ Name */}
      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      {/* ✅ Email */}
      <TextInput
        placeholder="Email Address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      {/* ✅ Phone */}
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      {/* ✅ Address */}
      <TextInput
        placeholder="Address"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      {/* ✅ Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
        <Text style={styles.saveText}>{saving ? "Saving..." : "Save"}</Text>
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

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
  },

  avatarImg: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#ff6b00",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 12,
    fontSize: 18,
    marginBottom: 16,
  },

  saveBtn: {
    backgroundColor: "#ff6b00",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginTop: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});