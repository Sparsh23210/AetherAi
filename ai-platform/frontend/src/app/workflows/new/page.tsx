'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Trash2, Save, Sparkles, ChevronRight, LayoutDashboard, Video, PenTool, Code, Music, Zap, Loader2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface WorkflowStep {
  id: string;
  category: string;
  toolId: string;
  toolName: string;
}

const CATEGORIES = [
  { id: 'video-gen', name: 'Video Gen', icon: Video },
  { id: 'image-gen', name: 'Image Gen', icon: PenTool },
  { id: 'coding', name: 'Coding', icon: Code },
  { id: 'audio', name: 'Audio', icon: Music },
  { id: 'agents', name: 'Agents', icon: Zap },
];

function WorkflowBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState('Untitled Workflow');
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: '1', category: 'video-gen', toolId: '', toolName: '' }
  ]);
  const [allTools, setAllTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // Option: Redirect to login or show guest warning
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tools');
        const data = await res.json();
        const tools = data.tools || [];
        setAllTools(tools);

        // Check for template in URL
        const templateId = searchParams.get('template');
        if (templateId && tools.length > 0) {
          applyTemplate(templateId, tools);
        }
      } catch (err) {
        console.error('Error fetching tools:', err);
      }
    };
    fetchTools();
  }, [searchParams]);

  const applyTemplate = (id: string, tools: any[]) => {
    let templateSteps: WorkflowStep[] = [];
    let templateTitle = '';

    const findToolId = (name: string) => tools.find(t => t.name.toLowerCase().includes(name.toLowerCase()))?.id || '';

    if (id === 'viral-reel') {
      templateTitle = 'Viral Faceless Reel';
      templateSteps = [
        { id: '1', category: 'agents', toolId: findToolId('ChatGPT'), toolName: 'ChatGPT' },
        { id: '2', category: 'audio', toolId: findToolId('ElevenLabs'), toolName: 'ElevenLabs' },
        { id: '3', category: 'video-gen', toolId: findToolId('Kling'), toolName: 'Kling AI' },
      ];
    } else if (id === 'saas-architect') {
      templateTitle = 'AI SaaS Architect';
      templateSteps = [
        { id: '1', category: 'agents', toolId: findToolId('Claude'), toolName: 'Claude' },
        { id: '2', category: 'coding', toolId: findToolId('Cursor'), toolName: 'Cursor' },
        { id: '3', category: 'coding', toolId: findToolId('Vercel'), toolName: 'Vercel' },
      ];
    } else if (id === 'podcast') {
      templateTitle = 'Automated Podcast';
      templateSteps = [
        { id: '1', category: 'audio', toolId: findToolId('Descript'), toolName: 'Descript' },
        { id: '2', category: 'audio', toolId: findToolId('Riverside'), toolName: 'Riverside' },
      ];
    }

    if (templateSteps.length > 0) {
      setTitle(templateTitle);
      setSteps(templateSteps);
    }
  };

  const addStep = () => {
    const newId = Date.now().toString();
    setSteps([...steps, { id: newId, category: 'image-gen', toolId: '', toolName: '' }]);
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter(s => s.id !== id));
    }
  };

  const updateStep = (id: string, updates: Partial<WorkflowStep>) => {
    setSteps(steps.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const saveWorkflow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'workflows'), {
        userId: user.uid,
        title,
        steps,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      router.push('/workflows');
    } catch (err: any) {
      console.error('Error saving workflow:', err);
      alert('Error saving workflow: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <Sparkles className="text-indigo-500 w-6 h-6" />
              AI<span className="text-indigo-400">Architect</span>
            </Link>
            <ChevronRight className="text-slate-600" />
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-lg font-bold text-slate-200 w-64"
            />
          </div>
          <button 
            onClick={saveWorkflow}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={18} /> Save Blueprint</>}
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3 text-slate-200">
            <LayoutDashboard className="text-indigo-500" /> Workflow Builder
          </h1>
          <p className="text-slate-400">Design your multi-stage AI pipeline by connecting top-tier tools.</p>
        </div>

        <div className="space-y-8 relative">
          <div className="absolute left-10 top-0 bottom-0 w-1 bg-slate-800/50 -z-10 rounded-full" />

          {steps.map((step, index) => (
            <div key={step.id} className="flex gap-8 group">
              <div className="w-20 h-20 bg-slate-900 border-4 border-slate-950 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-700 shrink-0 group-hover:text-indigo-500 group-hover:border-indigo-500/20 transition">
                {index + 1}
              </div>

              <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition relative">
                <button 
                  onClick={() => removeStep(step.id)}
                  className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition p-2 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Step Category</label>
                    <div className="relative">
                      <select 
                        value={step.category}
                        onChange={(e) => updateStep(step.id, { category: e.target.value, toolId: '', toolName: '' })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:border-indigo-500 outline-none transition appearance-none cursor-pointer"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Select AI Tool</label>
                    <select 
                      value={step.toolId}
                      onChange={(e) => {
                        const tool = allTools.find(t => t.id === e.target.value);
                        updateStep(step.id, { toolId: e.target.value, toolName: tool?.name || '' });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:border-indigo-500 outline-none transition appearance-none cursor-pointer"
                    >
                      <option value="">Choose a tool...</option>
                      {allTools.map(tool => (
                        <option key={tool.id} value={tool.id}>{tool.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {step.toolId && (
                  <div className="mt-6 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-300 flex items-center gap-2">
                      <Zap size={16} className="text-indigo-400" /> Powered by {step.toolName}
                    </span>
                    <Link href={`/tool/${allTools.find(t => t.id === step.toolId)?.slug}`} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition">
                      VIEW DOCS
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button 
            onClick={addStep}
            className="flex items-center gap-4 text-slate-500 hover:text-indigo-400 transition ml-4 py-6 group"
          >
            <div className="w-12 h-12 bg-slate-900 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center group-hover:border-indigo-500/50 transition">
              <Plus size={20} />
            </div>
            <span className="font-bold uppercase tracking-wider text-xs">Add Next Stage</span>
          </button>
        </div>

        <div className="mt-16 bg-slate-900/40 border border-slate-800 rounded-[32px] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full -z-10" />
          <h3 className="text-2xl font-black mb-3">Blueprint Summary</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">This architecture combines {steps.length} specialized AI models for your custom workflow.</p>
          <div className="flex justify-center items-center gap-16">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-indigo-400">{steps.length}</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Steps</span>
            </div>
            <div className="w-px h-12 bg-slate-800" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-indigo-400">AI</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Core Engines</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NewWorkflowPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-indigo-500" /></div>}>
      <WorkflowBuilder />
    </Suspense>
  );
}
