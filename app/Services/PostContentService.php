<?php

namespace App\Services;

use App\Models\Hashtag;
use App\Models\PostMention;
use App\Models\TimeCapsule;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PostContentService
{
    /**
     * Extract #hashtags from text. Returns lowercased names without #.
     */
    public static function extractHashtags(string $text): array
    {
        preg_match_all('/#([a-zA-Z0-9_]+)/', $text, $matches);
        return array_values(array_unique(
            array_map('strtolower', $matches[1] ?? [])
        ));
    }

    /**
     * Extract @mentions from text. Returns lowercased usernames without @.
     */
    public static function extractMentions(string $text): array
    {
        preg_match_all('/@([a-zA-Z0-9_]+)/', $text, $matches);
        return array_values(array_unique(
            array_map('strtolower', $matches[1] ?? [])
        ));
    }

    /**
     * Sync hashtags for a post after create/update.
     * - Creates new hashtag rows if needed.
     * - Updates post_hashtags pivot.
     * - Keeps posts_count accurate.
     */
    public static function syncHashtags(TimeCapsule $post, string $text): void
    {
        $names = self::extractHashtags($text);

        // Get old hashtag IDs for this post (before sync)
        $oldIds = DB::table('post_hashtags')
            ->where('post_id', $post->id)
            ->pluck('hashtag_id')
            ->toArray();

        $newIds = [];

        foreach ($names as $name) {
            $hashtag = Hashtag::firstOrCreate(['name' => $name]);
            $newIds[] = $hashtag->id;

            // Insert pivot if not exists
            DB::table('post_hashtags')->insertOrIgnore([
                'post_id'    => $post->id,
                'hashtag_id' => $hashtag->id,
            ]);
        }

        // Remove stale pivots
        $removeIds = array_diff($oldIds, $newIds);
        if ($removeIds) {
            DB::table('post_hashtags')
                ->where('post_id', $post->id)
                ->whereIn('hashtag_id', $removeIds)
                ->delete();
        }

        // Recount all affected hashtags
        $allAffected = array_unique(array_merge($oldIds, $newIds));
        foreach ($allAffected as $hId) {
            $count = DB::table('post_hashtags')->where('hashtag_id', $hId)->count();
            DB::table('hashtags')->where('id', $hId)->update(['posts_count' => $count]);
        }
    }

    /**
     * Sync @mentions for a post. Silently skips unknown usernames.
     */
    public static function syncMentions(TimeCapsule $post, string $text, int $authorId): void
    {
        $usernames = self::extractMentions($text);

        $existingMentionIds = DB::table('post_mentions')
            ->where('post_id', $post->id)
            ->pluck('mentioned_user_id')
            ->toArray();

        // Remove old mentions
        DB::table('post_mentions')->where('post_id', $post->id)->delete();

        $author = User::find($authorId);

        foreach ($usernames as $username) {
            $user = User::where('username', $username)->first();
            if (!$user || $user->id === $authorId) continue; // skip self-mention

            DB::table('post_mentions')->insertOrIgnore([
                'post_id'           => $post->id,
                'mentioned_user_id' => $user->id,
            ]);

            // Only notify if not already notified for this post
            if (!in_array($user->id, $existingMentionIds) && $author) {
                $user->notify(new \App\Notifications\UserMentionedNotification($author, $post));
            }
        }
    }

    /**
     * Delete all hashtag/mention data for a post and recount hashtags.
     */
    public static function deleteForPost(TimeCapsule $post): void
    {
        $hashtagIds = DB::table('post_hashtags')
            ->where('post_id', $post->id)
            ->pluck('hashtag_id')
            ->toArray();

        DB::table('post_hashtags')->where('post_id', $post->id)->delete();
        DB::table('post_mentions')->where('post_id', $post->id)->delete();

        foreach ($hashtagIds as $hId) {
            $count = DB::table('post_hashtags')->where('hashtag_id', $hId)->count();
            DB::table('hashtags')->where('id', $hId)->update(['posts_count' => $count]);
        }
    }
}

