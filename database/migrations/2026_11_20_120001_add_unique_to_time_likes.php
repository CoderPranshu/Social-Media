<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('time_likes', function (Blueprint $table) {
            // Remove duplicate likes before adding unique constraint
            \DB::statement(
                'DELETE t1 FROM time_likes t1
                 INNER JOIN time_likes t2
                 WHERE t1.id > t2.id
                   AND t1.user_id = t2.user_id
                   AND t1.post_id = t2.post_id'
            );

            // Add unique constraint to prevent duplicate likes
            $table->unique(['user_id', 'post_id'], 'time_likes_user_post_unique');
        });
    }

    public function down(): void
    {
        Schema::table('time_likes', function (Blueprint $table) {
            $table->dropUnique('time_likes_user_post_unique');
        });
    }
};

