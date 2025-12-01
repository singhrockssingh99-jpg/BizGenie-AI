import React, { useState } from 'react';
import { Plus, Trash2, Mail, Shield } from 'lucide-react';
import { User, UserRole } from '../types';

export const Team: React.FC = () => {
  const [agents, setAgents] = useState<User[]>([
    { id: 'a1', name: 'Anjali Gupta', email: 'anjali@skyline.com', role: UserRole.AGENT, avatar: 'AG' },
    { id: 'a2', name: 'Rahul Roy', email: 'rahul@skyline.com', role: UserRole.AGENT, avatar: 'RR' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const newAgent: User = {
      id: `a${Date.now()}`,
      name: newAgentName,
      email: newAgentEmail,
      role: UserRole.AGENT,
      avatar: newAgentName.charAt(0).toUpperCase()
    };
    setAgents([...agents, newAgent]);
    setIsModalOpen(false);
    setNewAgentName('');
    setNewAgentEmail('');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Team Management</h2>
          <p className="text-slate-500">Manage agents and their access to your business leads.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Add New Agent
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Agent Name</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {agent.avatar}
                    </div>
                    <span className="font-medium text-slate-800">{agent.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Shield size={10} className="mr-1" />
                    Agent
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm flex items-center">
                  <Mail size={14} className="mr-2" />
                  {agent.email}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Agent</h3>
            <form onSubmit={handleAddAgent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    required
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={newAgentEmail}
                    onChange={(e) => setNewAgentEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Create Agent
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};