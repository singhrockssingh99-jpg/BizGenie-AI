
import React, { useState } from 'react';
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

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // State to track if the current logged-in business has completed onboarding
  // In a real app, this would come from the backend User object
  const [businessProfile, setBusinessProfile] = useState<IBusinessProfile | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // If they are a pre-existing user (mock data), we assume they have a profile
    if (loggedInUser.businessId === 'skyline-estates') {
        setBusinessProfile(DEFAULT_BUSINESS);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
    setBusinessProfile(null);
  };

  const handleOnboardingComplete = (profile: IBusinessProfile) => {
    setBusinessProfile(profile);
    // In real app, save to DB here
  };

  // 1. Auth Check
  if (!user) {
    return <Auth onLogin={handleLogin} />;
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