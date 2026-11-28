<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\TimeCapsule;
use App\Models\TimeLike;
use App\Models\TimeComment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PublicProfileController extends Controller
{
    /**
     * Display a public user profile resolved by username.
     * URL: /users/{username}
     */
    public function show(Request $request, string $username): Response
    {
        // Resolve user by username (case-insensitive)
        $profileUser = User::where('username', $username)
            ->orWhere(DB::raw('LOWER(username)'), strtolower($username))
            ->firstOrFail();

        $viewer = $request->user();
        $viewerId = $viewer?->id;

        // ── Stats ──────────────────────────────────────────────────────────────
        $stats = DB::table('time_capsules')
            ->selectRaw('COUNT(*) as posts_count, COALESCE(SUM(likes), 0) as likes_received')
            ->where('user_id', $profileUser->id)
            ->where('status', 'published')
            ->first();

        $followersCount = Follow::where('following_id', $profileUser->id)->count();
        $followingCount = Follow::where('follower_id', $profileUser->id)->count();

        // ── Is the viewer following this user? ─────────────────────────────────
        $isFollowing = $viewerId
            ? Follow::where('follower_id', $viewerId)
                ->where('following_id', $profileUser->id)
                ->exists()
            : false;

        $isOwnProfile = $viewerId === $profileUser->id;

        // ── Build profile data ─────────────────────────────────────────────────
        $profile = [
            'id'              => $profileUser->id,
            'name'            => $profileUser->name,
            'username'        => $profileUser->username,
            'bio'             => $profileUser->bio,
            'location'        => $profileUser->location,
            'avatar_path'     => $profileUser->avatar_path
                ? Storage::disk('public')->url($profileUser->avatar_path)
                : null,
            'cover_path'      => $profileUser->cover_path
                ? Storage::disk('public')->url($profileUser->cover_path)
                : null,
            'followers_count' => $followersCount,
            'following_count' => $followingCount,
            'posts_count'     => (int) ($stats->posts_count ?? 0),
            'likes_received'  => (int) ($stats->likes_received ?? 0),
            'joined_at'       => $profileUser->created_at?->format('F Y'),
            'is_following'    => $isFollowing,
            'is_own_profile'  => $isOwnProfile,
        ];

        // ── Posts (respect privacy) ────────────────────────────────────────────
        $postsQuery = TimeCapsule::with(['images', 'hashtags'])
            ->withCount(['likes', 'comments'])
            ->where('user_id', $profileUser->id);

        if ($isOwnProfile) {
            // Owner sees all their own posts
            $postsQuery->where('status', 'published');
        } elseif ($viewer) {
            // Apply visibility rules for authenticated viewer
            $postsQuery->where('status', 'published')
                ->where(function ($q) use ($viewerId, $isFollowing) {
                    $q->where('visibility', 'public')
                      ->orWhere(function ($q2) use ($viewerId, $isFollowing) {
                          $q2->where('visibility', 'followers')
                             ->where(function ($q3) use ($viewerId, $isFollowing) {
                                 // Viewer follows this user
                                 if ($isFollowing) {
                                     $q3->whereRaw('1=1');
                                 } else {
                                     $q3->whereRaw('1=0');
                                 }
                             });
                      });
                });
        } else {
            // Guest: only public posts
            $postsQuery->where('status', 'published')->where('visibility', 'public');
        }

        $posts = $postsQuery->latest()->paginate(12);

        $formattedPosts = $posts->getCollection()->map(function ($post) use ($viewerId) {
            $imageUrls = $post->allImageUrls();
            return [
                'id'             => $post->id,
                'post_content'   => $post->post_content,
                'visibility'     => $post->visibility,
                'likes_count'    => (int) $post->likes_count,
                'comments_count' => (int) $post->comments_count,
                'created_at'     => $post->created_at,
                'images'         => $imageUrls,
                'thumbnail'      => $imageUrls[0] ?? null,
                'image_count'    => count($imageUrls),
                'hashtags'       => $post->hashtags->pluck('name')->toArray(),
                'is_liked'       => $viewerId
                    ? $post->likes()->where('user_id', $viewerId)->exists()
                    : false,
                'is_bookmarked'  => false,
            ];
        });

        // ── Liked posts tab (respect original post privacy) ───────────────────
        $likedPostIds = $viewerId === $profileUser->id
            ? TimeLike::where('user_id', $profileUser->id)->pluck('post_id')
            : collect(); // Only owner can see their liked posts; shown when viewing own profile

        $likedPosts = collect();
        if ($isOwnProfile && $likedPostIds->isNotEmpty()) {
            $likedPosts = TimeCapsule::with(['images', 'user'])
                ->withCount(['likes', 'comments'])
                ->whereIn('id', $likedPostIds)
                ->where('status', 'published')
                ->latest()
                ->limit(12)
                ->get()
                ->map(function ($post) use ($viewerId) {
                    $imageUrls = $post->allImageUrls();
                    return [
                        'id'             => $post->id,
                        'post_content'   => $post->post_content,
                        'visibility'     => $post->visibility,
                        'likes_count'    => (int) $post->likes_count,
                        'comments_count' => (int) $post->comments_count,
                        'created_at'     => $post->created_at,
                        'images'         => $imageUrls,
                        'thumbnail'      => $imageUrls[0] ?? null,
                        'image_count'    => count($imageUrls),
                        'is_liked'       => true,
                        'is_bookmarked'  => false,
                    ];
                });
        }

        return Inertia::render('user-profile', [
            'profile'         => $profile,
            'posts'           => $formattedPosts->values(),
            'postsNextPage'   => $posts->nextPageUrl(),
            'likedPosts'      => $likedPosts->values(),
        ]);
    }
}

