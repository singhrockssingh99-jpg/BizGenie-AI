import React, { useState } from 'react';
import { MOCK_BUSINESSES } from '../constants';
import { Search, Filter, MoreHorizontal, Building2, Users, Database, Zap, Download } from 'lucide-react';
import { BusinessSummary } from '../types';

export const AdminBusinesses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessSummary | null>(null);

  const filteredBusinesses = MOCK_BUSINESSES.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manage Businesses</h2>
          <p className="text-slate-500">Monitor and manage registered workspaces.</p>
        </div>
        <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by company or owner..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-2">
           <button className="flex items-center space-x-2 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-lg">
             <Filter size={18} />
             <span className="text-sm font-medium">Filter</span>
           </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Company</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Owner</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Plan</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Team Size</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBusinesses.map((business) => (
              <tr key={business.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{business.name}</p>
                      <p className="text-xs text-slate-500">{business.industry}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-800 font-medium">{business.ownerName}</p>
                  <p className="text-xs text-slate-500">{business.ownerEmail}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                    business.subscriptionPlan === 'Enterprise' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    business.subscriptionPlan === 'Pro' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {business.subscriptionPlan}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                  {business.agentCount} Agents
                </td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                     business.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                     business.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                     'bg-red-100 text-red-800'
                   }`}>
                     <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        business.status === 'Active' ? 'bg-emerald-500' :
                        business.status === 'Pending' ? 'bg-orange-500' :
                        'bg-red-500'
                     }`}></span>
                     {business.status}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedBusiness(business)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Workspace Summary Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Workspace Summary</h3>
                <button 
                  onClick={() => setSelectedBusiness(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
             </div>
             
             <div className="p-6">
               <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-4">
                     <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Building2 size={32} />
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900">{selectedBusiness.name}</h2>
                        <div className="flex items-center space-x-2 text-slate-500 text-sm mt-1">
                           <span>{selectedBusiness.industry}</span>
                           <span>•</span>
                           <span>Joined {selectedBusiness.joinedDate}</span>
                        </div>
                     </div>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedBusiness.status === 'Active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                     {selectedBusiness.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                  </button>
               </div>

               <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                     <div className="flex items-center space-x-2 text-blue-600 mb-2">
                        <Users size={18} />
                        <span className="font-semibold text-sm">Total Leads</span>
                     </div>
                     <p className="text-2xl font-bold text-slate-800">{selectedBusiness.stats.totalLeads}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                     <div className="flex items-center space-x-2 text-purple-600 mb-2">
                        <Zap size={18} />
                        <span className="font-semibold text-sm">Active Campaigns</span>
                     </div>
                     <p className="text-2xl font-bold text-slate-800">{selectedBusiness.stats.campaignsRunning}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                     <div className="flex items-center space-x-2 text-orange-600 mb-2">
                        <Database size={18} />
                        <span className="font-semibold text-sm">Storage Used</span>
                     </div>
                     <p className="text-2xl font-bold text-slate-800">{selectedBusiness.stats.storageUsed}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Owner Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                        <p className="text-slate-500 mb-1">Full Name</p>
                        <p className="font-medium text-slate-800">{selectedBusiness.ownerName}</p>
                     </div>
                     <div>
                        <p className="text-slate-500 mb-1">Email Address</p>
                        <p className="font-medium text-slate-800">{selectedBusiness.ownerEmail}</p>
                     </div>
                  </div>
               </div>
             </div>
             
             <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
                <button 
                   onClick={() => setSelectedBusiness(null)}
                   className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                >
                   Close
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
