import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { LeadsCRM } from './pages/LeadsCRM';
import { ContentStudio } from './pages/ContentStudio';
import { BusinessProfile } from './pages/BusinessProfile';
import { Team } from './pages/Team';
import { AdminBusinesses } from './pages/AdminBusinesses';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { User, UserRole, BusinessProfile as IBusinessProfile } from './types';
import { DEFAULT_BUSINESS } from './constants';
import { subscribeToAuth, logoutUser } from './services/authService';
import { Loader2 } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // State to track if the current logged-in business has completed onboarding
  const [businessProfile, setBusinessProfile] = useState<IBusinessProfile | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((authUser) => {
      setUser(authUser);
      setLoading(false);
      
      // Mock logic for business profile existence
      // In a real DB scenario, we would fetch the business profile from 'businesses' collection
      if (authUser && authUser.role === UserRole.BUSINESS_ADMIN) {
        // If we have a businessId, we might fetch it. For now, we use mock if ID matches.
        if (authUser.businessId) {
             setBusinessProfile(DEFAULT_BUSINESS); 
        } else {
             setBusinessProfile(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setCurrentView('dashboard');
    setBusinessProfile(null);
  };

  const handleOnboardingComplete = (profile: IBusinessProfile) => {
    setBusinessProfile(profile);
    // TODO: Save this profile to Firestore 'businesses' collection
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  // 1. Auth Check
  if (!user) {
    return <Auth />;
  }

  // 2. Onboarding Check (Only for Business Admins who don't have a profile yet)
  if (user.role === UserRole.BUSINESS_ADMIN && !businessProfile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // 3. View Routing
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'leads':
        return <LeadsCRM user={user} />;
      case 'content':
        return <ContentStudio />;
      case 'business':
        return <BusinessProfile />;
      case 'team':
        return <Team />;
      case 'businesses':
        return <AdminBusinesses />;
      default:
        return <div className="p-10 text-center text-slate-500">Feature coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        user={user} 
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
           {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;