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
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('last_seen_at');
            $table->dropColumn('synced_at');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->enum('status', ['discovered', 'processing', 'synced', 'failed'])->default('discovered');
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamp('synced_at')->nullable();
        });
    }
};
