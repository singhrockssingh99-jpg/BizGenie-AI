
import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Video, Mic, Share2, Copy, Download, Loader2, Save, Users, CheckCircle } from 'lucide-react';
import { generateText, generateImage, generateAudio, generateVideo } from '../services/geminiService';
import { saveContent } from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import { ContentType } from '../types';

type GenType = 'copy' | 'image' | 'video' | 'audio';

export const ContentStudio: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<GenType>('copy');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Save State
  const [contentTitle, setContentTitle] = useState('');
  const [isShared, setIsShared] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    setSaveSuccess(false);
    setContentTitle(''); // Reset title for new generation

    try {
      let output;
      if (activeTab === 'copy') {
        const sysInstruct = "You are an expert Digital Marketer for Real Estate in India. Create engaging, high-converting content in 'Hinglish' (Mix of Hindi and English) suitable for Instagram Captions or WhatsApp messages. Include emojis.";
        output = await generateText(prompt, sysInstruct);
      } else if (activeTab === 'image') {
        output = await generateImage(prompt);
      } else if (activeTab === 'audio') {
        output = await generateAudio(prompt);
      } else if (activeTab === 'video') {
        output = await generateVideo(prompt);
      }
      
      if (output) {
        setResult(output);
        // Default title suggestion
        setContentTitle(`${activeTab.toUpperCase()} - ${new Date().toLocaleDateString()}`);
      } else {
        setError("Generation returned no result.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate content. " + (err.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !user || !user.businessId) return;
    if (!contentTitle.trim()) {
      alert("Please provide a title for the content.");
      return;
    }

    setIsSaving(true);
    try {
      let contentType = ContentType.TEXT;
      if (activeTab === 'image') contentType = ContentType.IMAGE;
      if (activeTab === 'video') contentType = ContentType.VIDEO;
      if (activeTab === 'audio') contentType = ContentType.AUDIO;

      await saveContent(user.businessId, {
        title: contentTitle,
        type: contentType,
        status: 'Draft',
        data: result,
        businessId: user.businessId,
        createdBy: user.id,
        isShared: isShared
      });
      setSaveSuccess(true);
    } catch (err) {
      console.error("Save error", err);
      alert("Failed to save content.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatAudioSrc = (data: string) => {
    // If it's already a data URI, return it, otherwise assume base64 mp3/pcm
    if (data.startsWith('data:')) return data;
    return `data:audio/mp3;base64,${data}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Content Studio</h2>
        <p className="text-slate-500">Create viral marketing assets in seconds with Gemini AI.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
        <div className="flex border-b border-slate-100">
          {[
            { id: 'copy', label: 'Marketing Copy', icon: Sparkles },
            { id: 'image', label: 'Image Gen', icon: ImageIcon },
            { id: 'video', label: 'Video (Veo)', icon: Video },
            { id: 'audio', label: 'Hinglish Audio', icon: Mic },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as GenType); setResult(null); setError(null); setSaveSuccess(false); }}
                className={`flex-1 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              {activeTab === 'copy' && "What do you want to write about?"}
              {activeTab === 'image' && "Describe the image you want to generate"}
              {activeTab === 'video' && "Describe the video scene (e.g., A luxury villa with a pool at sunset)"}
              {activeTab === 'audio' && "Enter text to convert to speech (Hinglish supported)"}
            </label>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                activeTab === 'copy' ? "E.g., Write an Instagram caption for a new luxury 3BHK launch in Mumbai with sea view..." :
                activeTab === 'image' ? "E.g., A modern living room with floor to ceiling windows overlooking a city skyline, photorealistic, 4k..." :
                "Enter your prompt here..."
              }
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
            
            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium shadow-md transition-all ${
                  isLoading || !prompt ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Creating Magic...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate {activeTab === 'video' ? 'Video' : 'Content'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8 border-t border-slate-100 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Generated Result</h3>
                <div className="flex space-x-2">
                  <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Copy">
                    <Copy size={18} />
                  </button>
                  <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Download">
                    <Download size={18} />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                {activeTab === 'copy' && (
                  <p className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">{result}</p>
                )}
                
                {activeTab === 'image' && (
                  <div className="flex justify-center">
                    <img src={result} alt="Generated Asset" className="max-h-96 rounded-lg shadow-md" />
                  </div>
                )}

                {activeTab === 'audio' && (
                  <div className="flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <Mic size={32} />
                    </div>
                    <audio controls src={formatAudioSrc(result)} className="w-full max-w-md" />
                  </div>
                )}
                
                {activeTab === 'video' && (
                    <div className="flex flex-col items-center">
                         <video controls className="w-full max-h-96 rounded-lg shadow-md" crossOrigin="anonymous">
                             <source src={result} type="video/mp4" />
                             Your browser does not support the video tag.
                         </video>
                         <p className="mt-2 text-xs text-slate-500">Video generated via Veo 3.1</p>
                    </div>
                )}
              </div>

              {/* Save & Share Section */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                  <Save size={18} className="mr-2 text-indigo-600" /> 
                  Save to Business Library
                </h4>
                
                {saveSuccess ? (
                  <div className="flex items-center text-emerald-600 bg-emerald-50 p-4 rounded-lg">
                    <CheckCircle size={24} className="mr-3" />
                    <div>
                      <p className="font-medium">Saved Successfully!</p>
                      <p className="text-sm">This content is now available to your team.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Content Title</label>
                      <input 
                        type="text" 
                        value={contentTitle}
                        onChange={(e) => setContentTitle(e.target.value)}
                        placeholder="e.g. Diwali Promo Post" 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4 h-10 pb-1">
                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={isShared} 
                          onChange={(e) => setIsShared(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700 flex items-center">
                          <Users size={16} className="mr-1 text-slate-500" />
                          Share with Team
                        </span>
                      </label>
                    </div>

                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full md:w-auto px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {isSaving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                      Save Asset
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
