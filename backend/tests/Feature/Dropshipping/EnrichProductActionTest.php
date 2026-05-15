<?php

namespace Tests\Feature\Dropshipping;

use App\Dropshipping\Actions\EnrichProductAction;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
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

    public function test_enriches_first_unprocessed_product()
    {
        $product = Product::factory()->create([
            'last_enrichment_at' => null,
        ]);

        $now = now();
        Product::factory()->create([
            'name_raw' => 'second',
            'last_enrichment_at' => $now,
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

    public function test_prioritizes_oldest_product()
    {
        $second = Product::factory()->create([
            'last_enrichment_at' => null,
        ]);

        sleep(1);

        $first = Product::factory()->create([
            'last_enrichment_at' => null,
        ]);

        $service = $this->mock(ProductService::class);

        $service->shouldReceive('enrichProduct')
            ->once()
            ->withArgs(function ($arg) use ($second) {
                return $arg->id === $second->id;
            });

        $this->app->instance(ProductService::class, $service);

        $action = $this->app->make(EnrichProductAction::class);

        $action->execute();
    }
}
