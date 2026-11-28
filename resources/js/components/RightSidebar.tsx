import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Heart, Trophy, Star } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface RecentPost {
  id: number;
  post_content: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  image: string | null;
}

interface TrendingHashtag {
  name: string;
  posts_count: number;
}

interface SuggestedUser {
  id: number;
  name: string;
  username: string | null;
  avatar_path: string | null;
  followers_count: number;
  posts_count: number;
}

interface TopPrediction {
  id: number;
  post_content: string | null;
  likes_count: number;
  created_at: string;
  thumbnail: string | null;
  author: {
    id: number;
    name: string;
    username: string | null;
    avatar_path: string | null;
  } | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Avatar({ url, name, size = 8 }: { url?: string | null; name: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const cls = `w-${size} h-${size} rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-[#b46d23] to-[#804c15] shrink-0 overflow-hidden border border-zinc-100 dark:border-zinc-700`;
  return url ? (
    <img src={url} alt={name} className={`w-${size} h-${size} rounded-full object-cover shrink-0 border border-zinc-100 dark:border-zinc-700`} />
  ) : (
    <div className={cls}>{initials}</div>
  );
}

// ── Top Prediction Card ───────────────────────────────────────────────────────

function TopPredictionCard({
  prediction,
  label,
  icon,
  emptyMessage,
}: {
  prediction: TopPrediction | null;
  label: string;
  icon: React.ReactNode;
  emptyMessage: string;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-[#b46d23]">{icon}</span>
        <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{label}</h3>
      </div>

      {prediction ? (
        <Link
          href={`/posts/${prediction.id}`}
          className="block no-underline group"
        >
          <div className="flex gap-3 items-start">
            {/* Thumbnail or emoji placeholder */}
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center">
              {prediction.thumbnail ? (
                <img
                  src={prediction.thumbnail}
                  alt="Prediction"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
              ) : (
                <span className="text-xl">🔮</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Post content preview */}
              <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-[#b46d23] transition-colors leading-snug line-clamp-2">
                {prediction.post_content
                  ? prediction.post_content.replace(/#\w+/g, '').trim() || 'Prediction post'
                  : '📷 Photo prediction'}
              </p>

              {/* Author row */}
              {prediction.author && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Avatar url={prediction.author.avatar_path} name={prediction.author.name} size={5} />
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium truncate">
                    {prediction.author.name}
                    {prediction.author.username && (
                      <span className="text-zinc-400"> @{prediction.author.username}</span>
                    )}
                  </span>
                </div>
              )}

              {/* Likes badge + time */}
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#b46d23]">
                  <Heart className="w-3 h-3 fill-[#b46d23]" />
                  <span>{prediction.likes_count} like{prediction.likes_count !== 1 ? 's' : ''}</span>
                </div>
                <span className="text-[11px] text-zinc-400">{timeAgo(prediction.created_at)}</span>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className="py-4 text-center">
          <p className="text-[12px] text-zinc-400 font-medium leading-relaxed">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}

// ── Main Sidebar ──────────────────────────────────────────────────────────────

export const RightSidebar: React.FC = () => {
  const { props } = usePage<any>();

  const recentPosts: RecentPost[]           = (props as any).recentPosts       ?? [];
  const trendingHashtags: TrendingHashtag[] = (props as any).trendingHashtags  ?? [];
  const suggestedUsers: SuggestedUser[]     = (props as any).suggestedUsers    ?? [];
  const topOfDay: TopPrediction | null      = (props as any).topOfDay          ?? null;
  const topOfMonth: TopPrediction | null    = (props as any).topOfMonth        ?? null;

  return (
    <div className="space-y-4 text-left">

      {/* ── Block 0: Top Prediction of the Day ───────────────────────────── */}
      <TopPredictionCard
        prediction={topOfDay}
        label="Top Prediction of the Day"
        icon={<Trophy className="w-4 h-4" />}
        emptyMessage="No predictions posted today yet. Be the first to share one!"
      />

      {/* ── Block 0b: Top Prediction of the Month ────────────────────────── */}
      <TopPredictionCard
        prediction={topOfMonth}
        label="Top Prediction of the Month"
        icon={<Star className="w-4 h-4" />}
        emptyMessage={`No predictions posted in ${new Date().toLocaleString('default', { month: 'long' })} yet.`}
      />

      {/* ── Block 1: Recent Posts ─────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Recent Posts</h3>
            <Link href="/allpost" className="text-[13px] font-bold text-[#b46d23] hover:underline no-underline">
              View all
            </Link>
          </div>

          <div className="space-y-3.5">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="flex items-start justify-between gap-3 group cursor-pointer no-underline block"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-[#b46d23] transition-colors leading-snug line-clamp-2">
                    {post.post_content
                      ? post.post_content.replace(/#\w+/g, '').trim() || 'Post'
                      : '📷 Photo post'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                    {timeAgo(post.created_at)} &bull; {post.likes_count} like{post.likes_count !== 1 ? 's' : ''} &bull; {post.comments_count} comment{post.comments_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                  {post.image ? (
                    <img src={post.image} alt="Post thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition duration-200" />
                  ) : (
                    <span className="text-lg">📝</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty recent posts state */}
      {recentPosts.length === 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm text-center space-y-2">
          <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tight text-left">Recent Posts</p>
          <p className="text-[12px] text-zinc-400 py-3">You haven't posted yet.</p>
          <Link href="/dashboard" className="inline-block text-[12px] font-bold text-[#b46d23] hover:underline no-underline">
            Create your first post →
          </Link>
        </div>
      )}

      {/* ── Block 2: Suggested Users ──────────────────────────────────────── */}
      {suggestedUsers.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tight">People You May Know</h3>
          <div className="space-y-3">
            {suggestedUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <Link href={u.username ? `/users/${u.username}` : `/profile`} className="shrink-0 no-underline">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    {u.avatar_path ? (
                      <img src={u.avatar_path} alt={u.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{u.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 truncate leading-tight">{u.name}</p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {u.username ? `@${u.username}` : ''}{u.username ? ' · ' : ''}{u.followers_count} follower{u.followers_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <Link
                  href={`/users/${u.id}/follow`}
                  method="post"
                  as="button"
                  className="shrink-0 px-3 py-1 text-[11px] font-extrabold rounded-full bg-[#b46d23] hover:bg-[#9a5c1a] text-white border-none cursor-pointer transition-colors no-underline"
                >
                  Follow
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Block 3: Trending Hashtags ────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Trending Topics</h3>

        {trendingHashtags.length > 0 ? (
          <div className="space-y-3">
            {trendingHashtags.map((topic) => (
              <Link
                key={topic.name}
                href={`/feed/hashtag/${topic.name}`}
                className="flex items-center justify-between group cursor-pointer py-0.5 no-underline block"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-[#b46d23] font-bold text-xs group-hover:translate-x-0.5 transition-transform">#</span>
                  <span className="text-[13px] font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition">
                    {topic.name}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium">
                  {topic.posts_count} post{topic.posts_count !== 1 ? 's' : ''}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-zinc-400 py-2">No trending topics yet. Start using #hashtags in your posts!</p>
        )}

        {/* Footer links */}
        <div className="pt-2 border-t border-zinc-50 dark:border-zinc-800/50 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-zinc-400 font-medium">
          <Link href="/privacy" className="hover:underline text-zinc-400 no-underline">Privacy</Link>
          <Link href="/privacy" className="hover:underline text-zinc-400 no-underline">Terms</Link>
          <Link href="/help" className="hover:underline text-zinc-400 no-underline">Help</Link>
          <span className="ml-auto font-normal">© 2026 PredictionHub</span>
        </div>
      </div>

    </div>
  );
};
