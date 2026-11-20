import React, { useState } from 'react';
import { 
  FileText, TrendingUp, MessageSquare, BookOpen, BarChart2, 
  Bell, ChevronDown, RotateCcw, ArrowUp, Share2, Bookmark, 
  MoreHorizontal, Trash2, Check, Plus, Send, X, ThumbsUp, Repeat2
} from 'lucide-react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from '@/components/navbar';

// Types definitions matching the feed experience
type PostType = 'PREDICTION' | 'DISCUSSION' | 'ARTICLE' | 'POLL';

interface Comment {
  id: number;
  author: string;
  avatarUrl: string;
  timeAgo: string;
  content: string;
}

interface PostItem {
  id: number;
  type: PostType;
  author: string;
  authorInitials: string;
  avatarBg: string;
  headline?: string;
  timeAgo: string;
  title: string;
  content: string;
  termLabel?: string;
  termColor?: string;
  tags: string[];
  upvotes: number;
  commentsCount: number;
  shares: number;
  imageUrl?: string;
  isUpvoted?: boolean;
  isSaved?: boolean;
  isFollowingAuthor?: boolean;
  commentsList: Comment[];
}

interface Connection {
  id: number;
  name: string;
  role: string;
  avatarUrl: string;
}

const AllPostsPage: React.FC = () => {
  // Current Logged-In User Profile Definition
  const currentUser = {
    name: 'Ananya Patel',
    initials: 'AP',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

  // State arrays for managing active interactive posts dynamically
  const [posts, setPosts] = useState<PostItem[]>([
    {
      id: 1,
      type: 'PREDICTION',
      author: 'Ananya Patel',
      authorInitials: 'AP',
      avatarBg: 'bg-amber-100 text-amber-700',
      headline: 'Web Developer & Tech Writer',
      timeAgo: '2h ago',
      title: 'AI will become the most powerful productivity lever by 2030.',
      content: 'With the pace of AI advancements, I predict that by 2030, AI tools will automate the majority of knowledge work, dramatically increasing productivity across industries.',
      termLabel: 'Long-term',
      termColor: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30',
      tags: ['AI', 'FutureOfWork', 'Productivity'],
      upvotes: 128,
      commentsCount: 2,
      shares: 12,
      isUpvoted: false,
      isSaved: false,
      isFollowingAuthor: false,
      commentsList: [
        {
          id: 101,
          author: 'Rahul Sharma',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          timeAgo: '1d ago',
          content: 'Solid take. The transition timeline depends entirely on consumer hardware pipelines though.'
        },
        {
          id: 102,
          author: 'Priya Patel',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          timeAgo: '5h ago',
          content: 'Agreed, enterprise adoption is accelerating much quicker than anticipated!'
        }
      ]
    },
    {
      id: 2,
      type: 'DISCUSSION',
      author: 'Rohan Sen',
      authorInitials: 'RS',
      avatarBg: 'bg-emerald-100 text-emerald-700',
      headline: 'Aerospace Engineering Lead',
      timeAgo: '4h ago',
      title: 'What do you think will be the next big breakthrough in space tech?',
      content: 'From reusable rockets to space tourism, space tech is evolving fast. Let’s discuss what breakthrough you think will come next.',
      tags: ['Space', 'Technology'],
      upvotes: 96,
      commentsCount: 0,
      shares: 7,
      isUpvoted: false,
      isSaved: false,
      isFollowingAuthor: false,
      commentsList: []
    },
    {
      id: 3,
      type: 'ARTICLE',
      author: 'Ananya Patel',
      authorInitials: 'AP',
      avatarBg: 'bg-amber-100 text-amber-700',
      headline: 'Web Developer & Tech Writer',
      timeAgo: '6h ago',
      title: 'The Future of Work: Skills You Need to Stay Relevant',
      content: 'The job market is changing rapidly. Here are the top skills you should develop to future-proof your career.',
      termLabel: 'Medium-term',
      termColor: 'bg-amber-50 text-[#b46d23] border-[#f4e6d4] dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
      tags: ['FutureOfWork', 'Skills', 'Career'],
      upvotes: 72,
      commentsCount: 1,
      shares: 5,
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
      isUpvoted: false,
      isSaved: false,
      isFollowingAuthor: false,
      commentsList: [
        {
          id: 301,
          author: 'Devendra Singh',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          timeAgo: '2d ago',
          content: 'Continuous learning is definitely the single ultimate skill required now.'
        }
      ]
    }
  ]);

  // Track state for native comment drawer input layers per post
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [newCommentTexts, setNewCommentTexts] = useState<{ [key: number]: string }>({});

  // Centralized interactive state for premium Connections modal share target
  const [sendModalPostId, setSendModalPostId] = useState<number | null>(null);
  const [searchContactQuery, setSearchContactQuery] = useState('');
  const [sendingStatus, setSendingStatus] = useState<{ [contactId: number]: boolean }>({});
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const mockConnections: Connection[] = [
    { id: 1, name: 'Gaurav Kumar', role: 'Full Stack Engineer', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Rohan Mehta', role: 'UI/UX Lead Designer', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Sneha Reddy', role: 'Product Manager', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' }
  ];

  // 1. Like / Upvote Action Handler
  const handleUpvote = (id: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === id) {
          const isUpvoted = !post.isUpvoted;
          return {
            ...post,
            isUpvoted,
            upvotes: isUpvoted ? post.upvotes + 1 : post.upvotes - 1
          };
        }
        return post;
      })
    );
  };

  // 2. Premium Inline Comment Section Submitter
  const handleAddComment = (postId: number) => {
    const text = newCommentTexts[postId];
    if (!text || !text.trim()) return;

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const updatedComments = [
            ...post.commentsList,
            {
              id: Date.now(),
              author: 'You (Creator)',
              avatarUrl: currentUser.avatarUrl,
              timeAgo: 'Just now',
              content: text.trim()
            }
          ];
          return {
            ...post,
            commentsCount: updatedComments.length,
            commentsList: updatedComments
          };
        }
        return post;
      })
    );
    setNewCommentTexts(prev => ({ ...prev, [postId]: '' }));
  };

  // 3. Follow System Toggle
  const handleFollowToggle = (postId: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post => post.id === postId ? { ...post, isFollowingAuthor: !post.isFollowingAuthor } : post)
    );
  };

  // 4. Save / Bookmark Toggle Handler
  const handleSave = (id: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post => post.id === id ? { ...post, isSaved: !post.isSaved } : post)
    );
  };

  // 5. Delete Action Handler
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      setActiveMenuId(null);
    }
  };

  // Simulated Connection Send Execution
  const handleExecuteSend = (contactId: number) => {
    setSendingStatus(prev => ({ ...prev, [contactId]: true }));
    setTimeout(() => {
      setSendingStatus(prev => ({ ...prev, [contactId]: false }));
      setSendModalPostId(null);
      setSearchContactQuery('');
    }, 900);
  };

  const filteredConnections = mockConnections.filter(c =>
    c.name.toLowerCase().includes(searchContactQuery.toLowerCase())
  );

  // Filter out to only view current authenticated active users dashboard logs
  const loggedInUserPosts = posts.filter(post => post.author === currentUser.name);

  return (
    <>
    <Navbar/>
    <div className="min-h-screen  dark:bg-zinc-950 pt-6 px-4 md:px-8 pb-12 font-sans text-left relative">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Main Title Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">My Posts</h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-1">
            Manage, trace, and monitor predictions and layouts you have shared.
          </p>
        </div>

        {/* Core Layout Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
            <SidebarProvider>
       <LeftSidebar />
       </SidebarProvider>

          {/* CENTER CONTENT LOG HUB */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="space-y-4">
              {loggedInUserPosts.length > 0 ? (
                loggedInUserPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.01)] p-5 relative flex flex-col justify-between gap-4 transition-all duration-200 hover:border-zinc-200 dark:hover:border-zinc-700"
                  >
                    {/* Upper Container Segment layout block wrapper */}
                    <div className="flex flex-col md:flex-row justify-between gap-5">
                      
                      {/* Left Column Content Stack */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {/* Identity Header */}
                          <div className="flex items-center space-x-2.5 mb-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black tracking-tight shrink-0 ${post.avatarBg}`}>
                              {post.authorInitials}
                            </div>
                            <div className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
                              <span className="text-[#b46d23] uppercase tracking-wide text-[10px] font-black">{post.type}</span>
                              <span>•</span>
                              <span className="text-zinc-700 dark:text-zinc-200 font-extrabold">{post.author}</span>
                              <span>•</span>
                              <span>{post.timeAgo}</span>
                            </div>
                          </div>

                          {/* Heading title */}
                          <h3 className="text-sm sm:text-base font-black text-zinc-950 dark:text-white tracking-tight leading-snug hover:text-[#b46d23] transition cursor-pointer mb-2">
                            {post.title}
                          </h3>

                          {/* Content Layer Excerpt */}
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed font-normal mb-4 max-w-2xl">
                            {post.content}
                          </p>
                        </div>

                        {/* Badges Layout row node array */}
                        <div className="flex flex-wrap items-center gap-2">
                          {post.termLabel && (
                            <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 border rounded-md ${post.termColor || 'bg-amber-50 text-[#b46d23] border-amber-100'}`}>
                              {post.termLabel}
                            </span>
                          )}
                          {post.tags.map(tag => (
                            <span key={tag} className="bg-zinc-50 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-500 border border-zinc-100 dark:border-zinc-800/60 text-[10px] font-bold px-2.5 py-0.5 rounded-lg">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Column Layout Frame */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0 min-w-0 md:min-w-[140px] relative">
                        
                        {/* Top Action Controls Menu Row */}
                        <div className="hidden md:flex items-center space-x-1 mb-2 relative">
                          <button 
                            onClick={() => handleFollowToggle(post.id)}
                            className={`flex items-center space-x-1 border px-2.5 py-1 rounded-xl text-[10px] font-bold transition ${
                              post.isFollowingAuthor 
                                ? 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-500' 
                                : 'border-zinc-200 dark:border-zinc-700 text-[#b46d23] hover:bg-zinc-50'
                            }`}
                          >
                            {post.isFollowingAuthor ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Plus className="w-2.5 h-2.5 stroke-[3]" />}
                            <span>{post.isFollowingAuthor ? 'Following' : 'Follow'}</span>
                          </button>

                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === post.id ? null : post.id)}
                            className="p-1.5 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {activeMenuId === post.id && (
                            <div className="absolute right-0 top-8 w-36 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl shadow-lg py-1.5 z-10">
                              <button 
                                onClick={() => handleDelete(post.id)}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-left transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Post</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {post.imageUrl && (
                          <div className="w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800/80 shadow-sm shrink-0 md:mb-auto order-first md:order-none">
                            <img src={post.imageUrl} alt="Asset thumbnail" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Engagement Action Operations Hub Ribbon */}
                    <div className="pt-3 flex items-center justify-between border-t border-zinc-100/60 dark:border-zinc-800/60 text-[11px] font-black text-zinc-400 select-none">
                      
                      {/* Upvote Click Trigger */}
                      <button 
                        onClick={() => handleUpvote(post.id)}
                        className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition ${
                          post.isUpvoted 
                            ? 'bg-amber-500/10 text-[#b46d23]' 
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-[#b46d23]'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 stroke-[2.5] ${post.isUpvoted ? 'fill-current' : ''}`} />
                        <span className={post.isUpvoted ? 'text-[#b46d23]' : 'text-zinc-600 dark:text-zinc-300'}>
                          {post.upvotes} Upvotes
                        </span>
                      </button>

                      {/* Comment Click Drawer Toggle */}
                      <button 
                        onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                        className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition ${
                          activeCommentPostId === post.id ? 'bg-zinc-50 dark:bg-zinc-800 text-[#b46d23]' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-[#b46d23]'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 stroke-[2]" />
                        <span>{post.commentsCount} Comments</span>
                      </button>

                      {/* Share Option - Direct Modal Linkup */}
                      <button 
                        onClick={() => setSendModalPostId(post.id)}
                        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-[#b46d23] transition"
                      >
                        <Send className="w-3.5 h-3.5 stroke-[2]" />
                        <span>Send</span>
                      </button>

                      {/* Save Action Badge */}
                      <button 
                        onClick={() => handleSave(post.id)}
                        className={`px-3 py-2 rounded-xl transition hover:bg-zinc-50 dark:hover:bg-zinc-800 ${post.isSaved ? 'text-[#b46d23]' : 'hover:text-[#b46d23]'}`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 stroke-[2] ${post.isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* INTERACTIVE COMMENT DRAWER MODULE DECK */}
                    {activeCommentPostId === post.id && (
                      <div className="mt-2 border-t border-zinc-100/50 dark:border-zinc-800/50 pt-4 space-y-4 bg-zinc-50/40 dark:bg-zinc-900/20 rounded-xl p-3">
                        {/* Interactive Editor Compose Box */}
                        <div className="flex items-start space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                            {currentUser.initials}
                          </div>
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={newCommentTexts[post.id] || ''}
                              onChange={(e) => setNewCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="Add a calculated response..."
                              className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#b46d23]/40 font-medium"
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-200 text-xs font-bold px-3 py-1.5 rounded-xl transition hover:bg-zinc-800"
                            >
                              Comment
                            </button>
                          </div>
                        </div>

                        {/* List Render Panel */}
                        <div className="space-y-3 pt-2">
                          {post.commentsList.map((comment) => (
                            <div key={comment.id} className="flex space-x-2.5 items-start group">
                              <img src={comment.avatarUrl} alt={comment.author} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                              <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-2.5 flex-1 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-[11px] font-extrabold text-zinc-800 dark:text-zinc-200">{comment.author}</h5>
                                  <span className="text-[9px] text-zinc-400 font-medium">{comment.timeAgo}</span>
                                </div>
                                <p className="text-xs font-normal text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-400">
                  <p className="text-sm font-bold">You haven't posted anything yet.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* DYNAMIC CONNECTIONS SHARE DRAWER OVERLAY */}
      {sendModalPostId !== null && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 w-full max-w-sm rounded-2xl p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase">Send Post to Connection</h4>
              <button onClick={() => { setSendModalPostId(null); setSearchContactQuery(''); }} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={searchContactQuery}
              onChange={(e) => setSearchContactQuery(e.target.value)}
              placeholder="Search connections..."
              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 rounded-xl p-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#b46d23]/40"
            />
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {filteredConnections.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-xl transition">
                  <div className="flex items-center space-x-2.5">
                    <img src={contact.avatarUrl} alt={contact.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{contact.name}</h5>
                      <p className="text-[10px] text-zinc-400 line-clamp-1">{contact.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleExecuteSend(contact.id)}
                    disabled={sendingStatus[contact.id]}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1 ${
                      sendingStatus[contact.id] 
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' 
                        : 'bg-zinc-900 text-white dark:bg-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    {sendingStatus[contact.id] ? <Check className="w-3 h-3" /> : <Send className="w-2.5 h-2.5" />}
                    <span>{sendingStatus[contact.id] ? 'Sent' : 'Send'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default AllPostsPage;