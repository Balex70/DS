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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('shipping_full_name_latin')
                ->nullable()
                ->after('shipping_full_name');

            $table->string('shipping_address_line1_latin')
                ->nullable()
                ->after('shipping_address_line1');

            $table->string('shipping_address_line2_latin')
                ->nullable()
                ->after('shipping_address_line2');

            $table->string('shipping_city_latin')
                ->nullable()
                ->after('shipping_city');

            $table->string('shipping_state_latin')
                ->nullable()
                ->after('shipping_state');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'shipping_full_name_latin',
                'shipping_address_line1_latin',
                'shipping_address_line2_latin',
                'shipping_city_latin',
                'shipping_state_latin',
            ]);
        });
    }
};
