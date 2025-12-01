import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { LeadsCRM } from './pages/LeadsCRM';
import { ContentStudio } from './pages/ContentStudio';
import { BusinessProfile } from './pages/BusinessProfile';
import { Team } from './pages/Team';
import { AdminBusinesses } from './pages/AdminBusinesses';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { UserRole, BusinessProfile as IBusinessProfile } from './types';
import { DEFAULT_BUSINESS } from './constants';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [businessProfile, setBusinessProfile] = useState<IBusinessProfile | null>(null);

  // Initialize profile (Mock logic for now, would be a separate hook in real app)
  React.useEffect(() => {
    if (user && user.role === UserRole.BUSINESS_ADMIN && !businessProfile) {
      if (user.businessId) {
         setBusinessProfile(DEFAULT_BUSINESS); 
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (user.role === UserRole.BUSINESS_ADMIN && !businessProfile) {
    return <Onboarding onComplete={setBusinessProfile} />;
  }

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
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col md:flex-row">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        user={user} 
        onLogout={() => { logout(); setCurrentView('dashboard'); setBusinessProfile(null); }}
      />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
           {renderView()}
        </div>
      </main>
      <BottomNav 
        currentView={currentView}
        setView={setCurrentView}
        user={user}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;