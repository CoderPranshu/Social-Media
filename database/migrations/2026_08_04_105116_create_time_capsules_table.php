<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('time_capsules', function (Blueprint $table) {
            $table->id();
            $table->string('post_content')->nullable();
            $table->string('user_id')->nullable();
            $table->string('likes')->nullable();
            $table->string('shares')->nullable();
            $table->string('comments_count')->nullable();
            $table->string('status')->nullable();
            $table->string('date')->nullable();
            $table->string('year')->nullable();
            $table->string('category_id')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_capsules');
    }
};
