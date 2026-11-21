<?php

use App\Models\TimeCapsule;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('authenticated users can publish and reload long text posts', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $content = trim(str_repeat('A saved social post. ', 20));

    $response = $this->actingAs($user)
        ->postJson('/posts', ['post_content' => $content])
        ->assertCreated();
    $postId = $response->json('post.id');

    $this->assertDatabaseHas('time_capsules', [
        'id' => $postId,
        'user_id' => $user->id,
        'post_content' => $content,
        'status' => 'published',
    ]);

    $readResponse = $this->actingAs($user)
        ->getJson('/my-posts')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.post_content', $content);

    expect($readResponse->headers->get('Cache-Control'))->toContain('no-store');

    $this->actingAs($otherUser)
        ->getJson('/my-posts')
        ->assertOk()
        ->assertJsonCount(0);

    expect($postId)->toBeInt();
});

test('authenticated users can publish image posts and reload their image', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/posts', [
            'post_content' => 'An image post',
            'image' => UploadedFile::fake()->create('post.jpg', 50, 'image/jpeg'),
        ])
        ->assertCreated();
    expect($response->json('post.id'))->toBeInt();

    $post = TimeCapsule::where('user_id', $user->id)->firstOrFail();

    Storage::disk('public')->assertExists($post->image);

    $this->actingAs($user)
        ->getJson('/my-posts')
        ->assertOk()
        ->assertJsonPath('0.post_content', 'An image post')
        ->assertJsonPath('0.images.0', Storage::disk('public')->url($post->image));
});
