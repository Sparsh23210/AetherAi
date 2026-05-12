'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Verifying access...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-950">
        <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center backdrop-blur-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />
          
          <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
            <ShieldAlert className="w-10 h-10 text-indigo-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Access Restricted</h2>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed">
            The Aether database is protected. Please sign in or create an account to view full tool blueprints and comparative data.
          </p>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => router.push('/login')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
            >
              Log In to Unlock
            </button>
            <button 
              onClick={() => router.push('/signup')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition border border-slate-700 active:scale-[0.98]"
            >
              Create Free Account
            </button>
          </div>
          
          <p className="mt-8 text-sm text-slate-500">
            Join 10,000+ architects discovering the future of AI.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
