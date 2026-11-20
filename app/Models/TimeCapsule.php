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
            'id'              => $this->id,
            'post_content'    => $this->post_content,
            'visibility'      => $this->visibility ?? 'public',
            'status'          => $this->status,
            'created_at'      => $this->created_at,
            'updated_at'      => $this->updated_at,
            'likes_count'     => (int) $this->likes_count,
            'comments_count'  => (int) $this->comments_count,
            'shares_count'    => (int) ($this->shares ?? 0),
            'is_liked'        => (bool) $this->is_liked,
            'is_bookmarked'   => (bool) $this->is_bookmarked,
            'images'          => $this->allImageUrls(),
            'author'          => $this->user ? [
                'id'          => $this->user->id,
                'name'        => $this->user->name,
                'username'    => $this->user->username,
                'avatar_path' => $this->user->avatar_path
                    ? Storage::disk('public')->url($this->user->avatar_path)
                    : null,
            ] : null,
        ];
    }
}
