import React, { useState } from 'react';
import { Bell, MessageSquare, Heart, UserPlus, Share2, TrendingUp, Settings, ShieldAlert } from 'lucide-react';

interface NotificationsLeftSidebarProps {
  // Callback to inform the parent layout about the active section/filter change
  onFilterChange?: (filterLabel: string) => void;
}

export const NotificationsLeftSidebar: React.FC<NotificationsLeftSidebarProps> = ({ onFilterChange }) => {
  // Manage state for the active item
  const [activeFilter, setActiveFilter] = useState('All notifications');

  // Updated menu schema containing semantic target href structures
  const menuItems = [
    { icon: <Bell className="w-4 h-4" />, label: 'All notifications', count: 12, href: '/notification' },
    // { icon: <MessageSquare className="w-4 h-4" />, label: 'Comments', count: 5, href: '/notification' },
    // { icon: <Heart className="w-4 h-4" />, label: 'Likes', count: 18, href: '/notification'},
    { icon: <UserPlus className="w-4 h-4" />, label: 'Follows', count: 7, href: '/followersfollowing' },
  ];

  const handleFilterClick = (label: string) => {
    setActiveFilter(label);
    if (onFilterChange) {
      onFilterChange(label);
    }
  };

  return (
    /* Container is now fully visible across all viewpoints */
    <div className="space-y-4 w-full text-left">
      
      {/* Responsive Stack Container:
        - Mobile: flex-row layout with horizontal tracking scrollbars (`overflow-x-auto sb-hide`)
        - Desktop (md+): Reverts perfectly into a traditional block system
      */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-2 shadow-sm">
        <h3 className="text-xs font-bold text-gray-800 dark:text-zinc-200 px-3 pt-3 pb-2 uppercase tracking-wider hidden md:block">
          Notifications
        </h3>
        
        {/* Navigation Wrapper uses flex-nowrap + overflow-x-auto on mobile screens */}
        <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar space-x-1.5 md:space-x-0 md:space-y-0.5 scroll-smooth px-1 py-1 md:p-0">
          {menuItems.map((item, idx) => {
            const isCurrentActive = activeFilter === item.label;
            
            return (
              <a
                key={idx}
                href={item.href}
                onClick={() => handleFilterClick(item.label)}
                className={`flex items-center justify-between px-3.5 py-2 md:py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group shrink-0
                  ${isCurrentActive 
                    ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 font-semibold' 
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                  }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={isCurrentActive ? 'text-amber-600' : 'text-gray-400 group-hover:text-amber-600 transition-colors'}>
                    {item.icon}
                  </span>
                  <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
                {item.count && (
                  <span className={`text-[10px] px-1.5 py-0.5 ml-2 rounded-md font-bold transition-colors duration-150
                    ${isCurrentActive ? 'bg-amber-200/60 dark:bg-amber-900/40' : 'bg-gray-100 dark:bg-zinc-800'}`}>
                    {item.count}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Action dividing line hidden on small device viewports */}
        <div className="border-t border-gray-100 dark:border-zinc-800 my-2 hidden md:block" />

        {/* Premium Action Settings Link elements hidden on mobile rows to keep viewports compact */}
        <a 
          href="/notificationsetting"
          className="hidden md:flex w-full items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-left transition-all duration-150 group"
        >
          <Settings className="w-4 h-4 text-gray-400 group-hover:text-[#b46d23] transition-colors" />
          <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">Notification settings</span>
        </a>
      </div>

      {/* Top Contributors Subsection Widget (Kept on desktop monitors exclusively) */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hidden lg:block">
        <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200 mb-3">Top contributors this week</h4>
        <div className="space-y-3">
          {[
            { name: 'Arjun Mehta', desc: '24 predictions', score: 120, badge: '👑' },
            { name: 'Neha Gupta', desc: '18 predictions', score: 98, badge: '🥈' },
            { name: 'Rohan Sen', desc: '15 predictions', score: 76, badge: '🥉' }
          ].map((user, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between text-xs cursor-pointer hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 p-1 rounded-xl transition-all"
            >
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-[10px] dark:text-zinc-200">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-zinc-200 group-hover:text-amber-600">{user.name}</p>
                  <p className="text-[10px] text-gray-400">{user.desc}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 font-medium text-gray-500">
                <span>{user.score}</span>
                <span>{user.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};