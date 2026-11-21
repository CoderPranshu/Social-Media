<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FollowController extends Controller
{
    /**
     * Toggle follow/unfollow a user.
     */
    public function toggle(Request $request, User $user): JsonResponse
    {
        $currentUserId = $request->user()->id;

        if ($currentUserId === $user->id) {
            return response()->json(['message' => 'You cannot follow yourself.'], 422);
        }

        $existing = Follow::where('follower_id', $currentUserId)
            ->where('following_id', $user->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $isFollowing = false;
        } else {
            Follow::create([
                'follower_id'  => $currentUserId,
                'following_id' => $user->id,
            ]);
            $isFollowing = true;

            // Notify user
            $user->notify(new \App\Notifications\UserFollowedNotification($request->user()));
        }

        return response()->json([
            'is_following'    => $isFollowing,
            'followers_count' => $user->followersCount(),
            'following_count' => $user->followingCount(),
        ]);
    }

    /**
     * Search users for mentions autocomplete or user search.
     */
    public function search(Request $request): JsonResponse
    {
        $query = trim($request->get('q', ''));

        if (empty($query)) {
            return response()->json([]);
        }

        $users = User::query()
            ->where('id', '!=', $request->user()->id)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('username', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get(['id', 'name', 'username', 'avatar_path'])
            ->map(function ($u) {
                return [
                    'id'          => $u->id,
                    'name'        => $u->name,
                    'username'    => $u->username,
                    'avatar_path' => $u->avatar_path ? Storage::disk('public')->url($u->avatar_path) : null,
                ];
            });

        return response()->json($users);
    }

    /**
     * Get followers list for a user.
     */
    public function followers(Request $request, User $user): JsonResponse
    {
        $currentUserId = $request->user()->id;

        $followers = $user->followers()
            ->get(['users.id', 'users.name', 'users.username', 'users.avatar_path', 'users.headline'])
            ->map(function ($u) use ($currentUserId) {
                return [
                    'id'           => $u->id,
                    'name'         => $u->name,
                    'username'     => $u->username,
                    'headline'     => $u->headline,
                    'avatar_path'  => $u->avatar_path ? Storage::disk('public')->url($u->avatar_path) : null,
                    'is_following' => Follow::where('follower_id', $currentUserId)->where('following_id', $u->id)->exists(),
                ];
            });

        return response()->json($followers);
    }

    /**
     * Get following list for a user.
     */
    public function following(Request $request, User $user): JsonResponse
    {
        $currentUserId = $request->user()->id;

        $following = $user->following()
            ->get(['users.id', 'users.name', 'users.username', 'users.avatar_path', 'users.headline'])
            ->map(function ($u) use ($currentUserId) {
                return [
                    'id'           => $u->id,
                    'name'         => $u->name,
                    'username'     => $u->username,
                    'headline'     => $u->headline,
                    'avatar_path'  => $u->avatar_path ? Storage::disk('public')->url($u->avatar_path) : null,
                    'is_following' => Follow::where('follower_id', $currentUserId)->where('following_id', $u->id)->exists(),
                ];
            });

        return response()->json($following);
    }
}

