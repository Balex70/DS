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
        Schema::table('product_variants', function (Blueprint $table) {
            $table->string('name_processed')->nullable();
            $table->string('key_processed')->nullable();
            $table->enum('ai_status', ['queued', 'processing', 'done', 'failed'])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn('name_processed');
            $table->dropColumn('key_processed');
            $table->dropColumn('ai_status');
        });
    }
};
