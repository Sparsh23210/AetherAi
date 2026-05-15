'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Users, 
  Target, 
  Award, 
  Cpu,
  ArrowRight,
  ChevronRight,
  Layers,
  BarChart3,
  Lightbulb,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-black uppercase tracking-widest mb-8"
            >
              <Sparkles size={14} /> Our Mission
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white leading-tight"
            >
              Architecting the <br /><span className="text-gradient">Intelligence Era.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed"
            >
              Aether AI is more than a directory. It's the elite engine where visionaries discover, compare, and launch the world's most powerful artificial intelligence.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Cpu />, title: "Precision Discovery", desc: "No more searching through thousands of mediocre tools. We curate only the elite." },
              { icon: <BarChart3 />, title: "Performance Scored", desc: "Every tool is mathematically audited for speed and quality before listing." },
              { icon: <Rocket />, title: "Founder Launchpad", desc: "The premier stage for AI innovators to reach their first thousand power users." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="bg-slate-900/40 border border-slate-800 rounded-[40px] p-10 backdrop-blur-xl group hover:border-indigo-500/30 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Are Unique Section */}
      <section className="py-32 relative overflow-hidden bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                Why Aether AI is <br /><span className="text-gradient">Unique.</span>
              </h2>
              <div className="space-y-8">
                {[
                  { title: "Mathematical Auditing", desc: "We don't rely on reviews alone. Our systems analyze technical performance to provide objective Speed and Quality scores." },
                  { title: "Workflow Orchestration", desc: "Beyond discovery, we help you combine tools into powerful automated workflows that replace weeks of manual labor." },
                  { title: "Founder-First Ecosystem", desc: "We provide founders with the analytics and visibility they need to scale from MVP to market leader." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                      <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full"></div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-[60px] p-4 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200" 
                  alt="AI Visualization" 
                  className="rounded-[50px] w-full h-[600px] object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent rounded-[50px]"></div>
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Zap size={20} className="text-white" />
                      </div>
                      <span className="font-black text-white text-lg tracking-tight">The Aether Standard</span>
                    </div>
                    <p className="text-slate-200 font-bold italic leading-relaxed">
                      "We are building the infrastructure for the intelligence age. Every pixel of Aether is designed to make the power of AI accessible to everyone."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founders Focus Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-[60px] p-12 md:p-20 backdrop-blur-xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Target size={12} /> The Founder's Launchpad
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                Built for <span className="text-orange-500">Founders</span> <br />& Co-founders.
              </h2>
              <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed">
                We know that the journey from idea to product-market fit is grueling. Aether AI provides founders with a specialized environment to gain the visibility and technical credibility they deserve.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-white flex items-center gap-3">
                    <Award className="text-orange-500" size={20} /> Zero-Friction Launch
                  </h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Submit your tool in minutes. Our automated logo extraction and domain analysis tools do the heavy lifting, letting you focus on building.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-white flex items-center gap-3">
                    <BarChart3 className="text-indigo-500" size={20} /> Performance Audits
                  </h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Get an objective Speed and Quality score that proves your tool's worth to potential users and investors.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-white flex items-center gap-3">
                    <Users className="text-purple-500" size={20} /> Community Feedback
                  </h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Engage with power users who provide critical feedback to help you iterate and improve your AI models.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-white flex items-center gap-3">
                    <ShieldCheck className="text-green-500" size={20} /> Verified Status
                  </h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Tools that pass our deep technical audits receive a 'Verified Launch' badge, boosting trust and adoption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Utility for Everyone Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Useful for <span className="text-gradient">Everyone.</span></h2>
            <p className="text-slate-500 text-xl font-medium">Aether AI empowers people across all industries and roles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: "Founders", benefit: "Launch your MVP to an elite audience and gain instant technical validation.", color: "indigo" },
              { role: "Creative Professionals", benefit: "Discover high-end video and image generation tools to amplify your vision.", color: "purple" },
              { role: "Developers", benefit: "Access the best LLMs and coding assistants with benchmarked performance scores.", color: "cyan" },
              { role: "Enterprise Teams", benefit: "Build custom workflows that integrate multiple AI models into a single pipeline.", color: "orange" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-slate-900/40 border border-slate-800 rounded-[40px] p-8 flex flex-col h-full group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-500 mb-6 group-hover:scale-110 transition-transform`}>
                  {i === 0 ? <Rocket size={24} /> : i === 1 ? <Sparkles size={24} /> : i === 2 ? <Cpu size={24} /> : <Layers size={24} />}
                </div>
                <h4 className="text-2xl font-black text-white mb-4">{item.role}</h4>
                <p className="text-slate-400 font-medium leading-relaxed flex-grow">{item.benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter relative z-10 leading-tight">
              Ready to <span className="text-slate-950">Architect</span> your future?
            </h2>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <Link href="/signup" className="bg-white text-black px-12 py-5 rounded-2xl font-black text-lg hover:bg-slate-100 transition active:scale-95 shadow-xl">
                Get Started Now
              </Link>
              <Link href="/founders" className="bg-slate-950/20 backdrop-blur-xl border border-white/20 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition active:scale-95">
                Launch Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 font-black text-3xl tracking-tighter mb-8">
            <img src="/logo.png" alt="Aether AI" className="w-10 h-10" />
            <span className="text-white">Aether<span className="text-indigo-500">AI</span></span>
          </div>
          <p className="text-slate-500 font-medium mb-8 italic">Architecting Intelligence for a better tomorrow.</p>
          <div className="flex justify-center gap-8 text-slate-600 font-bold text-sm uppercase tracking-widest">
            <Link href="/help" className="hover:text-white transition">Help</Link>
            <Link href="/search" className="hover:text-white transition">Explore</Link>
            <Link href="/founders" className="hover:text-white transition">Launch</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckCircle2({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
