<?php

namespace App\Http\Controllers;

use App\Models\TimeCapsule;
use App\Models\TimeComment;
use App\Notifications\CommentRepliedNotification;
use App\Notifications\PostCommentedNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TimeCommentController extends Controller
{
    /**
     * List comments for a post (top-level only, with replies eager-loaded).
     */
    public function index(Request $request, TimeCapsule $post): JsonResponse
    {
        // Privacy check
        if (!$request->user()->can('view', $post)) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $comments = TimeComment::with(['user', 'replies.user'])
            ->where('post_id', $post->id)
            ->whereNull('parent_id')
            ->latest()
            ->get()
            ->map(fn($c) => $this->formatComment($c));

        return response()->json($comments);
    }

    /**
     * Add a comment (or reply) to a post.
     */
    public function store(Request $request, TimeCapsule $post): JsonResponse
    {
        // Privacy check
        if (!$request->user()->can('view', $post)) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'comment'   => 'required|string|max:2000',
            'parent_id' => 'nullable|integer|exists:time_comments,id',
        ]);

        $user = $request->user();

        $comment = DB::transaction(function () use ($user, $post, $validated) {
            $c = TimeComment::create([
                'user_id'   => $user->id,
                'post_id'   => $post->id,
                'comment'   => $validated['comment'],
                'parent_id' => $validated['parent_id'] ?? null,
            ]);

            // Always update comments counter on the post
            $post->comments_count = TimeComment::where('post_id', $post->id)->count();
            $post->save();

            return $c;
        });

        $comment->load(['user', 'replies.user']);

        // Notifications
        if (!empty($validated['parent_id'])) {
            $parent = TimeComment::with('user')->find($validated['parent_id']);
            if ($parent && $parent->user && (int) $parent->user_id !== $user->id) {
                $parent->user->notify(new CommentRepliedNotification($user, $post, $parent, $comment));
            }
        } else {
            if ($post->user && (int) $post->user_id !== $user->id) {
                $post->user->notify(new PostCommentedNotification($user, $post, $comment));
            }
        }

        return response()->json([
            'message' => 'Comment added successfully.',
            'comment' => $this->formatComment($comment),
        ], 201);
    }

    /**
     * Delete a comment (only by its author).
     */
    public function destroy(Request $request, TimeCapsule $post, TimeComment $comment): JsonResponse
    {
        if ((int) $comment->user_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Unauthorized. You can only delete your own comments.'], 403);
        }

        DB::transaction(function () use ($comment, $post) {
            // Delete replies first
            $comment->replies()->delete();
            $comment->delete();

            $post->comments_count = TimeComment::where('post_id', $post->id)->count();
            $post->save();
        });

        return response()->json(['message' => 'Comment deleted.']);
    }

    /**
     * Edit a comment (only by its author).
     */
    public function update(Request $request, TimeCapsule $post, TimeComment $comment): JsonResponse
    {
        if ((int) $comment->user_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Unauthorized. You can only edit your own comments.'], 403);
        }

        $validated = $request->validate([
            'comment' => 'required|string|max:2000',
        ]);

        $comment->update(['comment' => $validated['comment']]);
        $comment->load(['user', 'replies.user']);

        return response()->json([
            'message' => 'Comment updated.',
            'comment' => $this->formatComment($comment),
        ]);
    }

    // ─── Helper ──────────────────────────────────────────────────────────────

    private function formatComment(TimeComment $c): array
    {
        return [
            'id'         => $c->id,
            'comment'    => $c->comment,
            'parent_id'  => $c->parent_id,
            'created_at' => $c->created_at,
            'author'     => $c->user ? [
                'id'          => $c->user->id,
                'name'        => $c->user->name,
                'username'    => $c->user->username,
                'avatar_path' => $c->user->avatar_path
                    ? Storage::disk('public')->url($c->user->avatar_path)
                    : null,
            ] : null,
            'replies'    => $c->replies
                ? $c->replies->map(fn($r) => $this->formatComment($r))->toArray()
                : [],
        ];
    }
}
