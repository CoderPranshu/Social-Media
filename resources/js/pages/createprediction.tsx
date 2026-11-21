import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, DollarSign, Percent, Plus, X, 
  HelpCircle, Eye, Globe, Lock, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { apiPost } from '@/lib/api';

export default function CreatePrediction() {
  // Form State Nodes
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [predictionType, setPredictionType] = useState<'binary' | 'numeric' | 'multiple'>('binary');
  const [expiryDate, setExpiryDate] = useState('');
  
  // Dynamic Tags Input Layer
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['AI', 'Future']);
  
  // Multiple Choice Options (if applicable)
  const [options, setOptions] = useState<string[]>(['Option A', 'Option B']);
  const [newOption, setNewOption] = useState('');

  // Visibility and Success States
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Categories list aligned with platform themes
  const categories = ['Technology', 'Finance', 'Geopolitics', 'Sports', 'Pop Culture', 'Science'];

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && !tags.includes(tagInput.trim())) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    try {
      const tagText = tags.map(t => `#${t.replace(/^#/, '')}`).join(' ');
      const content = `${title.trim()}\n\n${description.trim()}\n\n${tagText}`.trim();
      await apiPost('/posts', {
        post_content: content,
        visibility: visibility === 'private' ? 'only_me' : 'public',
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        window.location.href = '/dashboard';
      }, 1500);
    } catch {
      alert('Could not publish prediction.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] dark:bg-zinc-950 py-10 px-4 transition-colors">
      <div className="max-w-[760px] mx-auto bg-white dark:bg-zinc-900 border border-[#EFEBE4] dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm text-left relative overflow-hidden">
        
        {/* SUCCESS STATE MODAL OVERLAY */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 dark:bg-zinc-900/90 z-50 flex flex-col items-center justify-center p-6 text-center backdrop-blur-xs"
            >
              <motion.div
                initial={{ scale: 0.9, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 10 }}
                className="space-y-4"
              >
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white">Prediction Authenticated!</h2>
                <p className="text-xs font-semibold text-zinc-500 max-w-sm mx-auto">
                  Your entry node has been successfully written to the platform marketplace ledger.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER PROFILE IDENTITY SECTION */}
        <div className="border-b border-[#FAF5EE] dark:border-zinc-800/60 pb-5 mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#b46d23]">Consensus Engine</span>
          <h1 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">Publish New Prediction</h1>
          <p className="text-xs font-medium text-zinc-400 mt-1">Deploy your speculative analytical insight and allow the market ecosystem to vote or hedge consensus.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. CORE TITLE & SPECIFICATION INPUT */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-zinc-900 dark:text-zinc-200 uppercase tracking-wide">Prediction Statement</label>
              <span className="text-[10px] text-zinc-400 font-bold">{title.length}/120</span>
            </div>
            <input 
              type="text"
              required
              maxLength={120}
              placeholder="e.g., Apple will announce an alternative AI OS architecture by Q4 2026..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-[#b46d23] focus:border-[#b46d23] transition-all"
            />
          </div>

          {/* 2. CHIP ARCHITECTURE: CATEGORY GRID SELECTOR */}
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-900 dark:text-zinc-200 uppercase tracking-wide block">Target Vector Domain</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    category === cat 
                      ? 'bg-[#FAF5EE] dark:bg-[#b46d23]/10 border-[#b46d23] text-[#b46d23]' 
                      : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3. METRIC MATRIX BLOCK: CONTEXT TYPE SELECTOR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Binary Switch */}
            <div 
              onClick={() => setPredictionType('binary')}
              className={`p-4 border rounded-xl cursor-pointer transition-all space-y-1.5 text-left select-none ${
                predictionType === 'binary' 
                  ? 'border-[#b46d23] bg-[#FCFAF7] dark:bg-zinc-800/40' 
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-900 dark:text-zinc-200">Yes / No Statement</span>
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <p className="text-[10px] text-zinc-400 font-semibold leading-normal">Absolute directional resolve (e.g. true or false outcomes).</p>
            </div>

            {/* Numeric Target Switch */}
            <div 
              onClick={() => setPredictionType('numeric')}
              className={`p-4 border rounded-xl cursor-pointer transition-all space-y-1.5 text-left select-none ${
                predictionType === 'numeric' 
                  ? 'border-[#b46d23] bg-[#FCFAF7] dark:bg-zinc-800/40' 
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-900 dark:text-zinc-200">Numeric Benchmark</span>
                <Percent className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <p className="text-[10px] text-zinc-400 font-semibold leading-normal">Resolves to a precise mathematical range or price target metrics.</p>
            </div>

            {/* Multiple Choice Options Switch */}
            <div 
              onClick={() => setPredictionType('multiple')}
              className={`p-4 border rounded-xl cursor-pointer transition-all space-y-1.5 text-left select-none ${
                predictionType === 'multiple' 
                  ? 'border-[#b46d23] bg-[#FCFAF7] dark:bg-zinc-800/40' 
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-900 dark:text-zinc-200">Multiple Choices</span>
                <Plus className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <p className="text-[10px] text-zinc-400 font-semibold leading-normal">Custom selection fields for tracking open scenario possibilities.</p>
            </div>

          </div>

          {/* DYNAMIC SUB-LAYERS: DYNAMIC RENDERING FOR OPTIONS CONFIG */}
          {predictionType === 'multiple' && (
            <motion.div 
              initial={{ opacity: 0, y: -4 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 rounded-xl space-y-3"
            >
              <label className="text-xs font-black text-zinc-900 dark:text-zinc-200 uppercase tracking-wide">Option Pool Configuration</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <span>{opt}</span>
                    <button type="button" onClick={() => setOptions(options.filter(o => o !== opt))} className="text-zinc-400 hover:text-red-500 border-none bg-transparent cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Insert choice option alternative..." 
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="flex-1 h-9 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold outline-none"
                />
                <button type="button" onClick={handleAddOption} className="h-9 px-4 bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity border-none cursor-pointer">Add Choice</button>
              </div>
            </motion.div>
          )}

          {/* 4. DETAILS EXPOSITION TEXTAREA */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-zinc-900 dark:text-zinc-200 uppercase tracking-wide block">Supporting Research Data & Logic</label>
            <textarea 
              rows={4}
              placeholder="State your data points, macro context, or structural reasons that validate this foresight framework..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-[#b46d23] focus:border-[#b46d23] transition-all resize-none"
            />
          </div>

          {/* 5. SPLIT PARAMETER CONTROLS: METADATA & LOCK TIMERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Expiry Clock Calendar Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-900 dark:text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#b46d23]" /> Resolve Evaluation Cut-off
              </label>
              <input 
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-[#b46d23] focus:border-[#b46d23]"
              />
            </div>

            {/* Visibility Mode Toggle Wrapper */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-900 dark:text-zinc-200 uppercase tracking-wide block">Privacy Distribution Vector</label>
              <div className="grid grid-cols-2 gap-2 h-11 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                    visibility === 'public' 
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs' 
                      : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> Public
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                    visibility === 'private' 
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs' 
                      : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" /> Circle Only
                </button>
              </div>
            </div>
          </div>

          {/* 6. EXTENDED SEARCH STRING TAG NODES */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-zinc-900 dark:text-zinc-200 uppercase tracking-wide block">Index Metadata Keywords</label>
            <div className="w-full min-h-11 p-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-2xs">
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="text-zinc-400 hover:text-zinc-600 border-none bg-transparent cursor-pointer flex items-center p-0"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <input 
                type="text"
                placeholder="Press Enter to attach tags..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="flex-1 min-w-[140px] bg-transparent text-xs font-semibold text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 outline-none border-none py-1 px-1"
              />
            </div>
          </div>

          {/* FOOTER WARN BOX & SUBMIT ANCHORS */}
          <div className="pt-4 border-t border-[#FAF5EE] dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-2 max-w-md">
              <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <p className="text-[10px] font-semibold text-zinc-400 leading-normal">
                Once published, accuracy ratings lock into validation contracts. Early settlement or parameter edits require community consensus delegation protocols.
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full sm:w-auto h-11 px-8 bg-[#b46d23] hover:bg-[#965a1b] text-white font-extrabold text-xs tracking-wide rounded-xl shadow-md shadow-amber-700/10 transition-all border-none cursor-pointer flex items-center justify-center shrink-0"
            >
              Deploy Consensus Node
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}