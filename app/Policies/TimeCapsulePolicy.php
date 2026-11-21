<?php

namespace App\Policies;

use App\Models\TimeCapsule;
use App\Models\User;

class TimeCapsulePolicy
{
    /**
     * Determine whether the user can view the post.
     */
    public function view(?User $user, TimeCapsule $post): bool
    {
        if ($post->status !== 'published' && (!$user || $user->id !== (int) $post->user_id)) {
            return false;
        }

        if ($post->visibility === 'public') {
            return true;
        }

        if (!$user) {
            return false;
        }

        if ($user->id === (int) $post->user_id) {
            return true;
        }

        if ($post->visibility === 'followers') {
            return $post->user && $post->user->followers()->where('follower_id', $user->id)->exists();
        }

        if ($post->visibility === 'only_me') {
            return $user->id === (int) $post->user_id;
        }

        return false;
    }

    /**
     * Determine whether the user can update the post.
     */
    public function update(User $user, TimeCapsule $post): bool
    {
        return $user->id === (int) $post->user_id;
    }

    /**
     * Determine whether the user can delete the post.
     */
    public function delete(User $user, TimeCapsule $post): bool
    {
        return $user->id === (int) $post->user_id;
    }
}

