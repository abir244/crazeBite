import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHeSXqVCmzg6WehzhjIlvTBG2nBcz2N9A",
  authDomain: "crazebite-98cc3.firebaseapp.com",
  projectId: "crazebite-98cc3",
  storageBucket: "crazebite-98cc3.appspot.com",
  messagingSenderId: "220364685226",
  appId: "1:220364685226:web:a9aa8628992080df3ff5d3",
  measurementId: "G-PN97RBKHQQ"
};

const app = initializeApp(firebaseConfig);

// ✅ Auth
export const auth = getAuth(app);

// ✅ Firestore
export const db = getFirestore(app);

// ✅ Storage
export const storage = getStorage(app);