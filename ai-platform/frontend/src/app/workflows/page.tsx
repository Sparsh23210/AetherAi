'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Plus, Play, Clock, Share2, MoreHorizontal, LayoutDashboard, Loader2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export default function WorkflowsPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const q = query(
            collection(db, 'workflows'),
            where('userId', '==', currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const docs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as any));
          
          // Sort by createdAt desc in JavaScript to avoid index requirement
          docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          
          setWorkflows(docs);
        } catch (err) {
          console.error('Error fetching workflows from Firestore:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const templates = [
    { id: 'viral-reel', title: 'Viral Faceless Reel', steps: 3, tools: ['ChatGPT', 'ElevenLabs', 'Kling AI'], color: 'from-pink-500/20' },
    { id: 'saas-architect', title: 'AI SaaS Architect', steps: 4, tools: ['Claude', 'Cursor', 'Supabase', 'Vercel'], color: 'from-blue-500/20' },
    { id: 'podcast', title: 'Automated Podcast', steps: 2, tools: ['Descript', 'Riverside'], color: 'from-purple-500/20' },
  ];

  const handleUseTemplate = (templateId: string) => {
    router.push(`/workflows/new?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-extrabold mb-4">Workflow Discovery</h1>
            <p className="text-slate-400 text-lg">Browse templates or build your own custom AI execution chains.</p>
          </div>
          <Link href="/workflows/new" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl transition text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20">
            <Plus size={20} /> New Workflow
          </Link>
        </div>

        {/* Featured Templates */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-300">
            <Sparkles className="text-yellow-400" /> Featured Templates
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {templates.map(template => (
              <div 
                key={template.id} 
                onClick={() => handleUseTemplate(template.id)}
                className={`bg-gradient-to-br ${template.color} to-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/50 transition cursor-pointer group relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition">
                  <Plus className="text-indigo-400 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-indigo-300 transition">{template.title}</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {template.tools.map(tool => (
                    <span key={tool} className="text-xs font-bold bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 text-slate-400">
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">{template.steps} Steps</span>
                  <button className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm group-hover:scale-105 transition flex items-center gap-2">
                    <Play size={14} fill="black" /> Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Your Saved Workflows */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-300">
            <Clock className="text-indigo-400" /> Your Saved Workflows
          </h2>
          
          {!user ? (
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl py-12 text-center">
              <p className="text-slate-400 mb-4">Please log in to see your saved workflows.</p>
              <Link href="/login" className="text-indigo-400 font-bold hover:underline">Log In</Link>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-slate-800 rounded-3xl">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
              <p className="text-slate-500 font-medium">Retrieving your blueprints...</p>
            </div>
          ) : workflows.length > 0 ? (
            <div className="space-y-4">
              {workflows.map(wf => (
                <div key={wf.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center justify-between hover:bg-slate-900 hover:border-slate-700 transition group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition">
                      <LayoutDashboard size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-200">{wf.title}</h3>
                      <p className="text-sm text-slate-500">
                        {wf.steps?.length || 0} stages • Last updated {wf.updatedAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition"><Share2 size={18} /></button>
                    <button className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition"><MoreHorizontal size={18} /></button>
                    <Link 
                      href={`/workflows/edit/${wf.id}`}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold transition border border-slate-700"
                    >
                      Open Editor
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl py-16 text-center">
              <Plus className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-slate-300">No workflows yet</h3>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto">Create your first automated AI pipeline to streamline your content creation or development.</p>
              <Link href="/workflows/new" className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold transition inline-block shadow-lg shadow-indigo-600/20">
                Start Building
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
