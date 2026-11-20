import React, { useState } from 'react';
import { MoreHorizontal, MessageSquare, Heart, UserPlus, Share2, ArrowUpRight, Check, Trash2, Eye } from 'lucide-react';
import Footer from './footer';

interface NotificationsListProps {
  searchQuery: string;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({ searchQuery }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  
  const filters = ['All', 'Comments', 'Likes', 'Follows', 'Shares', 'Predictions'];

  // 1. Turned static data into full state so we can mutate read/unread and deleted states dynamically
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: 'Ananya Patel',
      type: 'Likes',
      avatarText: 'AP',
      avatarBg: 'bg-amber-100 text-amber-800',
      actionText: 'liked your prediction',
      highlightText: '“AI will become the most powerful productivity lever by 2030.”',
      time: '2m ago',
      isUnread: true,
      icon: <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
    },
    {
      id: 2,
      name: 'Rohan Sen',
      type: 'Comments',
      avatarText: 'RS',
      avatarBg: 'bg-emerald-100 text-emerald-800',
      actionText: 'commented on your prediction',
      highlightText: '“Global recession before mid-2026 is unlikely.”',
      subQuote: 'Great point! I think inflation trends will play a key role here.',
      time: '15m ago',
      isUnread: true,
      icon: <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
    },
    {
      id: 3,
      name: 'Neha Gupta',
      type: 'Follows',
      avatarText: 'NG',
      avatarBg: 'bg-purple-100 text-purple-800',
      actionText: 'started following you.',
      time: '1h ago',
      isUnread: false,
      icon: <UserPlus className="w-3.5 h-3.5 text-blue-500" />
    },
    {
      id: 4,
      name: 'PredictionHub Engine',
      type: 'Predictions',
      avatarText: 'PH',
      avatarBg: 'bg-indigo-100 text-indigo-800',
      actionText: 'Your prediction “Bitcoin will reach $150K by the end of 2025” received',
      highlightText: '25 new upvotes.',
      time: '2h ago',
      isUnread: false,
      icon: <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
    }
  ]);

  // --- BUTTON INTERACTION HANDLERS ---

  // Handler: Mark all notifications as Read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  // Handler: Toggle single notification Read/Unread state from dropdown
  const toggleReadStatus = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: !n.isUnread } : n));
    setActiveMenuId(null); // Close dropdown menu
  };

  // Handler: Delete single notification card
  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setActiveMenuId(null); // Close dropdown menu
  };

  // Handler: Infinite Scroll Mock Trigger
  const handleLoadMore = () => {
    const freshMockItems = [
      {
        id: Date.now(),
        name: 'Gaurav Sharma',
        type: 'Shares',
        avatarText: 'GS',
        avatarBg: 'bg-blue-100 text-blue-800',
        actionText: 'shared your recent dashboard design milestone.',
        time: '5h ago',
        isUnread: true,
        icon: <Share2 className="w-3.5 h-3.5 text-blue-500" />
      }
    ];
    setNotifications(prev => [...prev, ...freshMockItems]);
  };

  // Filtering computational logic block
  const filteredNotifications = notifications.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.type === activeFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.highlightText && item.highlightText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    
    <div className="space-y-3 w-full">
      
      {/* Category Pills Slider Row */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-2.5 flex gap-1.5 overflow-x-auto scrollbar-none shadow-sm">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap
              ${activeFilter === filter 
                ? 'bg-amber-900 text-white dark:bg-amber-600' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Main Core Feed */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-zinc-800">
        <div className="p-4 flex justify-between items-center bg-white dark:bg-zinc-900">
          <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">Recent Updates</span>
          <button 
            onClick={handleMarkAllRead}
            className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-500 hover:underline transition-all"
          >
            Mark all as read
          </button>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">No notifications found here.</div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 flex items-start space-x-3 transition-colors relative hover:bg-gray-50/60 dark:hover:bg-zinc-800/40
                ${notif.isUnread ? 'bg-amber-50/20 dark:bg-amber-950/5' : ''}`}
            >
              {/* Unread indicator dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-4 shrink-0 transition-all duration-200" 
                   style={{ opacity: notif.isUnread ? 1 : 0 }} />
              
              {/* Initials Avatar Box */}
              <div className={`w-10 h-10 rounded-full ${notif.avatarBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                {notif.avatarText}
              </div>

              {/* Main Content Body */}
              <div className="flex-1 text-xs text-gray-600 dark:text-zinc-300 leading-normal pr-4">
                <p>
                  <span className="font-bold text-gray-900 dark:text-zinc-100">{notif.name} </span>
                  {notif.actionText} <span className="font-medium text-gray-900 dark:text-zinc-100">{notif.highlightText}</span>
                </p>
                
                {notif.subQuote && (
                  <div className="mt-2 p-2.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-100 dark:border-zinc-800 text-[11px] text-gray-500 dark:text-zinc-400 italic">
                    "{notif.subQuote}"
                  </div>
                )}
                
                <span className="block text-[10px] text-gray-400 mt-1.5">{notif.time}</span>
              </div>

              {/* Action Controls Side Indicators & Context Dropdowns */}
              <div className="flex items-center space-x-1 shrink-0 self-start relative">
                <span className="p-1">{notif.icon}</span>
                
                <button 
                  onClick={() => setActiveMenuId(activeMenuId === notif.id ? null : notif.id)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {/* Micro Action Dropdown Menu Container */}
                {activeMenuId === notif.id && (
                  <>
                    {/* Click backdrop area to dismiss the menu overlay stack */}
                    <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                    
                    <div className="absolute right-0 top-7 w-40 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl py-1 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                      <button 
                        onClick={() => toggleReadStatus(notif.id)}
                        className="w-full text-left px-3 py-2 text-[11px] font-medium text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/60 flex items-center space-x-2"
                      >
                        {notif.isUnread ? <Check className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{notif.isUnread ? 'Mark as read' : 'Mark as unread'}</span>
                      </button>
                      <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="w-full text-left px-3 py-2 text-[11px] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center space-x-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete notification</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Infinite Load More Activator Action Row */}
      <button 
        onClick={handleLoadMore}
        className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 py-3 rounded-2xl text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/80 transition-all text-center shadow-sm"
      >
        Load more notifications
      </button>
     

    </div>
    
   
  );
};