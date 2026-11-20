import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import type { FeedPost, PaginatedFeed } from '@/types/post';
import { PostCard } from './PostCard';
import { PostComposer } from './PostComposer';
import { apiGet } from '@/lib/api';

interface AuthUser {
  id: number;
  name: string;
  username?: string | null;
  avatar_path?: string | null;
}

function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 animate-pulse">
      <div className="flex gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-4/6" />
      </div>
      <div className="h-48 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
    </div>
  );
}

export const MiddleFeed: React.FC = () => {
  const { auth } = usePage<SharedData>().props;
  const currentUser = auth.user as AuthUser;

  const [posts, setPosts]           = useState<FeedPost[]>([]);
  const [page, setPage]             = useState(1);
  const [hasMore, setHasMore]       = useState(true);
  const [isLoading, setIsLoading]   = useState(false);
  const [isInitial, setIsInitial]   = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // ── Fetch a page of posts ─────────────────────────────────────────────────
  const fetchPage = useCallback(async (pageNum: number) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiGet<PaginatedFeed>(`/feed?page=${pageNum}&per_page=10`);
      setPosts(prev => pageNum === 1 ? res.data : [...prev, ...res.data]);
      setHasMore(res.has_more);
      setPage(pageNum);
    } catch {
      setError('Could not load feed. Please refresh.');
    } finally {
      setIsLoading(false);
      setIsInitial(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPage(1);
  }, []);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting && hasMore && !isLoading) fetchPage(page + 1); },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, page, fetchPage]);

  // ── State updaters passed into PostCard ───────────────────────────────────
  const handleLikeToggle = (postId: number, liked: boolean, count: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_liked: liked, likes_count: count } : p));
  };

  const handleBookmarkToggle = (postId: number, bm: boolean) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_bookmarked: bm } : p));
  };

  const handleDelete = (postId: number) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handlePostCreated = (post: FeedPost) => {
    setPosts(prev => [post, ...prev]);
  };

  return (
    <div className="space-y-4 text-left w-full relative">

      {/* ── Composer trigger card ── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(180,109,35,0.03)] space-y-4">
        <div className="flex items-center gap-3">
          {/* Auth user avatar */}
          {currentUser.avatar_path ? (
            <img
              src={currentUser.avatar_path}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-zinc-100 dark:border-zinc-800 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-600 shrink-0">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {/* The PostComposer renders a styled trigger button inline here */}
            <PostComposer
              currentUser={currentUser}
              onPostCreated={handlePostCreated}
              triggerLabel="What's on your mind?"
            />
          </div>
        </div>
      </div>

      {/* ── Feed ── */}
      {isInitial ? (
        [1, 2, 3].map(n => <PostSkeleton key={n} />)
      ) : error ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-10 text-center">
          <p className="text-sm text-red-500 font-medium">{error}</p>
          <button
            onClick={() => fetchPage(1)}
            className="mt-4 text-xs font-bold text-[#b46d23] hover:underline"
          >
            Try again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-10 text-center">
          <p className="text-2xl mb-2">🌱</p>
          <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">The feed is empty</p>
          <p className="text-xs text-zinc-400 mt-1">Be the first to post something!</p>
        </div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLikeToggle={handleLikeToggle}
              onBookmarkToggle={handleBookmarkToggle}
              onDelete={handleDelete}
              showAuthor={true}
            />
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={loaderRef} className="py-2">
            {isLoading && !isInitial && (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-[#b46d23] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!hasMore && posts.length > 0 && (
              <p className="text-center text-xs text-zinc-400 font-medium py-4">
                You've reached the end of the feed.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
