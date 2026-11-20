import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Mail, Smartphone
} from 'lucide-react';
import { LeftSidebar } from '../components/LeftSidebar'; 
import { SidebarProvider } from '@/components/ui/sidebar';

import { Navbar } from '@/components/navbar';
import { NotificationsLeftSidebar } from '@/components/NotificationsLeftSidebar';

export default function NotificationSettings() {
  // Component state managing modular preference layers
  const [preferences, setPreferences] = useState({
    emailPredictions: true,
    emailComments: true,
    emailMarketing: false,
    pushLikes: true,
    pushFollows: true,
    pushTrending: true,
    inAppSystem: true,
    inAppWeeklySum: true
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [currentFilter, setCurrentFilter] = useState('All');
  
  const handleFilterChangeFromSidebar = (label: string) => {
    const parsedFilter = label === 'All notifications' ? 'All' : label;
    setCurrentFilter(parsedFilter);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans antialiased text-zinc-800 dark:text-zinc-200 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
      
      {/* 1. TOP GLOBAL NAVIGATION HEADER */}
      <Navbar />

      {/* 2. CORE ARCHITECTURE CANVASES */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 pb-12">
        <div className="w-full flex flex-col gap-4 md:gap-5 text-left">
          
          {/* MOBILE & TABLET SIDEBAR WRAPPER ONLY */}
          <div className="w-full block lg:hidden">
            <SidebarProvider>
              <LeftSidebar />
            </SidebarProvider>
          </div>

          {/* MAIN PREFERENCES CONTROL COMPONENT CONTAINER */}
          <div className="w-full space-y-4 md:space-y-5">
            
            {/* Main Title Banner */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-xs">
              <h1 className="text-base font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#A26227] dark:text-orange-400" /> Notification Preferences
              </h1>
              <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5 leading-normal">
                Choose how you'd like to receive updates about your predictions, community activity, and trending topics.
              </p>
            </div>

            {/* Preferences Group: Email Layer */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center space-x-2 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
                <Mail className="w-4 h-4 text-[#A26227] dark:text-orange-400" />
                <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Email Notifications</h3>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 block">Your Predictions</label>
                    <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 leading-normal">Get notified when someone likes, comments on, or interacts with your prediction posts.</p>
                  </div>
                  <Toggle checked={preferences.emailPredictions} onChange={() => togglePreference('emailPredictions')} />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 block">Comments & Mentions</label>
                    <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 leading-normal">Receive an email whenever someone replies to your comment or mentions you in a discussion.</p>
                  </div>
                  <Toggle checked={preferences.emailComments} onChange={() => togglePreference('emailComments')} />
                </div>
              </div>
            </div>

            {/* Preferences Group: Real-Time Mobile Push Settings */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center space-x-2 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
                <Smartphone className="w-4 h-4 text-[#A26227] dark:text-orange-400" />
                <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Push Notifications</h3>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 block">Likes & Reactions</label>
                    <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 leading-normal">Receive instant notifications whenever someone likes or reacts to your prediction.</p>
                  </div>
                  <Toggle checked={preferences.pushLikes} onChange={() => togglePreference('pushLikes')} />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 block">New Followers</label>
                    <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 leading-normal">Get notified when someone starts following your profile.</p>
                  </div>
                  <Toggle checked={preferences.pushFollows} onChange={() => togglePreference('pushFollows')} />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 block">Trending Predictions</label>
                    <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 leading-normal">Be the first to know when a prediction or topic you're following starts trending.</p>
                  </div>
                  <Toggle checked={preferences.pushTrending} onChange={() => togglePreference('pushTrending')} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable premium toggle switch layout sub-component 
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      type="button"
      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 shrink-0 border-none cursor-pointer outline-none focus:ring-2 focus:ring-amber-500/20 ${
        checked ? 'bg-[#A26227] dark:bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-800'
      }`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="bg-white dark:bg-zinc-100 w-4 h-4 rounded-full shadow-xs"
        animate={{ x: checked ? 16 : 0 }}
      />
    </button>
  );
}