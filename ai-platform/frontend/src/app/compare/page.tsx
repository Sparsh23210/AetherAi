'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Plus, Check, X, Star, Zap, Globe, Cpu, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import AuthGate from '@/components/AuthGate';

export default function ComparePage() {
  const [selectedTools, setSelectedTools] = useState<any[]>([]);
  const [allTools, setAllTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const data = await api.get('/tools');
        setAllTools(data.tools || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  const addTool = (id: string) => {
    if (selectedTools.length < 3) {
      const tool = allTools.find(t => t.id === id);
      if (tool && !selectedTools.find(st => st.id === id)) {
        setSelectedTools([...selectedTools, tool]);
      }
    }
  };

  const removeTool = (id: string) => {
    setSelectedTools(selectedTools.filter(t => t.id !== id));
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-slate-950 text-slate-50 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/search" className="text-sm font-medium text-slate-400 hover:text-white transition flex items-center gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Discovery
          </Link>
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold mb-4">Tool Comparison</h1>
            <p className="text-slate-400 font-medium">Compare up to 3 tools side-by-side to find the best fit for your architecture.</p>
          </div>

          {/* Selection Area */}
          <div className="flex gap-4 mb-12 overflow-x-auto pb-4 custom-scrollbar">
            {selectedTools.map(tool => (
              <div key={tool.id} className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-4 flex items-center gap-4 shrink-0 w-64 animate-in fade-in slide-in-from-left-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center font-bold text-indigo-400 shrink-0">
                  {tool.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate text-white">{tool.name}</h3>
                  <p className="text-xs text-slate-500">{tool.pricing_type}</p>
                </div>
                <button onClick={() => removeTool(tool.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1"><X size={18} /></button>
              </div>
            ))}

            {selectedTools.length < 3 && (
              <div className="relative group shrink-0">
                <select
                  onChange={(e) => addTool(e.target.value)}
                  className="appearance-none bg-slate-900/80 border-2 border-slate-800 border-dashed rounded-2xl p-4 w-64 h-[74px] cursor-pointer focus:border-indigo-500 focus:bg-slate-900 hover:border-indigo-500/50 transition-all outline-none text-slate-300 font-medium shadow-lg hover:shadow-indigo-500/10"
                  value=""
                >
                  <option value="" disabled className="bg-slate-950 text-slate-500 font-bold py-2">+ Add Tool to Compare</option>
                  {allTools
                    .filter(t => !selectedTools.find(st => st.id === t.id))
                    .map(t => <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200 font-medium py-2">{t.name}</option>)
                  }
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-600">
                  <Plus size={20} />
                </div>
              </div>
            )}
          </div>

          {/* Comparison Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : selectedTools.length > 0 ? (
            <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/[0.05] rounded-[40px] overflow-hidden shadow-2xl shadow-indigo-900/20 p-1">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
              <div className="overflow-x-auto relative z-10 bg-slate-950/50 rounded-[36px]">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/[0.05] bg-slate-900/80">
                      <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] w-1/4">Feature Matrix</th>
                      {selectedTools.map(tool => (
                        <th key={tool.id} className="p-8 text-2xl font-black text-white">{tool.name}</th>
                      ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr>
                    <td className="p-6 font-medium text-slate-400">Quality Rating</td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="p-6">
                        <div className="flex items-center gap-1.5 text-yellow-500 font-bold">
                          <Star size={16} fill="currentColor" /> {tool.quality_score}/10
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 font-medium text-slate-400">Pricing Tier</td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="p-6 font-bold text-slate-200">{tool.pricing_type}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 font-medium text-slate-400">Developer API</td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="p-6">
                        {tool.api_available ? <Check className="text-emerald-500" /> : <X className="text-red-500" />}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 font-medium text-slate-400">Speed Performance</td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden min-w-[60px]">
                            <div className="bg-indigo-500 h-full" style={{ width: `${tool.speed_score * 10}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-300">{tool.speed_score}/10</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 font-medium text-slate-400">Platform Availability</td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="p-6">
                        <div className="flex gap-3">
                          {tool.web_app && <Globe size={18} className="text-slate-400" />}
                          {tool.desktop_app && <Cpu size={18} className="text-slate-400" />}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 font-medium text-slate-400">Skill Requirement</td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="p-6">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tool.difficulty_level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            tool.difficulty_level === 'Intermediate' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                          {tool.difficulty_level}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 font-medium text-slate-400">Capabilities</td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="p-6 text-sm text-slate-400 leading-relaxed max-w-xs">{tool.short_description}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-32 bg-slate-900/20 backdrop-blur-xl border border-slate-800 border-dashed rounded-[40px]">
              <Zap className="w-16 h-16 text-indigo-500/50 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              <h3 className="text-3xl font-black mb-3 text-white">Start Your Comparison</h3>
              <p className="text-slate-400 max-w-sm mx-auto font-medium text-lg">Select up to three tools from the database to analyze their architectural differences.</p>
            </div>
          )}
        </div>
      </div>
    </AuthGate>
  );
}
