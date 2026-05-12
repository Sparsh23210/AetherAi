'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { createClient } from '@/lib/supabase';
import { Rocket, ArrowLeft, Loader2, ExternalLink, MessageSquare, ChevronUp, Zap, Trash2, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyStartupsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push('/login?redirect=/founders/my-startups');
      } else {
        setUser(u);
        fetchMyTools(u.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchMyTools = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('founder_id', uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTools(data || []);

      // Auto-Repair: Ensure all tools are linked to their categories
      if (data) {
        data.forEach(async (tool) => {
          if (tool.category_name) {
            // Ask backend to ensure link exists
            const catSlug = tool.category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            // 1. Ensure category exists
            await fetch('http://localhost:5000/api/categories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: tool.category_name, slug: catSlug })
            });

            // 2. Link tool to category
            const { data: catData } = await supabase.from('categories').select('id').eq('slug', catSlug).single();
            if (catData) {
              await fetch(`http://localhost:5000/api/tools/${tool.id}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryId: catData.id })
              });
            }
          }
        });
      }
    } catch (err) {
      console.error('Error fetching your tools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this startup? This cannot be undone.')) return;
    
    try {
      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5000/api/tools/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Delete failed');
      
      // Update local state
      setTools(tools.filter(t => t.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete tool');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link href="/founders" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition mb-4">
              <ArrowLeft size={18} /> Back to Launchpad
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4">
              My <span className="text-indigo-400">Startups</span>
              <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-500">{tools.length}</span>
            </h1>
          </div>
          <Link 
            href="/founders/submit" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            Launch Another <Rocket size={20} />
          </Link>
        </div>

        {tools.length === 0 ? (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-[3rem] py-20 px-8 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Rocket size={40} className="text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">No startups launched yet</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Ready to show the world what you've built? Launch your first startup on the AI Launchpad today.
            </p>
            <Link href="/founders/submit" className="text-indigo-400 font-bold hover:text-indigo-300 transition underline underline-offset-8">
              List your startup for free →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={tool.id}
                className="group relative bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-[2.5rem] p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/5"
              >
                <Link href={`/founders/tool/${tool.id}`} className="absolute inset-0 z-0" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-xl">
                      {tool.logo_url ? (
                        <img src={tool.logo_url} alt={tool.name} className="w-full h-full object-cover" />
                      ) : (
                        <Rocket size={28} className="text-slate-700" />
                      )}
                    </div>
                    <div className="flex gap-2">
                       <Link href={`/founders/edit/${tool.id}`} className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all active:scale-90 z-20">
                         <Edit3 size={18} />
                       </Link>
                       <button 
                        onClick={(e) => handleDelete(e, tool.id)}
                        className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 z-20"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-2 group-hover:text-indigo-400 transition">{tool.name}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2 font-medium">{tool.short_description || tool.tagline}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <ChevronUp size={14} className="text-indigo-500" /> {tool.votes?.length || 0}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <MessageSquare size={14} className="text-indigo-500" /> {tool.comments?.length || 0}
                      </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center gap-1">
                      <Zap size={10} /> Active
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
