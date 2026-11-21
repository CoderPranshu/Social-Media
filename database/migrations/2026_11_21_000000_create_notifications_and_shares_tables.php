<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Laravel Standard Notifications Table ─────────────────────────────
        if (!Schema::hasTable('notifications')) {
            Schema::create('notifications', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('type');
                $table->morphs('notifiable');
                $table->text('data');
                $table->timestamp('read_at')->nullable();
                $table->timestamps();
            });
        }

        // ── Post Shares Table ────────────────────────────────────────────────
        if (!Schema::hasTable('post_shares')) {
            Schema::create('post_shares', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('post_id');
                $table->timestamps();

                $table->index('user_id');
                $table->index('post_id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('post_id')->references('id')->on('time_capsules')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('post_shares');
        Schema::dropIfExists('notifications');
    }
};

