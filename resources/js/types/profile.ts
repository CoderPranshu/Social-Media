export interface UserProfile {
    id: number;
    name: string;
    username: string | null;
    bio: string | null;
    location: string | null;
    avatar_path: string | null;
    cover_path: string | null;
    followers_count?: number;
    following_count?: number;
    posts_count?: number;
    likes_count?: number;
    comments_count?: number;
}
