'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LifeBuoy, 
  Mail, 
  MessageCircle, 
  Phone, 
  Search, 
  ChevronRight, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight,
  Headphones,
  CheckCircle2,
  Clock,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const faqs = [
    {
      q: "How do I launch my startup on Aether AI?",
      a: "Click on the 'Launch New' button in the navbar. Fill in your product details, upload a logo, and set your performance scores. Your tool will be live instantly!"
    },
    {
      q: "Is there a cost to list my tool?",
      a: "Currently, listing your basic startup is free. We offer premium placement and 'Featured' status for tools that want maximum visibility."
    },
    {
      q: "How does the 'Compare' tool work?",
      a: "The comparison engine uses real-time data to score tools on Speed and Quality. You can select any two tools to see a side-by-side performance breakdown."
    },
    {
      q: "Can I edit my startup after launching?",
      a: "Yes! Go to 'My Startups' in your profile dropdown, click 'Edit' on the desired tool, and update any information you need."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-8"
          >
            <LifeBuoy size={14} /> Support Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white"
          >
            How can we <span className="text-gradient">help you?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium"
          >
            Find answers to common questions, get in touch with our elite support team, or explore documentation.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500 rounded-3xl"></div>
            <div className="relative flex items-center bg-slate-900/50 border border-slate-800 rounded-3xl p-2 backdrop-blur-xl group-focus-within:border-indigo-500/50 transition-all duration-300">
              <Search className="ml-6 text-slate-500" size={24} />
              <input 
                type="text" 
                placeholder="Search for articles, guides, or help..." 
                className="w-full bg-transparent border-none py-4 px-6 text-white placeholder:text-slate-600 focus:outline-none font-medium"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition shadow-xl shadow-indigo-600/20 active:scale-95 mr-1 hidden md:block">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Cards */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-900/40 border border-slate-800 rounded-[40px] p-10 flex flex-col items-center text-center group hover:border-indigo-500/30 transition-all duration-500"
            >
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-indigo-500/5">
                <Phone size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Phone Support</h3>
              <p className="text-slate-400 mb-8 font-medium">Speak directly with our technical experts for immediate assistance.</p>
              <a href="tel:+918707601618" className="text-indigo-400 font-black text-xl hover:text-indigo-300 transition">+91 8707601618</a>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-900/40 border border-slate-800 rounded-[40px] p-10 flex flex-col items-center text-center group hover:border-purple-500/30 transition-all duration-500"
            >
              <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-8 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-purple-500/5">
                <Mail size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Email Inquiry</h3>
              <p className="text-slate-400 mb-8 font-medium">Drop us a line and we'll get back to you within 24 hours.</p>
              <a href="mailto:aetherai655@gmail.com" className="text-purple-400 font-black text-lg hover:text-purple-300 transition break-all px-2">aetherai655@gmail.com</a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-900/20 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Common Questions</h2>
            <p className="text-slate-500 font-medium">Quick answers to the most frequent inquiries.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-3xl p-8 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{faq.q}</h4>
                    <p className="text-slate-400 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                  <div className="mt-1 bg-slate-800 rounded-xl p-2 text-slate-500 group-hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Hero Detail */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900/40 to-purple-900/40 border border-indigo-500/20 rounded-[60px] p-12 md:p-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                  <CheckCircle2 size={12} /> System Status: Operational
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                  Elite support for <span className="text-gradient">elite builders.</span>
                </h2>
                <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed">
                  We understand that architecture is precise. Our support team consists of AI engineers and product specialists ready to help you optimize your Aether presence.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Clock size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-300">24/7 Priority Support</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <Headphones size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-300">Dedicated Success Manager</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <Shield size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-300">Enterprise SLA Protection</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                      <Zap size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-300">Instant Technical Audit</span>
                  </div>
                </div>

                <button className="bg-white text-black px-10 py-5 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-50 transition active:scale-95 shadow-2xl shadow-white/5">
                  Access Portal <ExternalLink size={20} />
                </button>
              </div>

              <div className="relative">
                <div className="relative z-10 bg-slate-950/50 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500 shadow-xl shadow-indigo-500/20 flex items-center justify-center">
                      <Headphones className="text-white" size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white">Live Assistance</h4>
                      <p className="text-indigo-400 text-sm font-bold tracking-widest uppercase">Support Online</p>
                    </div>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const inquiry = formData.get('inquiry');
                      const message = formData.get('message');
                      
                      const subject = encodeURIComponent(`Aether AI Support: ${inquiry}`);
                      const body = encodeURIComponent(`Inquiry Type: ${inquiry}\n\nMessage:\n${message}`);
                      
                      const mailtoLink = `mailto:aetherai655@gmail.com?subject=${subject}&body=${body}`;
                      
                      // Use a temporary link to trigger the mailto to ensure better browser compatibility
                      const link = document.createElement('a');
                      link.href = mailtoLink;
                      link.click();
                      
                      alert('Opening your email client... If it doesn\'t open, please email us directly at aetherai655@gmail.com');
                    }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Inquiry</label>
                      <select name="inquiry" className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500 transition font-medium appearance-none cursor-pointer">
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Billing Question">Billing Question</option>
                        <option value="Partnership Request">Partnership Request</option>
                        <option value="Report a Bug">Report a Bug</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Message</label>
                      <textarea name="message" required rows={3} className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500 transition font-medium resize-none" placeholder="How can we assist you today?"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black transition shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2">
                      Send Message <ArrowRight size={20} />
                    </button>
                  </form>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 font-black text-3xl tracking-tighter mb-8">
            <img src="/logo.png" alt="Aether AI" className="w-10 h-10" />
            <span className="text-white">Aether<span className="text-indigo-500">AI</span></span>
          </div>
          <p className="text-slate-500 font-medium mb-8 italic">Architecting Intelligence, supporting the future.</p>
          <div className="flex justify-center gap-8 text-slate-600 font-bold text-sm uppercase tracking-widest">
            <Link href="/" className="hover:text-white transition">Terms</Link>
            <Link href="/" className="hover:text-white transition">Privacy</Link>
            <Link href="/" className="hover:text-white transition">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
