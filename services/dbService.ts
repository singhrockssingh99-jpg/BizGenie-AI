
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Lead, LeadStatus, User, UserRole, ContentItem } from "../types";

// --- Leads Management ---

export const subscribeToLeads = (
  user: User, 
  callback: (leads: Lead[]) => void
) => {
  if (!user.businessId) return () => {};

  // Base query: Get leads for this business
  let q = query(
    collection(db, "businesses", user.businessId, "leads")
  );

  // If Agent, only show assigned leads
  if (user.role === UserRole.AGENT) {
    q = query(
      collection(db, "businesses", user.businessId, "leads"),
      where("assignedTo", "==", user.id)
    );
  }

  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lead[];
    callback(leads);
  });
};

export const addLead = async (businessId: string, leadData: Partial<Lead>) => {
  await addDoc(collection(db, "businesses", businessId, "leads"), {
    ...leadData,
    status: LeadStatus.NEW,
    createdAt: serverTimestamp(),
    score: 50, // Default score
    lastInteraction: new Date().toISOString()
  });
};

// --- Team Management ---

export const subscribeToTeam = (
  businessId: string, 
  callback: (members: User[]) => void
) => {
  const q = query(
    collection(db, "users"),
    where("businessId", "==", businessId)
  );

  return onSnapshot(q, (snapshot) => {
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
    callback(members);
  });
};

export const updateLeadStatus = async (businessId: string, leadId: string, status: LeadStatus) => {
  const leadRef = doc(db, "businesses", businessId, "leads", leadId);
  await updateDoc(leadRef, { status });
};

// --- Content Management ---

export const saveContent = async (businessId: string, content: Omit<ContentItem, 'id' | 'createdAt'>) => {
  await addDoc(collection(db, "businesses", businessId, "content"), {
    ...content,
    createdAt: serverTimestamp()
  });
};

export const subscribeToContent = (
  user: User,
  callback: (items: ContentItem[]) => void
) => {
  if (!user.businessId) return () => {};

  let q = query(collection(db, "businesses", user.businessId, "content"));

  // Logic: 
  // - Admins see everything.
  // - Agents see what they created OR what is shared.
  // Note: Firestore OR queries are limited. We'll filter client-side for simplicity in this demo,
  // or just fetch all and let the UI decide. 
  // For production, complex queries would be needed or separate collections.
  
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ContentItem[];
    callback(items);
  });
};
