<?php

namespace App\Notifications;

use App\Models\TimeCapsule;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Storage;

class UserMentionedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public User $actor,
        public TimeCapsule $post
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $snippet = $this->post->post_content ? \Illuminate\Support\Str::limit($this->post->post_content, 60) : 'a post';

        return [
            'type'        => 'mention',
            'action_text' => 'mentioned you in a post',
            'highlight'   => "“{$snippet}”",
            'post_id'     => $this->post->id,
            'actor'       => [
                'id'          => $this->actor->id,
                'name'        => $this->actor->name,
                'username'    => $this->actor->username,
                'avatar_path' => $this->actor->avatar_path ? Storage::disk('public')->url($this->actor->avatar_path) : null,
            ],
        ];
    }
}

