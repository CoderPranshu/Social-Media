import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { LeftSidebar } from '../components/LeftSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RightSidebar } from './RightSidebar';
import { PostCard } from './PostCard';
import { apiGet } from '@/lib/api';
import type { SharedData } from '@/types';
import type { FeedPost, PaginatedFeed } from '@/types/post';
import { TrendingUp, ThumbsUp, MessageSquare, Loader2 } from 'lucide-react';

type FilterType = 'trending' | 'most-liked' | 'most-discussed';

export const PopularFeed: React.FC = () => {
  const { auth } = usePage<SharedData>().props;
  const currentUser = auth.user;

  const [filter, setFilter]       = useState<FilterType>('trending');
  const [posts, setPosts]         = useState<FeedPost[]>([]);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const [loading, setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const getApiFilter = (f: FilterType) => {
    if (f === 'most-discussed') return 'most_discussed';
    return 'popular';
  };

  const fetchPopular = useCallback(async (pageNum: number, currentFilter: FilterType) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const apiFilter = getApiFilter(currentFilter);
      const res = await apiGet<PaginatedFeed>(`/feed?filter=${apiFilter}&page=${pageNum}&per_page=10`);
      setPosts(prev => pageNum === 1 ? res.data : [...prev, ...res.data]);
      setHasMore(res.has_more);
      setPage(pageNum);
    } catch {
      setError('Could not load popular feed. Please refresh.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPopular(1, filter);
  }, [filter, fetchPopular]);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchPopular(page + 1, filter);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, filter, fetchPopular]);

  const handleLikeToggle = (postId: number, liked: boolean, count: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_liked: liked, likes_count: count } : p));
  };

  const handleBookmarkToggle = (postId: number, bm: boolean) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_bookmarked: bm } : p));
  };

  const handleDelete = (postId: number) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handlePostUpdated = (updated: FeedPost) => {
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 font-sans antialiased text-zinc-800 dark:text-zinc-200 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
        <main className="max-w-8xl mx-auto px-0 sm:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 md:gap-6 items-start">
          
          {/* Mobile sidebar */}
          <div className="block lg:hidden w-full md:col-span-1 shrink-0 px-4 sm:px-0">
            <LeftSidebar />
          </div>

          {/* Left navigation on desktop */}
          <section className="hidden lg:block lg:col-span-3 space-y-4 text-left">
            <LeftSidebar />
          </section>

          {/* Middle column: Popular Feed */}
          <section className="col-span-1 md:col-span-3 lg:col-span-6 space-y-4 px-4 sm:px-0 min-w-0 text-left">
            
            {/* Filter tabs banner */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#A26227]" /> Popular Predictions
                </h1>
                <span className="text-xs text-zinc-400 font-medium">Ranked by community engagement</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('trending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    filter === 'trending'
                      ? 'bg-[#A26227] text-white border-[#A26227]'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-100 dark:border-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Trending
                </button>
                <button
                  onClick={() => setFilter('most-liked')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    filter === 'most-liked'
                      ? 'bg-[#A26227] text-white border-[#A26227]'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-100 dark:border-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Most Liked
                </button>
                <button
                  onClick={() => setFilter('most-discussed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    filter === 'most-discussed'
                      ? 'bg-[#A26227] text-white border-[#A26227]'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-100 dark:border-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Most Discussed
                </button>
              </div>
            </div>

            {/* Posts list */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#A26227]" />
                  <span>Loading popular feed…</span>
                </div>
              ) : error ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-8 text-center text-red-500 text-xs">
                  {error}
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-400 dark:text-zinc-500 font-medium text-xs">
                  No popular posts recorded yet.
                </div>
              ) : (
                posts.map(post => (
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

              {/* Sentinel */}
              <div ref={loaderRef} className="py-2">
                {loadingMore && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-[#A26227]" />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right sidebar */}
          <section className="hidden lg:block lg:col-span-3 space-y-4 text-left">
            <RightSidebar />
          </section>

        </main>
      </div>
    </SidebarProvider>
  );
};
