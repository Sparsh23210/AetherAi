import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-slate-400 font-medium animate-pulse">Loading Aether AI...</p>
    </div>
  );
}
