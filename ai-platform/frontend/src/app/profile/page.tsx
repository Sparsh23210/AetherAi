'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, limit, doc } from 'firebase/firestore';
import { User, Mail, Calendar, Star, LayoutDashboard, Edit3, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    favoritesCount: 0,
    workflowsCount: 0
  });

  useEffect(() => {
    let unsubscribeUser: () => void;
    let unsubscribeWorkflows: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Real-time listener for user favorites (doc reference is more efficient)
          const userRef = doc(db, 'users', currentUser.uid);
          unsubscribeUser = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.data();
              setStats(prev => ({
                ...prev,
                favoritesCount: userData?.favorites?.length || 0
              }));
            }
          });
          
          // Real-time listener for workflows
          const workflowQuery = query(collection(db, 'workflows'), where('userId', '==', currentUser.uid));
          unsubscribeWorkflows = onSnapshot(workflowQuery, (snapshot) => {
            setStats(prev => ({
              ...prev,
              workflowsCount: snapshot.size
            }));
          });
        } catch (err) {
          console.error('Error setting up real-time listeners:', err);
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeWorkflows) unsubscribeWorkflows();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
        <Link href="/login" className="text-indigo-400 hover:underline">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="max-w-5xl mx-auto px-4 py-20">
        
        {/* Profile Header */}
        <div className="relative mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-[100px] rounded-full -z-10" />
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 rounded-[40px] bg-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-600/20 ring-4 ring-slate-900">
              {user.email?.[0].toUpperCase()}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-5xl font-black">{user.displayName || 'Anonymous User'}</h1>
                <Link href="/settings" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-xl transition text-slate-400 hover:text-white">
                  <Edit3 size={18} />
                </Link>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-400 font-medium">
                <div className="flex items-center gap-2"><Mail size={18} className="text-slate-600" /> {user.email}</div>
                <div className="flex items-center gap-2"><Calendar size={18} className="text-slate-600" /> Member since {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Recent'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Link href="/favorites" className="bg-slate-900/40 border border-slate-800 rounded-[32px] p-10 hover:border-pink-500/30 transition group overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition">
                <Star size={80} className="text-pink-500" />
             </div>
             <Star className="text-pink-500 mb-6" size={32} />
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Saved Tools</h3>
             <p className="text-5xl font-black text-white">{stats.favoritesCount}</p>
          </Link>

          <Link href="/workflows" className="bg-slate-900/40 border border-slate-800 rounded-[32px] p-10 hover:border-indigo-500/30 transition group overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition">
                <LayoutDashboard size={80} className="text-indigo-500" />
             </div>
             <LayoutDashboard className="text-indigo-500 mb-6" size={32} />
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Workflows</h3>
             <p className="text-5xl font-black text-white">{stats.workflowsCount}</p>
          </Link>
        </div>

        {/* Recent Activity or Welcome Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[40px] p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome back, {user.displayName || 'Explorer'}!</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Your personal dashboard is where you track your favorite AI engines and automation blueprints.</p>
          <div className="flex flex-wrap justify-center gap-4">
             <Link href="/search" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition">Explore Tools</Link>
             <Link href="/workflows/new" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition">Create Workflow</Link>
          </div>
        </div>

      </main>
    </div>
  );
}
