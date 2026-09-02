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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Internal order number
            $table->string('order_number')->unique();

            // User / customer (nullable if guest checkout)
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();

            // Dropshipping integration
            $table->string('ds_provider')->default('cj');
            $table->string('ds_order_id')->nullable()->index();
            $table->string('ds_tracking_number')->nullable()->index();
            $table->string('ds_status')->nullable(); 
            // e.g. pending, paid, processing, shipped, delivered, failed

            // Financials (snapshot at time of order)
            $table->integer('subtotal');
            $table->integer('shipping_cost')->default(0);
            $table->integer('total');

            $table->string('currency', 10)->default('USD');

            // Status inside your system
            $table->string('status')->default('pending');
            // pending, paid, processing, fulfilled, canceled, refunded

            // Payment info (optional but useful)
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('unpaid');
            // unpaid, paid, failed, refunded

            // Shipping details snapshot (important in dropshipping)
            $table->string('shipping_full_name');
            $table->string('shipping_phone')->nullable();
            $table->string('shipping_email')->nullable();

            $table->string('shipping_address_line1');
            $table->string('shipping_address_line2')->nullable();
            $table->string('shipping_city');
            $table->string('shipping_state')->nullable();
            $table->string('shipping_postal_code')->nullable();
            $table->string('shipping_country', 2);

            // CJ fulfillment flags
            $table->boolean('sent_to_ds_provider')->default(false);
            $table->timestamp('sent_to_ds_provider_at')->nullable();

            $table->timestamp('fulfilled_at')->nullable();

            // Notes
            $table->text('notes')->nullable();

            // Soft delete
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
