'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Sparkles, 
  User, 
  LogOut, 
  Heart, 
  Settings, 
  ChevronDown, 
  LayoutGrid,
  Zap,
  Search
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
      setDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="border-b border-white/[0.08] bg-slate-950/40 backdrop-blur-2xl sticky top-0 z-50 shadow-2xl shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-black text-2xl tracking-tighter group relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <img src="/logo.png" alt="Aether AI" className="w-9 h-9 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10" />
          <span className="relative z-10 text-white">Aether<span className="text-gradient">AI</span></span>
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-8">
            <Link href="/search" className={`text-sm font-bold tracking-wide transition-all ${isActive('/search') ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'text-slate-400 hover:text-white'}`}>Explore</Link>
            <Link href="/workflows" className={`text-sm font-bold tracking-wide transition-all ${isActive('/workflows') ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'text-slate-400 hover:text-white'}`}>Workflows</Link>
            <Link href="/founders" className={`text-sm font-bold tracking-wide transition-all flex items-center gap-2 ${isActive('/founders') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}>
              Launch <span className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">New</span>
            </Link>
            <Link href="/compare" className={`text-sm font-bold tracking-wide transition-all ${isActive('/compare') ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'text-slate-400 hover:text-white'}`}>Compare</Link>
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full transition group"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-500/20">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setDropdownOpen(false)}
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="px-3 py-3 border-b border-slate-800 mb-1">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Signed in as</p>
                          <p className="text-sm font-bold text-white truncate">{user.email}</p>
                        </div>

                        <Link 
                          href="/profile" 
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-sm font-medium text-slate-300 hover:text-white transition group"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                          My Profile
                        </Link>
                        <Link 
                          href="/favorites" 
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-sm font-medium text-slate-300 hover:text-white transition group"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Heart className="w-4 h-4 text-slate-500 group-hover:text-pink-400" />
                          Favourites
                        </Link>
                        <Link 
                          href="/founders/my-startups" 
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-sm font-medium text-slate-300 hover:text-white transition group"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Zap className="w-4 h-4 text-slate-500 group-hover:text-yellow-400" />
                          My Startups
                        </Link>
                        <Link 
                          href="/settings" 
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-sm font-medium text-slate-300 hover:text-white transition group"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                          Settings
                        </Link>

                        <div className="h-px bg-slate-800 my-1" />

                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-sm font-medium text-red-400 transition group"
                        >
                          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          Log out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="text-sm font-bold text-slate-400 hover:text-white transition hidden sm:block"
                >
                  Log in
                </Link>
                <Link 
                  href="/signup" 
                  className="relative group overflow-hidden bg-slate-900 border border-slate-700 hover:border-indigo-500 px-6 py-2.5 rounded-full transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <span className="relative z-10 text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
