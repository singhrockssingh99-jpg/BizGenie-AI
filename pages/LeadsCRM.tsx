import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, User, UserRole } from '../types';
import { Search, Phone, Mail, Calendar, Send, Sparkles, Filter, MessageCircle, Loader2 } from 'lucide-react';
import { generateText } from '../services/geminiService';
import { useLeads } from '../hooks/useLeads';

interface LeadsCRMProps {
  user: User;
}

export const LeadsCRM: React.FC<LeadsCRMProps> = ({ user }) => {
  const { leads, loading, error } = useLeads(user);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Messages state (Mock for now)
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([
    { sender: 'ai_assistant', text: 'Hello! I noticed you were looking at 3BHK properties.' }
  ]);

  // Auto-select first lead when loaded
  useEffect(() => {
    if (leads.length > 0 && !selectedLead) {
      setSelectedLead(leads[0]);
    }
  }, [leads]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: chatMessage }]);
    setChatMessage('');
  };

  const handleAISuggestion = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    try {
      const history = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      const prompt = `
        Act as a professional Real Estate Sales Assistant.
        Lead: ${selectedLead.name}, Requirements: ${selectedLead.requirements}
        History: ${history}
        Task: Suggest a short, persuasive response.
      `;
      const suggestion = await generateText(prompt);
      if (suggestion) setChatMessage(suggestion.trim());
    } catch (err) {
      alert("AI Service Error: Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const openWhatsApp = () => {
    if (!selectedLead) return;
    const msg = encodeURIComponent(`Hi ${selectedLead.name}, regarding your inquiry about ${selectedLead.requirements}...`);
    window.open(`https://wa.me/${selectedLead.phone.replace(/\D/g,'')}?text=${msg}`, '_blank');
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-6rem)] md:h-[calc(100vh-2rem)] gap-6">
      {/* Lead List */}
      <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden h-1/3 md:h-auto">
        <div className="p-4 border-b border-slate-100">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800">
               {user.role === UserRole.AGENT ? 'My Assigned Leads' : 'All Leads'}
             </h3>
             <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{leads.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input type="text" placeholder="Search leads..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-600" /></div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : leads.length > 0 ? (
            leads.map(lead => (
              <div 
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 ${selectedLead?.id === lead.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-slate-800">{lead.name}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100">{lead.status}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2 truncate">{lead.requirements}</p>
                <div className="flex items-center text-xs text-slate-400">
                  <Calendar size={12} className="mr-1"/> {new Date(lead.lastInteraction).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
             <div className="p-8 text-center text-slate-400">
                <Filter size={32} className="mx-auto mb-2 opacity-50" />
                <p>No leads found.</p>
             </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden h-2/3 md:h-auto">
        {selectedLead ? (
          <>
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{selectedLead.name}</h3>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="flex items-center"><Phone size={12} className="mr-1"/> {selectedLead.phone}</span>
                  </div>
                </div>
              </div>
              <button onClick={openWhatsApp} className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                 <MessageCircle size={16} />
                 <span>WhatsApp</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white relative">
              <textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type message..."
                className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20"
              />
              <div className="absolute bottom-6 right-6 flex space-x-2">
                 <button onClick={handleAISuggestion} disabled={isGenerating} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                   <Sparkles size={20} className={isGenerating ? "animate-pulse" : ""} />
                 </button>
                 <button onClick={handleSendMessage} className="p-2 bg-indigo-600 text-white rounded-lg">
                   <Send size={18} />
                 </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
             <Search size={32} className="mb-4" />
             <p>Select a lead to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};