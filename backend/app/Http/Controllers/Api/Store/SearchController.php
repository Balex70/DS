<?php
namespace App\Http\Controllers\Api\Store;

use App\Currency\Services\PriceConverter;
use App\Enums\CurrenciesEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SearchController extends Controller
{
    public function __construct(
        private PriceConverter $converter
    ) {}
    public function search(Request $request)
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
        ]);

        $search = trim($validated['q'] ?? '');

        if ($search === '' || mb_strlen($search) < 2) {
            return response()->json([
                'products' => [],
                'categories' => [],
            ]);
        }

        $cacheKey = "search:{$search}";

        return Cache::remember($cacheKey, 30, function () use ($search, $request) {
            $products = Product::query()
                ->with(['variants'])
                ->select(['id', 'name_raw', 'name_processed', 'price', 'slug'])
                ->where(function ($q) use ($search) {
                    $q->where('name_processed', 'ILIKE', "%{$search}%")
                    ->orWhere('name_raw', 'ILIKE', "%{$search}%")
                    ->orWhereHas('variants', function ($vq) use ($search) {
                        $vq->where('name', 'ILIKE', "%{$search}%");
                    });
                })
                ->limit(10)
                ->get();

            if($request->filled('currency')) {
                $products->each(function (Product $product) use ($request) {
                    $product->currency_price = $this->converter->convert(
                        $product->price,
                        CurrenciesEnum::USD->value,
                        $request->currency,
                    );
                });
            }

            $categories = Category::query()
                ->select(['id', 'name', 'slug', 'full_path'])
                ->where('name', 'ILIKE', "%{$search}%")
                ->limit(5)
                ->get();
            return [
                'products' => $products,
                'categories' => $categories,
            ];
        });
    }

    public function fullSearch(Request $request)
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
        ]);

        $search = trim($validated['q'] ?? '');

        if ($search === '' || mb_strlen($search) < 2) {
            return response()->json([
                'products' => [],
            ]);
        }

        $query = Product::query()
                ->with(['variants', 'cheapestVariant'])
                ->select(['id', 'name_raw', 'name_processed', 'price', 'slug', 'warehouse_inventory_num'])
                ->where(function ($q) use ($search) {
                    $q->where('name_processed', 'ILIKE', "%{$search}%")
                    ->orWhere('name_raw', 'ILIKE', "%{$search}%")
                    ->orWhereHas('variants', function ($vq) use ($search) {
                        $vq->where('name', 'ILIKE', "%{$search}%");
                    });
                })
                ->latest();

        return ProductResource::collection(
            $query->paginate(10)
        );
    }
}
