'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createClient } from '@/lib/supabase';
import { Rocket, Sparkles, LayoutGrid, Globe, Type, Image as ImageIcon, CheckCircle2, Loader2, ArrowRight, Upload, X, User, Zap, Star, Mail, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthGate from '@/components/AuthGate';

export default function EditToolPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    websiteUrl: '',
    logoUrl: '',
    founderName: '',
    coFounderName: '',
    founderEmail: '',
    contactNumber: '',
    category: 'Productivity',
    pricingType: 'Freemium',
    customCategory: '',
    speedScore: 8,
    qualityScore: 7
  });

  const MAX_TAGLINE = 80;
  const MAX_DESC = 500;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push(`/login?redirect=/founders/edit/${id}`);
      } else {
        setUser(u);
        setFormData(prev => ({ ...prev, founderName: prev.founderName || u.displayName || '' }));
      }
    });

    // Fetch dynamic categories from database
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        const data = await res.json();
        if (data.categories) setCategoriesList(data.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchTool = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase.from('ai_tools').select('*').eq('id', id).single();
        if (data && !error) {
          setFormData({
            name: data.name,
            tagline: data.short_description,
            description: data.description,
            websiteUrl: data.website_url,
            logoUrl: data.logo_url || '',
            founderName: data.founder_name,
            coFounderName: data.co_founder_name || '',
            founderEmail: data.founder_email || '',
            contactNumber: data.contact_number || '',
            category: data.category_name,
            pricingType: data.pricing_type,
            customCategory: '',
            speedScore: data.speed_score,
            qualityScore: data.quality_score
          });
          if (data.logo_url && data.logo_url.startsWith('http')) {
            setImagePreview(data.logo_url);
          }
        }
      } catch (err) {
        console.error('Error fetching tool:', err);
      }
    };

    fetchCategories();
    fetchTool();

    return () => unsubscribe();
  }, [router, id, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be less than 2MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    console.log('[Launch] Starting flexible-logo optimized launch...');
    
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        alert('Launch taking longer than expected. Please check your dashboard.');
      }
    }, 30000);

    try {
      let finalLogoUrl = '';
      
      // 1. Handle Logo Strategy (Priority: Upload > Manual URL > Auto-Domain)
      if (imageFile) {
        console.log('[Launch] Uploading custom logo...');
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('tools')
          .upload(filePath, imageFile);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('tools').getPublicUrl(filePath);
          finalLogoUrl = publicUrl;
        }
      } else if (formData.logoUrl) {
        // Option B: Manual URL provided by user
        console.log('[Launch] Using manual logo URL...');
        finalLogoUrl = formData.logoUrl;
      } else if (formData.websiteUrl) {
        // Option C: Auto-generate from Website (Zero Storage!)
        console.log('[Launch] Auto-generating logo from domain...');
        try {
          const domain = new URL(formData.websiteUrl).hostname;
          finalLogoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
        } catch {
          finalLogoUrl = ''; 
        }
      }

      let finalCategory = formData.category;
      
      // Handle Custom Category Creation
      if (formData.category === 'Other' && formData.customCategory) {
        finalCategory = formData.customCategory;
        const catSlug = formData.customCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        // Securely create category via backend
        try {
          await fetch('http://localhost:5000/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formData.customCategory, slug: catSlug })
          });
        } catch (catErr) {
          console.error('[Launch] Category creation failed:', catErr);
        }
      }

      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const token = await user.getIdToken();
      
      const payload = {
        name: formData.name,
        description: formData.description,
        short_description: formData.tagline,
        website_url: formData.websiteUrl,
        logo_url: finalLogoUrl,
        pricing_type: formData.pricingType,
        speed_score: formData.speedScore,
        quality_score: formData.qualityScore,
        founder_name: formData.founderName,
        co_founder_name: formData.coFounderName,
        founder_email: formData.founderEmail,
        contact_number: formData.contactNumber,
        category_name: finalCategory
      };

      const res = await fetch(`http://localhost:5000/api/tools/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Update failed');
      }

      console.log('[Update] SUCCESS! Startup updated.');
      clearTimeout(timeoutId);
      setSuccess(true);
      setTimeout(() => router.push('/founders/my-startups'), 1500);
    } catch (err: any) {
      console.error('[Update] CRITICAL ERROR:', err.message);
      alert(`Update failed: ${err.message}`);
      setLoading(false);
      clearTimeout(timeoutId);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 border border-green-500/30">
          <CheckCircle2 size={48} className="text-green-500" />
        </motion.div>
        <h1 className="text-4xl font-black mb-4 text-white">Startup Updated!</h1>
        <p className="text-slate-400 text-lg mb-8">Your tool changes have been saved.</p>
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="max-w-3xl mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <Rocket className="w-12 h-12 text-indigo-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Edit Startup</h1>
          <p className="text-slate-400 text-lg">Update your product details to keep users informed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12 backdrop-blur-xl">
          
          {/* Logo Upload */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={14} /> Startup Logo (PNG/JPG)
            </label>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-slate-950 border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-500/50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="text-slate-700" size={32} />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {imagePreview && (
                  <button 
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-300">Upload your logo</p>
                <p className="text-xs text-slate-500">Square images work best. Max size 2MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tool Name */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Type size={14} /> Tool Name
              </label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-6 focus:border-indigo-500 outline-none transition font-bold" placeholder="Architect AI" />
            </div>
          </div>

          {/* Performance Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={16} className="text-orange-500" /> Speed Score
                </label>
                <span className="text-2xl font-black text-white">{formData.speedScore}<span className="text-slate-600 text-sm">/10</span></span>
              </div>
              <input 
                type="range" min="1" max="10" 
                value={formData.speedScore}
                onChange={(e) => setFormData({...formData, speedScore: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <p className="text-[10px] text-slate-500 mt-3 italic">How fast does your AI generate results?</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" /> Quality Score
                </label>
                <span className="text-2xl font-black text-white">{formData.qualityScore}<span className="text-slate-600 text-sm">/10</span></span>
              </div>
              <input 
                type="range" min="1" max="10" 
                value={formData.qualityScore}
                onChange={(e) => setFormData({...formData, qualityScore: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <p className="text-[10px] text-slate-500 mt-3 italic">Accuracy and reliability of the output.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid size={14} /> Category
              </label>
              <select 
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-6 focus:border-indigo-500 outline-none transition appearance-none cursor-pointer"
              >
                <option value="">Select Category</option>
                {categoriesList.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                <option value="Other">Other (Custom)</option>
              </select>

              {/* Conditional Custom Category Input */}
              {formData.category === 'Other' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4"
                >
                  <input 
                    required 
                    value={formData.customCategory} 
                    onChange={(e) => setFormData({...formData, customCategory: e.target.value})} 
                    className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-2xl py-3 px-6 focus:border-indigo-500 outline-none transition text-sm italic" 
                    placeholder="Type new category name (e.g. AI Legal Assistant)" 
                  />
                </motion.div>
              )}
            </div>

            {/* Pricing Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} /> Pricing Type
              </label>
              <select 
                required
                value={formData.pricingType}
                onChange={(e) => setFormData({...formData, pricingType: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-6 focus:border-indigo-500 outline-none transition appearance-none cursor-pointer text-indigo-400 font-bold"
              >
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
                <option value="Paid API">Paid API</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Founder Name */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User size={14} /> Founder Name
              </label>
              <input 
                required 
                value={formData.founderName} 
                onChange={(e) => setFormData({...formData, founderName: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-6 focus:border-indigo-500 outline-none transition font-bold" 
                placeholder="Full Name" 
              />
            </div>

             {/* Co-founder Name */}
             <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} /> Co-founder Name (Optional)
                </label>
                <input 
                  value={formData.coFounderName} 
                  onChange={(e) => setFormData({...formData, coFounderName: e.target.value})} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-6 focus:border-indigo-500 outline-none transition" 
                  placeholder="e.g. Jane Doe" 
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Founder Email */}
             <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={14} /> Founder Email
                </label>
                <input 
                  required 
                  type="email"
                  value={formData.founderEmail} 
                  onChange={(e) => setFormData({...formData, founderEmail: e.target.value})} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-6 focus:border-indigo-500 outline-none transition" 
                  placeholder="email@example.com" 
                />
             </div>

             {/* Contact Number */}
             <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Smartphone size={14} /> Contact Number
                </label>
                <input 
                  required 
                  type="tel"
                  value={formData.contactNumber} 
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-6 focus:border-indigo-500 outline-none transition" 
                  placeholder="+1 (555) 000-0000" 
                />
             </div>
          </div>

          {/* Tagline */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} /> Tagline
              </label>
              <span className={`text-[10px] font-bold ${formData.tagline.length > MAX_TAGLINE ? 'text-red-500' : 'text-slate-600'}`}>
                {formData.tagline.length}/{MAX_TAGLINE}
              </span>
            </div>
            <input 
              required 
              maxLength={MAX_TAGLINE}
              value={formData.tagline} 
              onChange={(e) => setFormData({...formData, tagline: e.target.value})} 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-6 focus:border-indigo-500 outline-none transition" 
              placeholder="Short catchy one-liner..." 
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid size={14} /> Full Description
              </label>
              <span className={`text-[10px] font-bold ${formData.description.length > MAX_DESC ? 'text-red-500' : 'text-slate-600'}`}>
                {formData.description.length}/{MAX_DESC}
              </span>
            </div>
            <textarea 
              required 
              rows={4} 
              maxLength={MAX_DESC}
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-6 focus:border-indigo-500 outline-none transition resize-none" 
              placeholder="Explain your product in detail..." 
            />
          </div>

          {/* Website URL */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} /> Website URL
            </label>
            <input required type="url" value={formData.websiteUrl} onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-6 focus:border-indigo-500 outline-none transition" placeholder="https://yourtool.com" />
          </div>

          {/* Logo URL */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={14} /> Direct Logo URL (Optional)
            </label>
            <input type="url" value={formData.logoUrl} onChange={(e) => setFormData({...formData, logoUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-6 focus:border-indigo-500 outline-none transition" placeholder="https://example.com/logo.png" />
            <p className="text-[10px] text-slate-600 italic px-2">Tip: Leave blank to auto-generate logo from your website domain.</p>
          </div>

          <div className="pt-8 flex items-center justify-between border-t border-slate-800">
            <Link href="/founders/my-startups" className="text-slate-500 hover:text-white transition font-medium">Cancel</Link>
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold transition flex items-center gap-3 shadow-xl shadow-indigo-600/20 disabled:opacity-50 active:scale-95">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Update Startup <ArrowRight size={20} /></>}
            </button>
          </div>
        </form>
      </main>
    </div>
    </AuthGate>
  );
}
