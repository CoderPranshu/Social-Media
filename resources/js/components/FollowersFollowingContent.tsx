import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Plus, Loader2 } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { NotificationsLeftSidebar } from '@/components/NotificationsLeftSidebar';
import { apiGet, apiPost } from '@/lib/api';
import type { SharedData } from '@/types';

interface FollowersFollowingContentProps {
  onBack: () => void;
}

interface FollowUser {
  id: number;
  name: string;
  username: string | null;
  headline?: string | null;
  avatar_path: string | null;
  is_following: boolean;
}

export const FollowersFollowingContent: React.FC<FollowersFollowingContentProps> = ({ onBack }) => {
  const { auth } = usePage<SharedData>().props;
  const currentUserId = auth.user?.id;

  const [subTab, setSubTab] = useState<'followers' | 'following'>('followers');
  const [users, setUsers]   = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (tab: 'followers' | 'following') => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const data = await apiGet<FollowUser[]>(`/users/${currentUserId}/${tab}`);
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(subTab);
  }, [subTab, currentUserId]);

  const toggleFollow = async (id: number) => {
    // Optimistic
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_following: !u.is_following } : u));
    try {
      const res = await apiPost<{ is_following: boolean }>(`/users/${id}/follow`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_following: res.is_following } : u));
    } catch {
      // Rollback
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_following: !u.is_following } : u));
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5 items-start text-left">
      {/* Left Navigation */}
      <div className="w-full lg:col-span-1 lg:sticky lg:top-[80px] z-30">
        <NotificationsLeftSidebar onFilterChange={() => {}} />
      </div>

      {/* Right Stream Segment Details Card */}
      <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] p-4 md:p-5 space-y-4 w-full min-w-0">
        {/* Header */}
        <div className="flex items-center space-x-3 pb-2 border-b border-zinc-50 dark:border-zinc-800/60">
          <button onClick={onBack} className="p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Following & Followers</h3>
            <p className="text-[11px] text-zinc-400 font-medium">Manage your community updates</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex space-x-2 bg-zinc-50 dark:bg-zinc-800/40 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setSubTab('followers')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'followers' 
                ? 'bg-white dark:bg-zinc-900 shadow-sm text-[#A26227] dark:text-orange-400' 
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            Followers
          </button>
          <button 
            onClick={() => setSubTab('following')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'following' 
                ? 'bg-white dark:bg-zinc-900 shadow-sm text-[#A26227] dark:text-orange-400' 
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            Following
          </button>
        </div>

        {/* List */}
        <div className="space-y-3 pt-2">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-zinc-400 gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#A26227]" />
              <span>Loading {subTab}…</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-400 font-medium">
              {subTab === 'followers' ? 'You have no followers yet.' : 'You are not following anyone yet.'}
            </div>
          ) : (
            users.map(person => (
              <div key={person.id} className="flex items-center justify-between p-3 border border-zinc-50 dark:border-zinc-800/50 rounded-xl hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all">
                <div className="flex items-center space-x-3 min-w-0">
                  {person.avatar_path ? (
                    <img src={person.avatar_path} alt={person.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#FAF6F0] dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 text-xs shrink-0">
                      {person.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{person.name}</h4>
                    <p className="text-[11px] text-zinc-400 font-medium truncate">
                      {person.username ? `@${person.username}` : (person.headline ?? 'Member')}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleFollow(person.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center space-x-1 border ${
                    person.is_following 
                      ? 'border-zinc-200 text-zinc-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50/30' 
                      : 'border-[#A26227]/30 text-[#A26227] hover:bg-[#A26227] hover:text-white'
                  }`}
                >
                  {person.is_following ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
