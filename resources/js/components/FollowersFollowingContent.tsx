import React, { useState } from 'react';
import { ArrowLeft, UserMinus, Check } from 'lucide-react';
import { NotificationsLeftSidebar } from '@/components/NotificationsLeftSidebar';

interface FollowersFollowingContentProps {
  onBack: () => void;
}

export const FollowersFollowingContent: React.FC<FollowersFollowingContentProps> = ({ onBack }) => {
  const [subTab, setSubTab] = useState<'followers' | 'following'>('followers');

  // Mock Data Matrix
  const [people, setPeople] = useState([
    { id: 1, name: 'Kushall Dev', role: 'UI/UX Designer', type: 'followers', isFollowing: true, initials: 'KD' },
    { id: 2, name: 'Vanshika Sharma', role: 'Technical Writer', type: 'followers', isFollowing: false, initials: 'VS' },
    { id: 3, name: 'Aman Verma', role: 'MERN Developer', type: 'following', isFollowing: true, initials: 'AV' },
    { id: 4, name: 'Priyanshu Singh', role: 'DevOps Engineer', type: 'following', isFollowing: true, initials: 'PS' },
  ]);

  const [currentFilter, setCurrentFilter] = useState('All');
    
  const handleFilterChangeFromSidebar = (label: string) => {
    const parsedFilter = label === 'All notifications' ? 'All' : label;
    setCurrentFilter(parsedFilter);
  };

  const toggleFollow = (id: number) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, isFollowing: !p.isFollowing } : p));
  };

  const currentList = people.filter(p => p.type === subTab);

  return (
    /* Main Layout Grid wrapper splitting your layout out elegantly into 4 structural streams */
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5 items-start text-left">
      
      {/* Left Navigation Streams Column Module (Takes 1 structural column block on large desktop monitors) */}
      <div className="w-full lg:col-span-1 lg:sticky lg:top-[80px] z-30">
        <NotificationsLeftSidebar onFilterChange={handleFilterChangeFromSidebar} />
      </div>

      {/* Right Stream Segment Details Card Layout container (Occupies 3 columns out of 4) */}
      <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] p-4 md:p-5 space-y-4 w-full min-w-0">
        
        {/* Header Context Action */}
        <div className="flex items-center space-x-3 pb-2 border-b border-zinc-50 dark:border-zinc-800/60">
          <button onClick={onBack} className="p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Following & Followers</h3>
            <p className="text-[11px] text-zinc-400 font-medium">Manage your community updates</p>
          </div>
        </div>

        {/* Premium Pill Tabs Segment */}
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

        {/* List Renderer Container */}
        <div className="space-y-3 pt-2">
          {currentList.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-400">Empty active segment context.</div>
          ) : (
            currentList.map(person => (
              <div key={person.id} className="flex items-center justify-between p-3 border border-zinc-50 dark:border-zinc-800/50 rounded-xl hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#FAF6F0] dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 text-xs shrink-0">
                    {person.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{person.name}</h4>
                    <p className="text-[11px] text-zinc-400 font-medium truncate">{person.role}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleFollow(person.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center space-x-1 border ${
                    person.isFollowing 
                      ? 'border-zinc-200 text-zinc-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50/30' 
                      : 'border-[#A26227]/30 text-[#A26227] hover:bg-[#A26227] hover:text-white'
                  }`}
                >
                  {person.isFollowing ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Following</span>
                    </>
                  ) : (
                    <span>Follow back</span>
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