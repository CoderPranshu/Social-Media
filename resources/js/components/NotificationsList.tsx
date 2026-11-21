import React, { useState, useEffect, useCallback } from 'react';
import { 
  MoreHorizontal, MessageSquare, Heart, UserPlus, Share2, 
  ArrowUpRight, Check, Trash2, Eye, AtSign, Loader2 
} from 'lucide-react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';

interface NotificationItem {
  id: string;
  type: string;
  name: string;
  username: string | null;
  avatar_path: string | null;
  action_text: string;
  highlight: string | null;
  sub_quote: string | null;
  post_id: number | null;
  comment_id: number | null;
  is_unread: boolean;
  created_at: string;
  time_ago: string;
}

interface NotificationsListProps {
  searchQuery: string;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({ searchQuery }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const filters = ['All', 'Unread', 'Likes', 'Comments', 'Follows', 'Mentions'];

  const getApiFilter = (f: string): string => {
    switch (f.toLowerCase()) {
      case 'unread': return 'unread';
      case 'likes': return 'like';
      case 'comments': return 'comment';
      case 'follows': return 'follow';
      case 'mentions': return 'mention';
      default: return 'all';
    }
  };

  const fetchNotifications = useCallback(async (pageNum: number, currentFilter: string, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const apiFilter = getApiFilter(currentFilter);
      const res = await apiGet<{
        data: NotificationItem[];
        current_page: number;
        last_page: number;
        total: number;
      }>(`/api/notifications?page=${pageNum}&filter=${apiFilter}&per_page=20`);

      setNotifications(prev => append ? [...prev, ...res.data] : res.data);
      setHasMore(res.current_page < res.last_page);
      setPage(res.current_page);
    } catch {
      if (!append) setNotifications([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1, activeFilter);
  }, [activeFilter, fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await apiPost('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_unread: false })));
    } catch { /* silent */ }
  };

  const toggleReadStatus = async (id: string, isCurrentlyUnread: boolean) => {
    if (isCurrentlyUnread) {
      try {
        await apiPost(`/api/notifications/${id}/read`);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_unread: false } : n));
      } catch { /* silent */ }
    }
    setActiveMenuId(null);
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiDelete(`/api/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch { /* silent */ }
    setActiveMenuId(null);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchNotifications(page + 1, activeFilter, true);
    }
  };

  const filteredNotifications = notifications.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(q) || 
           (item.highlight && item.highlight.toLowerCase().includes(q)) ||
           (item.sub_quote && item.sub_quote.toLowerCase().includes(q));
  });

  const renderIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
      case 'reply':
        return <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-blue-500" />;
      case 'mention':
        return <AtSign className="w-3.5 h-3.5 text-[#b46d23]" />;
      default:
        return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-3 w-full text-left">
      {/* Category Pills */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-2.5 flex gap-1.5 overflow-x-auto scrollbar-none shadow-sm">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => { setActiveFilter(filter); setPage(1); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
              activeFilter === filter 
                ? 'bg-[#b46d23] text-white dark:bg-amber-600' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Main Notification Feed */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-zinc-800">
        <div className="p-4 flex justify-between items-center bg-white dark:bg-zinc-900">
          <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">Recent Updates</span>
          <button 
            onClick={handleMarkAllRead}
            className="text-[11px] font-semibold text-[#b46d23] hover:text-[#965a1b] dark:text-amber-500 hover:underline transition-all"
          >
            Mark all as read
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#b46d23]" />
            <span>Loading notifications…</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">
            No notifications found.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 flex items-start space-x-3 transition-colors relative hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 ${
                notif.is_unread ? 'bg-amber-50/20 dark:bg-amber-950/5' : ''
              }`}
            >
              {/* Unread dot */}
              <div 
                className="w-1.5 h-1.5 rounded-full bg-[#b46d23] mt-4 shrink-0 transition-all duration-200" 
                style={{ opacity: notif.is_unread ? 1 : 0 }} 
              />
              
              {/* Avatar */}
              {notif.avatar_path ? (
                <img src={notif.avatar_path} alt={notif.name} className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-zinc-800 text-[#b46d23] dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  {notif.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 text-xs text-gray-600 dark:text-zinc-300 leading-normal pr-4">
                <p>
                  <span className="font-bold text-gray-900 dark:text-zinc-100">{notif.name} </span>
                  {notif.actionText} {notif.highlight && <span className="font-medium text-gray-900 dark:text-zinc-100">{notif.highlight}</span>}
                </p>
                
                {notif.sub_quote && (
                  <div className="mt-2 p-2.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-100 dark:border-zinc-800 text-[11px] text-gray-500 dark:text-zinc-400 italic">
                    "{notif.sub_quote}"
                  </div>
                )}
                
                <span className="block text-[10px] text-gray-400 mt-1.5">{notif.time_ago}</span>
              </div>

              {/* Action Controls */}
              <div className="flex items-center space-x-1 shrink-0 self-start relative">
                <span className="p-1">{renderIcon(notif.type)}</span>
                
                <button 
                  onClick={() => setActiveMenuId(activeMenuId === notif.id ? null : notif.id)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {activeMenuId === notif.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                    
                    <div className="absolute right-0 top-7 w-40 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl py-1 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                      <button 
                        onClick={() => toggleReadStatus(notif.id, notif.is_unread)}
                        className="w-full text-left px-3 py-2 text-[11px] font-medium text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/60 flex items-center space-x-2"
                      >
                        {notif.is_unread ? <Check className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{notif.is_unread ? 'Mark as read' : 'Already read'}</span>
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

      {/* Infinite Load More */}
      {hasMore && (
        <button 
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 py-3 rounded-2xl text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/80 transition-all text-center shadow-sm disabled:opacity-50"
        >
          {loadingMore ? 'Loading more…' : 'Load more notifications'}
        </button>
      )}
    </div>
  );
};
