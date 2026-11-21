<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class TimeCapsule extends Model
{
    protected $fillable = [
        'post_content',
        'user_id',
        'likes',
        'shares',
        'comments_count',
        'status',
        'visibility',
        'date',
        'year',
        'category_id',
        'image',
    ];

    // ─── Relationships ───────────────────────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function likes()
    {
        return $this->hasMany(TimeLike::class, 'post_id');
    }

    public function comments()
    {
        return $this->hasMany(TimeComment::class, 'post_id');
    }

    public function bookmarks()
    {
        return $this->hasMany(PostBookmark::class, 'post_id');
    }

    public function images()
    {
        return $this->hasMany(PostImage::class, 'post_id')->orderBy('sort_order');
    }

    public function hashtags()
    {
        return $this->belongsToMany(Hashtag::class, 'post_hashtags', 'post_id', 'hashtag_id');
    }

    public function mentions()
    {
        return $this->hasMany(PostMention::class, 'post_id');
    }

    public function postShares()
    {
        return $this->hasMany(PostShare::class, 'post_id');
    }

    /**
     * Scope to posts visible to the given user according to privacy rules:
     * - Public: visible to everyone
     * - Followers: visible only to author and author's followers
     * - Only me: visible only to author
     */
    public function scopeVisibleTo($query, ?User $user)
    {
        if (!$user) {
            return $query->where('visibility', 'public')->where('status', 'published');
        }

        return $query->where('status', 'published')
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('visibility', 'public')
                  ->orWhere(function ($q2) use ($user) {
                      $q2->where('visibility', 'followers')
                         ->whereIn('user_id', function ($sub) use ($user) {
                             $sub->select('following_id')
                                 ->from('follows')
                                 ->where('follower_id', $user->id);
                         });
                  });
            });
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /**
     * Return all image URLs for this post.
     * Falls back to the legacy `image` column if no rows in post_images.
     */
    public function allImageUrls(): array
    {
        $fromTable = $this->images->map(fn($img) => Storage::disk('public')->url($img->path))->toArray();

        if (count($fromTable) > 0) {
            return $fromTable;
        }

        if ($this->image) {
            return [Storage::disk('public')->url($this->image)];
        }

        return [];
    }

    /**
     * Format a post as the standard API response shape.
     */
    public function toFeedArray(int $authUserId): array
    {
        return [
            'id'             => $this->id,
            'post_content'   => $this->post_content,
            'visibility'     => $this->visibility ?? 'public',
            'status'         => $this->status,
            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
            'likes_count'    => (int) ($this->likes_count ?? $this->likes ?? 0),
            'comments_count' => (int) ($this->comments_count ?? 0),
            'shares_count'   => (int) ($this->shares ?? 0),
            'is_liked'       => (bool) ($this->is_liked ?? false),
            'is_bookmarked'  => (bool) ($this->is_bookmarked ?? false),
            'images'         => $this->allImageUrls(),
            'hashtags'       => $this->relationLoaded('hashtags')
                ? $this->hashtags->pluck('name')->toArray()
                : [],
            'mentions'       => $this->relationLoaded('mentions')
                ? $this->mentions->map(fn($m) => [
                    'id'       => $m->mentionedUser?->id,
                    'name'     => $m->mentionedUser?->name,
                    'username' => $m->mentionedUser?->username,
                ])->filter(fn($m) => $m['id'])->values()->toArray()
                : [],
            'author'         => $this->user ? [
                'id'           => $this->user->id,
                'name'         => $this->user->name,
                'username'     => $this->user->username,
                'avatar_path'  => $this->user->avatar_path
                    ? Storage::disk('public')->url($this->user->avatar_path)
                    : null,
                'is_following' => ($authUserId !== $this->user->id)
                    ? \App\Models\Follow::where('follower_id', $authUserId)->where('following_id', $this->user->id)->exists()
                    : false,
            ] : null,
        ];
    }
}
