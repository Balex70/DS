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
        Schema::table('product_images', function (Blueprint $table) {
            $table->string('original_url')->nullable();
            $table->string('ai_url')->nullable();

            $table->string('status')->default('original');
            // original | queued | processing | done | failed

            $table->json('ai_meta')->nullable();

            $table->timestamp('ai_processed_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            $table->dropColumn(['original_url', 'ai_url', 'status', 'ai_meta', 'ai_processed_at']);
        });
    }
};
