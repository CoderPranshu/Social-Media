<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('time_capsules', function (Blueprint $table) {
            // Add visibility: public | followers | only_me
            $table->string('visibility')->default('public')->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('time_capsules', function (Blueprint $table) {
            $table->dropColumn('visibility');
        });
    }
};

