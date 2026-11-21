<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── hashtags ──────────────────────────────────────────────────────────
        Schema::create('hashtags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // stored without # prefix, lowercased
            $table->unsignedBigInteger('posts_count')->default(0);
            $table->timestamps();
        });

        // ── post_hashtags ─────────────────────────────────────────────────────
        Schema::create('post_hashtags', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('hashtag_id');
            $table->unique(['post_id', 'hashtag_id']);
            $table->index('hashtag_id');
            $table->foreign('post_id')->references('id')->on('time_capsules')->onDelete('cascade');
            $table->foreign('hashtag_id')->references('id')->on('hashtags')->onDelete('cascade');
        });

        // ── post_mentions ─────────────────────────────────────────────────────
        Schema::create('post_mentions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('mentioned_user_id');
            $table->unique(['post_id', 'mentioned_user_id']);
            $table->index('mentioned_user_id');
            $table->foreign('post_id')->references('id')->on('time_capsules')->onDelete('cascade');
            $table->foreign('mentioned_user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // ── follows ───────────────────────────────────────────────────────────
        Schema::create('follows', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('follower_id');
            $table->unsignedBigInteger('following_id');
            $table->timestamps();
            $table->unique(['follower_id', 'following_id']);
            $table->index('follower_id');
            $table->index('following_id');
            $table->foreign('follower_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('following_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_mentions');
        Schema::dropIfExists('post_hashtags');
        Schema::dropIfExists('hashtags');
        Schema::dropIfExists('follows');
    }
};

