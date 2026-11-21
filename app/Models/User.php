<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'bio',
        'location',
        'avatar_path',
        'cover_path',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function posts()
    {
        return $this->hasMany(TimeCapsule::class, 'user_id');
    }

    /** Users this user is following */
    public function following()
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id')
            ->withTimestamps();
    }

    /** Users who follow this user */
    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id')
            ->withTimestamps();
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    public function isFollowing(int $userId): bool
    {
        return Follow::where('follower_id', $this->id)
            ->where('following_id', $userId)
            ->exists();
    }

    public function followersCount(): int
    {
        return Follow::where('following_id', $this->id)->count();
    }

    public function followingCount(): int
    {
        return Follow::where('follower_id', $this->id)->count();
    }
}
