import React, { useState, useRef, ChangeEvent } from 'react';
import {
  X, Image, Trash2, Globe, Users2, Lock, Check, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiPost } from '@/lib/api';
import type { FeedPost } from '@/types/post';

type VisibilityType = 'public' | 'followers' | 'only_me';

interface AuthUser {
  id: number;
  name: string;
  username?: string | null;
  avatar_path?: string | null;
}

interface PostComposerProps {
  currentUser: AuthUser;
  onPostCreated: (post: FeedPost) => void;
  triggerLabel?: string;
}

function Avatar({ url, name }: { url?: string | null; name?: string | null }) {
  const initials = (name ?? '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return url
    ? <img src={url} alt={name ?? ''} className="w-10 h-10 rounded-full object-cover border border-zinc-100 dark:border-zinc-800 shrink-0" />
    : <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-600 shrink-0">{initials}</div>;
}

function VisibilityIcon({ v }: { v: VisibilityType }) {
  if (v === 'followers') return <Users2 className="w-3 h-3" />;
  if (v === 'only_me')   return <Lock   className="w-3 h-3" />;
  return <Globe className="w-3 h-3" />;
}

const VISIBILITY_LABELS: Record<VisibilityType, string> = {
  public:    'Anyone',
  followers: 'Followers',
  only_me:   'Only me',
};

export const PostComposer: React.FC<PostComposerProps> = ({
  currentUser, onPostCreated, triggerLabel = '📝 Create a post'
}) => {
  const [isOpen, setIsOpen]                   = useState(false);
  const [text, setText]                       = useState('');
  const [visibility, setVisibility]           = useState<VisibilityType>('public');
  const [showVisMenu, setShowVisMenu]         = useState(false);
  const [previews, setPreviews]               = useState<string[]>([]);
  const [files, setFiles]                     = useState<File[]>([]);
  const [isPosting, setIsPosting]             = useState(false);
  const [error, setError]                     = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canPost = text.trim().length > 0 || files.length > 0;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    const valid: File[] = [];
    const previewUrls: string[] = [];

    for (const f of selected) {
      if (!f.type.startsWith('image/')) { alert('Only image files are allowed.'); continue; }
      if (f.size > 10 * 1024 * 1024) { alert(`${f.name} exceeds 10 MB limit.`); continue; }
      valid.push(f);
      previewUrls.push(URL.createObjectURL(f));
    }

    setFiles(prev => [...prev, ...valid]);
    setPreviews(prev => [...prev, ...previewUrls]);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearComposer = () => {
    previews.forEach(URL.revokeObjectURL);
    setText('');
    setFiles([]);
    setPreviews([]);
    setVisibility('public');
    setShowVisMenu(false);
    setIsOpen(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePost = async () => {
    if (!canPost || isPosting) return;
    setIsPosting(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('post_content', text);
      form.append('visibility', visibility);

      if (files.length === 1) {
        // Use legacy `image` field for single image (backward compat)
        form.append('image', files[0]);
      } else {
        files.forEach(f => form.append('images[]', f));
      }

      const res = await apiPost<{ message: string; post: FeedPost }>('/posts', form);
      clearComposer();
      onPostCreated(res.post);
    } catch (err: unknown) {
      const e = err as { data?: { errors?: Record<string, string[]>; message?: string } };
      if (e?.data?.errors) {
        setError(Object.values(e.data.errors).flat().join(' '));
      } else {
        setError((err as Error).message ?? 'Could not publish post.');
      }
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
      />

      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#b46d23] hover:bg-[#965a1c] text-white text-xs font-extrabold px-4 py-2 rounded-full transition-colors flex items-center gap-1 shadow-sm active:scale-95"
      >
        {triggerLabel}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={clearComposer}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-[550px] rounded-2xl flex flex-col shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Modal header */}
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between relative">
                <div className="flex items-center gap-3">
                  <Avatar url={currentUser.avatar_path} name={currentUser.name} />
                  <div className="relative">
                    <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-tight">
                      {currentUser.name}
                    </h3>
                    {currentUser.username && (
                      <p className="text-[10px] text-zinc-400">@{currentUser.username}</p>
                    )}
                    {/* Visibility picker */}
                    <button
                      type="button"
                      onClick={() => setShowVisMenu(p => !p)}
                      className="mt-1 px-2.5 py-1 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-full text-[10px] font-bold text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5 transition"
                    >
                      <VisibilityIcon v={visibility} />
                      <span>{VISIBILITY_LABELS[visibility]}</span>
                    </button>
                    {showVisMenu && (
                      <div className="absolute left-0 top-full mt-1.5 w-44 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden py-1 flex flex-col">
                        {(Object.entries(VISIBILITY_LABELS) as [VisibilityType, string][]).map(([key, label]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => { setVisibility(key); setShowVisMenu(false); }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between transition ${visibility === key ? 'text-[#b46d23] bg-amber-50/40 dark:bg-zinc-700/50' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/30'}`}
                          >
                            <span className="flex items-center gap-2"><VisibilityIcon v={key} />{label}</span>
                            {visibility === key && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={clearComposer} className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col gap-3 max-h-[400px] overflow-y-auto">
                <textarea
                  rows={4}
                  autoFocus
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full bg-transparent border-none text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none resize-none leading-relaxed"
                />

                {/* Image previews */}
                {previews.length > 0 && (
                  <div className={`grid gap-2 ${previews.length === 1 ? 'grid-cols-1' : previews.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {previews.map((src, i) => (
                      <div key={i} className="relative group/preview rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                        <img src={src} alt="" className="w-full h-32 object-cover" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-1.5 right-1.5 p-1 bg-zinc-900/80 hover:bg-red-600 text-white rounded-lg shadow transition opacity-0 group-hover/preview:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl px-3 py-2">
                    {error}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/30">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-emerald-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                    title="Add image"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={clearComposer} className="h-8 px-4 text-zinc-500 font-bold text-xs rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                    Cancel
                  </button>
                  <button
                    onClick={handlePost}
                    disabled={!canPost || isPosting}
                    className="h-8 px-5 bg-[#b46d23] hover:bg-[#965a1b] disabled:bg-zinc-200 disabled:dark:bg-zinc-800 disabled:text-zinc-400 text-white font-bold text-xs rounded-full shadow transition-all"
                  >
                    {isPosting ? 'Posting…' : 'Post'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

