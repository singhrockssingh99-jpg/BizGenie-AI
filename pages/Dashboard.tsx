import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, Users, MessageSquare, TrendingUp, Building2, DollarSign } from 'lucide-react';
import { User, UserRole } from '../types';

interface DashboardProps {
  user: User;
}

const data = [
  { name: 'Mon', leads: 4, revenue: 2400 },
  { name: 'Tue', leads: 7, revenue: 1398 },
  { name: 'Wed', leads: 5, revenue: 9800 },
  { name: 'Thu', leads: 12, revenue: 3908 },
  { name: 'Fri', leads: 9, revenue: 4800 },
  { name: 'Sat', leads: 15, revenue: 3800 },
  { name: 'Sun', leads: 10, revenue: 4300 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: any; color: string }> = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm text-green-600">
      <ArrowUpRight size={16} className="mr-1" />
      <span className="font-medium">{trend}</span>
      <span className="text-slate-400 ml-1">vs last week</span>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
  const isAgent = user.role === UserRole.AGENT;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isSuperAdmin ? 'Platform Overview' : 'Dashboard Overview'}
          </h2>
          <p className="text-slate-500">
            {isSuperAdmin 
              ? 'Monitoring all businesses and platform health.' 
              : `Welcome back, here's what's happening.`}
          </p>
        </div>
        {!isSuperAdmin && (
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md transition-colors">
            Generate Report
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isSuperAdmin ? (
          <>
            <StatCard title="Total Businesses" value="124" trend="+5" icon={Building2} color="bg-blue-500" />
            <StatCard title="Total Agents" value="842" trend="+12" icon={Users} color="bg-indigo-500" />
            <StatCard title="Platform Revenue" value="$45.2k" trend="+8.4%" icon={DollarSign} color="bg-emerald-500" />
            <StatCard title="Active Users" value="1.2k" trend="+15%" icon={TrendingUp} color="bg-purple-500" />
          </>
        ) : isAgent ? (
          <>
            <StatCard title="My Leads" value="48" trend="+3" icon={Users} color="bg-blue-500" />
            <StatCard title="Follow-ups" value="12" trend="-2" icon={MessageSquare} color="bg-orange-500" />
            <StatCard title="Closed Deals" value="3" trend="+1" icon={TrendingUp} color="bg-emerald-500" />
            <StatCard title="Pending Tasks" value="5" trend="0" icon={ArrowUpRight} color="bg-red-500" />
          </>
        ) : (
          <>
            <StatCard title="Total Leads" value="1,284" trend="+12.5%" icon={Users} color="bg-blue-500" />
            <StatCard title="Active Conversations" value="42" trend="+5.2%" icon={MessageSquare} color="bg-indigo-500" />
            <StatCard title="Conversion Rate" value="3.8%" trend="+0.4%" icon={TrendingUp} color="bg-emerald-500" />
            <StatCard title="Content Reach" value="45.2k" trend="+18.1%" icon={ArrowUpRight} color="bg-purple-500" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">
            {isSuperAdmin ? 'Platform Growth' : 'Lead Acquisition Trend'}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey={isSuperAdmin ? "revenue" : "leads"} 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">
            {isSuperAdmin ? 'Revenue by Plan' : 'Lead Sources'}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: isSuperAdmin ? 'Enterprise' : 'IG', value: 45 },
                { name: isSuperAdmin ? 'Pro' : 'FB', value: 30 },
                { name: isSuperAdmin ? 'Basic' : 'Web', value: 15 },
                { name: isSuperAdmin ? 'Free' : 'Ref', value: 10 },
              ]}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="value" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};