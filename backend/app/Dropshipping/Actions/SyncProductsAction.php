<?php

namespace App\Dropshipping\Actions;

use App\Dropshipping\DTO\ProductData;
use App\Dropshipping\DropshippingManager;
use App\Models\Product;

class SyncProductsAction
{
    public function __construct(
        private DropshippingManager $manager
    ) {}

    public function execute(): void
    {
        $provider = $this->manager->driver();

        $products = $provider->getProducts();

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['external_id' => $product->id],
                [
                    'name' => $product->name,
                    'price' => $product->price,
                ]
            );
        }
    }
}
