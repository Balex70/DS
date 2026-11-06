<?php

namespace App\Http\Controllers\Api\Store;

use App\Enums\CurrenciesEnum;
use App\Enums\LocalesEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Material;
use App\Services\SearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SearchController extends Controller
{
    public function __construct(
        private SearchService $searchService,
    ) {
    }

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

        [$products, $categories] = $this->searchService->searchQuery($search, $locale, $currency);

        return [
            'products' => $products,
            'categories' => $categories,
        ];
    }

    public function fullSearch(Request $request)
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'locale' => ['nullable', Rule::enum(LocalesEnum::class)],
            'sort' => ['nullable', 'string', 'max:100'],
            'currency' => ['nullable', Rule::enum(CurrenciesEnum::class)],
            'price' => ['nullable', 'array'],
            'activeMaterials' => ['nullable', 'array'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $search = trim($validated['q'] ?? '');

        if ($search === '' || mb_strlen($search) < 2) {
            return response()->json([
                'products' => [],
                'categories' => [],
            ]);
        }

        $locale = $validated['locale'] ?? null;
        $sort = $validated['sort'] ?? null;
        $currency = $validated['currency'] ?? null;
        $priceRange = $request->filled('price') ? $request->input('price') : null;
        $activeMaterials = $request->filled('activeMaterials') ? $request->input('activeMaterials') : null;
        $page = $request->filled('page') ? $request->input('page') : 1;

        [$paginatedProducts, $filters, $categories] = $this->searchService->fullSearchQuery($search, $locale, $sort, $currency, $priceRange, $activeMaterials, $page);

        return response()->json([
            'products' => $paginatedProducts,
            'filters' => $filters,
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function filters(Request $request)
    {
        // $validated = $request->validate([
        //     'q' => ['nullable', 'string', 'max:100'],
        //     'locale' => ['nullable', Rule::enum(LocalesEnum::class)],
        //     'currency' => ['nullable', Rule::enum(CurrenciesEnum::class)],
        //     'price' => ['nullable', 'array'],
        //     'activeMaterials' => ['nullable', 'array'],
        // ]);

        // $search = trim($validated['q'] ?? null);
        // $locale = $validated['locale'] ?? null;

        // $base = $this->searchService->filterQuery($search, $locale);
        // $baseWithVariants = $base->join('product_variants', 'products.id', '=', 'product_variants.product_id');

        // // PRICE RANGE (clone to avoid query mutation)
        // $price = (clone $baseWithVariants)
        //     ->reorder()
        //     ->select([
        //         DB::raw('MIN(products.price) as min'),
        //         DB::raw('MAX(products.price) as max'),
        //     ])
        //     ->first();

        // // MATERIALS (clone to avoid query mutation)
        // $productIds = (clone $base)
        //     ->select('products.id')
        //     ->distinct()
        //     ->pluck('id');
        // $materialsQuery = Material::query()
        //     ->whereHas('products', function ($q) use ($productIds) {
        //         $q->whereIn('products.id', $productIds);
        //     });
        // if ($request->filled('locale') && LocalesEnum::tryFrom($request->locale)) {
        //     $locale = $request->locale ?? 'en';

        //     $materialsQuery->with([
        //         'translation' => fn ($q) => $q->where('locale', $locale),
        //     ]);
        // }
        // $materials = $materialsQuery->select('id', 'name')->get();

        // // WEIGHT RANGE
        // // $weight = $base
        // //     ->join('product_variants', 'products.id', '=', 'product_variants.product_id')
        // //     ->selectRaw('MIN(product_variants.weight) as min, MAX(product_variants.weight) as max')
        // //     ->first();

        // return response()->json([
        //     'price' => $price,
        //     'materials' => $materials,
        //     'weight' => [],
        // ]);
    }
}
