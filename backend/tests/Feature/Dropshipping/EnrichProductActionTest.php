<?php

namespace Tests\Feature\Dropshipping;

use App\Dropshipping\Actions\EnrichProductAction;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnrichProductActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_does_nothing_when_no_product_found()
    {
        $service = $this->mock(ProductService::class);
        $service->shouldNotReceive('enrichProduct');

        $this->app->instance(ProductService::class, $service);

        $action = $this->app->make(EnrichProductAction::class);

        $action->execute();
    }

    public function test_enriches_oldest_product_when_no_unprocessed_products_exist(): void
    {
        $oldest = Product::factory()->create([
            'last_enrichment_at' => now()->subDays(3),
        ]);

        Product::factory()->create([
            'last_enrichment_at' => now()->subDays(2),
        ]);

        Product::factory()->create([
            'last_enrichment_at' => now()->subDay(),
        ]);

        $service = $this->mock(ProductService::class);

        $service->shouldReceive('enrichProduct')
            ->once()
            ->withArgs(function ($arg) use ($oldest) {
                return $arg->id === $oldest->id;
            });

        $this->app->instance(ProductService::class, $service);

        $action = $this->app->make(EnrichProductAction::class);

        $action->execute();
    }

    public function test_prioritizes_unprocessed_products_over_processed_products(): void
    {
        Product::factory()->create([
            'last_enrichment_at' => now()->subDays(10),
        ]);

        $unprocessed = Product::factory()->create([
            'last_enrichment_at' => null,
        ]);

        $service = $this->mock(ProductService::class);

        $service->shouldReceive('enrichProduct')
            ->once()
            ->withArgs(function ($arg) use ($unprocessed) {
                return $arg->id === $unprocessed->id;
            });

        $this->app->instance(ProductService::class, $service);

        $action = $this->app->make(EnrichProductAction::class);

        $action->execute();
    }

    public function test_prioritizes_oldest_unprocessed_product_by_id(): void
    {
        $first = Product::factory()->create([
            'last_enrichment_at' => null,
        ]);

        $second = Product::factory()->create([
            'last_enrichment_at' => null,
        ]);

        $service = $this->mock(ProductService::class);

        $service->shouldReceive('enrichProduct')
            ->once()
            ->withArgs(function ($arg) use ($first) {
                return $arg->id === $first->id;
            });

        $this->app->instance(ProductService::class, $service);

        $action = $this->app->make(EnrichProductAction::class);

        $action->execute();
    }

    public function test_ignores_failed_products(): void
    {
        Product::factory()->create([
            'last_enrichment_at' => null,
            'enrichment_failed_at' => now(),
        ]);

        $product = Product::factory()->create([
            'last_enrichment_at' => null,
            'enrichment_failed_at' => null,
        ]);

        $service = $this->mock(ProductService::class);

        $service->shouldReceive('enrichProduct')
            ->once()
            ->withArgs(function ($arg) use ($product) {
                return $arg->id === $product->id;
            });

        $this->app->instance(ProductService::class, $service);

        $action = $this->app->make(EnrichProductAction::class);

        $action->execute();
    }
}
