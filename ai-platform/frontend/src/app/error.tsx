'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
        <AlertCircle size={48} className="text-red-500" />
      </div>
      <h1 className="text-3xl md:text-4xl font-black mb-4 text-slate-50 tracking-tight">Something went wrong</h1>
      <p className="text-slate-400 mb-10 max-w-md mx-auto">
        We encountered an unexpected error while loading this page. Our team has been notified.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
        >
          <Home size={18} />
          Return Home
        </Link>
      </div>
    </div>
  );
}
