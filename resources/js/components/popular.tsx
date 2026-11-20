import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { LeftSidebar } from '../components/LeftSidebar';
import { 
  MessageSquare, Repeat2, Send, ThumbsUp, MoreHorizontal, Plus, 
  CornerDownRight, Check, X, Search
} from 'lucide-react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RightSidebar } from './RightSidebar';

// ==========================================
// TYPE & INTERFACE DEFINITIONS
// ==========================================
interface Comment {
  id: number;
  author: string;
  avatarUrl: string;
  timeAgo: string;
  content: string;
}

interface Post {
  id: number;
  author: string;
  timeAgo: string;
  headline: string;
  avatarUrl: string;
  termLabel: string;
  termColor: string;
  title: string;
  content: string;
  likes: number;
  commentsCount: number;
  shares: number;
  tags: string[];
  isLikedByUser?: boolean;
  isRepostedByUser?: boolean;
  isFollowingAuthor?: boolean;
  commentsList: Comment[];
}

interface Connection {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

type FilterType = 'trending' | 'most-liked' | 'most-discussed';

// ==========================================
// MAIN ADAPTIVE POPULAR FEED ENGINE
// ==========================================
export const PopularFeed: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('trending');
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [newCommentTexts, setNewCommentTexts] = useState<{ [key: number]: string }>({});
  
