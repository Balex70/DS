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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();

            $table->string('external_id')->unique(); // vid
            $table->string('sku')->nullable();

            $table->string('name')->nullable();

            $table->decimal('price', 10, 2)->nullable();

            // Inventory
            $table->integer('stock')->nullable();
            
            // Shipping-related (very important later)
            $table->decimal('weight', 10, 2)->nullable();
            $table->decimal('volume', 12, 2)->nullable();
            
            // Media
            $table->string('image')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
