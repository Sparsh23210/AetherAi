'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Code, Image as ImageIcon, Video, Mic, Briefcase, Zap } from 'lucide-react';
import { api } from '@/lib/api';

const CATEGORIES = [
  { id: 'video', name: 'Video Gen', icon: Video },
  { id: 'image', name: 'Image Gen', icon: ImageIcon },
  { id: 'code', name: 'Coding', icon: Code },
  { id: 'voice', name: 'Voice & Audio', icon: Mic },
  { id: 'business', name: 'Business', icon: Briefcase },
  { id: 'agents', name: 'AI Agents', icon: Zap },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    categories: [] as string[],
    budget: '',
    skill: '',
    api: ''
  });

  const [saving, setSaving] = useState(false);

  const toggleCategory = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(id) 
        ? prev.categories.filter(c => c !== id)
        : [...prev.categories, id]
    }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const finishOnboarding = async () => {
    setSaving(true);
    try {
      await api.post('/user/preferences', {
        categories: preferences.categories,
        budget: preferences.budget,
        skill: preferences.skill,
        apiNeeded: preferences.api === 'Yes, I want to automate'
      });
    } catch (err) {
      console.error('Failed to save preferences', err);
    } finally {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-2xl">
        <div className="mb-12 text-center">
          <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Let's Personalize Your Experience</h1>
          <p className="text-slate-400">Tell us what you're looking for to get the best tool recommendations.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-xl font-semibold mb-6">What do you want to build?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${
                      preferences.categories.includes(cat.id) 
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-100' 
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <cat.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-xl font-semibold mb-6">What is your budget preference?</h2>
              <div className="space-y-3 mb-8">
                {['Free Only', 'Low Budget', 'Premium Tools', 'Not Sure'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setPreferences({ ...preferences, budget: opt })}
                    className={`w-full p-4 rounded-xl border text-left font-medium transition-all ${
                      preferences.budget === opt 
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-100' 
                        : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-xl font-semibold mb-6">What is your technical skill level?</h2>
              <div className="space-y-3 mb-8">
                {['Beginner (No Code)', 'Intermediate', 'Professional / Developer'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setPreferences({ ...preferences, skill: opt })}
                    className={`w-full p-4 rounded-xl border text-left font-medium transition-all ${
                      preferences.skill === opt 
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-100' 
                        : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-xl font-semibold mb-6">Do you need API access?</h2>
              <div className="space-y-3 mb-8">
                {['Yes, I want to automate', 'No, just Web/Desktop UI', 'Auto Recommend'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setPreferences({ ...preferences, api: opt })}
                    className={`w-full p-4 rounded-xl border text-left font-medium transition-all ${
                      preferences.api === opt 
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-100' 
                        : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            <button 
              onClick={step === 4 ? finishOnboarding : nextStep}
              className="text-slate-400 hover:text-slate-200 text-sm font-medium px-4 py-2"
            >
              Skip
            </button>
            <button
              onClick={step === 4 ? finishOnboarding : nextStep}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {saving ? 'Saving...' : step === 4 ? 'Finish' : 'Continue'} {!saving && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
