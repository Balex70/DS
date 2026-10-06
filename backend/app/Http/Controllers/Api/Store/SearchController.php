<?php
namespace App\Http\Controllers\Api\Store;

use App\Currency\Services\PriceConverter;
use App\Enums\CurrenciesEnum;
use App\Enums\LocalesEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;

class SearchController extends Controller
{
    public function __construct(
        private PriceConverter $converter
    ) {}
    public function search(Request $request)
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'locale' => ['nullable', Rule::enum(LocalesEnum::class)],
            'currency' => ['nullable', Rule::enum(CurrenciesEnum::class)],
        ]);

        $search = trim($validated['q'] ?? '');

        if ($search === '' || mb_strlen($search) < 2) {
            return response()->json([
                'products' => [],
                'categories' => [],
            ]);
        }

        $locale = $validated['locale'] ?? null;
        $currency = $validated['currency'] ?? null;

        $cacheKey = 'search:' . md5(json_encode([
            'q' => $search,
            'locale' => $locale,
            'currency' => $currency,
        ]));

        return Cache::remember($cacheKey, 30, function () use ($search, $locale, $currency) {
            $query = Product::query()
                ->whereNotNull('last_enrichment_at')
                ->whereNotNull('ai_texts_at')
                ->whereNull('enrichment_failed_at')
                ->select(['id', 'name_raw', 'name_processed', 'price', 'slug']);

            if($locale) {
                $products = $query
                ->with([
                    'variants',
                    'translation' => fn ($q) => $q->where('locale', $locale),
                    'variants.translation' => fn ($q) => $q->where('locale', $locale),
                ])
                ->where(function ($q) use ($search, $locale) {
                    $q->where('name_processed', 'ILIKE', "%{$search}%")
                    ->orWhere('name_raw', 'ILIKE', "%{$search}%")
                    ->orWhereHas('translations', function ($tq) use ($search, $locale) {
                        $tq->where('locale', $locale)
                            ->where('name', 'ILIKE', "%{$search}%");
                    })
                    ->orWhereHas('variants', function ($vq) use ($search, $locale) {
                        $vq->where('name', 'ILIKE', "%{$search}%")
                            ->orWhere('name_processed', 'ILIKE', "%{$search}%")
                            ->orWhereHas('translations', function ($vtq) use ($search, $locale) {
                                $vtq->where('locale', $locale)
                                    ->where('name', 'ILIKE', "%{$search}%");
                            });
                    });
                })
                ->limit(10)
                ->get();
            } else {
                $products = $query
                    ->with(['variants'])
                    ->where(function ($q) use ($search) {
                        $q->where('name_processed', 'ILIKE', "%{$search}%")
                        ->orWhere('name_raw', 'ILIKE', "%{$search}%")
                        ->orWhereHas('variants', function ($vq) use ($search) {
                            $vq->where('name', 'ILIKE', "%{$search}%")
                            ->orWhere('name_processed', 'ILIKE', "%{$search}%");
                        });
                    })
                    ->limit(10)
                    ->get();
            }

            if($currency) {
                $products->each(function (Product $product) use ($currency) {
                    $product->currency_price = $this->converter->convert(
                        $product->price,
                        CurrenciesEnum::USD->value,
                        $currency,
                    );
                });
            }

            $categories = Category::query()
                ->where('active', true)
                ->where('is_visible', true)
                ->select(['id', 'name', 'slug', 'full_path'])
                ->when(
                    $locale,
                    fn ($query) => $query->where(function ($q) use ($search, $locale) {
                        $q->where('name', 'ILIKE', "%{$search}%")
                            ->orWhereHas('translations', function ($tq) use ($search, $locale) {
                                $tq->where('locale', $locale)
                                    ->where('name', 'ILIKE', "%{$search}%");
                            });
                    }),
                    fn ($query) => $query->where('name', 'ILIKE', "%{$search}%")
                )
                ->with([
                    'translations' => fn ($q) => $locale
                        ? $q->where('locale', $locale)
                        : $q,
                ])
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
