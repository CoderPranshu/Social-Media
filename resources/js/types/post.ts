// ─── Core post data returned by all backend endpoints ────────────────────────

export interface PostAuthor {
  id: number;
  name: string;
  username: string | null;
  avatar_path: string | null;
}

export interface FeedPost {
  id: number;
  post_content: string | null;
  visibility: 'public' | 'followers' | 'only_me';
  status: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  images: string[];          // absolute storage URLs
  author: PostAuthor | null;
}

export interface FeedComment {
  id: number;
  comment: string;
  parent_id: number | null;
  created_at: string;
  author: PostAuthor | null;
  replies: FeedComment[];
}

export interface PaginatedFeed {
  data: FeedPost[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  has_more: boolean;
}

