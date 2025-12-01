
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          // Fetch custom user profile from Firestore
          const docRef = doc(db, 'users', fbUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              id: fbUser.uid,
              name: data.name,
              email: fbUser.email || '',
              role: data.role || UserRole.BUSINESS_ADMIN,
              businessId: data.businessId,
              avatar: data.name ? data.name.charAt(0).toUpperCase() : 'U'
            });
          } else {
            // Fallback if record missing
            setUser({
              id: fbUser.uid,
              name: fbUser.email?.split('@')[0] || 'User',
              email: fbUser.email || '',
              role: UserRole.BUSINESS_ADMIN,
            });
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (name: string, email: string, pass: string, role: UserRole = UserRole.BUSINESS_ADMIN) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Create User Document
    await setDoc(doc(db, 'users', cred.user.uid), {
      name,
      email,
      role,
      businessId: `biz-${Date.now()}`, // Simple ID generation for demo
      createdAt: serverTimestamp()
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
