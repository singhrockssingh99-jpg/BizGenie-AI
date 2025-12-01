import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { User, UserRole } from "../types";

// Map Firebase User + Firestore Data to our App User type
const mapUser = (fbUser: FirebaseUser, dbUser: any): User => {
  return {
    id: fbUser.uid,
    name: dbUser?.name || fbUser.email?.split('@')[0] || 'User',
    email: fbUser.email || '',
    role: dbUser?.role || UserRole.BUSINESS_ADMIN,
    businessId: dbUser?.businessId,
    avatar: dbUser?.name ? dbUser.name.charAt(0).toUpperCase() : 'U'
  };
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      callback(null);
      return;
    }

    try {
      // Fetch extra user details from Firestore
      const userDocRef = doc(db, "users", fbUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        callback(mapUser(fbUser, userDoc.data()));
      } else {
        // Fallback if doc doesn't exist yet (shouldn't happen in normal flow)
        callback({
          id: fbUser.uid,
          name: fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          role: UserRole.BUSINESS_ADMIN, // Default fallback
          avatar: 'U'
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      callback(null);
    }
  });
};

export const loginUser = async (email: string, pass: string): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, pass);
};

export const registerUser = async (name: string, email: string, pass: string, role: UserRole = UserRole.BUSINESS_ADMIN, businessId?: string): Promise<void> => {
  // 1. Create Auth User
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  // 2. Create User Profile in Firestore
  // We use the Auth UID as the Document ID for easy retrieval
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    role,
    businessId: businessId || `biz-${Date.now()}`, // Generate a business ID if new owner
    createdAt: serverTimestamp()
  });
};

export const logoutUser = async (): Promise<void> => {
  await firebaseSignOut(auth);
};