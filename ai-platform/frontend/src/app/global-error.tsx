'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center font-sans">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
            <AlertCircle size={48} className="text-red-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4 text-slate-50 tracking-tight">Critical Error</h1>
          <p className="text-slate-400 mb-10 max-w-md mx-auto">
            A fatal error occurred that crashed the application. Please try reloading the page.
          </p>
          
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
          >
            <RefreshCw size={18} />
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
