import React, { useState } from 'react';
import {
  ThumbsUp, MessageSquare, Repeat2, Bookmark,
  MoreHorizontal, Trash2, Edit2, Globe, Users, Lock,
  Send, X, CornerDownRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FeedPost, FeedComment, PostAuthor } from '@/types/post';
import { apiPost, apiDelete, apiGet } from '@/lib/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function VisibilityBadge({ v }: { v: string }) {
  if (v === 'followers') return <><Users className="w-3 h-3 inline" /> Followers</>;
  if (v === 'only_me')   return <><Lock  className="w-3 h-3 inline" /> Only me</>;
  return <><Globe className="w-3 h-3 inline" /> Public</>;
}

function Avatar({ url, name, size = 10 }: { url?: string | null; name?: string | null; size?: number }) {
  const initials = (name ?? '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const cls = `w-${size} h-${size} rounded-full object-cover bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-600 shrink-0`;
  return url
    ? <img src={url} alt={name ?? ''} className={`w-${size} h-${size} rounded-full object-cover shrink-0 border border-zinc-100 dark:border-zinc-800`} />
    : <div className={cls}>{initials}</div>;
}

// ─── ImageGallery ─────────────────────────────────────────────────────────────

function ImageGallery({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  if (!images.length) return null;

  if (images.length === 1) {
    return (
      <div className="w-full border-t border-b border-zinc-100 dark:border-zinc-800/60 overflow-hidden max-h-[500px] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <img src={images[0]} alt="Post" className="w-full object-cover select-none" />
      </div>
    );
  }

  return (
    <div className="relative w-full border-t border-b border-zinc-100 dark:border-zinc-800/60 overflow-hidden max-h-[500px] bg-zinc-50 dark:bg-zinc-950 group">
      <img src={images[current]} alt={`Image ${current + 1}`} className="w-full object-cover select-none" />
      {/* Nav arrows */}
      <button
        onClick={() => setCurrent(p => Math.max(0, p - 1))}
        disabled={current === 0}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-900/60 hover:bg-zinc-900/80 text-white p-1.5 rounded-full disabled:opacity-20 opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => setCurrent(p => Math.min(images.length - 1, p + 1))}
        disabled={current === images.length - 1}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-900/60 hover:bg-zinc-900/80 text-white p-1.5 rounded-full disabled:opacity-20 opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-3' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── CommentItem ─────────────────────────────────────────────────────────────

function CommentItem({
  comment, currentUserId, onDelete, onReply
}: {
  comment: FeedComment;
  currentUserId: number;
  onDelete: (id: number) => void;
  onReply: (parentId: number, name: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2 group/comment">
        <Avatar url={comment.author?.avatar_path} name={comment.author?.name} size={8} />
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-3 py-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
              {comment.author?.name ?? 'Unknown'}
            </span>
            <span className="text-[10px] text-zinc-400">{timeAgo(comment.created_at)}</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">{comment.comment}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <button
              onClick={() => onReply(comment.id, comment.author?.name ?? '')}
              className="text-[10px] font-bold text-zinc-400 hover:text-[#b46d23] transition"
            >
              Reply
            </button>
            {comment.author?.id === currentUserId && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-[10px] font-bold text-zinc-400 hover:text-red-500 transition opacity-0 group-hover/comment:opacity-100"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="ml-10 space-y-2">
          {comment.replies.map(reply => (
            <div key={reply.id} className="flex items-start gap-2 group/reply">
              <CornerDownRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700 mt-2 shrink-0" />
              <Avatar url={reply.author?.avatar_path} name={reply.author?.name} size={7} />
              <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl px-3 py-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-zinc-900 dark:text-zinc-100">
                    {reply.author?.name ?? 'Unknown'}
                  </span>
                  <span className="text-[10px] text-zinc-400">{timeAgo(reply.created_at)}</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">{reply.comment}</p>
                {reply.author?.id === currentUserId && (
                  <button
                    onClick={() => onDelete(reply.id)}
                    className="text-[10px] font-bold text-zinc-400 hover:text-red-500 mt-1 transition opacity-0 group-hover/reply:opacity-100"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PostCard ─────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: FeedPost;
  currentUser: { id: number; name: string; username?: string | null; avatar_path?: string | null };
  onLikeToggle: (postId: number, liked: boolean, count: number) => void;
  onBookmarkToggle: (postId: number, bookmarked: boolean) => void;
  onDelete?: (postId: number) => void;
  onEdit?: (post: FeedPost) => void;
  showAuthor?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post, currentUser, onLikeToggle, onBookmarkToggle, onDelete, onEdit, showAuthor = true
}) => {
  const [liking, setLiking] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments]         = useState<FeedComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentText, setCommentText]   = useState('');
  const [replyTo, setReplyTo]           = useState<{ id: number; name: string } | null>(null);
  const [submitting, setSubmitting]     = useState(false);
  const [showMenu, setShowMenu]         = useState(false);

  const isOwner = post.author?.id === currentUser.id;

  // ── Like toggle ─────────────────────────────────────────────────
  const handleLike = async () => {
    if (liking) return;
    // Optimistic update
    onLikeToggle(
      post.id,
      !post.is_liked,
      post.is_liked ? post.likes_count - 1 : post.likes_count + 1
    );
    setLiking(true);
    try {
      const res = await apiPost<{ liked: boolean; likes_count: number }>(`/posts/${post.id}/like`);
      onLikeToggle(post.id, res.liked, res.likes_count);
    } catch {
      // Rollback optimistic update
      onLikeToggle(post.id, post.is_liked, post.likes_count);
    } finally {
      setLiking(false);
    }
  };

  // ── Bookmark toggle ──────────────────────────────────────────────
  const handleBookmark = async () => {
    if (bookmarking) return;
    onBookmarkToggle(post.id, !post.is_bookmarked);
    setBookmarking(true);
    try {
      const res = await apiPost<{ bookmarked: boolean }>(`/posts/${post.id}/bookmark`);
      onBookmarkToggle(post.id, res.bookmarked);
    } catch {
      onBookmarkToggle(post.id, post.is_bookmarked);
    } finally {
      setBookmarking(false);
    }
  };

  // ── Load comments ────────────────────────────────────────────────
  const handleToggleComments = async () => {
    if (!showComments && !commentsLoaded) {
      try {
        const data = await apiGet<FeedComment[]>(`/posts/${post.id}/comments`);
        setComments(data);
        setCommentsLoaded(true);
      } catch { /* silent */ }
    }
    setShowComments(p => !p);
  };

  // ── Submit comment ───────────────────────────────────────────────
  const handleSubmitComment = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await apiPost<{ comment: FeedComment }>(`/posts/${post.id}/comments`, {
        comment:   commentText.trim(),
        parent_id: replyTo?.id ?? null,
      });
      if (replyTo) {
        setComments(prev => prev.map(c =>
          c.id === replyTo.id
            ? { ...c, replies: [...c.replies, res.comment] }
            : c
        ));
      } else {
        setComments(prev => [res.comment, ...prev]);
      }
      setCommentText('');
      setReplyTo(null);
    } catch { /* silent */ } finally {
      setSubmitting(false);
    }
  };

  // ── Delete comment ───────────────────────────────────────────────
  const handleDeleteComment = async (commentId: number) => {
    try {
      await apiDelete(`/posts/${post.id}/comments/${commentId}`);
      setComments(prev => {
        // Remove top-level or nested reply
        const removeFromList = (list: FeedComment[]): FeedComment[] =>
          list
            .filter(c => c.id !== commentId)
            .map(c => ({ ...c, replies: c.replies.filter(r => r.id !== commentId) }));
        return removeFromList(prev);
      });
    } catch { /* silent */ }
  };

  // ── Share ────────────────────────────────────────────────────────
  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Check out this post', url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    } catch { /* user cancelled */ }
  };

  // ── Delete post ──────────────────────────────────────────────────
  const handleDeletePost = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await apiDelete(`/posts/${post.id}`);
      onDelete?.(post.id);
    } catch { alert('Could not delete post.'); }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.01)] overflow-hidden transition-all duration-300 hover:border-zinc-200/60 dark:hover:border-zinc-700/50">

      {/* ── Header ── */}
      {showAuthor && (
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <Avatar url={post.author?.avatar_path} name={post.author?.name} size={11} />
            <div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <h4 className="text-[15px] font-extrabold text-zinc-900 dark:text-zinc-100 hover:text-[#b46d23] transition cursor-pointer">
                  {post.author?.name ?? 'Unknown'}
                </h4>
                {post.author?.username && (
                  <span className="text-[10px] text-zinc-400 font-medium">@{post.author.username}</span>
                )}
                <span className="text-[10px] text-zinc-400">·</span>
                <span className="text-[10px] text-zinc-400">{timeAgo(post.created_at)}</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                <VisibilityBadge v={post.visibility} />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 relative">
            <button
              onClick={handleBookmark}
              className="p-1.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
            >
              <Bookmark className={`w-4 h-4 transition-colors ${post.is_bookmarked ? 'text-[#b46d23] fill-[#b46d23]' : 'text-zinc-400'}`} />
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => setShowMenu(p => !p)}
                  className="p-1.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                >
                  <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                </button>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden"
                    >
                      {onEdit && (
                        <button
                          onClick={() => { setShowMenu(false); onEdit(post); }}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/40 flex items-center gap-2 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit post
                        </button>
                      )}
                      <button
                        onClick={() => { setShowMenu(false); handleDeletePost(); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete post
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Content ── */}
      {post.post_content && (
        <div className="px-5 pb-3">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
            {post.post_content}
          </p>
        </div>
      )}

      {/* ── Images ── */}
      <ImageGallery images={post.images} />

      {/* ── Metric counts ── */}
      <div className="px-5 py-2.5 flex items-center gap-4 text-[11px] text-zinc-400 dark:text-zinc-500 font-bold border-t border-zinc-100/60 dark:border-zinc-800/40 select-none">
        <span>{post.likes_count} likes</span>
        <span>{post.comments_count} comments</span>
        <span>{post.shares_count} shares</span>
      </div>

      {/* ── Action bar ── */}
      <div className="px-2 py-1 bg-zinc-50/30 dark:bg-zinc-900/30 border-t border-zinc-100/60 dark:border-zinc-800/50 flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 font-bold">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 p-2 rounded-xl flex-1 justify-center transition border border-transparent group/act ${post.is_liked ? 'bg-amber-50/40 dark:bg-amber-950/20 text-[#b46d23] border-[#f4e6d4]/40 dark:border-amber-900/30' : 'hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-100 dark:hover:border-zinc-700/30 hover:text-[#b46d23]'}`}
        >
          <ThumbsUp className={`w-4 h-4 transition-all group-hover/act:scale-105 ${post.is_liked ? 'fill-[#b46d23]/20 text-[#b46d23]' : 'text-zinc-400 group-hover/act:text-[#b46d23]'}`} />
          <span>{post.is_liked ? 'Liked' : 'Like'}</span>
        </button>

        <button
          onClick={handleToggleComments}
          className={`flex items-center gap-2 p-2 rounded-xl flex-1 justify-center transition border border-transparent group/act ${showComments ? 'bg-zinc-100/50 dark:bg-zinc-800/80 text-[#b46d23]' : 'hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-100 dark:hover:border-zinc-700/30 hover:text-[#b46d23]'}`}
        >
          <MessageSquare className="w-4 h-4 text-zinc-400 group-hover/act:text-[#b46d23] group-hover/act:scale-105 transition-all" />
          <span>Comment</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 p-2 rounded-xl flex-1 justify-center transition border border-transparent hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-100 dark:hover:border-zinc-700/30 hover:text-[#b46d23] group/act"
        >
          <Repeat2 className="w-4 h-4 text-zinc-400 group-hover/act:text-[#b46d23] group-hover/act:scale-105 transition-all" />
          <span>Share</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 p-2 rounded-xl flex-1 justify-center transition border border-transparent hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-100 dark:hover:border-zinc-700/30 hover:text-[#b46d23] group/act"
        >
          <Send className="w-4 h-4 text-zinc-400 group-hover/act:text-[#b46d23] group-hover/act:scale-105 transition-all" />
          <span>Send</span>
        </button>
      </div>

      {/* ── Comment Panel ── */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-50/50 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-800/60 p-4 space-y-4">
              {/* Reply indicator */}
              {replyTo && (
                <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl px-3 py-1.5 text-xs font-bold text-[#b46d23]">
                  <span>Replying to {replyTo.name}</span>
                  <button onClick={() => setReplyTo(null)}><X className="w-3.5 h-3.5" /></button>
                </div>
              )}

              {/* Input */}
              <div className="flex items-start gap-2.5">
                <Avatar url={currentUser.avatar_path} name={currentUser.name} size={8} />
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmitComment()}
                    placeholder={replyTo ? `Reply to ${replyTo.name}...` : 'Add a comment...'}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-3 pr-10 text-xs font-semibold text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#e5ca9a] transition"
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || submitting}
                    className="absolute right-1.5 p-1.5 rounded-lg text-[#b46d23] disabled:opacity-20 hover:bg-amber-50 dark:hover:bg-zinc-800 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Comment list */}
              {comments.length > 0 ? (
                <div className="space-y-3 pt-1">
                  {comments.map(c => (
                    <CommentItem
                      key={c.id}
                      comment={c}
                      currentUserId={currentUser.id}
                      onDelete={handleDeleteComment}
                      onReply={(id, name) => setReplyTo({ id, name })}
                    />
                  ))}
                </div>
              ) : commentsLoaded ? (
                <p className="text-xs text-zinc-400 text-center py-4 font-medium">No comments yet. Be the first!</p>
              ) : (
                <p className="text-xs text-zinc-400 text-center py-4 font-medium">Loading…</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

