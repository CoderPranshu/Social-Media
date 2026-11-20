export interface UserProfile {
    id: number;
    name: string;
    username: string | null;
    bio: string | null;
    location: string | null;
    avatar_path: string | null;
    cover_path: string | null;
}