import React from 'react';
import { LayoutDashboard, Users, Megaphone, Menu } from 'lucide-react';
import { User } from '../types';

interface BottomNavProps {
  currentView: string;
  setView: (view: string) => void;
  user: User;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView, user }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 px-6 py-3 flex justify-between items-center text-slate-500">
      <button 
        onClick={() => setView('dashboard')}
        className={`flex flex-col items-center space-y-1 ${currentView === 'dashboard' ? 'text-indigo-600' : ''}`}
      >
        <LayoutDashboard size={20} />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      <button 
        onClick={() => setView('leads')}
        className={`flex flex-col items-center space-y-1 ${currentView === 'leads' ? 'text-indigo-600' : ''}`}
      >
        <Users size={20} />
        <span className="text-[10px] font-medium">Leads</span>
      </button>

      <button 
        onClick={() => setView('content')}
        className={`flex flex-col items-center space-y-1 ${currentView === 'content' ? 'text-indigo-600' : ''}`}
      >
        <Megaphone size={20} />
        <span className="text-[10px] font-medium">Studio</span>
      </button>

      <button 
        onClick={() => setView('settings')}
        className={`flex flex-col items-center space-y-1 ${currentView === 'settings' ? 'text-indigo-600' : ''}`}
      >
        <Menu size={20} />
        <span className="text-[10px] font-medium">More</span>
      </button>
    </div>
  );
};