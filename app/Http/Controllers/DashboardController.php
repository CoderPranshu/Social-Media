<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\Hashtag;
use App\Models\TimeCapsule;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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

        // ── 5. Top Prediction of the Day ─────────────────────────────────────
        // "Most liked public prediction posted today", ranked by relational time_likes count.
        $topOfDay = $this->topPrediction(
            Carbon::today(),
            Carbon::today()->endOfDay()
        );

        // ── 6. Top Prediction of the Month ───────────────────────────────────
        // "Most liked public prediction posted this calendar month".
        $topOfMonth = $this->topPrediction(
            Carbon::now()->startOfMonth(),
            Carbon::now()->endOfMonth()
        );

        return Inertia::render('dashboard', [
            'userStats'        => $userStats,
            'recentPosts'      => $recentPosts,
            'trendingHashtags' => $trendingHashtags,
            'suggestedUsers'   => $suggestedUsers,
            'topOfDay'         => $topOfDay,
            'topOfMonth'       => $topOfMonth,
        ]);
    }

    // ── Helper: fetch the most-liked published public post within a date range ──
    private function topPrediction(Carbon $from, Carbon $to): ?array
    {
        $post = TimeCapsule::with(['user', 'images'])
            ->withCount('likes')   // counts rows in time_likes via the existing relationship
            ->where('status', 'published')
            ->where('visibility', 'public')
            ->whereBetween('created_at', [$from, $to])
            ->orderByDesc('likes_count')
            ->first();

        if (! $post) {
            return null;
        }

        $imageUrls = $post->allImageUrls();

        return [
            'id'           => $post->id,
            'post_content' => $post->post_content,
            'likes_count'  => (int) $post->likes_count,
            'created_at'   => $post->created_at,
            'thumbnail'    => $imageUrls[0] ?? null,
            'author' => $post->user ? [
                'id'         => $post->user->id,
                'name'       => $post->user->name,
                'username'   => $post->user->username,
                'avatar_path' => $post->user->avatar_path
                    ? Storage::disk('public')->url($post->user->avatar_path)
                    : null,
            ] : null,
        ];
    }
}

