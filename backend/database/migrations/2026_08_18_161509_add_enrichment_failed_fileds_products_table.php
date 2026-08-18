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
            $table->timestamp('enrichment_failed_at')->nullable()->after('last_enrichment_at');
            $table->text('enrichment_error')->nullable()->after('enrichment_failed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'enrichment_failed_at',
                'enrichment_error',
            ]);
        });
    }
};
