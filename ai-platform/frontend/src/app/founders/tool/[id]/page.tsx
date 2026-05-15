'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { createClient } from '@/lib/supabase';
import { Rocket, MessageSquare, ChevronUp, ExternalLink, ArrowLeft, Send, User, Calendar, ShieldCheck, Zap, Loader2, Star, Mail, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ToolDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [tool, setTool] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => setUser(u));

    const fetchTool = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_tools')
          .select('*')
          .eq('id', id as string)
          .single();

        if (error) throw error;
        setTool(data);
      } catch (err) {
        console.error('Error fetching tool:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTool();

    // Real-time listener for updates (votes/comments)
    const channel = supabase.channel(`tool-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'ai_tools', filter: `id=eq.${id}` }, (payload) => {
        setTool(payload.new);
      })
      .subscribe();

    return () => {
      unsubscribeAuth();
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleVote = async () => {
    if (!user) return alert('Please log in to vote');
    
    const currentVotes = tool.votes || [];
    const hasVoted = currentVotes.includes(user.uid);
    const newVotes = hasVoted 
      ? currentVotes.filter((v: string) => v !== user.uid)
      : [...currentVotes, user.uid];

    try {
      const { error } = await supabase
        .from('ai_tools')
        .update({ votes: newVotes })
        .eq('id', tool.id);

      if (error) throw error;
      setTool({ ...tool, votes: newVotes });
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    const newComment = {
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      text: commentText,
      createdAt: new Date().toISOString()
    };

    const newComments = [...(tool.comments || []), newComment];

    try {
      const { error } = await supabase
        .from('ai_tools')
        .update({ comments: newComments })
        .eq('id', tool.id);

      if (error) throw error;
      setTool({ ...tool, comments: newComments });
      setCommentText('');
    } catch (err) {
      console.error('Error commenting:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
    </div>
  );

  if (!tool) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
      <button onClick={() => router.push('/founders')} className="text-indigo-400">Back to Launchpad</button>
    </div>
  );

  const isOwner = user && tool && (user.uid === tool.founder_id);
  const voted = user && tool.votes?.includes(user.uid);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this startup? This action cannot be undone.')) return;
    
    try {
      setLoading(true);
      console.log(`[Delete] Calling backend to remove ID: ${id}`);

      const res = await fetch(`http://localhost:5000/api/tools/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete');
      }
      
      console.log('[Delete] Project successfully removed globally.');
      router.push('/founders');
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert('Failed to delete tool: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/founders" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition mb-12">
          <ArrowLeft size={20} /> Back to Launchpad
        </Link>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
            {tool.logo_url ? (
              <img src={tool.logo_url} alt={tool.name} className="w-full h-full object-cover" />
            ) : (
              <Rocket size={48} className="text-slate-700" />
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">{tool.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <a 
                href={tool.website_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-200 transition active:scale-95 shadow-xl shadow-white/10"
              >
                Visit Website <ExternalLink size={20} />
              </a>
              
              <button 
                onClick={handleVote}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black border transition active:scale-95 ${
                  voted ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20' : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <ChevronUp size={24} /> Upvote ({tool.votes?.length || 0})
              </button>

              {isOwner && (
                <button 
                  onClick={handleDelete}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition flex items-center gap-2 active:scale-95"
                >
                  Delete Startup
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="md:col-span-2 space-y-12">
            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-orange-500/30 transition">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition">
                  <Zap size={24} fill="currentColor" fillOpacity={0.2} />
                </div>
                <div className="text-4xl font-black text-white mb-1">{tool.speed_score || '8'}<span className="text-slate-600 text-xl">/10</span></div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Speed</div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-yellow-500/30 transition">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4 group-hover:scale-110 transition">
                  <Star size={24} fill="currentColor" fillOpacity={0.2} />
                </div>
                <div className="text-4xl font-black text-white mb-1">{tool.quality_score || '7'}<span className="text-slate-600 text-xl">/10</span></div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quality</div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-500/30 transition">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-110 transition">
                  <ShieldCheck size={24} fill="currentColor" fillOpacity={0.2} />
                </div>
                <div className="text-4xl font-black text-white mb-1">{Math.min(10, tool.votes?.length || 0)}<span className="text-slate-600 text-xl">/10</span></div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Popularity</div>
              </div>
            </div>

            <section>
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-6">About the product</h3>
              <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">{tool.description}</p>
            </section>

            {/* Comments Section */}
            <section className="pt-12 border-t border-slate-900">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Community Discussion ({tool.comments?.length || 0})</h3>
              
              <form onSubmit={handleComment} className="mb-10 group">
                <div className="relative">
                  <textarea 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={user ? "What do you think of this tool?" : "Please log in to join the discussion"}
                    disabled={!user}
                    className="w-full bg-slate-900 border border-slate-800 rounded-3xl py-5 px-6 outline-none focus:border-indigo-500 transition-all resize-none min-h-[120px] placeholder:text-slate-600"
                  />
                  {user && (
                    <button className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 p-3 rounded-2xl transition shadow-lg shadow-indigo-600/20 active:scale-95">
                      <Send size={20} />
                    </button>
                  )}
                </div>
              </form>

              <div className="space-y-6">
                {tool.comments?.slice().reverse().map((comment: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                        {comment.userName[0]}
                      </div>
                      <span className="font-bold text-slate-200">{comment.userName}</span>
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{comment.text}</p>
                  </motion.div>
                ))}
                {tool.comments?.length === 0 && (
                  <div className="text-center py-12 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800/50">
                    <MessageSquare className="mx-auto text-slate-700 mb-4" />
                    <p className="text-slate-500">No comments yet. Start the conversation!</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Launch Info</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-sm font-medium">
                  <User className="text-slate-600" size={18} />
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Founder</p>
                    <p className="text-slate-200">{tool.founder_name || 'Architect Founder'}</p>
                  </div>
                </div>
                {tool.co_founder_name && (
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <User className="text-indigo-400/50" size={18} />
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Co-founder</p>
                      <p className="text-slate-200">{tool.co_founder_name}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm font-medium">
                  <Calendar className="text-slate-600" size={18} />
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Launched On</p>
                    <p className="text-slate-200">{new Date(tool.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <Mail className="text-slate-600" size={18} />
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Founder Email</p>
                    <p className="text-indigo-400 font-bold break-all">{tool.founder_email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <Smartphone className="text-slate-600" size={18} />
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Contact Number</p>
                    <p className="text-indigo-400 font-bold">{tool.contact_number || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <ShieldCheck className="text-slate-600" size={18} />
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Status</p>
                    <p className="text-green-500 flex items-center gap-1 font-bold"><Zap size={12} /> Verified Launch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
