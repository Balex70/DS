<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            // External ID from provider
            $table->string('external_id')->nullable()->after('name');

            // Provider (cj, aliexpress, etc.)
            $table->string('provider')->default('cj')->after('external_id');

            // Parent relation
            $table->foreignId('parent_id')
                ->nullable()
                ->after('provider')
                ->constrained('categories')
                ->nullOnDelete();

            // Unique constraint (VERY IMPORTANT)
            $table->unique(
                ['external_id', 'provider'],
                'categories_external_provider_unique'
            );
            
            // non-unique index parent_id
            $table->index('parent_id', 'categories_parent_id_index');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            // Drop constraints first
            $table->dropUnique('categories_external_provider_unique');
            $table->dropForeign('categories_parent_id_foreign');
            $table->dropIndex('categories_parent_id_index');

            // Then drop columns
            $table->dropColumn(['external_id', 'provider', 'parent_id']);
        });
    }
};
