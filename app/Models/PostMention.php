<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostMention extends Model
{
    protected $table = 'post_mentions';
    protected $fillable = ['post_id', 'mentioned_user_id'];

    public function mentionedUser()
    {
        return $this->belongsTo(User::class, 'mentioned_user_id');
    }

    public function post()
    {
        return $this->belongsTo(TimeCapsule::class, 'post_id');
    }
}

