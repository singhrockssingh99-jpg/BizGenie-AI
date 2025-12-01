
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Lead, User, UserRole } from '../types';

export const useLeads = (user: User | null) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.businessId) {
      setLeads([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let q = query(collection(db, "businesses", user.businessId, "leads"));

      // Role-based filtering: Agents only see assigned leads
      if (user.role === UserRole.AGENT) {
        q = query(
          collection(db, "businesses", user.businessId, "leads"),
          where("assignedTo", "==", user.id)
        );
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedLeads = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lead[];
        
        setLeads(fetchedLeads);
        setLoading(false);
      }, (err) => {
        console.error("Firestore Error:", err);
        setError("Failed to fetch leads. Check permissions.");
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [user]);

  return { leads, loading, error };
};
