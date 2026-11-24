<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\Hashtag;
use App\Models\TimeCapsule;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // ── 1. Authenticated user stats ───────────────────────────────────────
        $stats = DB::table('time_capsules')
            ->selectRaw('COUNT(*) as posts_count, COALESCE(SUM(likes), 0) as likes_received')
            ->where('user_id', $user->id)
            ->where('status', 'published')
            ->first();

        $followersCount = Follow::where('following_id', $user->id)->count();
        $followingCount = Follow::where('follower_id', $user->id)->count();

        $userStats = [
            'posts_count'     => (int) ($stats->posts_count ?? 0),
            'followers_count' => $followersCount,
            'following_count' => $followingCount,
            'likes_received'  => (int) ($stats->likes_received ?? 0),
        ];

        // ── 2. Recent posts (authenticated user's latest 4) ───────────────────
        $recentPosts = TimeCapsule::with(['images'])
            ->where('user_id', $user->id)
            ->where('status', 'published')
            ->latest()
            ->limit(4)
            ->get()
            ->map(function ($post) {
                $imageUrls = $post->allImageUrls();
                return [
                    'id'             => $post->id,
                    'post_content'   => $post->post_content,
                    'likes_count'    => (int) $post->likes,
                    'comments_count' => (int) $post->comments_count,
                    'created_at'     => $post->created_at,
                    'image'          => $imageUrls[0] ?? null,
                ];
            });

        // ── 3. Trending hashtags (top 6 by usage) ────────────────────────────
        $trendingHashtags = Hashtag::withCount('posts')
            ->orderByDesc('posts_count')
            ->limit(6)
            ->get()
            ->map(fn($h) => [
                'name'       => $h->name,
                'posts_count' => (int) $h->posts_count,
            ]);

        // ── 4. Suggested users (not followed yet, exclude self, limit 5) ─────
        $followingIds = Follow::where('follower_id', $user->id)
            ->pluck('following_id')
            ->push($user->id); // exclude self

        $suggestedUsers = User::whereNotIn('id', $followingIds)
            ->withCount([
                'followers',
                'posts' => fn($q) => $q->where('status', 'published'),
            ])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($u) => [
                'id'              => $u->id,
                'name'            => $u->name,
                'username'        => $u->username,
                'avatar_path'     => $u->avatar_path
                    ? Storage::disk('public')->url($u->avatar_path)
                    : null,
                'followers_count' => (int) $u->followers_count,
                'posts_count'     => (int) $u->posts_count,
            ]);

        return Inertia::render('dashboard', [
            'userStats'       => $userStats,
            'recentPosts'     => $recentPosts,
            'trendingHashtags' => $trendingHashtags,
            'suggestedUsers'  => $suggestedUsers,
        ]);
    }
}
