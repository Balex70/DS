<?php

namespace Tests\Feature\Dropshipping;

use App\Dropshipping\Actions\RetryOrDeleteFailedProductEnrichmentAction;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\ProductService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RetryOrDeleteFailedProductEnrichmentActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_does_nothing_when_no_failed_product_found(): void
    {
        $service = $this->mock(ProductService::class);
        $service->shouldNotReceive('enrichProduct');

        $this->app->instance(ProductService::class, $service);

        $action = $this->app->make(
            RetryOrDeleteFailedProductEnrichmentAction::class
        );

        $action->execute();
    }

    public function test_retries_oldest_failed_product(): void
    {
        $oldest = Product::factory()->create([
            'enrichment_failed_at' => now()->subDays(3),
        ]);

        Product::factory()->create([
            'enrichment_failed_at' => now()->subDays(2),
        ]);

        Product::factory()->create([
            'enrichment_failed_at' => now()->subDay(),
        ]);

        $service = $this->mock(ProductService::class);

        $service->shouldReceive('enrichProduct')
            ->once()
            ->withArgs(function ($arg) use ($oldest) {
                return $arg->id === $oldest->id;
            });

        $this->app->instance(ProductService::class, $service);

        $action = $this->app->make(
            RetryOrDeleteFailedProductEnrichmentAction::class
        );

        $action->execute();
    }

    public function test_does_not_delete_product_when_enrichment_succeeds(): void
    {
        $product = Product::factory()->create([
            'enrichment_failed_at' => now(),
        ]);

        $service = $this->mock(ProductService::class);

        $service->shouldReceive('enrichProduct')
            ->once()
            ->withArgs(function (Product $arg) use ($product) {
                return $arg->id === $product->id;
            })
            ->andReturnUsing(function (Product $product) {
                $product->update([
                    'enrichment_failed_at' => null,
                    'enrichment_error' => null,
                ]);
            });

        $this->app->instance(ProductService::class, $service);

        $action = $this->app->make(
            RetryOrDeleteFailedProductEnrichmentAction::class
        );

        $action->execute();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'enrichment_failed_at' => null,
        ]);
    }

    public function test_does_not_delete_product_when_retry_fails_and_product_has_orders(): void
    {
        $product = Product::factory()->create([
            'enrichment_failed_at' => now(),
        ]);

        $variant = ProductVariant::factory()->create([
            'product_id' => $product->id,
        ]);

        $order = Order::factory()->create();

        $variant->orderItems()->create([
            'order_id' => $order->id,
            'sku' => $variant->sku,
            'title' => $variant->name,
            'quantity' => 1,
            'price' => 100,
            'total' => 100,
        ]);

        $service = $this->mock(ProductService::class);

        $service->shouldReceive('enrichProduct')
            ->once()
            ->withArgs(function (Product $arg) use ($product) {
                return $arg->id === $product->id;
            });

        $this->app->instance(ProductService::class, $service);

        $action = $this->app->make(
            RetryOrDeleteFailedProductEnrichmentAction::class
        );

        $action->execute();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
        ]);
    }

    public function test_deletes_product_when_retry_fails_and_product_has_no_orders(): void
    {
        $product = Product::factory()->create([
            'enrichment_failed_at' => now(),
        ]);

        $service = $this->mock(ProductService::class);

        $service->shouldReceive('enrichProduct')
            ->once()
            ->withArgs(function (Product $arg) use ($product) {
                return $arg->id === $product->id;
            });

        $this->app->instance(ProductService::class, $service);

        $action = $this->app->make(
            RetryOrDeleteFailedProductEnrichmentAction::class
        );

        $action->execute();

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }
}
