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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            // External reference
            $table->string('external_id')->unique(); // CJ pid

            // Basic info
            $table->string('name_raw');
            $table->string('name_processed')->nullable();
            $table->string('slug')->nullable()->unique();
            $table->longText('description_raw')->nullable(); // Raw description
            $table->longText('description_processed')->nullable();

            // Pricing
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('now_price', 10, 2)->nullable();
            $table->decimal('suggested_price', 10, 2)->nullable();

            // Big media
            $table->string('big_image')->nullable();
            
            // additional data from CJ
            // isCollect
            $table->boolean('is_collect')->default(false);
            // addMarkStatus
            $table->boolean('add_mark_status')->default(false);
            // warehouseInventoryNum
            $table->integer('warehouse_inventory_num')->nullable();

            // Status
            $table->enum('status', ['discovered', 'processing', 'synced', 'failed'])->default('discovered');

            // Sync tracking
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamp('synced_at')->nullable();

            // AI processing
            $table->timestamp('ai_processed_at')->nullable();

            // Optional debugging (VERY useful)
            $table->json('raw_data')->nullable();
            
            $table->index('status');
            $table->index('last_seen_at');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
