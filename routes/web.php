<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\SocialProfileController;
use App\Http\Controllers\TimeCapsuleController;
use App\Http\Controllers\TimeLikeController;
use App\Http\Controllers\TimeCommentController;
use App\Http\Controllers\PostBookmarkController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicProfileController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');



Route::middleware(['auth'])->group(function () {

    Route::get('/profile', [SocialProfileController::class, 'show'])
        ->name('profile');

    Route::post('/profile', [SocialProfileController::class, 'update'])
        ->name('social-profile.update');

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // ── Post CRUD ───────────────────────────────────────────────────────────
    Route::post('/posts', [TimeCapsuleController::class, 'store'])
        ->name('posts.store');

    Route::get('/my-posts', [TimeCapsuleController::class, 'myPosts'])
        ->name('posts.mine');

    Route::get('/feed', [TimeCapsuleController::class, 'feed'])
        ->name('posts.feed');

    Route::get('/feed/hashtag/{tag}', [TimeCapsuleController::class, 'byHashtag'])
        ->name('posts.hashtag');

    Route::get('/posts/{post}', [TimeCapsuleController::class, 'show'])
        ->name('posts.show');

    Route::put('/posts/{post}', [TimeCapsuleController::class, 'update'])
        ->name('posts.update');

    Route::delete('/posts/{post}', [TimeCapsuleController::class, 'destroy'])
        ->name('posts.destroy');

    // ── Likes ───────────────────────────────────────────────────────────────
    Route::post('/posts/{post}/like', [TimeLikeController::class, 'toggle'])
        ->name('posts.like');

    // ── Comments ────────────────────────────────────────────────────────────
    Route::get('/posts/{post}/comments', [TimeCommentController::class, 'index'])
        ->name('posts.comments.index');

    Route::post('/posts/{post}/comments', [TimeCommentController::class, 'store'])
        ->name('posts.comments.store');

    Route::put('/posts/{post}/comments/{comment}', [TimeCommentController::class, 'update'])
        ->name('posts.comments.update');

    Route::delete('/posts/{post}/comments/{comment}', [TimeCommentController::class, 'destroy'])
        ->name('posts.comments.destroy');

    // ── Bookmarks ───────────────────────────────────────────────────────────
    Route::post('/posts/{post}/bookmark', [PostBookmarkController::class, 'toggle'])
        ->name('posts.bookmark');

    Route::get('/bookmarks', [PostBookmarkController::class, 'index'])
        ->name('bookmarks.index');

    // ── Shares ──────────────────────────────────────────────────────────────
    Route::post('/posts/{post}/share', [TimeCapsuleController::class, 'share'])
        ->name('posts.share');

    // ── Public User Profiles (by username) ──────────────────────────────────
    // IMPORTANT: This must be placed BEFORE the /users/{user}/follow, /followers, /following routes
    Route::get('/users/{username}', [PublicProfileController::class, 'show'])
        ->name('users.profile')
        ->where('username', '[a-zA-Z0-9_.\-]+');

    // ── Follows & Mentions ──────────────────────────────────────────────────
    Route::post('/users/{user}/follow', [FollowController::class, 'toggle'])
        ->name('users.follow');

    Route::get('/users/search', [FollowController::class, 'search'])
        ->name('users.search');

    Route::get('/users/{user}/followers', [FollowController::class, 'followers'])
        ->name('users.followers');

    Route::get('/users/{user}/following', [FollowController::class, 'following'])
        ->name('users.following');

    // ── Notifications API ───────────────────────────────────────────────────
    Route::get('/api/notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');

    Route::post('/api/notifications/read-all', [NotificationController::class, 'markAllAsRead'])
        ->name('notifications.readAll');

    Route::post('/api/notifications/{id}/read', [NotificationController::class, 'markAsRead'])
        ->name('notifications.read');

    Route::delete('/api/notifications/{id}', [NotificationController::class, 'destroy'])
        ->name('notifications.destroy');

    Route::get('/api/notifications/unread-count', [NotificationController::class, 'unreadCount'])
        ->name('notifications.unreadCount');

});


Route::get('/notification', function () {
    return Inertia::render('notification');
})->name('notification');

// Route::get('/profile', function () {
//     return Inertia::render('profile');
// })->name('profile');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/popularfeed', function () {
    return Inertia::render('popular');
})->name('popular');

Route::get('/allpost', function () {
    return Inertia::render('allpost');
})->name('allpost');

Route::get('/home', function () {
    return Inertia::render('home');
})->name('Home');

Route::get('/privacy', function () {
    return Inertia::render('privacy');
})->name('privacy');

Route::get('/help', function () {
    return Inertia::render('help');
})->name('help');

Route::get('/saved', function () {
    return Inertia::render('savedpost');
})->name('savedpost');

Route::get('/followersfollowing', function () {
    return Inertia::render('followerfollowing');
})->name('followerfollowing');



Route::get('/notificationsetting', function () {
    return Inertia::render('notificationsetting');
})->name('notificationsetting');

// Route::middleware(['auth'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
