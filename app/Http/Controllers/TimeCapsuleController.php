<?php

namespace App\Http\Controllers;

use App\Models\PostBookmark;
use App\Models\PostImage;
use App\Models\PostShare;
use App\Models\TimeCapsule;
use App\Services\PostContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TimeCapsuleController extends Controller
{
    // ─── Shared eager-load query builder ──────────────────────────────────────

    private function baseQuery(int $userId)
    {
        return TimeCapsule::with(['user', 'images', 'hashtags', 'mentions.mentionedUser'])
            ->withCount(['likes', 'comments'])
            ->withExists([
                'likes as is_liked'          => fn($q) => $q->where('user_id', $userId),
                'bookmarks as is_bookmarked' => fn($q) => $q->where('user_id', $userId),
            ]);
    }

    // ─── Create a Post ────────────────────────────────────────────────────────

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'post_content' => 'nullable|string|max:5000',
            'visibility'   => 'nullable|in:public,followers,only_me',
            'images'       => 'nullable|array|max:10',
            'images.*'     => 'image|mimes:jpg,jpeg,png,webp,gif|max:10240',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if (empty($validated['post_content']) && !$request->hasFile('images') && !$request->hasFile('image')) {
            return response()->json(['message' => 'Please write something or upload at least one image.'], 422);
        }

        $userId = $request->user()->id;

        return DB::transaction(function () use ($request, $validated, $userId) {
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

            // Multi-image upload
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $i => $file) {
                    PostImage::create([
                        'post_id'    => $post->id,
                        'path'       => $file->store('posts', 'public'),
                        'sort_order' => $i
                    ]);
                }
            } elseif ($legacyImagePath) {
                PostImage::create([
                    'post_id'    => $post->id,
                    'path'       => $legacyImagePath,
                    'sort_order' => 0
                ]);
            }

            // Extract and persist hashtags + mentions
            $text = $post->post_content ?? '';
            if ($text) {
                PostContentService::syncHashtags($post, $text);
                PostContentService::syncMentions($post, $text, $userId);
            }

            $post->load(['user', 'images', 'hashtags', 'mentions.mentionedUser'])
                ->loadCount(['likes', 'comments'])
                ->loadExists([
                    'likes as is_liked'          => fn($q) => $q->where('user_id', $userId),
                    'bookmarks as is_bookmarked' => fn($q) => $q->where('user_id', $userId),
                ]);

            return response()->json([
                'message' => 'Post published successfully!',
                'post'    => $post->toFeedArray($userId),
            ], 201)->header('Cache-Control', 'private, no-store');
        });
    }

    // ─── My Posts ─────────────────────────────────────────────────────────────

    public function myPosts(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $posts = $this->baseQuery($userId)
            ->where('user_id', $userId)
            ->latest()
            ->get()
            ->map(fn($p) => $p->toFeedArray($userId));

        return response()->json($posts)
            ->header('Cache-Control', 'private, no-store, no-cache, must-revalidate');
    }

    // ─── Global & Discovery Feed ──────────────────────────────────────────────

    public function feed(Request $request): JsonResponse
    {
        $user    = $request->user();
        $userId  = $user->id;
        $perPage = (int) $request->get('per_page', 15);
        $page    = (int) $request->get('page', 1);
        $filter  = $request->get('filter', 'latest'); // 'latest', 'popular', 'most_discussed'
        $query   = trim($request->get('q', ''));
        $catId   = $request->get('category_id');

        $builder = $this->baseQuery($userId)
            ->visibleTo($user);

        // Filter by category if supplied
        if (!empty($catId)) {
            $builder->where('category_id', $catId);
        }

        // Search query across content, hashtags, or author name/username
        if (!empty($query)) {
            $cleaned = ltrim($query, '#@');
            $builder->where(function ($q) use ($query, $cleaned) {
                $q->where('post_content', 'like', "%{$query}%")
                  ->orWhereHas('hashtags', fn($h) => $h->where('name', 'like', "%{$cleaned}%"))
                  ->orWhereHas('user', function ($u) use ($query, $cleaned) {
                      $u->where('name', 'like', "%{$query}%")
                        ->orWhere('username', 'like', "%{$cleaned}%");
                  });
            });
        }

        // Sorting / Popularity filtering
        if ($filter === 'popular') {
            $builder->orderByRaw('CAST(likes AS UNSIGNED) DESC')
                    ->latest();
        } elseif ($filter === 'most_discussed') {
            $builder->orderByRaw('CAST(comments_count AS UNSIGNED) DESC')
                    ->latest();
        } else {
            $builder->latest();
        }

        $posts = $builder->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data'         => collect($posts->items())->map(fn($p) => $p->toFeedArray($userId)),
            'current_page' => $posts->currentPage(),
            'last_page'    => $posts->lastPage(),
            'per_page'     => $posts->perPage(),
            'total'        => $posts->total(),
            'has_more'     => $posts->hasMorePages(),
        ])->header('Cache-Control', 'private, no-store');
    }

    // ─── Hashtag Feed ─────────────────────────────────────────────────────────

    public function byHashtag(Request $request, string $tag): JsonResponse
    {
        $user    = $request->user();
        $userId  = $user->id;
        $perPage = (int) $request->get('per_page', 15);
        $page    = (int) $request->get('page', 1);

        $posts = $this->baseQuery($userId)
            ->visibleTo($user)
            ->whereHas('hashtags', fn($q) => $q->where('name', strtolower($tag)))
            ->latest()
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'tag'          => $tag,
            'data'         => collect($posts->items())->map(fn($p) => $p->toFeedArray($userId)),
            'current_page' => $posts->currentPage(),
            'last_page'    => $posts->lastPage(),
            'total'        => $posts->total(),
            'has_more'     => $posts->hasMorePages(),
        ])->header('Cache-Control', 'private, no-store');
    }

    // ─── Single Post ──────────────────────────────────────────────────────────

    public function show(Request $request, TimeCapsule $post): JsonResponse
    {
        $user   = $request->user();
        $userId = $user->id;

        // Privacy authorization check
        if (!$request->user()->can('view', $post)) {
            return response()->json(['message' => 'This post is private or unavailable.'], 403);
        }

        $loadedPost = $this->baseQuery($userId)->findOrFail($post->id);

        return response()->json($loadedPost->toFeedArray($userId));
    }

    // ─── Edit a Post ──────────────────────────────────────────────────────────

    public function update(Request $request, TimeCapsule $post): JsonResponse
    {
        // Authorization check
        if (!$request->user()->can('update', $post)) {
            return response()->json(['message' => 'Unauthorized. You can only edit your own posts.'], 403);
        }

        $validated = $request->validate([
            'post_content' => 'nullable|string|max:5000',
            'visibility'   => 'nullable|in:public,followers,only_me',
        ]);

        $userId = $request->user()->id;

        DB::transaction(function () use ($post, $validated, $userId) {
            $post->update(array_filter($validated, fn($v) => $v !== null));

            $text = $post->post_content ?? '';
            if ($text) {
                PostContentService::syncHashtags($post, $text);
                PostContentService::syncMentions($post, $text, $userId);
            } else {
                PostContentService::deleteForPost($post);
            }
        });

        $loadedPost = $this->baseQuery($userId)->findOrFail($post->id);

        return response()->json([
            'message' => 'Post updated successfully.',
            'post'    => $loadedPost->toFeedArray($userId),
        ]);
    }

    // ─── Delete a Post ────────────────────────────────────────────────────────

    public function destroy(Request $request, TimeCapsule $post): JsonResponse
    {
        // Authorization check
        if (!$request->user()->can('delete', $post)) {
            return response()->json(['message' => 'Unauthorized. You can only delete your own posts.'], 403);
        }

        DB::transaction(function () use ($post) {
            PostContentService::deleteForPost($post);

            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            foreach ($post->images()->get() as $img) {
                Storage::disk('public')->delete($img->path);
            }
            $post->delete();
        });

        return response()->json(['message' => 'Post deleted successfully.']);
    }

    // ─── Share a Post ─────────────────────────────────────────────────────────

    public function share(Request $request, TimeCapsule $post): JsonResponse
    {
        $userId = $request->user()->id;

        // Privacy check
        if (!$request->user()->can('view', $post)) {
            return response()->json(['message' => 'Cannot share a private post.'], 403);
        }

        DB::transaction(function () use ($userId, $post) {
            PostShare::create([
                'user_id' => $userId,
                'post_id' => $post->id,
            ]);

            $post->shares = (int) ($post->shares ?? 0) + 1;
            $post->save();
        });

        return response()->json([
            'message'      => 'Post shared successfully.',
            'shares_count' => (int) $post->shares,
        ]);
    }
}
