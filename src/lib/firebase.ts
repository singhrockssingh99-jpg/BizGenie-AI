
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Use Environment Variables (Vite standard) with fallback to provided keys for immediate stability
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCElp4eTBDOtptBXz0-aZ192XG7Eo2ZDDg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "realassist-ai-59504.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "realassist-ai-59504",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "realassist-ai-59504.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "711677470436",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:711677470436:web:3691c809f919928754eef1",
  measurementId: "G-RSYBV9Z338"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
