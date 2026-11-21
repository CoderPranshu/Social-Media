<?php

use App\Models\Follow;
use App\Models\Hashtag;
use App\Models\PostBookmark;
use App\Models\TimeCapsule;
use App\Models\TimeComment;
use App\Models\TimeLike;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    // Clean up tables in testing database between tests without fresh/wipe
    DB::table('notifications')->delete();
    DB::table('post_shares')->delete();
    DB::table('post_mentions')->delete();
    DB::table('post_hashtags')->delete();
    DB::table('hashtags')->delete();
    DB::table('follows')->delete();
    DB::table('post_bookmarks')->delete();
    DB::table('post_images')->delete();
    DB::table('time_comments')->delete();
    DB::table('time_likes')->delete();
    DB::table('time_capsules')->delete();
    DB::table('users')->delete();
});

test('user can create a text-only post', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/posts', [
            'post_content' => 'Hello world! This is my first prediction post #future #tech',
            'visibility'   => 'public',
        ])
        ->assertStatus(201);

    $postId = $response->json('post.id');

    $this->assertDatabaseHas('time_capsules', [
        'id'           => $postId,
        'user_id'      => $user->id,
        'visibility'   => 'public',
        'status'       => 'published',
    ]);

    // Check hashtags were extracted
    $this->assertDatabaseHas('hashtags', ['name' => 'future']);
    $this->assertDatabaseHas('hashtags', ['name' => 'tech']);
});

test('user can create post with multiple images', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $img1 = UploadedFile::fake()->create('slide1.jpg', 50, 'image/jpeg');
    $img2 = UploadedFile::fake()->create('slide2.png', 50, 'image/png');

    $response = $this->actingAs($user)
        ->postJson('/posts', [
            'post_content' => 'Multi image post',
            'images'       => [$img1, $img2],
            'visibility'   => 'public',
        ])
        ->assertStatus(201);

    $postId = $response->json('post.id');

    $this->assertDatabaseHas('post_images', ['post_id' => $postId, 'sort_order' => 0]);
    $this->assertDatabaseHas('post_images', ['post_id' => $postId, 'sort_order' => 1]);
});

test('like and unlike system prevents duplicates and updates counts', function () {
    $user = User::factory()->create();
    $author = User::factory()->create();
    $post = TimeCapsule::create([
        'user_id'        => $author->id,
        'post_content'   => 'A post to like',
        'visibility'     => 'public',
        'status'         => 'published',
        'likes'          => '0',
    ]);

    // Like
    $likeRes = $this->actingAs($user)
        ->postJson("/posts/{$post->id}/like")
        ->assertOk()
        ->assertJson(['liked' => true, 'likes_count' => 1]);

    $this->assertDatabaseHas('time_likes', [
        'user_id' => $user->id,
        'post_id' => $post->id,
    ]);

    // Author receives notification
    $this->assertEquals(1, $author->notifications()->count());

    // Unlike
    $unlikeRes = $this->actingAs($user)
        ->postJson("/posts/{$post->id}/like")
        ->assertOk()
        ->assertJson(['liked' => false, 'likes_count' => 0]);

    $this->assertDatabaseMissing('time_likes', [
        'user_id' => $user->id,
        'post_id' => $post->id,
    ]);
});

test('comment and reply system works with notifications', function () {
    $author = User::factory()->create();
    $commenter = User::factory()->create();
    $replier = User::factory()->create();

    $post = TimeCapsule::create([
        'user_id'        => $author->id,
        'post_content'   => 'Great post',
        'visibility'     => 'public',
        'status'         => 'published',
    ]);

    // Add top-level comment
    $comRes = $this->actingAs($commenter)
        ->postJson("/posts/{$post->id}/comments", [
            'comment' => 'This is a top-level comment',
        ])
        ->assertStatus(201);

    $commentId = $comRes->json('comment.id');
    $this->assertDatabaseHas('time_comments', ['id' => $commentId, 'parent_id' => null]);
    $this->assertEquals(1, $author->notifications()->count());

    // Add reply
    $replyRes = $this->actingAs($replier)
        ->postJson("/posts/{$post->id}/comments", [
            'comment'   => 'This is a reply to the comment',
            'parent_id' => $commentId,
        ])
        ->assertStatus(201);

    $replyId = $replyRes->json('comment.id');
    $this->assertDatabaseHas('time_comments', ['id' => $replyId, 'parent_id' => $commentId]);
    $this->assertEquals(1, $commenter->notifications()->count());
});

