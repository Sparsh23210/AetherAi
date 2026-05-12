'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Filter, Play, Code, PenTool, Music, Video, Star, Zap, LayoutGrid, Rocket, ArrowRight, User, Car, Languages, Mic, Mail, Smartphone, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingTools, setTrendingTools] = useState<any[]>([]);
  const [newLaunches, setNewLaunches] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        // Fetch standard tools from backend
        const [toolsData, catsData] = await Promise.all([
          api.get('/tools?trending=true&limit=3'),
          api.get('/categories')
        ]);
        
        if (toolsData.tools) setTrendingTools(toolsData.tools);
        if (catsData.categories) setCategories(catsData.categories);

        // Fetch Community Launches from Supabase
        const { data: launches } = await supabase
          .from('ai_tools')
          .select('*')
          .eq('is_launched', true)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (launches) setNewLaunches(launches);

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIcon = (slug: string) => {
    const mapping: Record<string, any> = {
      'ai-chatbot': Search,
      'ai-image-generation': ImageIcon,
      'ai-video-generation': Video,
      'ai-coding-assistant': Code,
      'ai-music-generation': Music,
      'ai-productivity': LayoutGrid,
      'ai-marketing': Sparkles,
      'ai-search': Search,
      'ai-design': PenTool,
      'ai-writing': PenTool,
      'mobility': Car,
      'ai-translation': Languages,
      'ai-transcription': Mic,
      'ai-customer-support': Mail,
      'ai-mobile-apps': Smartphone,
      'ai-audio': Mic,
    };
    return mapping[slug] || Sparkles;
  };

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 11);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Startup Launch CTA Banner */}
        <div className="relative overflow-hidden mb-16 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group">
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <span className="bg-indigo-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white">Founder's Special</span>
                 <span className="text-slate-500 text-sm font-bold flex items-center gap-1"><Sparkles size={14} className="text-yellow-500" /> 100% Free for now</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                List your Startup free <br className="hidden md:block" />
                <span className="text-indigo-400">and get the users now!!</span>
              </h2>
              <p className="text-slate-400 font-medium max-w-md">Join hundreds of founders showcasing their AI products to the global architect community.</p>
           </div>
           <Link 
             href="/founders/submit" 
             className="relative z-10 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-lg transition flex items-center gap-3 shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 group/btn"
           >
             Launch My Startup <Rocket size={24} className="group-hover/btn:translate-x-1 transition" />
           </Link>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
              <img src="/logo.png" alt="Aether AI Logo" className="w-20 h-20 md:w-28 md:h-28 relative z-10 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
            </div>
            <div>
              Aether<span className="text-indigo-500">AI</span> <br/>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Architecting Intelligence
              </span>
            </div>
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            Discover, compare, and build workflows with the largest structured database of AI tools. Filter by API, pricing, and specific use-cases.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
              <Search className="w-6 h-6 text-slate-400 ml-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, categories, or workflows..." 
                className="w-full bg-transparent text-white px-4 py-4 focus:outline-none placeholder:text-slate-500"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-4 font-medium transition flex items-center gap-2">
                Search
              </button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <span className="text-slate-500">Popular:</span>
            <Link href="/workflows/new" className="text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1">
              <LayoutGrid size={14} /> Build a Workflow
            </Link>
            <Link href="/compare" className="text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1">
              <Zap size={14} /> Compare Tools
            </Link>
          </div>
        </div>

        {/* Categories Grid (Required Selection) */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="text-yellow-400" /> Browse by Category
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* All Tools Card */}
            <Link href="/search" className="group bg-indigo-600/10 border border-indigo-500/20 hover:border-indigo-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg shadow-indigo-500/20">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-indigo-100 uppercase tracking-tight text-xs mb-1">Explore</span>
              <span className="font-bold text-white">All Tools</span>
            </Link>

            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center">
                  <Skeleton className="w-12 h-12 rounded-full mb-4" />
                  <Skeleton className="w-24 h-4" />
                </div>
              ))
            ) : (
              displayedCategories.map(cat => {
                const Icon = getIcon(cat.slug);
                return (
                  <Link href={`/search?category=${cat.slug}`} key={cat.id} className="group bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition border border-slate-700 group-hover:border-indigo-500/30">
                      {Icon ? <Icon className="w-6 h-6 text-indigo-400" /> : <span className="text-2xl">{cat.icon}</span>}
                    </div>
                    <span className="font-medium text-slate-300 group-hover:text-white transition line-clamp-1">{cat.name}</span>
                  </Link>
                );
              })
            )}
          </div>

          {!loading && categories.length > 11 && (
            <div className="mt-8 text-center">
              <button 
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-600 px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 mx-auto text-slate-400 hover:text-white"
              >
                {showAllCategories ? 'Show Less' : `Show More (+${categories.length - 11} Categories)`}
              </button>
            </div>
          )}
        </div>

        {/* Newly Launched Tools Section */}
        {newLaunches.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Rocket className="text-indigo-400" /> Newly Launched
              </h2>
              <Link href="/founders" className="text-indigo-400 hover:text-indigo-300 transition font-bold text-sm flex items-center gap-1">
                View Launchpad <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {newLaunches.map(tool => (
                <Link 
                  href={`/founders/tool/${tool.id}`} 
                  key={tool.id} 
                  className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/50 transition border-l-4 border-l-indigo-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img 
                        src={tool.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=random`} 
                        alt={tool.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10">
                      Launched
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{tool.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 line-clamp-2">{tool.short_description || tool.tagline}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                       <User size={12} className="text-indigo-500" /> {tool.founder_name || 'Architect'}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500">
                       {mounted && new Date(tool.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Trending Tools Section */}
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-8">
            <Star className="text-orange-400" /> Trending Tools
          </h2>
          {loading ? (
             <div className="grid md:grid-cols-3 gap-6">
               {[1, 2, 3].map(i => (
                 <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-48">
                   <Skeleton className="w-3/4 h-6 mb-4" />
                   <Skeleton className="w-full h-4 mb-2" />
                   <Skeleton className="w-full h-4 mb-6" />
                   <div className="flex justify-between items-center mt-auto">
                     <Skeleton className="w-16 h-4" />
                     <Skeleton className="w-24 h-8 rounded-lg" />
                   </div>
                 </div>
               ))}
             </div>
          ) : trendingTools.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {trendingTools.map(tool => (
                <div key={tool.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/50 transition cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{tool.name}</h3>
                    </div>
                    <span className="text-xs font-bold bg-slate-800 px-2 py-1 rounded text-slate-300">{tool.pricing_type}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-6">{tool.short_description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-sm text-yellow-400 font-medium">
                      <Star className="w-4 h-4 fill-current" /> {tool.quality_score}/10
                    </div>
                    <Link href={`/tool/${tool.slug}`} className="text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500">No tools found. Please run the database seeder!</div>
          )}
        </div>
      </main>
    </div>
  );
}
