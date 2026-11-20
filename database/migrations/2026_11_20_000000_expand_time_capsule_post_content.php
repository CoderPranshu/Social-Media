<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('time_capsules', function (Blueprint $table) {
            $table->text('post_content')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('time_capsules', function (Blueprint $table) {
            $table->string('post_content')->nullable()->change();
        });
    }
};
