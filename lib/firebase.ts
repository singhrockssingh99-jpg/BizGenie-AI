import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Safe access to environment variables
// This prevents crashes if import.meta.env is undefined in the runtime environment
const env: any = (import.meta && import.meta.env) ? import.meta.env : {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyCElp4eTBDOtptBXz0-aZ192XG7Eo2ZDDg",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "realassist-ai-59504.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "realassist-ai-59504",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "realassist-ai-59504.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "711677470436",
  appId: env.VITE_FIREBASE_APP_ID || "1:711677470436:web:3691c809f919928754eef1",
  measurementId: "G-RSYBV9Z338"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);