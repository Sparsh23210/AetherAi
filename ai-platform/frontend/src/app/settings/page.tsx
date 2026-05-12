'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { User, Mail, Shield, Bell, Loader2, Save, CheckCircle2, Key, Globe, Eye } from 'lucide-react';

type TabType = 'profile' | 'security' | 'notifications';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [notifs, setNotifs] = useState({
    marketing: true,
    security: true,
    updates: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        setEmail(currentUser.email || '');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSuccess(false);
    try {
      if (activeTab === 'profile') {
        await updateProfile(user, { displayName });
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          name: displayName,
          updatedAt: new Date()
        });
      }
      // For notifications, we'd save to Firestore user settings collection
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating settings:', err);
      alert('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4">
        <h1 className="text-xl font-bold mb-4">Please log in to view settings</h1>
        <a href="/login" className="text-indigo-400 hover:underline">Login Now</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold mb-3">Account Settings</h1>
          <p className="text-slate-400">Manage your profile, preferences, and account security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Sidebar Tabs */}
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left font-bold ${
                activeTab === 'profile' 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <User size={18} /> Profile
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left font-bold ${
                activeTab === 'security' 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Shield size={18} /> Security
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left font-bold ${
                activeTab === 'notifications' 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Bell size={18} /> Notifications
            </button>
          </div>

          {/* Form Content */}
          <div className="md:col-span-2">
            <form onSubmit={handleSave} className="space-y-8">
              
              {activeTab === 'profile' && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User className="text-indigo-400" /> Public Profile
                  </h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
                      <input 
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:border-indigo-500 outline-none transition"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
                      <input 
                        type="email"
                        value={email}
                        disabled
                        className="w-full bg-slate-950/50 border border-slate-800/50 rounded-xl py-3 pl-12 pr-4 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-600">Primary account email used for billing and communication.</p>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="text-indigo-400" /> Account Security
                  </h3>
                  
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-6">
                    <div>
                      <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-2">
                        <Key size={16} className="text-indigo-500" /> Password
                      </h4>
                      <p className="text-sm text-slate-500">Change your account password to keep your data secure.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={handlePasswordReset}
                      className="bg-slate-800 hover:bg-slate-700 text-sm font-bold px-4 py-2 rounded-lg transition shrink-0"
                    >
                      {resetSent ? 'Email Sent!' : 'Reset Password'}
                    </button>
                  </div>

                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl">
                    <h4 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                      <Globe size={16} className="text-indigo-500" /> Linked Accounts
                    </h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Google Authentication</span>
                      <span className="text-green-500 font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Connected
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Bell className="text-indigo-400" /> Notification Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'security', title: 'Security Alerts', desc: 'Get notified about new logins and account changes.' },
                      { id: 'marketing', title: 'Product Updates', desc: 'Receive news about new features and AI tools.' },
                      { id: 'updates', title: 'Workflow Status', desc: 'Alerts when your automation pipelines finish execution.' }
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                        <div>
                          <p className="font-bold text-slate-200">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setNotifs(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof prev] }))}
                          className={`w-12 h-6 rounded-full transition-colors relative ${notifs[item.id as keyof typeof notifs] ? 'bg-indigo-600' : 'bg-slate-800'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifs[item.id as keyof typeof notifs] ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {success && (
                    <span className="text-green-400 text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
                      <CheckCircle2 size={16} /> Settings saved!
                    </span>
                  )}
                </div>
                {activeTab !== 'security' && (
                  <button 
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/20 active:scale-95"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={18} /> Save Settings</>}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
