<?php

namespace App\Http\Controllers;

use App\Models\TimeCapsule;
use App\Models\TimeLike;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TimeLikeController extends Controller
{
    /**
     * Toggle like/unlike for a post.
     * Returns the new liked state and updated like count.
     */
    public function toggle(Request $request, TimeCapsule $post): JsonResponse
    {
        $userId = $request->user()->id;

        $existingLike = TimeLike::where('user_id', $userId)
            ->where('post_id', $post->id)
            ->first();

        if ($existingLike) {
            // Unlike
            DB::transaction(function () use ($existingLike, $post) {
                $existingLike->delete();
                // Keep the string column in sync (clamped at 0)
                $post->likes = max(0, (int) $post->likes - 1);
                $post->save();
            });

            $liked = false;
        } else {
            // Like
            DB::transaction(function () use ($userId, $post) {
                TimeLike::firstOrCreate([
                    'user_id' => $userId,
                    'post_id' => $post->id,
                ]);
                $post->likes = (int) $post->likes + 1;
                $post->save();
            });

            $liked = true;
        }

        // Return the real count from the relational table
        $count = TimeLike::where('post_id', $post->id)->count();

        return response()->json([
            'liked'      => $liked,
            'likes_count' => $count,
        ]);
    }
}
