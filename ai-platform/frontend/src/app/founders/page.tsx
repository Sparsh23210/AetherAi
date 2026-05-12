'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { createClient } from '@/lib/supabase';
import { Rocket, MessageSquare, ChevronUp, ExternalLink, Plus, Loader2, Sparkles, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthGate from '@/components/AuthGate';

export default function FoundersLaunchpad() {
  const supabase = createClient();
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => setUser(u));

    const fetchLaunchedTools = async () => {
      try {
        console.log('[Founders] Fetching tools from Supabase...');
        const { data, error } = await supabase
          .from('ai_tools')
          .select('*')
          .eq('is_launched', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[Founders] Supabase error:', error.message, error.details, error.hint);
          setTools([]);
          return;
        }
        
        console.log('[Founders] Tools fetched successfully:', data?.length);
        setTools(data || []);
      } catch (err: any) {
        console.error('[Founders] Unexpected error:', err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchedTools();
    
    // Set up real-time listener
    const channel = supabase.channel('launches')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_tools', filter: 'is_launched=eq.true' }, () => {
        fetchLaunchedTools();
      })
      .subscribe();

    return () => {
      unsubscribeAuth();
      supabase.removeChannel(channel);
    };
  }, []);

  const handleVote = async (toolId: string, currentVotes: string[]) => {
    if (!user) {
      alert('Please log in to vote!');
      return;
    }

    const hasVoted = currentVotes?.includes(user.uid);
    const newVotes = hasVoted 
      ? (currentVotes || []).filter(id => id !== user.uid)
      : [...(currentVotes || []), user.uid];

    try {
      const { error } = await supabase
        .from('ai_tools')
        .update({ votes: newVotes })
        .eq('id', toolId);

      if (error) throw error;
      
      // Optimistic update
      setTools(prev => prev.map(t => t.id === toolId ? { ...t, votes: newVotes } : t));
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8"
          >
            <Sparkles size={16} /> FOUNDER'S LAUNCHPAD
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-8"
          >
            Launch Your <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Startup</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-xl max-w-2xl mx-auto mb-12"
          >
            The premier destination for AI founders to showcase their products, gather feedback, and find their first 1,000 users.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/founders/submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold transition inline-flex items-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-95">
              <Plus size={20} /> List Your Startup
            </Link>
          </motion.div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Trophy className="text-yellow-500" /> Today's Top Launches
          </h2>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
             <span>Newest First</span>
             <div className="w-px h-4 bg-slate-800" />
             <span className="text-indigo-400">Popular</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-500">Loading the next big things...</p>
          </div>
        ) : tools.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {tools.map((tool, index) => {
                const hasVoted = user && tool.votes?.includes(user.uid);
                return (
                  <motion.div 
                    key={tool.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 flex items-center gap-6 hover:bg-slate-900/60 hover:border-indigo-500/20 transition-all group"
                  >
                    {/* Voting */}
                    <button 
                      onClick={() => handleVote(tool.id, tool.votes || [])}
                      className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border transition-all ${
                        hasVoted 
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <ChevronUp size={24} className={hasVoted ? 'animate-bounce' : ''} />
                      <span className="font-black text-sm">{tool.votes?.length || 0}</span>
                    </button>

                    {/* Logo */}
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-lg shadow-black/50">
                      {tool.logo_url ? (
                        <img src={tool.logo_url} alt={tool.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <Rocket className="text-slate-700" size={24} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition truncate">{tool.name}</h3>
                        <a href={tool.website_url || tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-indigo-400 transition">
                           <ExternalLink size={16} />
                        </a>
                      </div>
                      <p className="text-slate-400 text-sm line-clamp-1 mb-3">{tool.short_description || tool.tagline || tool.description}</p>
                      
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                           <MessageSquare size={14} /> {tool.comments?.length || 0} Comments
                         </div>
                         <div className="w-1 h-1 rounded-full bg-slate-800" />
                         <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                           <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center text-[8px] text-indigo-400 border border-indigo-500/20">
                             {tool.founder_name?.[0] || 'A'}
                           </div>
                           <span className="truncate max-w-[100px]">
                             {tool.founder_name || 'Architect'}
                             {tool.co_founder_name && ` + ${tool.co_founder_name}`}
                           </span>
                         </div>
                         <div className="w-1 h-1 rounded-full bg-slate-800" />
                         <span className="text-[10px] uppercase tracking-widest font-black text-indigo-500/80 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/10">
                           {tool.category_name || 'AI TOOL'}
                         </span>
                      </div>
                    </div>

                    {/* Action */}
                    <Link 
                      href={`/founders/tool/${tool.id}`}
                      className="hidden md:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition border border-slate-700"
                    >
                      Learn More
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[40px] py-24 text-center">
             <Rocket className="w-16 h-16 text-slate-800 mx-auto mb-6" />
             <h3 className="text-2xl font-bold mb-3 text-slate-300">No tools launched yet today</h3>
             <p className="text-slate-500 mb-10 max-w-sm mx-auto">Be the first founder to showcase your startup to the AI Architect community.</p>
             <Link href="/founders/submit" className="bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-2xl font-bold transition inline-block">
               Launch Your Tool
             </Link>
          </div>
        )}
      </main>
    </div>
    </AuthGate>
  );
}
