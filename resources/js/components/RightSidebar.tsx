import React from 'react';
// 1. Import Link from Inertia to intercept routing behavior
import { Link } from '@inertiajs/react';

export const RightSidebar: React.FC = () => {
  const latestPredictions = [
    { id: 1, title: 'Bitcoin will reach $150K by the end of 2025', meta: '3h ago • 2.1k predicted', img: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=80&auto=format&fit=crop&q=60', to: '/dashboard' },
    { id: 2, title: 'Humanoid robots will enter homes by 2030', meta: '5h ago • 1.8k predicted', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=80&auto=format&fit=crop&q=60', to: '/dashboard' },
    { id: 3, title: 'Space tourism will become a $10B industry by 2035', meta: '12h ago • 1.2k predicted', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=80&auto=format&fit=crop&q=60', to: '/dashboard' },
    { id: 4, title: 'Electric vehicles will dominate the market by 2030', meta: '1d ago • 980 predicted', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=80&auto=format&fit=crop&q=60', to: '/dashboard' }
  ];

  const trendingTopics = [
    { id: 1, name: 'Artificial Intelligence', count: '12.4k predictions', to: '/popularfeed' },
    { id: 2, name: 'Economy', count: '8.7k predictions', to: '/popularfeed' },
    { id: 3, name: 'Technology', count: '6.1k predictions', to: '/popularfeed' },
    { id: 4, name: 'Future of Work', count: '4.3k predictions', to: '/popularfeed' },
    { id: 5, name: 'Climate Change', count: '3.2k predictions', to: '/popularfeed' }
  ];

  return (
    <div className="space-y-4 text-left">
      
      {/* Block 1: Latest Predictions */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Latest Predictions</h3>
          {/* Converted to Inertia Link */}
          <Link href="/dashboard" className="text-[14px] font-bold text-[#b46d23] hover:underline no-underline">View all</Link>
        </div>

        <div className="space-y-3.5">
          {latestPredictions.map((pred) => (
            /* Converted outer item container to an Inertia Link block to navigate seamlessly when clicked */
            <Link key={pred.id} href={pred.to} className="flex items-start justify-between gap-3 group cursor-pointer no-underline block">
              <div className="flex-1 min-w-0">
                <h4 className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-[#b46d23] transition-colors leading-snug line-clamp-2">
                  {pred.title}
                </h4>
                <p className="text-[13px] text-zinc-400 font-medium mt-0.5">{pred.meta}</p>
              </div>
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100 dark:border-zinc-800">
                <img src={pred.img} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition duration-200" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Block 2: Trending Topics */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Trending Topics</h3>
        
        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            /* Converted each item block to an Inertia Link */
            <Link key={topic.id} href={topic.to} className="flex items-center justify-between group cursor-pointer py-0.5 no-underline block">
              <div className="flex items-center space-x-2">
                <span className="text-[#b46d23] font-bold text-xs group-hover:translate-x-0.5 transition-transform">↗</span>
                <span className="text-[14px] font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition">
                  {topic.name}
                </span>
              </div>
              <span className="text-[12px] text-zinc-400 font-medium">{topic.count}</span>
            </Link>
          ))}
        </div>

        {/* Small Legal Footer Links Tray */}
        <div className="pt-2 border-t border-zinc-50 dark:border-zinc-800/50 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-zinc-400 font-medium">
  
          <Link href="/privacy" className="hover:underline text-zinc-400 no-underline">Privacy</Link>
          <Link href="/privacy" className="hover:underline text-zinc-400 no-underline">Terms</Link>
          <Link href="/help" className="hover:underline text-zinc-400 no-underline">Help</Link>
          <span className="ml-auto font-normal">© 2026 PredictionHub</span>
        </div>
      </div>

    </div>
  );
};