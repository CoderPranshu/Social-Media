<?php

namespace App\Http\Controllers;

use App\Models\PostBookmark;
use App\Models\PostImage;
use App\Models\TimeCapsule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TimeCapsuleController extends Controller
{
    // ─── Create a Post ───────────────────────────────────────────────────────

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'post_content' => 'nullable|string|max:5000',
            'visibility'   => 'nullable|in:public,followers,only_me',
            'images'       => 'nullable|array|max:10',
            'images.*'     => 'image|mimes:jpg,jpeg,png,webp,gif|max:10240',
            // Legacy single-image field kept for backward compatibility
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if (empty($validated['post_content']) && !$request->hasFile('images') && !$request->hasFile('image')) {
            return response()->json([
                'message' => 'Please write something or upload at least one image.',
            ], 422);
        }

        $userId = $request->user()->id;

        return DB::transaction(function () use ($request, $validated, $userId) {
            // Persist legacy single image path (for backward compat with old myPosts)
            $legacyImagePath = null;
            if ($request->hasFile('image')) {
                $legacyImagePath = $request->file('image')->store('posts', 'public');
            }

            $post = TimeCapsule::create([
                'post_content'   => $validated['post_content'] ?? null,
                'user_id'        => $userId,
                'likes'          => '0',
                'shares'         => '0',
                'comments_count' => '0',
                'status'         => 'published',
                'visibility'     => $validated['visibility'] ?? 'public',
                'image'          => $legacyImagePath,
            ]);

            // Handle multiple images via post_images table
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $i => $file) {
                    $path = $file->store('posts', 'public');
                    PostImage::create([
                        'post_id'    => $post->id,
                        'path'       => $path,
                        'sort_order' => $i,
                    ]);
                }
            } elseif ($legacyImagePath) {
                // Also store in post_images for unified access
                PostImage::create([
                    'post_id'    => $post->id,
                    'path'       => $legacyImagePath,
                    'sort_order' => 0,
                ]);
            }

            // Load relationships for response
            $post->load(['user', 'images']);

            return response()->json([
                'message' => 'Post published successfully!',
                'post'    => $post->toFeedArray($userId),
            ], 201)->header('Cache-Control', 'private, no-store');
        });
    }

    // ─── My Posts (Profile Activity) ─────────────────────────────────────────

    public function myPosts(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $posts = TimeCapsule::with(['user', 'images'])
            ->withCount(['likes', 'comments'])
            ->withExists([
                'likes as is_liked'       => fn($q) => $q->where('user_id', $userId),
                'bookmarks as is_bookmarked' => fn($q) => $q->where('user_id', $userId),
            ])
            ->where('user_id', $userId)
            ->latest()
            ->get()
            ->map(fn($post) => $post->toFeedArray($userId));

        return response()->json($posts)
            ->header('Cache-Control', 'private, no-store, no-cache, must-revalidate');
    }

    // ─── Public / Home Feed ───────────────────────────────────────────────────

    public function feed(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $perPage = (int) $request->get('per_page', 15);
        $page    = (int) $request->get('page', 1);

        $posts = TimeCapsule::with(['user', 'images'])
            ->withCount(['likes', 'comments'])
            ->withExists([
                'likes as is_liked'          => fn($q) => $q->where('user_id', $userId),
                'bookmarks as is_bookmarked' => fn($q) => $q->where('user_id', $userId),
            ])
            // Phase A: show only public posts in the global feed
            ->where('visibility', 'public')
            ->where('status', 'published')
            ->latest()
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data'          => collect($posts->items())->map(fn($post) => $post->toFeedArray($userId)),
            'current_page'  => $posts->currentPage(),
            'last_page'     => $posts->lastPage(),
            'per_page'      => $posts->perPage(),
            'total'         => $posts->total(),
            'has_more'      => $posts->hasMorePages(),
        ])->header('Cache-Control', 'private, no-store');
    }

    // ─── Single Post ─────────────────────────────────────────────────────────

    public function show(Request $request, TimeCapsule $post): JsonResponse
    {
        $userId = $request->user()->id;

        $post->load(['user', 'images'])
            ->loadCount(['likes', 'comments'])
            ->loadExists([
                'likes as is_liked'          => fn($q) => $q->where('user_id', $userId),
                'bookmarks as is_bookmarked' => fn($q) => $q->where('user_id', $userId),
            ]);

        return response()->json($post->toFeedArray($userId));
    }

    // ─── Edit a Post ─────────────────────────────────────────────────────────

    public function update(Request $request, TimeCapsule $post): JsonResponse
    {
        if ($post->user_id != $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'post_content' => 'nullable|string|max:5000',
            'visibility'   => 'nullable|in:public,followers,only_me',
        ]);

        $post->update($validated);

        $post->load(['user', 'images'])
            ->loadCount(['likes', 'comments'])
            ->loadExists([
                'likes as is_liked'          => fn($q) => $q->where('user_id', $request->user()->id),
                'bookmarks as is_bookmarked' => fn($q) => $q->where('user_id', $request->user()->id),
            ]);

        return response()->json([
            'message' => 'Post updated.',
            'post'    => $post->toFeedArray($request->user()->id),
        ]);
    }

    // ─── Delete a Post ───────────────────────────────────────────────────────

    public function destroy(Request $request, TimeCapsule $post): JsonResponse
    {
        if ($post->user_id != $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        DB::transaction(function () use ($post) {
            // Delete images from disk
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            foreach ($post->images as $img) {
                Storage::disk('public')->delete($img->path);
            }
            $post->delete();
        });

        return response()->json(['message' => 'Post deleted.']);
    }
}
