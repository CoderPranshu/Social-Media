import React, { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileActivity } from './ProfileActivity';
import { LeftSidebar } from '../components/LeftSidebar'; 
import { SidebarProvider } from "@/components/ui/sidebar";
import { Calendar, Eye, Copy, Edit2, Check, X } from 'lucide-react';

import type { UserProfile } from '@/types/profile';

interface ProfileLayoutProps {
    profile: UserProfile;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ profile }) => {

// export const ProfileLayout: React.FC = () => {
  // Dynamic About Text State Matrix
  // const [aboutText, setAboutText] = useState(
  //   "Passionate full stack developer and tech enthusiast. I love building products and sharing predictions about the future. Let's connect and build the future together!"
  // );
  const [aboutText, setAboutText] = useState(profile.bio ?? '');
  
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [tempAboutText, setTempAboutText] = useState(aboutText);

  // Follow State Tracker Matrix for Top Predictors Card
  const [followedUsers, setFollowedUsers] = useState<{ [key: string]: boolean }>({});

  const handleStartEdit = () => {
    setTempAboutText(aboutText);
    setIsEditingAbout(true);
  };

  const handleSaveAbout = () => {
    setAboutText(tempAboutText);
    setIsEditingAbout(false);
  };

  const handleFollowToggle = (name: string) => {
    setFollowedUsers((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <SidebarProvider>
      {/* Container spacing adapted: perfectly fluid structure across mobile, tablet, and desktop viewports */}
      <div className="min-h-screen w-full dark:bg-zinc-950 lg:pt-6 px-0 sm:px-4 flex justify-center pb-12 font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
        <div className="w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5 items-start px-4 sm:px-0">
          
          {/* 1. LEFT SIDEBAR INJECTOR: Renders exclusively on mobile/tablet stream blocks, cleanly scaling */}
          <div className="block lg:hidden w-full">
            <LeftSidebar />
          </div>

          {/* Left Main Stream Column (3 Columns Wide on Large Screens) */}
          <div className="lg:col-span-3 space-y-4 md:space-y-5 text-left min-w-0 w-full">
            {/* <ProfileHeader /> */}
            <ProfileHeader profile={profile} />
            <ProfileActivity />
            
            {/* Premium Dynamic About Card Section */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 md:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-3 gap-6 items-start md:items-center transition-all duration-300">
              <div className="md:col-span-2 border-r-0 md:border-r border-zinc-100 dark:border-zinc-800 pr-0 md:pr-6 w-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-medium font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    About
                  </h3>
                  {!isEditingAbout && (
                    <button 
                      onClick={handleStartEdit}
                      className="p-1.5 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl transition shadow-xs group active:scale-95 flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-[11px] font-bold"
                    >
                      <Edit2 className="w-3 h-3 text-[#b46d23]" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {isEditingAbout ? (
                  <div className="space-y-3 w-full animate-in fade-in duration-200">
                    <textarea
                      rows={3}
                      value={tempAboutText}
                      onChange={(e) => setTempAboutText(e.target.value)}
                      className="w-full text-sm px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl outline-none text-zinc-900 dark:text-zinc-100 focus:border-[#b46d23] transition font-medium resize-none"
                      placeholder="Write something premium about yourself..."
                    />
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setIsEditingAbout(false)}
                        className="h-7 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-extrabold text-[11px] rounded-lg transition active:scale-95 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Cancel
                      </button>
                      <button 
                        onClick={handleSaveAbout}
                        className="h-7 px-3 bg-[#b46d23] hover:bg-[#965a1b] text-white font-extrabold text-[11px] rounded-lg transition shadow-sm active:scale-95 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium whitespace-pre-wrap">
                    {aboutText}
                  </p>
                )}
              </div>
              
              {/* Meta Statistics Grid - Adaptive Layout Configurations */}
              <div className="flex flex-row justify-between items-center sm:justify-around md:flex-col md:justify-center md:items-start md:col-span-1 w-full px-0 sm:px-2 gap-4 md:gap-4 md:space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl text-[#b46d23] shrink-0">
                    <Calendar className="w-5 h-5 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Joined</p>
                    <p className="text-xs md:text-sm font-black text-zinc-800 dark:text-zinc-200 mt-0.5 whitespace-nowrap">April 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column (1 Column Wide) */}
          <div className="lg:col-span-1 space-y-4 text-left select-none w-full min-w-0">
            
            {/* Languages & Public URLs widget */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-zinc-900 dark:text-zinc-200 mb-1">
                  <span>Profile language</span>
                  <span className="text-[#b46d23] cursor-pointer text-[11px] hover:scale-105 transition-transform">✏️</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">English</p>
              </div>
              
              <div className="h-[1px] bg-zinc-100/80 dark:bg-zinc-800" />
              
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-zinc-900 dark:text-zinc-200 mb-1">
                  <span>Public profile & URL</span>
                  <span className="text-[#b46d23] cursor-pointer text-[11px] hover:scale-105 transition-transform">✏️</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 font-medium bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50 p-2 rounded-xl min-w-0">
                  <span className="truncate text-zinc-600 dark:text-zinc-400 flex-1">predictionhub.com/in/isha-singh</span>
                  <Copy className="w-3.5 h-3.5 text-zinc-400 cursor-pointer hover:text-[#b46d23] shrink-0" />
                </div>
              </div>
            </div>

            {/* Profile Overview Analytics Module */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
              <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-3">Profile overview</h4>
              <div className="space-y-3">
                {[
                  { label: 'Predictions made', val: '24' },
                  { label: 'Upvotes received', val: '1.2K' },
                  { label: 'Comments', val: '156' },
                  { label: 'Followers', val: '448' },
                  { label: 'Following', val: '132' }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-xs font-bold">
                    <span className="text-zinc-400">{item.label}</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-black">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests Badge Deck */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Interests</h4>
                <span className="text-xs text-[#b46d23] font-bold cursor-pointer hover:underline">Manage</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Technology', 'AI & ML', 'Future of Work', 'Startups', 'Web Development', 'Sustainability'].map((interest) => (
                  <span key={interest} className="bg-zinc-50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800/80 px-2.5 py-1.5 rounded-xl text-[10px] font-bold">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Predictors to Follow Panel */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Top predictors to follow</h4>
                <span className="text-xs text-[#b46d23] font-bold cursor-pointer hover:underline">View all</span>
              </div>
              <div className="space-y-3.5">
                {[
                  { name: 'Rohan Sen', followers: '12.4K followers', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
                  { name: 'Neha Gupta', followers: '8.7K followers', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80' },
                  { name: 'Arjun Mehta', followers: '6.1K followers', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80' }
                ].map((user) => {
                  const isFollowing = !!followedUsers[user.name];
                  return (
                    <div key={user.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <img src={user.img} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-zinc-100 dark:border-zinc-800 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
                          <p className="text-[10px] text-zinc-400 font-medium mt-0.5 truncate">{user.followers}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleFollowToggle(user.name)}
                        className={`text-[10px] font-black px-3 py-1 rounded-xl transition shrink-0 border duration-200 ${
                          isFollowing
                            ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            : 'border-[#b46d23] text-[#b46d23] hover:bg-amber-50/50 dark:hover:bg-amber-950/20'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};