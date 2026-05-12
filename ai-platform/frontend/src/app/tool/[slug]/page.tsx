'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ExternalLink, 
  Star, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Smartphone, 
  Monitor, 
  Code, 
  UserCheck, 
  Briefcase,
  Layers,
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle2, 
  Clock, 
  Users,
  Heart
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toggleFavorite, getUserFavorites } from '@/lib/userActions';
import { api } from '@/lib/api';
import AuthGate from '@/components/AuthGate';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  website_url: string;
  logo_url: string;
  pricing_type: string;
  free_tier: boolean;
  api_available: boolean;
  mobile_app: boolean;
  desktop_app: boolean;
  web_app: boolean;
  open_source: boolean;
  beginner_friendly: boolean;
  commercial_use: boolean;
  difficulty_level: string;
  speed_score: number;
  quality_score: number;
  popularity_score: number;
  tags: string[];
  categories: Category[];
}

export default function ToolDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && tool) {
        const favs = await getUserFavorites(currentUser.uid);
        setIsFavorite(favs.includes(tool.id));
      }
    });
    return () => unsubscribe();
  }, [tool]);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/tools/${slug}`);
        setTool(data.tool);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTool();
    }
  }, [slug]);

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    const nowFav = await toggleFavorite(user.uid, tool!.id);
    setIsFavorite(nowFav);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-400 animate-pulse">Fetching tool blueprints...</p>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-2">System Error</h1>
        <p className="text-slate-400 mb-8 text-center max-w-md">
          {error || 'We couldn\'t find the tool you were looking for. It might have been declassified or moved.'}
        </p>
        <Link 
          href="/search"
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Return to Database
        </Link>
      </div>
    );
  }

  const ScoreCard = ({ icon: Icon, label, score, color }: { icon: any, label: string, score: number, color: string }) => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center">
      <div className={`p-3 rounded-xl ${color} mb-3`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{score}/10</div>
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
  );

  const FeatureBadge = ({ active, icon: Icon, label }: { active: boolean, icon: any, label: string }) => (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-50'}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  return (
    <AuthGate>
      <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Left Column: Tool Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 flex-shrink-0">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://www.google.com/s2/favicons?domain=${tool.website_url}&sz=256`} 
                    alt={tool.name} 
                    className="w-16 h-16 object-contain" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=6366f1&color=fff&size=256`;
                    }}
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h1 className="text-4xl md:text-5xl font-black text-white">{tool.name}</h1>
                  <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-sm font-bold">
                    {tool.pricing_type}
                  </div>
                  {tool.free_tier && (
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
                      Free Tier
                    </div>
                  )}
                </div>
                <p className="text-xl text-slate-400 leading-relaxed mb-6">
                  {tool.short_description}
                </p>
                
                <div className="flex flex-wrap gap-4 mt-8">
                <a 
                  href={tool.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                >
                  Visit Website <ExternalLink className="w-5 h-5" />
                </a>
                <button 
                  onClick={handleToggleFavorite}
                  className={`px-8 py-4 rounded-2xl font-bold transition flex items-center gap-2 border active:scale-[0.98] ${
                    isFavorite 
                      ? 'bg-pink-500/10 border-pink-500/50 text-pink-500' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-pink-500/50 hover:text-pink-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Saved to Favourites' : 'Save to Favourites'}
                </button>
              </div>
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ScoreCard icon={Zap} label="Speed" score={tool.speed_score} color="bg-orange-500" />
              <ScoreCard icon={Star} label="Quality" score={tool.quality_score} color="bg-yellow-500" />
              <ScoreCard icon={ShieldCheck} label="Popularity" score={tool.popularity_score} color="bg-indigo-500" />
            </div>

            {/* Main Content Sections */}
            <div className="space-y-12 pt-8">
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-indigo-500" /> Detailed Overview
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {tool.description}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Tag className="w-6 h-6 text-indigo-500" /> Categories & Tags
                </h2>
                <div className="flex flex-wrap gap-6 mb-8">
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Categories</div>
                    <div className="flex flex-wrap gap-2">
                      {tool.categories.map(cat => (
                        <Link 
                          key={cat.id} 
                          href={`/search?category=${cat.slug}`}
                          className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm font-medium hover:border-indigo-500/50 hover:text-indigo-400 transition flex items-center gap-2"
                        >
                          <span>{cat.icon}</span> {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map(tag => (
                      <span key={tag} className="bg-indigo-500/5 text-indigo-400 px-3 py-1.5 rounded-lg text-sm font-medium border border-indigo-500/10">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Right Column: Sidebar Specs */}
          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm sticky top-24">
              <h3 className="text-xl font-bold mb-6">Technical Specs</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">Deployment</div>
                  <div className="grid grid-cols-1 gap-3">
                    <FeatureBadge active={tool.web_app} icon={Globe} label="Web Application" />
                    <FeatureBadge active={tool.mobile_app} icon={Smartphone} label="Mobile App (iOS/Android)" />
                    <FeatureBadge active={tool.desktop_app} icon={Monitor} label="Desktop Client" />
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">Features</div>
                  <div className="grid grid-cols-1 gap-3">
                    <FeatureBadge active={tool.api_available} icon={Code} label="API Available" />
                    <FeatureBadge active={tool.open_source} icon={Code} label="Open Source" />
                    <FeatureBadge active={tool.beginner_friendly} icon={UserCheck} label="Beginner Friendly" />
                    <FeatureBadge active={tool.commercial_use} icon={Briefcase} label="Commercial Use" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm">Difficulty Level</span>
                    <span className={`text-sm font-bold ${
                      tool.difficulty_level === 'Beginner' ? 'text-emerald-400' : 
                      tool.difficulty_level === 'Intermediate' ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {tool.difficulty_level}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        tool.difficulty_level === 'Beginner' ? 'bg-emerald-500 w-1/3' : 
                        tool.difficulty_level === 'Intermediate' ? 'bg-orange-500 w-2/3' : 'bg-red-500 w-full'
                      }`} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      {/* Footer Space */}
      <div className="h-24" />
    </div>
    </AuthGate>
  );
}
