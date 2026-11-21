<?php

namespace App\Notifications;

use App\Models\TimeCapsule;
use App\Models\TimeComment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Storage;

class PostCommentedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public User $actor,
        public TimeCapsule $post,
        public TimeComment $comment
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $snippet = $this->post->post_content ? \Illuminate\Support\Str::limit($this->post->post_content, 60) : 'image post';
        $commentSnippet = \Illuminate\Support\Str::limit($this->comment->comment, 80);

        return [
            'type'        => 'comment',
            'action_text' => 'commented on your prediction',
            'highlight'   => "“{$snippet}”",
            'sub_quote'   => $commentSnippet,
            'post_id'     => $this->post->id,
            'comment_id'  => $this->comment->id,
            'actor'       => [
                'id'          => $this->actor->id,
                'name'        => $this->actor->name,
                'username'    => $this->actor->username,
                'avatar_path' => $this->actor->avatar_path ? Storage::disk('public')->url($this->actor->avatar_path) : null,
            ],
        ];
    }
}

