<?php

namespace App\Http\Controllers;

use App\Models\PostBookmark;
use App\Models\TimeCapsule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostBookmarkController extends Controller
{
    /**
     * Toggle bookmark on/off for a post.
     */
    public function toggle(Request $request, TimeCapsule $post): JsonResponse
    {
        $userId = $request->user()->id;

        $existing = PostBookmark::where('user_id', $userId)
            ->where('post_id', $post->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $bookmarked = false;
        } else {
            PostBookmark::create([
                'user_id' => $userId,
                'post_id' => $post->id,
            ]);
            $bookmarked = true;
        }

        return response()->json(['bookmarked' => $bookmarked]);
    }

    /**
     * Return all bookmarked posts for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $perPage = (int) $request->get('per_page', 15);

        $bookmarks = PostBookmark::where('user_id', $userId)
            ->with([
                'post' => fn($q) => $q->with(['user', 'images'])
                    ->withCount(['likes', 'comments'])
                    ->withExists([
                        'likes as is_liked'          => fn($q2) => $q2->where('user_id', $userId),
                        'bookmarks as is_bookmarked' => fn($q2) => $q2->where('user_id', $userId),
                    ]),
            ])
            ->latest()
            ->paginate($perPage);

        $data = $bookmarks->getCollection()
            ->filter(fn($b) => $b->post !== null)
            ->map(fn($b) => $b->post->toFeedArray($userId))
            ->values();

        return response()->json([
            'data'         => $data,
            'current_page' => $bookmarks->currentPage(),
            'last_page'    => $bookmarks->lastPage(),
            'has_more'     => $bookmarks->hasMorePages(),
            'total'        => $bookmarks->total(),
        ]);
    }
}

