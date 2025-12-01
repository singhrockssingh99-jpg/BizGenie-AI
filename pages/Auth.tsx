
import React, { useState } from 'react';
import { User } from '../types';
import { login, register } from '../services/authMock';
import { Loader2, ArrowRight, LayoutDashboard, UserCircle, Briefcase } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAgentLogin, setIsAgentLogin] = useState(false); // New state for Agent option
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let user;
      if (isLogin) {
        user = await login(email, password);
      } else {
        user = await register(name, email, password);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-8 text-center transition-colors duration-300 ${isAgentLogin && isLogin ? 'bg-indigo-900' : 'bg-slate-900'}`}>
          <div className="flex justify-center mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-lg ${isAgentLogin && isLogin ? 'bg-emerald-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
              <LayoutDashboard className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">BizGenie AI</h1>
          <p className="text-slate-400 text-sm mt-2">
            {isAgentLogin && isLogin ? 'Agent Workflow Portal' : 'Enterprise Growth Suite'}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          {/* Main Auth Toggle */}
          <div className="flex space-x-2 mb-6 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => { setIsLogin(true); setIsAgentLogin(false); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setIsAgentLogin(false); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Agent vs Business Toggle (Only visible during Sign In) */}
          {isLogin && (
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-slate-50 p-1 rounded-full border border-slate-200">
                <button
                  onClick={() => setIsAgentLogin(false)}
                  className={`flex items-center px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    !isAgentLogin ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Briefcase size={14} className="mr-1.5" />
                  Business Owner
                </button>
                <button
                  onClick={() => setIsAgentLogin(true)}
                  className={`flex items-center px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isAgentLogin ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <UserCircle size={14} className="mr-1.5" />
                  Agent Login
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isAgentLogin && isLogin ? 'Agent Email' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 ${isAgentLogin && isLogin ? 'focus:ring-emerald-500' : 'focus:ring-indigo-500'}`}
                placeholder={isAgentLogin && isLogin ? "agent@company.com" : "owner@company.com"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 ${isAgentLogin && isLogin ? 'focus:ring-emerald-500' : 'focus:ring-indigo-500'}`}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-100">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center ${
                isAgentLogin && isLogin 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? (isAgentLogin ? 'Login to Workspace' : 'Sign In') : 'Create Account'}
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center bg-slate-50 p-3 rounded-lg border border-slate-100">
             <p className="text-xs text-slate-400 font-mono">
               <strong>Demo Credentials:</strong><br/>
               Admin: admin@platform.com<br/>
               Owner: owner@skyline.com<br/>
               Agent: agent@skyline.com<br/>
               (Any password works)
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
