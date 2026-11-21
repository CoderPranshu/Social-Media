<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Storage;

class UserFollowedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public User $actor
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'        => 'follow',
            'action_text' => 'started following you',
            'highlight'   => null,
            'actor'       => [
                'id'          => $this->actor->id,
                'name'        => $this->actor->name,
                'username'    => $this->actor->username,
                'avatar_path' => $this->actor->avatar_path ? Storage::disk('public')->url($this->actor->avatar_path) : null,
            ],
        ];
    }
}

