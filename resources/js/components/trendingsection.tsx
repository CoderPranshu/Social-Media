   import React from 'react'
   import { 
  TrendingUp, ChevronRight
} from 'lucide-react';
 const trendingPredictions = [
    { id: 1, image: "https://i.pinimg.com/736x/07/50/9d/07509df8088b05c1734b0ecc66352a34.jpg", title: "AI will replace 50% of jobs by 2035", author: "Ananya Patel", time: "2h ago", views: "3.2K", tag: "AI", sparkline: [30, 45, 35, 60, 40, 70, 90] },
    { id: 2, image: "https://i.pinimg.com/736x/07/50/9d/07509df8088b05c1734b0ecc66352a34.jpg", title: "Bitcoin will reach $150K by 2025", author: "Rohan Sen", time: "3h ago", views: "2.8K", tag: "Crypto", sparkline: [20, 40, 25, 50, 45, 65, 85] },
    { id: 3, image: "https://i.pinimg.com/736x/07/50/9d/07509df8088b05c1734b0ecc66352a34.jpg", title: "India will be $10T economy by 2032", author: "Neha Gupta", time: "5h ago", views: "2.1K", tag: "Economy", sparkline: [40, 35, 55, 48, 70, 68, 80] },
    { id: 4, image: "https://i.pinimg.com/736x/07/50/9d/07509df8088b05c1734b0ecc66352a34.jpg", title: "Space tourism will be $10B industry by 2035", author: "Diksha Bhatt", time: "6h ago", views: "1.8K", tag: "Space", sparkline: [10, 20, 15, 40, 30, 45, 60] }
  ];

  const topTopics = [
    { id: 1, name: "Artificial Intelligence", count: "12.4K predictions", image: "https://i.pinimg.com/736x/07/50/9d/07509df8088b05c1734b0ecc66352a34.jpg", borderColor: "group-hover:border-purple-500" },
    { id: 2, name: "Future of Work", count: "8.7K predictions", image: "https://i.pinimg.com/736x/07/50/9d/07509df8088b05c1734b0ecc66352a34.jpg", borderColor: "group-hover:border-emerald-500" },
    { id: 3, name: "Climate Change", count: "6.1K predictions", image: "https://i.pinimg.com/736x/07/50/9d/07509df8088b05c1734b0ecc66352a34.jpg", borderColor: "group-hover:border-teal-500" },
    { id: 4, name: "Tech Innovations", count: "4.3K predictions", image: "https://i.pinimg.com/736x/07/50/9d/07509df8088b05c1734b0ecc66352a34.jpg", borderColor: "group-hover:border-blue-500" },
    { id: 5, name: "Global Economy", count: "3.2K predictions", image: "https://i.pinimg.com/736x/07/50/9d/07509df8088b05c1734b0ecc66352a34.jpg", borderColor: "group-hover:border-amber-500" }
  ];

  
  const trendingsection = () => {
    return (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          
          {/* Column A: Trending Predictions */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-4 sm:p-5 rounded-2xl space-y-5 shadow-sm lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white tracking-tight">Trending Trends & Predictions</h3>
                <p className="text-xs text-zinc-400 font-medium">Hot conversations gaining algorithmic momentum</p>
              </div>
              <a href="#" className="text-xs sm:text-sm font-bold text-[#A26227] hover:underline flex items-center space-x-0.5 self-start sm:self-auto">
                <span>View all insights</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
            
            <div className="space-y-2">
              {trendingPredictions.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl border border-transparent hover:bg-[#FAF6F0]/40 dark:hover:bg-zinc-800/30 hover:border-zinc-200/40 dark:hover:border-zinc-700/40 transition-all duration-300 cursor-pointer group gap-3"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800 shadow-sm bg-zinc-50 dark:bg-zinc-800">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="inline-block px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-[#A26227] dark:text-amber-500">
                        #{item.tag}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-snug group-hover:text-[#A26227] dark:group-hover:text-orange-400 transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-zinc-400 font-medium truncate">
                        {item.author} <span className="mx-0.5 opacity-40">•</span> {item.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-100 dark:border-zinc-800">
                    <div className="w-16 h-6 flex items-end space-x-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      {item.sparkline.map((val, idx) => (
                        <div key={idx} className="w-1 bg-gradient-to-t from-orange-400 to-amber-500 rounded-t-sm" style={{ height: `${val}%` }} />
                      ))}
                    </div>
                    <div className="flex items-center space-x-1 bg-zinc-50 dark:bg-zinc-800/80 px-2 py-1 rounded-lg text-xs text-zinc-500 font-bold border border-zinc-100 dark:border-zinc-700/60">
                      <TrendingUp className="w-3 h-3 text-orange-500" />
                      <span>{item.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Top Recommended Topics */}
          <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-6 border border-gray-100 dark:border-zinc-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                Recommended Topics
              </h2>
              <button className="text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-500 transition-colors">
                See all
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              {topTopics.map((topic) => (
                <div key={topic.id} className="group flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50/80 dark:hover:bg-zinc-800/50 transition-all duration-300 cursor-pointer gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-transparent ${topic.borderColor} shadow-sm transition-all duration-300 flex-shrink-0`}>
                      <img src={topic.image} alt={topic.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-zinc-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate">
                        {topic.name}
                      </span>
                      <span className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 truncate">
                        {topic.count}
                      </span>
                    </div>
                  </div>

                  <button className="px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/40 rounded-xl transition-all active:scale-95 shrink-0">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
    )
  }
  
  export default trendingsection