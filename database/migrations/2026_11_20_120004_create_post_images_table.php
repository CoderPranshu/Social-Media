<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id');
            $table->string('path');           // storage path e.g. posts/abc.jpg
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('post_id');
            $table->foreign('post_id')->references('id')->on('time_capsules')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_images');
    }
};

