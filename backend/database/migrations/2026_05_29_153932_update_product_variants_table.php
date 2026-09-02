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
            // Add relation to product_images
            $table->foreignId('image_id')
                ->nullable()
                ->after('volume')
                ->constrained('product_images')
                ->nullOnDelete();

            // Remove old image column
            $table->dropColumn('image');
            $table->string('key')->after('name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->string('image')->nullable()->after('volume');
            $table->dropConstrainedForeignId('image_id');
            $table->dropColumn('key');
        });
    }
};
