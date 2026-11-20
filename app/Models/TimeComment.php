<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeComment extends Model
{
    protected $fillable = ['user_id', 'post_id', 'comment', 'parent_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function post()
    {
        return $this->belongsTo(TimeCapsule::class, 'post_id');
    }

    public function parent()
    {
        return $this->belongsTo(TimeComment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(TimeComment::class, 'parent_id')->with('user');
    }
}
