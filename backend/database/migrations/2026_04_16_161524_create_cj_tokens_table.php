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
        Schema::create('cj_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('access_token', 1000);
            $table->string('refresh_token', 1000);
            $table->timestamp('access_expires_at');
            $table->timestamp('refresh_expires_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cj_tokens');
    }
};
