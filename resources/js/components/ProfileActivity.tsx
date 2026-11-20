import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import type { FeedPost } from '@/types/post';
import { PostComposer } from './PostComposer';
import { PostCard } from './PostCard';
import { apiGet } from '@/lib/api';

type Tab = 'Posts' | 'Bookmarks';

interface AuthUser {
  id: number;
  name: string;
  username?: string | null;
  avatar_path?: string | null;
}

export const ProfileActivity: React.FC = () => {
  const { auth } = usePage<SharedData>().props;
  const currentUser = auth.user as AuthUser;

  const [activeTab, setActiveTab] = useState<Tab>('Posts');
  const [posts, setPosts]         = useState<FeedPost[]>([]);
  const [bookmarks, setBookmarks] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const tabs: Tab[] = ['Posts', 'Bookmarks'];

  // ── Load my posts ──────────────────────────────────────────────────────────
  const loadMyPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiGet<FeedPost[]>('/my-posts');
      setPosts(data);
    } catch {
      setError('Unable to load your posts. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Load bookmarks when switching to Bookmarks tab ─────────────────────────
  const loadBookmarks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiGet<{ data: FeedPost[] }>('/bookmarks');
      setBookmarks(res.data);
    } catch {
      setError('Unable to load bookmarks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMyPosts();
  }, []);

  useEffect(() => {
    if (activeTab === 'Bookmarks' && bookmarks.length === 0) {
      loadBookmarks();
    }
  }, [activeTab]);

  // ── Optimistic like/bookmark updates ──────────────────────────────────────
  const handleLikeToggle = (postId: number, liked: boolean, count: number) => {
    const update = (list: FeedPost[]) =>
      list.map(p => p.id === postId ? { ...p, is_liked: liked, likes_count: count } : p);
    setPosts(update);
    setBookmarks(update);
  };

  const handleBookmarkToggle = (postId: number, bm: boolean) => {
    const update = (list: FeedPost[]) =>
      list.map(p => p.id === postId ? { ...p, is_bookmarked: bm } : p);
    setPosts(update);
    setBookmarks(bm ? bookmarks : bookmarks.filter(p => p.id !== postId));
  };

  const handleDelete = (postId: number) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setBookmarks(prev => prev.filter(p => p.id !== postId));
  };

  const handlePostCreated = (post: FeedPost) => {
    setPosts(prev => [post, ...prev]);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    sliderRef.current?.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  const visiblePosts = activeTab === 'Bookmarks' ? bookmarks : posts;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.01)] p-5 relative text-left">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-black text-zinc-950 dark:text-zinc-100 tracking-tight">Activity</h2>
          <span className="text-[11px] text-zinc-400 font-bold">Your posts and saves</span>
        </div>
        <PostComposer
          currentUser={currentUser}
          onPostCreated={handlePostCreated}
          triggerLabel="📝 Create a post"
        />
      </div>

      {/* Tab switcher */}
      <div className="flex flex-wrap gap-2 mt-4 select-none">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border active:scale-95 ${
              activeTab === tab
                ? 'bg-[#b46d23] text-white border-[#b46d23] shadow-sm'
                : 'bg-zinc-50 text-zinc-400 border-zinc-100/80 hover:bg-zinc-100/50 dark:bg-zinc-800/50 dark:border-zinc-800 dark:text-zinc-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Horizontal carousel */}
      <div className="relative mt-5 group">
        <button
          onClick={() => handleScroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-full p-2 shadow-md z-20 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none active:scale-90"
        >
          <ChevronLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-300 stroke-[2.5]" />
        </button>

        <div
          ref={sliderRef}
          className="flex space-x-4 overflow-x-auto pb-3 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {isLoading ? (
            /* Skeleton cards */
            [1, 2, 3].map(n => (
              <div key={n} className="w-[290px] sm:w-[335px] shrink-0 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 animate-pulse snap-start">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded mb-3 w-3/4" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mb-2 w-full" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mb-2 w-5/6" />
                <div className="h-24 bg-zinc-200 dark:bg-zinc-700 rounded mt-4" />
              </div>
            ))
          ) : error ? (
            <div className="text-xs text-red-500 p-8 text-center w-full">{error}</div>
          ) : visiblePosts.length > 0 ? (
            visiblePosts.map(post => (
              <div key={post.id} className="w-[290px] sm:w-[335px] shrink-0 snap-start">
                <PostCard
                  post={post}
                  currentUser={currentUser}
                  onLikeToggle={handleLikeToggle}
                  onBookmarkToggle={handleBookmarkToggle}
                  onDelete={handleDelete}
                  showAuthor={false}
                />
              </div>
            ))
          ) : (
            <div className="text-xs text-zinc-400 p-8 text-center w-full font-medium">
              {activeTab === 'Bookmarks' ? 'No saved posts yet.' : 'You haven\'t posted anything yet.'}
            </div>
          )}
        </div>

        <button
          onClick={() => handleScroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-full p-2 shadow-md z-20 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none active:scale-90"
        >
          <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-300 stroke-[2.5]" />
        </button>
      </div>

      {/* Footer link */}
      <div className="w-full mt-2 pt-3 border-t border-zinc-100/60 dark:border-zinc-800 flex items-center justify-center">
        <a href="/allpost">
          <button className="flex items-center space-x-1.5 text-xs font-black text-[#b46d23] hover:text-[#965a1c] transition-colors py-1 px-4 rounded-xl hover:bg-amber-50/30 active:scale-95">
            <span>Show all {activeTab.toLowerCase()}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </a>
      </div>
    </div>
  );
};
