import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { PhoneAuthProvider } from "firebase/auth";
import { auth, firebaseConfig } from "../firebase";
import { useRouter } from "expo-router";

const COUNTRY_CODES = [
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
];

export default function PhoneLogin() {
  const router = useRouter();
  const recaptchaVerifier = useRef(null);

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const sendOTP = async () => {
    if (!phone || phone.length < 6) {
      alert("Please enter a valid phone number");
      return;
    }

    const formattedPhone = countryCode.code + phone.replace(/^0+/, "");

    try {
      setLoading(true);

      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        formattedPhone,
        recaptchaVerifier.current
      );

      router.push({
        pathname: "/verifyOtp",
        params: { verificationId },
      });
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* ✅ Correct Recaptcha Config */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />

      <Text style={styles.title}>Phone Login</Text>
      <Text style={styles.subtitle}>Enter your phone number to continue</Text>

      {/* ✅ Country Code Selector */}
      <TouchableOpacity
        style={styles.countrySelector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flag}>{countryCode.flag}</Text>
        <Text style={styles.countryCode}>{countryCode.code}</Text>
      </TouchableOpacity>

      {/* ✅ Phone Input */}
      <TextInput
        placeholder="01712 345 678"
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* ✅ Send OTP Button */}
      <TouchableOpacity style={styles.btn} onPress={sendOTP}>
        <Text style={styles.btnText}>{loading ? "Sending..." : "Send OTP"}</Text>
      </TouchableOpacity>

      {/* ✅ Country Code Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Country</Text>

            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    setCountryCode(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={styles.countryText}>
                    {item.country} ({item.code})
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ff6b00",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    width: 120,
    justifyContent: "space-between",
  },
  flag: {
    fontSize: 22,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff6b00",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  countryText: {
    fontSize: 18,
    marginLeft: 10,
  },
  closeBtn: {
    marginTop: 20,
    alignSelf: "center",
  },
  closeText: {
    fontSize: 16,
    color: "#ff6b00",
    fontWeight: "700",
  },
});