  // Premium Share Dialog Overlay Mechanics
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeSharePostId, setActiveSharePostId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentConnections, setSentConnections] = useState<{ [key: string]: boolean }>({});

  // Connections Dataset
  const connections: Connection[] = [
    { id: 1, name: 'Gaurav Kumar', role: 'Full Stack Engineer', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Rohan Mehta', role: 'UI/UX Lead Designer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Sneha Reddy', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' }
  ];

  // Feed Array
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Arjun Vardhan',
      timeAgo: '5h ago',
      headline: 'FinTech Founder | Forbes 30 Under 30',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      termLabel: 'Short-term',
      termColor: 'border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400',
      title: 'Decentralized identity protocols will replace traditional OAuth by 2027.',
      content: 'The current structure of web authentication leaves massive exposure vectors. Heavily backed identity ledgers are reaching enterprise latency compliance standards this quarter.',
      likes: 1420,
      commentsCount: 89,
      shares: 340,
      tags: ['Web3', 'Cybersecurity', 'Fintech', 'Identity'],
      isLikedByUser: false,
      isRepostedByUser: false,
      isFollowingAuthor: false,
      commentsList: [
        {
          id: 401,
          author: 'Meera Nair',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          timeAgo: '4h ago',
          content: 'This is a monumental shift. UX friction is the last remaining obstacle to mass public adoption.'
        }
      ]
    },
    {
      id: 2,
      author: 'Suresh Swamy Rongala',
      timeAgo: '2d ago',
      headline: 'AI Researcher | Machine Learning | Deep Learning',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      termLabel: 'Long-term',
      termColor: 'border-orange-200 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400',
      title: 'AI will become the most powerful productivity lever by 2030.',
      content: 'With the pace of AI advancements, I predict that by 2030, AI tools will automate the majority of knowledge work, dramatically increasing productivity across industries.',
      likes: 850,
      commentsCount: 2,
      shares: 13,
      tags: ['AI', 'FutureOfWork', 'Productivity', '2030'],
      isLikedByUser: false,
      isRepostedByUser: false,
      isFollowingAuthor: true,
      commentsList: [
        {
          id: 402,
          author: 'Rahul Sharma',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          timeAgo: '1d ago',
          content: 'Solid take. The transition timeline depends entirely on consumer hardware pipelines though.'
        }
      ]
    }
  ]);

  // Sidebar Predictions Array
  const latestPredictions = [
    { id: 1, title: 'Bitcoin will reach $150K by the end of 2025', meta: '3h ago • 2.1k predicted', img: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=80&auto=format&fit=crop&q=60', to: '/dashboard' },
    { id: 2, title: 'Humanoid robots will enter homes by 2030', meta: '5h ago • 1.8k predicted', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=80&auto=format&fit=crop&q=60', to: '/dashboard' },
    { id: 3, title: 'Space tourism will become a $10B industry by 2035', meta: '12h ago • 1.2k predicted', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=80&auto=format&fit=crop&q=60', to: '/dashboard' }
  ];

  const trendingTopics = [
    { id: 1, name: 'Artificial Intelligence', count: '12.4k predictions', to: '/popularfeed' },
    { id: 2, name: 'Economy', count: '8.7k predictions', to: '/popularfeed' },
    { id: 3, name: 'Technology', count: '6.1k predictions', to: '/popularfeed' }
  ];

  // Calculations & Interactions
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (filter === 'most-liked') return b.likes - a.likes;
      if (filter === 'most-discussed') return b.commentsCount - a.commentsCount;
      return (b.likes + b.commentsCount * 3) - (a.likes + a.commentsCount * 3);
    });
  }, [posts, filter]);

  const handleFollowToggle = (postId: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isFollowingAuthor: !p.isFollowingAuthor } : p));
  };

  const handleLikeToggle = (postId: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLikedByUser;
        return { ...p, isLikedByUser: isLiked, likes: isLiked ? p.likes + 1 : p.likes - 1 };
      }
      return p;
    }));
  };

  const handleRepostToggle = (postId: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isReposted = !p.isRepostedByUser;
        return { ...p, isRepostedByUser: isReposted, shares: isReposted ? p.shares + 1 : p.shares - 1 };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: number) => {
    const text = newCommentTexts[postId];
    if (!text || !text.trim()) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const updated = [
          ...p.commentsList,
          {
            id: Date.now(),
            author: 'You (Creator)',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            timeAgo: 'Just now',
            content: text.trim()
          }
        ];
        return { ...p, commentsCount: updated.length, commentsList: updated };
      }
      return p;
    }));
    setNewCommentTexts(prev => ({ ...prev, [postId]: '' }));
  };

  const handleSendDirect = (connectionId: number) => {
    const uniqueKey = `${activeSharePostId}-${connectionId}`;
    setSentConnections(prev => ({ ...prev, [uniqueKey]: true }));
    if (activeSharePostId) {
      setPosts(prev => prev.map(p => p.id === activeSharePostId ? { ...p, shares: p.shares + 1 } : p));
    }
  };

  const filteredConnections = connections.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto lg:px-4 lg:py-6 sm:px-4 sm:py-0 text-zinc-900 dark:text-zinc-100 relative antialiased transition-colors duration-200">
      {/* Three Column Dynamic Platform Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Col 1: App Navigation Sidebar Module */}
        <div className="lg:col-span-1 lg:sticky lg:top-6">
          <SidebarProvider>
            <LeftSidebar />
          </SidebarProvider>
        </div>

        {/* Col 2: Adaptive Feed Engine Container */}
        <div className="lg:col-span-2 space-y-4 text-left w-full relative">
          {sortedPosts.map((post, index) => (
            <div key={post.id} className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/40 rounded-xl shadow-md dark:shadow-2xl overflow-hidden transition-all duration-300 relative">
              
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-zinc-100/40 dark:from-zinc-800/20 via-transparent to-transparent w-12 h-12 flex items-start justify-end p-2.5 pointer-events-none select-none">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 tracking-tight">#0{index + 1}</span>
              </div>

              {/* Card Meta Content Header */}
              <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
                <div className="flex space-x-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800/80 shrink-0">
                    <img src={post.avatarUrl} alt={post.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer transition">{post.author}</h4>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">{post.timeAgo}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5 line-clamp-1">{post.headline}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 shrink-0 z-10">
                  <button 
                    onClick={() => handleFollowToggle(post.id)}
                    className={`flex items-center space-x-1 border px-3 py-1 rounded-full text-[11px] font-bold transition ${
                      post.isFollowingAuthor 
                        ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300' 
                        : 'border-orange-200 dark:border-zinc-700/60 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-zinc-800/80'
                    }`}
                  >
                    {post.isFollowingAuthor ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3 stroke-[3]" />}
                    <span>{post.isFollowingAuthor ? 'Following' : 'Follow'}</span>
                  </button>
                  <button className="text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 p-1.5 rounded-lg transition">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Text Content */}
              <div className="px-5 pb-3.5 space-y-2">
                <span className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 border rounded-md ${post.termColor}`}>
                  {post.termLabel}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white tracking-tight leading-snug hover:text-orange-500 dark:hover:text-orange-400 transition cursor-pointer pr-6">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">{post.content}</p>
              </div>

              {/* Tags Layer */}
              <div className="px-5 pb-4 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-zinc-50 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800/50 px-2.5 py-1 rounded-lg text-[10px] font-medium cursor-pointer hover:text-orange-500 dark:hover:text-orange-400 transition-all">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Quantitative Metrics Bar */}
              <div className="px-5 py-2.5 flex items-center space-x-4 text-[11px] text-zinc-500 dark:text-zinc-400 font-bold border-t border-zinc-100 dark:border-zinc-800/40 select-none">
                <div onClick={() => handleLikeToggle(post.id)} className={`flex items-center space-x-1.5 cursor-pointer transition ${post.isLikedByUser ? 'text-orange-500 dark:text-orange-400' : 'hover:text-orange-500 dark:hover:text-orange-400'}`}>
                  <ThumbsUp className={`w-3.5 h-3.5 stroke-[2.5] ${post.isLikedByUser ? 'fill-orange-500/20' : ''}`} /> <span>{post.likes}</span>
                </div>
                <div onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)} className="flex items-center space-x-1.5 cursor-pointer hover:text-orange-500 dark:hover:text-orange-400 transition">
                  <MessageSquare className="w-3.5 h-3.5 stroke-[2.25]" /> <span>{post.commentsCount}</span>
                </div>
                <div onClick={() => handleRepostToggle(post.id)} className={`flex items-center space-x-1.5 cursor-pointer transition ${post.isRepostedByUser ? 'text-emerald-600 dark:text-emerald-500' : 'hover:text-orange-500 dark:hover:text-orange-400'}`}>
                  <Repeat2 className="w-3.5 h-3.5 stroke-[2.25]" /> <span>{post.shares}</span>
                </div>
              </div>

              {/* Dynamic Interactive Footer Buttons */}
              <div className="px-2 py-1.5 bg-zinc-50/50 dark:bg-zinc-900/10 border-t border-zinc-100 dark:border-zinc-800/40 flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 font-bold gap-1">
                <button onClick={() => handleLikeToggle(post.id)} className={`flex items-center space-x-2 p-2 rounded-xl flex-1 justify-center transition ${post.isLikedByUser ? 'bg-orange-50 dark:bg-[#241e17] text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-950/40' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/40'}`}>
                  <ThumbsUp className="w-4 h-4" /> <span>{post.isLikedByUser ? 'Liked' : 'Like'}</span>
                </button>
                <button onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)} className={`flex items-center space-x-2 p-2 rounded-xl flex-1 justify-center transition ${activeCommentPostId === post.id ? 'bg-zinc-200 dark:bg-zinc-800/70 text-orange-600 dark:text-orange-400' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/40'}`}>
                  <MessageSquare className="w-4 h-4" /> <span>Comment</span>
                </button>
                <button onClick={() => handleRepostToggle(post.id)} className={`flex items-center space-x-2 p-2 rounded-xl flex-1 justify-center transition ${post.isRepostedByUser ? 'bg-emerald-50 dark:bg-[#15241d] text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-950/40' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/40'}`}>
                  <Repeat2 className="w-4 h-4" /> <span>{post.isRepostedByUser ? 'Reposted' : 'Repost'}</span>
                </button>
                <button 
                  onClick={() => { setActiveSharePostId(post.id); setSearchQuery(''); setIsShareModalOpen(true); }} 
                  className="flex items-center space-x-2 p-2 rounded-xl flex-1 justify-center transition text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40"
                >
                  <Send className="w-4 h-4" /> <span>Send</span>
                </button>
              </div>

              {/* Nested Comments Tray Module */}
              {activeCommentPostId === post.id && (
                <div className="bg-zinc-50 dark:bg-[#0e0e10] border-t border-zinc-200 dark:border-zinc-800/60 p-4 space-y-4">
                  <div className="flex items-start space-x-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 relative flex items-center">
                      <input
                        type="text"
                        value={newCommentTexts[post.id] || ''}
                        onChange={(e) => setNewCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        placeholder="Add a constructive argument or comment..."
                        className="w-full bg-white dark:bg-[#161619] border border-zinc-300 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100 rounded-xl py-2 pl-3 pr-10 text-xs font-medium focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 placeholder-zinc-400 dark:placeholder-zinc-500"
                      />
                      <button onClick={() => handleAddComment(post.id)} disabled={!(newCommentTexts[post.id] || '').trim()} className="absolute right-1.5 p-1.5 text-orange-500 dark:text-orange-400 disabled:opacity-20 transition">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {post.commentsList && post.commentsList.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-2.5">
                      <CornerDownRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 mt-1.5 shrink-0" />
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                        <img src={comment.avatarUrl} alt={comment.author} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 bg-white dark:bg-[#161619] border border-zinc-200 dark:border-zinc-800/40 rounded-xl p-2.5 text-left shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">{comment.author}</span>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500">{comment.timeAgo}</span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Col 3: Adaptive Right Analytics Sidebar */}
        <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-6">
          
          <RightSidebar/>

        </div>
      </div>

      {/* ========================================================= */}
      {/* ADAPTIVE SEND MODAL DIALOG MODIFIER SCREEN OVERLAY         */}
      {/* ========================================================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-white dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-orange-500 fill-orange-500/10 rotate-[-15deg]" />
                <h3 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Send Prediction to Connections</h3>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 p-1 rounded-lg transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative flex items-center mb-4">
              <Search className="absolute left-3 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search connection names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/60 rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 font-medium"
              />
            </div>

            <div className="space-y-3.5 max-h-[240px] overflow-y-auto pr-1">
              {filteredConnections.length > 0 ? (
                filteredConnections.map((conn) => {
                  const uniqueKey = `${activeSharePostId}-${conn.id}`;
                  const isAlreadySent = sentConnections[uniqueKey];

                  return (
                    <div key={conn.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shrink-0">
                          <img src={conn.avatar} alt={conn.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 tracking-tight leading-none">{conn.name}</h5>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-1">{conn.role}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleSendDirect(conn.id)}
                        disabled={isAlreadySent}
                        className={`text-[10px] font-bold px-3.5 py-1.5 rounded-lg transition tracking-wide ${
                          isAlreadySent 
                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed border border-zinc-200 dark:border-zinc-700/30' 
                            : 'bg-[#ff5500] hover:bg-[#e04b00] text-white shadow-sm shadow-orange-950/10 dark:shadow-orange-950/20 active:scale-95'
                        }`}
                      >
                        {isAlreadySent ? 'Sent' : 'Send Direct'}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-zinc-400 dark:text-zinc-500 text-xs">No active connections found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};