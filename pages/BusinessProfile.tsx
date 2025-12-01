import React from 'react';
import { Upload, FileText, CheckCircle, Database } from 'lucide-react';
import { DEFAULT_BUSINESS } from '../constants';

export const BusinessProfile: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Business Profile & Knowledge Base</h2>
          <p className="text-slate-500">Train your AI Assistant by uploading your business documents.</p>
        </div>
        <button className="text-indigo-600 font-medium hover:underline">
          View Public Profile
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Company Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
            <input type="text" defaultValue={DEFAULT_BUSINESS.name} className="w-full p-2 border rounded-lg bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
            <input type="text" defaultValue={DEFAULT_BUSINESS.industry} className="w-full p-2 border rounded-lg bg-slate-50" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea defaultValue={DEFAULT_BUSINESS.description} className="w-full p-2 border rounded-lg bg-slate-50 h-24 resize-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
            <Database className="text-indigo-600" size={24} />
            <h3 className="text-lg font-semibold text-slate-800">AI Knowledge Base (RAG)</h3>
        </div>
        
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Upload size={24} />
          </div>
          <p className="font-medium text-slate-700">Click to upload files</p>
          <p className="text-sm text-slate-500 mt-1">PDF, Excel, Word documents (Max 50MB)</p>
        </div>

        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-slate-700">Active Knowledge Sources</h4>
          {DEFAULT_BUSINESS.uploadedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <FileText className="text-slate-400" size={20} />
                <span className="text-sm text-slate-700 font-medium">{file}</span>
              </div>
              <div className="flex items-center text-emerald-600 text-xs font-medium">
                <CheckCircle size={14} className="mr-1" />
                Indexed
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
