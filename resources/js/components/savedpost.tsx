import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Search, Bookmark, Loader2 } from 'lucide-react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from '../components/LeftSidebar'; 
import { RightSidebar } from './RightSidebar';
import { PostCard } from './PostCard';
import { apiGet } from '@/lib/api';
import type { SharedData } from '@/types';
import type { FeedPost } from '@/types/post';

export default function SavedPost() {
  const { auth } = usePage<SharedData>().props;
  const currentUser = auth.user;

  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts]             = useState<FeedPost[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<{ data: FeedPost[] }>('/bookmarks');
      setPosts(res.data);
    } catch {
      setError('Unable to load saved posts. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = (postId: number, bookmarked: boolean) => {
    if (!bookmarked) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  const handleLikeToggle = (postId: number, liked: boolean, count: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_liked: liked, likes_count: count } : p));
  };

  const handleDelete = (postId: number) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handlePostUpdated = (updated: FeedPost) => {
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const filteredPosts = posts.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const content = (item.post_content ?? '').toLowerCase();
    const author = (item.author?.name ?? '').toLowerCase();
    return content.includes(q) || author.includes(q);
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 font-sans antialiased text-zinc-800 dark:text-zinc-200 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
        
        {/* BODY ARCHITECTURE */}
        <main className="max-w-8xl mx-auto px-0 sm:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 md:gap-6 items-start">
          
          {/* 1. LEFT SIDEBAR (MOBILE/TABLET ONLY) */}
          <div className="block lg:hidden w-full md:col-span-1 shrink-0 px-4 sm:px-0">
            <LeftSidebar />
          </div>

          {/* 2. MANAGE BOOKMARKS FILTERS PANEL */}
          <section className="col-span-1 md:col-span-1 lg:col-span-3 space-y-4 px-4 sm:px-0">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-xs text-left">
              <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2 mb-3">
                <Bookmark className="w-4 h-4 text-[#A26227]" /> Saved Items
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                Posts and predictions you have bookmarked for later reading.
              </p>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-500">Total Bookmarked</span>
                <span className="text-[#A26227] font-black">{posts.length}</span>
              </div>
            </div>
          </section>

          {/* 3. MIDDLE COLUMN: MAIN SAVED ITEMS ACTIVITY FEED */}
          <section className="col-span-1 md:col-span-3 lg:col-span-6 space-y-4 px-4 sm:px-0 min-w-0">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div>
                <h1 className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#A26227] fill-current" /> Saved Posts
                </h1>
              </div>
              <div className="relative w-full sm:min-w-[200px] sm:w-auto">
                <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Filter saved posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-800/80 border border-transparent dark:border-zinc-700/40 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-zinc-200 dark:focus:border-zinc-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#A26227]" />
                  <span>Loading saved posts…</span>
                </div>
              ) : error ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-8 text-center text-red-500 text-xs">
                  {error}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-400 dark:text-zinc-500 font-medium text-xs">
                  {searchQuery ? 'No saved items match your filter.' : 'You haven\'t bookmarked any posts yet.'}
                </div>
              ) : (
                filteredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onLikeToggle={handleLikeToggle}
                    onBookmarkToggle={handleBookmarkToggle}
                    onDelete={handleDelete}
                    onPostUpdated={handlePostUpdated}
                    showAuthor={true}
                  />
                ))
              )}
            </div>
          </section>

          {/* 4. RIGHT COLUMN: RECOMMENDED WIDGET */}
          <section className="hidden lg:block lg:col-span-3 space-y-4 text-left">
            <RightSidebar />
          </section>
          
        </main>
      </div>
    </SidebarProvider>
  );
}
