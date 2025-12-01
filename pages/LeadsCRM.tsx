
import React, { useState, useMemo } from 'react';
import { MOCK_LEADS } from '../constants';
import { Lead, LeadStatus, User, UserRole } from '../types';
import { Search, Phone, Mail, Calendar, Send, Sparkles, Filter, Lock } from 'lucide-react';
import { generateText } from '../services/geminiService';

interface LeadsCRMProps {
  user: User;
}

export const LeadsCRM: React.FC<LeadsCRMProps> = ({ user }) => {
  // Filter leads: Super admins/Owners see all. Agents see only assigned.
  const visibleLeads = useMemo(() => {
    if (user.role === UserRole.AGENT) {
      return MOCK_LEADS.filter(lead => lead.assignedTo === user.id);
    }
    return MOCK_LEADS;
  }, [user]);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(visibleLeads.length > 0 ? visibleLeads[0] : null);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([
    { sender: 'ai_assistant', text: 'Hello! I noticed you were looking at 3BHK properties in South Delhi on our Instagram. Are you looking for immediate possession?' },
    { sender: 'lead', text: 'Yes, preferably within next 2 months. Budget is around 2.5 Cr.' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  // If the user selects a lead, or if visible leads change, ensure we don't show a restricted lead
  React.useEffect(() => {
    if (visibleLeads.length > 0 && (!selectedLead || !visibleLeads.find(l => l.id === selectedLead.id))) {
      setSelectedLead(visibleLeads[0]);
    } else if (visibleLeads.length === 0) {
      setSelectedLead(null);
    }
  }, [visibleLeads]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: chatMessage }]);
    setChatMessage('');
    // Simulate lead response
    setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'lead', text: "That sounds good. Can you share the brochure?" }]);
    }, 1500);
  };

  const handleAISuggestion = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    try {
      const history = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      const prompt = `
        Act as a professional Real Estate Sales Assistant for "Skyline Premium Estates".
        
        Lead Details:
        Name: ${selectedLead.name}
        Requirements: ${selectedLead.requirements}
        
        Conversation History:
        ${history}
        
        Task: Suggest a short, persuasive, and helpful response to the lead to move them closer to a site visit or booking. Keep it under 50 words.
      `;
      
      const suggestion = await generateText(prompt);
      if (suggestion) {
        setChatMessage(suggestion.trim());
      }
    } catch (err) {
      alert("Failed to generate suggestion. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-6">
      {/* Lead List */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800">
               {user.role === UserRole.AGENT ? 'My Assigned Leads' : 'All Leads'}
             </h3>
             <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{visibleLeads.length} total</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {visibleLeads.length > 0 ? (
            visibleLeads.map(lead => (
              <div 
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedLead?.id === lead.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-slate-800">{lead.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    lead.status === LeadStatus.NEW ? 'bg-blue-100 text-blue-700' :
                    lead.status === LeadStatus.QUALIFIED ? 'bg-green-100 text-green-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {lead.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{lead.requirements}</p>
                <div className="flex items-center text-xs text-slate-400 space-x-3">
                  <span className="flex items-center"><Calendar size={12} className="mr-1"/> {lead.lastInteraction}</span>
                  <span className={`font-medium ${lead.score > 75 ? 'text-green-600' : 'text-orange-500'}`}>Score: {lead.score}</span>
                </div>
              </div>
            ))
          ) : (
             <div className="p-8 text-center text-slate-400">
                <Filter size={32} className="mx-auto mb-2 opacity-50" />
                <p>No leads assigned yet.</p>
             </div>
          )}
        </div>
      </div>

      {/* Chat / Details Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        {selectedLead ? (
          <>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{selectedLead.name}</h3>
                  <div className="flex space-x-3 text-xs text-slate-500">
                    <span className="flex items-center"><Phone size={12} className="mr-1"/> {selectedLead.phone}</span>
                    <span className="flex items-center"><Mail size={12} className="mr-1"/> {selectedLead.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                 {user.role === UserRole.AGENT && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md flex items-center">
                        <Lock size={10} className="mr-1" /> Assigned to You
                    </span>
                 )}
                 <button className="text-sm bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 font-medium shadow-sm">
                    View CRM Profile
                 </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : msg.sender === 'ai_assistant'
                      ? 'bg-purple-100 text-purple-900 border border-purple-200 rounded-bl-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.sender === 'ai_assistant' && <div className="text-xs font-bold text-purple-700 mb-1 flex items-center"><Sparkles size={10} className="mr-1"/> AI Auto-Response</div>}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white">
              <div className="relative">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
                />
                <div className="absolute bottom-3 right-3 flex space-x-2">
                   <button 
                    onClick={handleAISuggestion}
                    disabled={isGenerating}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Generate AI Suggestion"
                  >
                    <Sparkles size={20} className={isGenerating ? "animate-pulse" : ""} />
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                 <Search size={32} className="text-slate-300" />
             </div>
             <p>Select a lead to start nurturing.</p>
          </div>
        )}
      </div>
    </div>
  );
};
