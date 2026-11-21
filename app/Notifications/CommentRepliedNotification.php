<?php

namespace App\Notifications;

use App\Models\TimeCapsule;
use App\Models\TimeComment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Storage;

class CommentRepliedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public User $actor,
        public TimeCapsule $post,
        public TimeComment $parentComment,
        public TimeComment $reply
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $replySnippet = \Illuminate\Support\Str::limit($this->reply->comment, 80);

        return [
            'type'        => 'reply',
            'action_text' => 'replied to your comment',
            'highlight'   => "“{$replySnippet}”",
            'post_id'     => $this->post->id,
            'comment_id'  => $this->reply->id,
            'actor'       => [
                'id'          => $this->actor->id,
                'name'        => $this->actor->name,
                'username'    => $this->actor->username,
                'avatar_path' => $this->actor->avatar_path ? Storage::disk('public')->url($this->actor->avatar_path) : null,
            ],
        ];
    }
}

