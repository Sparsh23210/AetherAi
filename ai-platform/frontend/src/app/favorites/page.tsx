'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { getUserFavorites, toggleFavorite } from '@/lib/userActions';
import { api } from '@/lib/api';
import { Star, ArrowRight, Zap, Loader2, Sparkles, Heart, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchToolsByIds = async (ids: string[]) => {
    if (ids.length === 0) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      // Use the api helper instead of raw fetch
      const data = await api.get(`/tools?ids=${ids.join(',')}`);
      const fetchedTools = data.tools || [];
      setFavorites(fetchedTools);

      // Auto-cleanup stale IDs (e.g. IDs from a previous database version)
      if (fetchedTools.length < ids.length && user) {
        const validIds = fetchedTools.map((t: any) => t.id);
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          favorites: validIds
        });
      }
    } catch (err) {
      console.error('[Favorites] Error fetching tools from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let unsubscribeUser: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Real-time listener for user favorites list
        const userRef = doc(db, 'users', currentUser.uid);
        unsubscribeUser = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const favoriteIds = snapshot.data().favorites || [];
            fetchToolsByIds(favoriteIds);
          } else {
            setFavorites([]);
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, []);

  const handleRemove = async (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    try {
      await toggleFavorite(user.uid, toolId);
      // Optimistic update
      setFavorites(prev => prev.filter(t => t.id !== toolId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Retrieving your favorite tools...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <Heart className="w-16 h-16 text-slate-800 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Login to save favorites</h1>
          <p className="text-slate-400 mb-8">Save your top AI tools to access them quickly and build custom workflows.</p>
          <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition inline-block">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-3 flex items-center gap-3">
              <Star className="text-yellow-400 fill-yellow-400" /> Your Favorites
            </h1>
            <p className="text-slate-400 text-lg">Quick access to the AI tools you love and use most.</p>
          </div>
          <Link href="/search" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-6 py-3 rounded-xl transition text-sm font-bold flex items-center gap-2">
             Discover More Tools <ArrowRight size={18} />
          </Link>
        </div>

        {favorites.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map(tool => (
              <div key={tool.id} className="relative group">
                <Link 
                  href={`/tool/${tool.slug}`}
                  className="block bg-slate-900/40 border border-slate-800/60 rounded-[32px] p-8 hover:border-indigo-500/30 transition-all hover:bg-slate-900/60 flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 rounded-[20px] bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden group-hover:border-indigo-500/30 transition shadow-xl relative">
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${tool.website_url}&sz=128`} 
                        alt={tool.name} 
                        className="w-10 h-10 object-contain z-10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=6366f1&color=fff`;
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                        <Star size={12} className="text-indigo-400 fill-indigo-400" />
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">SAVED</span>
                      </div>
                      <button 
                        onClick={(e) => handleRemove(e, tool.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                        title="Remove from favorites"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-300 transition">{tool.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
                      {tool.short_description || tool.description || 'No description available for this AI tool.'}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{tool.pricing_type || 'FREE'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm group-hover:translate-x-1 transition">
                      VIEW TOOL <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[40px] py-24 text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Star className="text-slate-700 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-300">Your collection is empty</h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto">Start exploring the directory and click the star icon on tools you want to save for later.</p>
            <Link href="/search" className="bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-2xl font-bold transition inline-block shadow-lg shadow-indigo-600/20">
              Browse AI Tools
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
