import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
  MapPin, Calendar, Grid3x3, Heart, MessageSquare,
  UserCheck, UserPlus, Mail, Edit2, Images,
  Lock, Globe, Users, ArrowLeft,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { apiPost } from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────────────────

interface PublicProfile {
  id: number;
  name: string;
  username: string | null;
  bio: string | null;
  location: string | null;
  avatar_path: string | null;
  cover_path: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  likes_received: number;
  joined_at: string | null;
  is_following: boolean;
  is_own_profile: boolean;
}

interface GridPost {
  id: number;
  post_content: string | null;
  visibility: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  images: string[];
  thumbnail: string | null;
  image_count: number;
  hashtags: string[];
  is_liked: boolean;
  is_bookmarked: boolean;
}

interface PageProps {
  profile: PublicProfile;
  posts: GridPost[];
  postsNextPage: string | null;
  likedPosts: GridPost[];
}

type ActiveTab = 'posts' | 'liked';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

// ── Avatar Component ──────────────────────────────────────────────────────────

function Avatar({ url, name, size = 112 }: { url?: string | null; name: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const style = { width: size, height: size };
  return url ? (
    <img
      src={url}
      alt={name}
      style={style}
      className="rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-md"
    />
  ) : (
    <div
      style={style}
      className="rounded-full border-4 border-white dark:border-zinc-900 shadow-md bg-gradient-to-br from-[#b46d23] to-[#804c15] flex items-center justify-center text-white font-black text-2xl"
    >
      {initials}
    </div>
  );
}

// ── Post Grid Card ────────────────────────────────────────────────────────────

function PostGridCard({ post, onClick }: { post: GridPost; onClick: (p: GridPost) => void }) {
  return (
    <div
      className="relative aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden cursor-pointer group rounded-sm"
      onClick={() => onClick(post)}
    >
      {post.thumbnail ? (
        <img
          src={post.thumbnail}
          alt="Post"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 p-3">
          <span className="text-2xl mb-1">📝</span>
          <p className="text-[10px] text-zinc-500 text-center line-clamp-3 font-medium">
            {post.post_content?.slice(0, 60) ?? ''}
          </p>
        </div>
      )}

      {/* Multi-image indicator */}
      {post.image_count > 1 && (
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-md p-1">
          <Images className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      {/* Visibility badge */}
      {post.visibility === 'only_me' && (
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-md p-1">
          <Lock className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-5">
        <div className="flex items-center gap-1.5 text-white font-bold text-sm">
          <Heart className="w-5 h-5 fill-white" />
          <span>{formatCount(post.likes_count)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-white font-bold text-sm">
          <MessageSquare className="w-5 h-5 fill-white/80" />
          <span>{formatCount(post.comments_count)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Post Detail Modal ─────────────────────────────────────────────────────────

function PostModal({ post, profile, onClose }: { post: GridPost; profile: PublicProfile; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Image panel */}
        {post.images.length > 0 && (
          <div className="relative bg-black flex items-center justify-center md:w-1/2 min-h-[260px]">
            <img
              src={post.images[imgIndex]}
              alt="Post"
              className="max-h-[60vh] md:max-h-full object-contain w-full"
            />
            {post.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex(i => Math.max(0, i - 1))}
                  disabled={imgIndex === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setImgIndex(i => Math.min(post.images.length - 1, i + 1))}
                  disabled={imgIndex === post.images.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {post.images.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/40'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Info panel */}
        <div className="flex-1 flex flex-col p-5 overflow-y-auto">
          {/* Author row */}
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <Avatar url={profile.avatar_path} name={profile.name} size={36} />
            <div>
              <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">{profile.name}</p>
              {profile.username && (
                <p className="text-xs text-zinc-400">@{profile.username}</p>
              )}
            </div>
            <span className="ml-auto text-xs text-zinc-400">{timeAgo(post.created_at)}</span>
          </div>

          {/* Content */}
          <div className="flex-1 py-4">
            {post.post_content && (
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{post.post_content}</p>
            )}
            {post.hashtags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.hashtags.map(tag => (
                  <Link
                    key={tag}
                    href={`/feed/hashtag/${tag}`}
                    className="text-[#b46d23] text-xs font-bold hover:underline no-underline"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
              <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="font-bold">{formatCount(post.likes_count)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
              <MessageSquare className="w-4 h-4" />
              <span className="font-bold">{formatCount(post.comments_count)}</span>
            </div>
            <Link
              href={`/posts/${post.id}`}
              className="ml-auto text-xs font-bold text-[#b46d23] hover:underline no-underline"
            >
              View full post →
            </Link>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function UserProfilePage() {
  const { profile, posts, likedPosts } = usePage<{ props: PageProps } & any>().props as unknown as PageProps;

  const [activeTab, setActiveTab] = useState<ActiveTab>('posts');
  const [localProfile, setLocalProfile] = useState(profile);
  const [followLoading, setFollowLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<GridPost | null>(null);

  const displayPosts = activeTab === 'posts' ? posts : likedPosts;

  const handleFollowToggle = async () => {
    if (followLoading) return;
    setFollowLoading(true);
    const wasFollowing = localProfile.is_following;

    // Optimistic update
    setLocalProfile(p => ({
      ...p,
      is_following: !wasFollowing,
      followers_count: wasFollowing ? p.followers_count - 1 : p.followers_count + 1,
    }));

    try {
      const res = await apiPost<{ is_following: boolean; followers_count: number }>(
        `/users/${localProfile.id}/follow`
      );
      setLocalProfile(p => ({
        ...p,
        is_following: res.is_following,
        followers_count: res.followers_count,
      }));
    } catch {
      // Roll back on failure
      setLocalProfile(p => ({
        ...p,
        is_following: wasFollowing,
        followers_count: wasFollowing ? p.followers_count + 1 : p.followers_count - 1,
      }));
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <AppLayout breadcrumbs={[]}>
      <Head title={`${localProfile.name} • PredictionHub`} />
      <Navbar />

      <div className="min-h-screen dark:bg-zinc-950 pb-20">
        <div className="max-w-[935px] mx-auto px-4 pt-4">

          {/* Back link */}
          <div className="mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </div>

          {/* ── Cover Image ────────────────────────────────────────────────── */}
          <div
            className="w-full h-40 md:h-52 rounded-2xl overflow-hidden bg-gradient-to-r from-zinc-800 via-zinc-700 to-stone-800 relative mb-0"
            style={localProfile.cover_path ? { backgroundImage: `url(${localProfile.cover_path})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {!localProfile.cover_path && (
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
            )}
          </div>

          {/* ── Profile Header ─────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm -mt-6 pt-0 pb-6 px-6 md:px-8 relative">

            {/* Avatar + actions row */}
            <div className="flex items-end justify-between pt-0 -mt-12 mb-4">
              {/* Avatar */}
              <div className="relative z-10 mt-2">
                <Avatar url={localProfile.avatar_path} name={localProfile.name} size={96} />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-2">
                {localProfile.is_own_profile ? (
                  <Link
                    href="/profile"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl transition no-underline border border-zinc-200 dark:border-zinc-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Profile
                  </Link>
                ) : (
                  <>
                    {/* Message button (coming soon) */}
                    <button
                      title="Direct messaging coming soon"
                      disabled
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-not-allowed opacity-60"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Message
                    </button>

                    {/* Follow / Following button */}
                    <button
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`flex items-center gap-1.5 px-5 py-2 text-xs font-extrabold rounded-xl transition active:scale-95 disabled:opacity-70 shadow-sm ${
                        localProfile.is_following
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                          : 'bg-[#b46d23] hover:bg-[#9a5c1a] text-white border-transparent'
                      }`}
                    >
                      {localProfile.is_following ? (
                        <><UserCheck className="w-3.5 h-3.5" /> Following</>
                      ) : (
                        <><UserPlus className="w-3.5 h-3.5" /> Follow</>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Name + username + bio */}
            <div>
              <h1 className="text-xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight">
                {localProfile.name}
              </h1>
              {localProfile.username && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
                  @{localProfile.username}
                </p>
              )}

              {localProfile.bio && (
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-3 leading-relaxed max-w-lg">
                  {localProfile.bio}
                </p>
              )}

              {/* Meta row: location + joined */}
              <div className="flex flex-wrap items-center gap-4 mt-3">
                {localProfile.location && (
                  <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#b46d23]" />
                    {localProfile.location}
                  </div>
                )}
                {localProfile.joined_at && (
                  <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#b46d23]" />
                    Joined {localProfile.joined_at}
                  </div>
                )}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <StatItem value={localProfile.posts_count} label="Posts" />
                <Link
                  href={`/users/${localProfile.id}/followers`}
                  className="no-underline group"
                >
                  <StatItem value={localProfile.followers_count} label="Followers" />
                </Link>
                <Link
                  href={`/users/${localProfile.id}/following`}
                  className="no-underline group"
                >
                  <StatItem value={localProfile.following_count} label="Following" />
                </Link>
                {localProfile.is_own_profile && (
                  <StatItem value={localProfile.likes_received} label="Likes Received" />
                )}
              </div>
            </div>
          </div>

          {/* ── Tabs ───────────────────────────────────────────────────────── */}
          <div className="mt-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-0">
            <TabButton
              active={activeTab === 'posts'}
              icon={<Grid3x3 className="w-4 h-4" />}
              label="Posts"
              count={localProfile.posts_count}
              onClick={() => setActiveTab('posts')}
            />
            {localProfile.is_own_profile && (
              <TabButton
                active={activeTab === 'liked'}
                icon={<Heart className="w-4 h-4" />}
                label="Liked"
                count={likedPosts.length}
                onClick={() => setActiveTab('liked')}
              />
            )}
          </div>

          {/* ── Post Grid ──────────────────────────────────────────────────── */}
          <div className="mt-4">
            {displayPosts.length === 0 ? (
              <EmptyState tab={activeTab} isOwn={localProfile.is_own_profile} />
            ) : (
              <div className="grid grid-cols-3 gap-0.5 md:gap-1">
                {displayPosts.map(post => (
                  <PostGridCard
                    key={post.id}
                    post={post}
                    onClick={setSelectedPost}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          profile={localProfile}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </AppLayout>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center group-hover:opacity-80 transition">
      <p className="text-base font-black text-zinc-900 dark:text-zinc-100">{formatCount(value)}</p>
      <p className="text-xs text-zinc-500 font-medium mt-0.5">{label}</p>
    </div>
  );
}

function TabButton({
  active, icon, label, count, onClick
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all -mb-px ${
        active
          ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
          : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
      }`}
    >
      {icon}
      {label}
      {count > 0 && (
        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
          active ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
        }`}>
          {formatCount(count)}
        </span>
      )}
    </button>
  );
}

function EmptyState({ tab, isOwn }: { tab: ActiveTab; isOwn: boolean }) {
  if (tab === 'liked') {
    return (
      <div className="text-center py-16">
        <Heart className="w-12 h-12 text-zinc-200 dark:text-zinc-700 mx-auto mb-3" />
        <p className="text-sm font-bold text-zinc-500">No liked posts yet</p>
        <p className="text-xs text-zinc-400 mt-1">Posts you like will appear here.</p>
      </div>
    );
  }
  return (
    <div className="text-center py-16">
      <Grid3x3 className="w-12 h-12 text-zinc-200 dark:text-zinc-700 mx-auto mb-3" />
      <p className="text-sm font-bold text-zinc-500">
        {isOwn ? 'No posts yet' : 'No posts to show'}
      </p>
      <p className="text-xs text-zinc-400 mt-1">
        {isOwn
          ? 'Share your first post from the home feed.'
          : 'This user has no public posts.'}
      </p>
      {isOwn && (
        <Link
          href="/dashboard"
          className="inline-block mt-4 px-4 py-2 bg-[#b46d23] text-white text-xs font-bold rounded-xl hover:bg-[#9a5c1a] transition no-underline"
        >
          Go to Feed →
        </Link>
      )}
    </div>
  );
}

