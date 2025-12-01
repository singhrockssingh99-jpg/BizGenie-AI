import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCElp4eTBDOtptBXz0-aZ192XG7Eo2ZDDg",
  authDomain: "realassist-ai-59504.firebaseapp.com",
  projectId: "realassist-ai-59504",
  storageBucket: "realassist-ai-59504.firebasestorage.app",
  messagingSenderId: "711677470436",
  appId: "1:711677470436:web:3691c809f919928754eef1",
  measurementId: "G-RSYBV9Z338"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (optional, wrapping in try/catch to prevent blocking if ad-blockers interfere)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Analytics failed to initialize:", e);
}
export { analytics };