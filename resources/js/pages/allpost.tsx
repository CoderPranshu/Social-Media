import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from '@/components/navbar';
import { PostCard } from '@/components/PostCard';
import { PostComposer } from '@/components/PostComposer';
import { RightSidebar } from '@/components/RightSidebar';
import { apiGet } from '@/lib/api';
import type { SharedData } from '@/types';
import type { FeedPost, PaginatedFeed } from '@/types/post';
import { Search, TrendingUp, Sparkles, MessageSquare, Loader2, Filter } from 'lucide-react';

export default function AllPostsPage() {
  const { auth } = usePage<SharedData>().props;
  const currentUser = auth.user;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'latest' | 'popular' | 'most_discussed'>('latest');
  const [posts, setPosts]             = useState<FeedPost[]>([]);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (pageNum: number, filterType: string, q: string) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const url = `/feed?page=${pageNum}&filter=${filterType}&q=${encodeURIComponent(q)}&per_page=12`;
      const res = await apiGet<PaginatedFeed>(url);

      setPosts(prev => pageNum === 1 ? res.data : [...prev, ...res.data]);
      setHasMore(res.has_more);
      setPage(pageNum);
    } catch {
      setError('Could not load posts. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Debounced search / filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts(1, activeFilter, searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [activeFilter, searchQuery, fetchPosts]);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchPosts(page + 1, activeFilter, searchQuery);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, activeFilter, searchQuery, fetchPosts]);

  const handleLikeToggle = (postId: number, liked: boolean, count: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_liked: liked, likes_count: count } : p));
  };

  const handleBookmarkToggle = (postId: number, bm: boolean) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_bookmarked: bm } : p));
  };

  const handleDelete = (postId: number) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handlePostCreated = (newPost: FeedPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdated = (updated: FeedPost) => {
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 font-sans antialiased text-zinc-800 dark:text-zinc-200 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
        <Navbar />

        <main className="max-w-8xl mx-auto px-4 sm:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 md:gap-6 items-start">
          
          {/* Mobile Left Sidebar */}
          <div className="block lg:hidden w-full md:col-span-1 shrink-0">
            <LeftSidebar />
          </div>

          {/* Desktop Left Sidebar */}
          <section className="hidden lg:block lg:col-span-3 space-y-4 text-left">
            <LeftSidebar />
          </section>

          {/* Middle Feed Column */}
          <section className="col-span-1 md:col-span-3 lg:col-span-6 space-y-4 min-w-0 text-left">
            
            {/* Search & Filter Header Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-2xl shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search posts, #hashtags, @users..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-800/80 border border-transparent dark:border-zinc-700/40 text-xs font-semibold text-zinc-800 dark:text-zinc-200 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-600 transition-colors"
                  />
                </div>
                
                {currentUser && (
                  <PostComposer
                    currentUser={currentUser}
                    onPostCreated={handlePostCreated}
                    triggerLabel="📝 Create a post"
                  />
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                <button
                  onClick={() => setActiveFilter('latest')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    activeFilter === 'latest'
                      ? 'bg-[#b46d23] text-white border-[#b46d23]'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-100 dark:border-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Latest
                </button>
                <button
                  onClick={() => setActiveFilter('popular')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    activeFilter === 'popular'
                      ? 'bg-[#b46d23] text-white border-[#b46d23]'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-100 dark:border-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Popular
                </button>
                <button
                  onClick={() => setActiveFilter('most_discussed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    activeFilter === 'most_discussed'
                      ? 'bg-[#b46d23] text-white border-[#b46d23]'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-100 dark:border-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Most Discussed
                </button>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#b46d23]" />
                  <span>Loading posts…</span>
                </div>
              ) : error ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-8 text-center text-red-500 text-xs">
                  {error}
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-400 dark:text-zinc-500 font-medium text-xs">
                  {searchQuery ? `No posts matched "${searchQuery}"` : 'No posts found in this feed.'}
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

              {/* Infinite scroll sentinel */}
              <div ref={loaderRef} className="py-2">
                {loadingMore && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-[#b46d23]" />
                  </div>
                )}
                {!hasMore && posts.length > 0 && (
                  <p className="text-center text-xs text-zinc-400 font-medium py-4">
                    You've reached the end of the posts.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Desktop Right Sidebar */}
          <section className="hidden lg:block lg:col-span-3 space-y-4 text-left">
            <RightSidebar />
          </section>

        </main>
      </div>
    </SidebarProvider>
  );
}
