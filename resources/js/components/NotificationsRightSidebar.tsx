import React, { useState } from 'react';
import { TrendingUp, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react';

export const NotificationsRightSidebar: React.FC = () => {
  // 1. Interactive States
  const [followedTopics, setFollowedTopics] = useState<number[]>([]);
  const [showAllTopics, setShowAllTopics] = useState(false);

  const initialTopics = [
    { id: 1, tag: 'Artificial Intelligence', stats: '12.4K predictions' },
    { id: 2, tag: 'Future of Work', stats: '8.7K predictions' },
    { id: 3, tag: 'Climate Change', stats: '6.1K predictions' },
    { id: 4, tag: 'Crypto & Web3', stats: '5.9K predictions' },
    { id: 5, tag: 'Macroeconomics', stats: '4.2K predictions' },
  ];

  const trendingPredictions = [
    { id: 101, text: 'AI will replace 50% of jobs by 2035', velocity: '3.2K volume' },
    { id: 102, text: 'Bitcoin will reach $150K by 2025', velocity: '2.8K volume' },
    { id: 103, text: 'India will be a $10T economy by 2032', velocity: '2.1K volume' }
  ];

  // --- INTERACTION HANDLERS ---

  // Follow/Unfollow Topic Toggle Action
  const handleToggleFollowTopic = (id: number) => {
    setFollowedTopics((prev) =>
      prev.includes(id) ? prev.filter((topicId) => topicId !== id) : [...prev, id]
    );
  };

  // Click handler for routing to a specific prediction stream
  const handlePredictionClick = (text: string) => {
    alert(`Navigating to target discussion stream:\n"${text}"`);
  };

  // Determine visibly rendered recommended items array slice size
  const displayedTopics = showAllTopics ? initialTopics : initialTopics.slice(0, 3);

  return (
    <div className="space-y-4 w-full">
      
      {/* Recommended Topics Subsection Module */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm transition-all duration-200">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200">Recommended for you</h4>
          <button 
            onClick={() => setShowAllTopics(!showAllTopics)}
            className="text-[10px] font-bold text-amber-700 hover:text-amber-800 dark:text-amber-500 flex items-center gap-0.5 transition-colors"
          >
            {showAllTopics ? (
              <>Show less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>View all <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        </div>
        
        <div className="space-y-3">
          {displayedTopics.map((topic) => {
            const isFollowed = followedTopics.includes(topic.id);
            return (
              <div key={topic.id} className="flex items-center justify-between text-xs animate-in fade-in duration-150">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-zinc-100">#{topic.tag}</p>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500">{topic.stats}</p>
                </div>
                <button 
                  onClick={() => handleToggleFollowTopic(topic.id)}
                  className={`p-1.5 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                    isFollowed
                      ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400'
                      : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
                  }`}
                  title={isFollowed ? "Following" : "Follow"}
                >
                  {isFollowed ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Predictions Module */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
        <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200 mb-3 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
          Trending predictions
        </h4>
        <div className="space-y-3.5">
          {trendingPredictions.map((trend) => (
            <div 
              key={trend.id} 
              onClick={() => handlePredictionClick(trend.text)}
              className="text-xs group cursor-pointer p-1 -m-1 rounded-lg hover:bg-gray-50/50 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <p className="font-medium text-gray-800 dark:text-zinc-200 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors line-clamp-1">
                {trend.text}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium mt-0.5">{trend.velocity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modern App Footer Links */}
      <div className="px-2 text-left">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
          <button onClick={() => alert('About Modal Trigger')} className="hover:underline hover:text-amber-700">About</button>
          <span>•</span>
          <button onClick={() => alert('Privacy & Terms Modal Trigger')} className="hover:underline hover:text-amber-700">Privacy & Terms</button>
          <span>•</span>
          <button onClick={() => alert('Help Center Redirect')} className="hover:underline hover:text-amber-700">Help Center</button>
        </div>
        <p className="text-[10px] text-gray-400 dark:text-zinc-600 mt-2 font-medium">
          PredictionHub © 2026
        </p>
      </div>

    </div>
  );
};