import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebase";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function VerifyOtp() {
  const router = useRouter();
  const { verificationId } = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputs = useRef([]);

  // ✅ Timer countdown
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ✅ Handle OTP input
  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  // ✅ Handle backspace auto-move
  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  // ✅ Verify OTP
  const verifyCode = async () => {
    const code = otp.join("");

    if (code.length < 6) {
      alert("Please enter the 6‑digit OTP");
      return;
    }

    try {
      setLoading(true);

      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);

      router.push("/createProfile");
    } catch (error) {
      alert("Invalid OTP. Please try again.");
    }

    setLoading(false);
  };

  // ✅ Resend OTP (placeholder)
  const resendOtp = () => {
    setTimer(60);
    alert("OTP resent!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the 6‑digit code sent to your phone</Text>

      {/* ✅ OTP Boxes */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <Animated.View key={index} style={styles.otpBox}>
            <TextInput
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          </Animated.View>
        ))}
      </View>

      {/* ✅ Verify Button */}
      <TouchableOpacity style={styles.btn} onPress={verifyCode}>
        <Text style={styles.btnText}>{loading ? "Verifying..." : "Verify OTP"}</Text>
      </TouchableOpacity>

      {/* ✅ Resend Timer */}
      <View style={{ marginTop: 20 }}>
        {timer > 0 ? (
          <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={resendOtp}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpBox: {
    width: 50,
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ff6b00",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff6b00",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  otpInput: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#333",
  },
  btn: {
    backgroundColor: "#ff6b00",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  timerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },
  resendText: {
    textAlign: "center",
    fontSize: 16,
    color: "#ff6b00",
    fontWeight: "700",
  },
});