test('user cannot edit or delete another users post', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();

    $post = TimeCapsule::create([
        'user_id'        => $owner->id,
        'post_content'   => 'Original post content',
        'visibility'     => 'public',
        'status'         => 'published',
    ]);

    // Stranger tries to update
    $this->actingAs($stranger)
        ->putJson("/posts/{$post->id}", ['post_content' => 'Hacked content'])
        ->assertStatus(403);

    // Stranger tries to delete
    $this->actingAs($stranger)
        ->deleteJson("/posts/{$post->id}")
        ->assertStatus(403);

    // Owner can update
    $this->actingAs($owner)
        ->putJson("/posts/{$post->id}", ['post_content' => 'Updated by owner'])
        ->assertOk();

    $this->assertDatabaseHas('time_capsules', [
        'id'           => $post->id,
        'post_content' => 'Updated by owner',
    ]);

    // Owner can delete
    $this->actingAs($owner)
        ->deleteJson("/posts/{$post->id}")
        ->assertOk();

    $this->assertDatabaseMissing('time_capsules', ['id' => $post->id]);
});

test('privacy and visibility rules are enforced in feed queries', function () {
    $author = User::factory()->create();
    $follower = User::factory()->create();
    $stranger = User::factory()->create();

    // Follow relationship
    Follow::create(['follower_id' => $follower->id, 'following_id' => $author->id]);

    // 1. Public post
    $publicPost = TimeCapsule::create([
        'user_id' => $author->id, 'post_content' => 'Public post', 'visibility' => 'public', 'status' => 'published',
    ]);

    // 2. Followers-only post
    $followersPost = TimeCapsule::create([
        'user_id' => $author->id, 'post_content' => 'Followers only post', 'visibility' => 'followers', 'status' => 'published',
    ]);

    // 3. Only-me post
    $onlyMePost = TimeCapsule::create([
        'user_id' => $author->id, 'post_content' => 'Secret only me post', 'visibility' => 'only_me', 'status' => 'published',
    ]);

    // Author sees all 3
    $authorFeed = $this->actingAs($author)->getJson('/feed')->assertOk()->json('data');
    $authorIds = array_column($authorFeed, 'id');
    expect($authorIds)->toContain($publicPost->id);
    expect($authorIds)->toContain($followersPost->id);
    expect($authorIds)->toContain($onlyMePost->id);

    // Follower sees public and followers-only, NOT only_me
    $followerFeed = $this->actingAs($follower)->getJson('/feed')->assertOk()->json('data');
    $followerIds = array_column($followerFeed, 'id');
    expect($followerIds)->toContain($publicPost->id);
    expect($followerIds)->toContain($followersPost->id);
    expect($followerIds)->not->toContain($onlyMePost->id);

    // Stranger sees ONLY public post
    $strangerFeed = $this->actingAs($stranger)->getJson('/feed')->assertOk()->json('data');
    $strangerIds = array_column($strangerFeed, 'id');
    expect($strangerIds)->toContain($publicPost->id);
    expect($strangerIds)->not->toContain($followersPost->id);
    expect($strangerIds)->not->toContain($onlyMePost->id);
});

test('bookmark and unbookmark post', function () {
    $user = User::factory()->create();
    $post = TimeCapsule::create([
        'user_id' => $user->id, 'post_content' => 'Bookmark me', 'visibility' => 'public', 'status' => 'published',
    ]);

    // Bookmark
    $this->actingAs($user)
        ->postJson("/posts/{$post->id}/bookmark")
        ->assertOk()
        ->assertJson(['bookmarked' => true]);

    $this->assertDatabaseHas('post_bookmarks', ['user_id' => $user->id, 'post_id' => $post->id]);

    // List bookmarks
    $list = $this->actingAs($user)
        ->getJson('/bookmarks')
        ->assertOk()
        ->assertJsonCount(1, 'data');

    // Unbookmark
    $this->actingAs($user)
        ->postJson("/posts/{$post->id}/bookmark")
        ->assertOk()
        ->assertJson(['bookmarked' => false]);

    $this->assertDatabaseMissing('post_bookmarks', ['user_id' => $user->id, 'post_id' => $post->id]);
});

test('sharing post tracks shares count safely', function () {
    $user = User::factory()->create();
    $post = TimeCapsule::create([
        'user_id' => $user->id, 'post_content' => 'Share me', 'visibility' => 'public', 'status' => 'published', 'shares' => '0',
    ]);

    $res = $this->actingAs($user)
        ->postJson("/posts/{$post->id}/share")
        ->assertOk()
        ->assertJson(['shares_count' => 1]);

    $this->assertDatabaseHas('post_shares', ['user_id' => $user->id, 'post_id' => $post->id]);
    $this->assertDatabaseHas('time_capsules', ['id' => $post->id, 'shares' => '1']);
});

