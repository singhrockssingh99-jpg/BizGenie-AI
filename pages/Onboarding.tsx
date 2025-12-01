import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { Building2, ArrowRight, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: BusinessProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<BusinessProfile>({
    name: '',
    industry: '',
    description: '',
    uploadedFiles: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Finalize
      onComplete(profile);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
             <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Setup Your Business</h1>
            <p className="text-slate-500">Let's configure your AI workspace.</p>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full bg-slate-100 h-2 rounded-full mb-8">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: step === 1 ? '50%' : '100%' }}
          ></div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. Skyline Estates"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                <select
                  required
                  value={profile.industry}
                  onChange={(e) => setProfile({...profile, industry: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                   <option value="">Select Industry</option>
                   <option value="Real Estate">Real Estate</option>
                   <option value="Retail">Retail</option>
                   <option value="Healthcare">Healthcare</option>
                   <option value="Education">Education</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Description</label>
                <textarea
                  required
                  value={profile.description}
                  onChange={(e) => setProfile({...profile, description: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-32"
                  placeholder="Describe your business, target audience, and key services..."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300 text-center py-10">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">All Set!</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We have created your workspace. You can now invite agents, upload documents, and start generating leads.
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium flex items-center transition-colors"
            >
              {step === 1 ? 'Next Step' : 'Launch Dashboard'} 
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};