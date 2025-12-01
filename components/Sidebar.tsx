import React from 'react';
import { LayoutDashboard, Users, Megaphone, Settings, Briefcase, UserCheck } from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  user: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, onLogout }) => {
  
  const getMenuItems = () => {
    const common = [
      { id: 'settings', label: 'Settings', icon: Settings },
    ];

    if (user.role === UserRole.SUPER_ADMIN) {
      return [
        { id: 'dashboard', label: 'Platform Overview', icon: LayoutDashboard },
        { id: 'businesses', label: 'Manage Businesses', icon: Briefcase }, // Placeholder for now
        ...common
      ];
    } else if (user.role === UserRole.BUSINESS_ADMIN) {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'leads', label: 'Leads CRM', icon: Users },
        { id: 'content', label: 'Content Studio', icon: Megaphone },
        { id: 'team', label: 'Team Management', icon: UserCheck },
        { id: 'business', label: 'Business Profile', icon: Briefcase },
        ...common
      ];
    } else {
      // Agent
      return [
        { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
        { id: 'leads', label: 'My Leads', icon: Users },
        { id: 'content', label: 'Content Studio', icon: Megaphone },
        ...common
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-10 shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          BizGenie AI
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {user.role === UserRole.SUPER_ADMIN ? 'Platform Admin' : 'Business Suite'}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 bg-slate-800 p-3 rounded-lg mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
            {user.avatar || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full text-xs text-center text-slate-500 hover:text-white py-1 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};