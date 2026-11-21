<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get paginated notifications for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $perPage = (int) $request->get('per_page', 25);
        $filter = $request->get('filter', 'all'); // 'all', 'unread', 'likes', 'comments', 'follows', 'mentions'

        $query = $user->notifications();

        if ($filter === 'unread') {
            $query->whereNull('read_at');
        } elseif (in_array($filter, ['like', 'comment', 'follow', 'mention', 'reply'])) {
            $query->where('data->type', $filter);
        }

        $notifications = $query->paginate($perPage);

        $data = collect($notifications->items())->map(function ($n) {
            $raw = $n->data ?? [];
            return [
                'id'           => $n->id,
                'type'         => $raw['type'] ?? 'general',
                'name'         => $raw['actor']['name'] ?? 'Someone',
                'username'     => $raw['actor']['username'] ?? null,
                'avatar_path'  => $raw['actor']['avatar_path'] ?? null,
                'action_text'  => $raw['action_text'] ?? 'interacted with your account',
                'highlight'    => $raw['highlight'] ?? null,
                'sub_quote'    => $raw['sub_quote'] ?? null,
                'post_id'      => $raw['post_id'] ?? null,
                'comment_id'   => $raw['comment_id'] ?? null,
                'is_unread'    => $n->read_at === null,
                'created_at'   => $n->created_at->toISOString(),
                'time_ago'     => $n->created_at->diffForHumans(),
            ];
        });

        return response()->json([
            'data'         => $data,
            'current_page' => $notifications->currentPage(),
            'last_page'    => $notifications->lastPage(),
            'total'        => $notifications->total(),
            'unread_count' => $user->unreadNotifications()->count(),
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->where('id', $id)->first();

        if ($notification && $notification->read_at === null) {
            $notification->markAsRead();
        }

        return response()->json([
            'message'      => 'Marked as read',
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'message'      => 'All marked as read',
            'unread_count' => 0,
        ]);
    }

    /**
     * Delete a notification.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->delete();
        }

        return response()->json([
            'message'      => 'Notification deleted',
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    /**
     * Return only the unread count.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        return response()->json([
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ]);
    }
}

