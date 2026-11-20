import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Bookmark, Trash2 } from 'lucide-react';

import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from '../components/LeftSidebar'; 
import { RightSidebar } from './RightSidebar';

interface SavedItem {
  id: number;
  author: string;
  initials: string;
  avatarBg: string;
  type: string;
  title: string;
  time: string;
  volume: string;
  consensus: string;
}

export default function SavedPost() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    {
      id: 1,
      author: "Ananya Patel",
      initials: "AP",
      avatarBg: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300",
      type: "Prediction",
      title: "AI will become the most powerful productivity lever by 2030.",
      time: "Saved 2m ago",
      volume: "3.2K predictions",
      consensus: "Trending"
    },
    {
      id: 2,
      author: "Rohan Sen",
      initials: "RS",
      avatarBg: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
      type: "Comments",
      title: "Global recession before mid-2026 is unlikely.",
      time: "Saved 15m ago",
      volume: "1.8K predictions",
      consensus: "Highly Disputed"
    },
    {
      id: 3,
      author: "Arjun Mehta",
      initials: "AM",
      avatarBg: "bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-300",
      type: "Predictions",
      title: "Bitcoin will reach $150K by the end of 2025.",
      time: "Saved 2h ago",
      volume: "2.8K predictions",
      consensus: "Bullish Consensus"
    }
  ]);

  const sidebarFilters = [
    { name: 'All saved items', count: savedItems.length, type: 'All' },
    { name: 'Predictions', count: savedItems.filter(i => i.type === 'Predictions' || i.type === 'Prediction').length, type: 'Predictions' },
    { name: 'Comments', count: savedItems.filter(i => i.type === 'Comments').length, type: 'Comments' },
    // { name: 'System updates', count: 0, type: 'System' }
  ];

  const handleRemoveBookmark = (id: number) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  const filteredItems = savedItems.filter(item => {
    const matchesTab = activeTab === 'All' || item.type.toLowerCase().includes(activeTab.toLowerCase().replace('items', ''));
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 font-sans antialiased text-zinc-800 dark:text-zinc-200 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
        
        {/* BODY ARCHITECTURE */}
        <main className="max-w-8xl mx-auto px-0 sm:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 md:gap-6 items-start">
          
          {/* 1. LEFT SIDEBAR WRAPPER (MOBILE/TABLET ONLY) */}
          <div className="block lg:hidden w-full md:col-span-1 shrink-0 px-4 sm:px-0">
            <LeftSidebar />
          </div>

          {/* 2. MANAGE BOOKMARKS FILTERS PANEL */}
          <section className="col-span-1 md:col-span-1 lg:col-span-3 space-y-4 px-4 sm:px-0">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-xs text-left transition-all duration-300">
              
              {/* Trigger Header */}
              <div 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center justify-between cursor-pointer group lg:pointer-events-none select-none"
              >
                <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-tight group-hover:text-[#A26227] dark:group-hover:text-orange-400 lg:group-hover:text-zinc-900 dark:lg:group-hover:text-zinc-50 transition-colors">
                  Manage bookmarks
                </h2>
                
                <div className="lg:hidden p-1 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 group-hover:bg-[#FAF5EE] dark:group-hover:bg-zinc-800 transition-colors">
                  {isFiltersOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-[#A26227] dark:group-hover:text-orange-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-[#A26227] dark:group-hover:text-orange-400" />
                  )}
                </div>
              </div>

              {/* Expandable Content Panel */}
              <AnimatePresence initial={false}>
                {(isFiltersOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                  <motion.div
                    key="bookmarks-filter-content"
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ 
                      height: 'auto', 
                      opacity: 1, 
                      marginTop: 12,
                      transition: { height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.2 } }
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0, 
                      marginTop: 0,
                      transition: { height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.15 } }
                    }}
                    className="overflow-hidden lg:!h-auto lg:!opacity-100 lg:!mt-3 block" 
                  >
                    <div className="space-y-0.5 pt-0.5">
                      {sidebarFilters.map((filter) => (
                        <button
                          key={filter.name}
                          onClick={() => {
                            setActiveTab(filter.type);
                            if (window.innerWidth < 1024) {
                              setIsFiltersOpen(false);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            activeTab === filter.type 
                              ? 'bg-[#FAF5EE] dark:bg-zinc-800 text-[#A26227] dark:text-orange-400' 
                              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <span>{filter.name}</span>
                          {filter.count > 0 && (
                            <span className={`text-[11px] font-medium transition-colors ${activeTab === filter.type ? 'text-[#A26227]/60 dark:text-orange-400/60' : 'text-zinc-400 dark:text-zinc-500'}`}>
                              {filter.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* 3. MIDDLE COLUMN: MAIN SAVED ITEMS ACTIVITY FEED */}
          <section className="col-span-1 md:col-span-3 lg:col-span-6 space-y-3 px-4 sm:px-0 min-w-0">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div>
                <h1 className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#A26227] dark:text-orange-400 fill-current" /> Saved Items
                </h1>
              </div>
              <div className="relative w-full sm:min-w-[200px] sm:w-auto">
                <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Filter view..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-800/80 border border-transparent dark:border-zinc-700/40 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-zinc-200 dark:focus:border-zinc-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 rounded-2xl shadow-xs flex items-start justify-between gap-3 sm:gap-4 text-left relative group"
                  >
                    <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                      <div className={`w-9 h-9 rounded-full ${item.avatarBg} font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                        {item.initials}
                      </div>
                      
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center space-x-1.5 text-xs font-semibold flex-wrap gap-y-1">
                          <span className="font-bold text-zinc-900 dark:text-zinc-200 truncate max-w-[100px] sm:max-w-none">{item.author}</span>
                          <span className="text-zinc-400 dark:text-zinc-500 font-normal">saved a</span>
                          <span className="text-[#A26227] dark:text-orange-400 bg-[#FAF5EE] dark:bg-orange-500/10 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider shrink-0">
                            {item.type}
                          </span>
                          <span className="text-zinc-400 dark:text-zinc-500 text-[10px] sm:text-[11px] font-normal shrink-0">{item.time}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug break-words">“{item.title}”</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button 
                        onClick={() => handleRemoveBookmark(item.id)}
                        className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-colors border border-transparent dark:border-zinc-700/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredItems.length === 0 && (
                <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center text-zinc-400 dark:text-zinc-500 font-medium text-xs">
                  No saved items match your criteria.
                </div>
              )}
            </div>
          </section>

          {/* 4. RIGHT COLUMN: RECOMMENDED WIDGET (DESKTOP ANCHOR) */}
          <section className="hidden lg:block lg:col-span-3 space-y-4 text-left">
             <RightSidebar/>
          </section>
          
        </main>
      </div>
    </SidebarProvider>
  );
}