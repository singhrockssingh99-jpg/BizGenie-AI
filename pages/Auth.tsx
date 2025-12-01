import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowRight, LayoutDashboard, UserCircle, Briefcase } from 'lucide-react';
import { UserRole } from '../types';

export const Auth: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isAgentLogin, setIsAgentLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, UserRole.BUSINESS_ADMIN);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className={`p-8 text-center transition-colors duration-300 ${isAgentLogin && isLogin ? 'bg-indigo-900' : 'bg-slate-900'}`}>
          <div className="flex justify-center mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-lg ${isAgentLogin && isLogin ? 'bg-emerald-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
              <LayoutDashboard className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">BizGenie AI</h1>
          <p className="text-slate-400 text-sm mt-2">
            {isAgentLogin && isLogin ? 'Agent Portal' : 'Enterprise Suite'}
          </p>
        </div>

        <div className="p-8">
          <div className="flex space-x-2 mb-6 bg-slate-100 p-1 rounded-lg">
            <button onClick={() => { setIsLogin(true); setIsAgentLogin(false); }} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Sign In</button>
            <button onClick={() => { setIsLogin(false); setIsAgentLogin(false); }} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Sign Up</button>
          </div>

          {isLogin && (
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-slate-50 p-1 rounded-full border border-slate-200">
                <button onClick={() => setIsAgentLogin(false)} className={`flex items-center px-4 py-1.5 rounded-full text-xs font-medium ${!isAgentLogin ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500'}`}><Briefcase size={14} className="mr-1.5" />Business Owner</button>
                <button onClick={() => setIsAgentLogin(true)} className={`flex items-center px-4 py-1.5 rounded-full text-xs font-medium ${isAgentLogin ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'}`}><UserCircle size={14} className="mr-1.5" />Agent</button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" /></div>
            )}
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="user@company.com" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" /></div>
            
            {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}
            
            <button type="submit" disabled={isLoading} className={`w-full text-white font-medium py-2.5 rounded-lg flex justify-center items-center ${isAgentLogin && isLogin ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
              {isLoading ? <Loader2 className="animate-spin" /> : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} className="ml-2" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};