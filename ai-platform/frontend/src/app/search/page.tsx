'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { Sparkles, Star, Search as SearchIcon, Filter, Loader2 } from 'lucide-react';
import AuthGate from '@/components/AuthGate';


import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toggleFavorite, getUserFavorites } from '@/lib/userActions';
import { api } from '@/lib/api';
import { Heart } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [tools, setTools] = useState<any[]>([]);
  const [filteredTools, setFilteredTools] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const favs = await getUserFavorites(currentUser.uid);
        setFavorites(favs);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [toolsData, catsData] = await Promise.all([
          api.get(`/tools${categoryParam ? `?category=${categoryParam}` : ''}`),
          api.get('/categories')
        ]);
        
        let results = toolsData.tools || [];
        
        if (query) {
          results = results.filter((t: any) => 
            t.name.toLowerCase().includes(query.toLowerCase()) || 
            t.short_description?.toLowerCase().includes(query.toLowerCase())
          );
        }
        
        setTools(results);
        setFilteredTools(results);
        setCategories(catsData.categories || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryParam, query]);

  const handleToggleFavorite = async (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    const isNowFavorite = await toggleFavorite(user.uid, toolId);
    if (isNowFavorite) {
      setFavorites(prev => [...prev, toolId]);
    } else {
      setFavorites(prev => prev.filter(id => id !== toolId));
    }
  };

  const handlePricingChange = (price: string) => {
    setSelectedPricing(prev => 
      prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]
    );
  };

  const applyFilters = () => {
    if (selectedPricing.length === 0) {
      setFilteredTools(tools);
    } else {
      setFilteredTools(tools.filter(t => selectedPricing.includes(t.pricing_type)));
    }
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-64 hidden md:block flex-shrink-0">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 sticky top-24">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Filter size={18} /> Filters</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Categories</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                <Link 
                  href={`/search${query ? `?q=${query}` : ''}`}
                  className={`block text-sm py-1 transition-colors ${!categoryParam ? 'text-indigo-400 font-medium' : 'text-slate-300 hover:text-white'}`}
                >
                  All Tools
                </Link>
                {categories.map(cat => (
                  <Link 
                    key={cat.id} 
                    href={`/search?category=${cat.slug}${query ? `&q=${query}` : ''}`}
                    className={`block text-sm py-1 transition-colors ${categoryParam === cat.slug ? 'text-indigo-400 font-medium' : 'text-slate-300 hover:text-white'}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Pricing</h4>
              <div className="space-y-2">
                {['Free', 'Freemium', 'Paid', 'Paid API'].map(price => (
                  <label key={price} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedPricing.includes(price)}
                      onChange={() => handlePricingChange(price)}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500" 
                    />
                    {price}
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={applyFilters}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2 rounded-lg transition shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Results Area */}
        <div className="flex-1">
          <div className="mb-8 border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-bold mb-2">
              {query ? `Search results for "${query}"` : categoryParam ? `Browsing ${categories.find(c => c.slug === categoryParam)?.name || categoryParam}` : 'All Tools'}
            </h1>
            <p className="text-slate-400">Found {filteredTools.length} results</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : filteredTools.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <div key={tool.id} className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/[0.05] rounded-[24px] p-6 transition-all duration-500 cursor-pointer flex flex-col group shadow-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-slate-800/60 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <button 
                    onClick={(e) => handleToggleFavorite(e, tool.id)}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${
                      favorites.includes(tool.id) 
                        ? 'bg-pink-500/10 text-pink-500' 
                        : 'bg-slate-800/50 text-slate-500 hover:text-pink-400 hover:bg-slate-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(tool.id) ? 'fill-current' : ''}`} />
                  </button>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900/80 flex items-center justify-center overflow-hidden border border-white/[0.08] shadow-inner group-hover:border-indigo-500/50 transition-colors">
                        <img 
                          src={`https://www.google.com/s2/favicons?domain=${tool.website_url}&sz=128`} 
                          alt={tool.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=6366f1&color=fff`;
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition">{tool.name}</h3>
                        <span className="text-xs font-medium text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-md">{tool.pricing_type}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-6 flex-1 line-clamp-2 relative z-10">{tool.short_description}</p>
                  
                  <div className="flex items-center justify-between mt-auto relative z-10">
                    <div className="flex items-center gap-1 text-sm text-yellow-400 font-medium">
                      <Star className="w-4 h-4 fill-current" /> {tool.quality_score}/10
                    </div>
                    <Link href={`/tool/${tool.slug}`} className="text-sm font-bold text-white bg-indigo-600/80 hover:bg-indigo-500 px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-indigo-400/20 active:scale-95">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
              <SearchIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No tools found</h3>
              <p className="text-slate-400 mb-6">Try adjusting your filters or search query.</p>
              <Link href="/search" className="text-indigo-400 hover:text-indigo-300 font-medium">Clear all filters</Link>
            </div>
          )}
        </div>
      </main>
    </div>
    </AuthGate>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
