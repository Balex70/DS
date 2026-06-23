<?php
namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SearchController extends Controller
{
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

        return Cache::remember($cacheKey, 30, function () use ($search) {
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

        $page = (int) $request->get('page', 1);

        $cacheKey = "full-search:{$search}:page:{$page}";

        $data = Cache::remember($cacheKey, 30, function () use ($search) {

            $query = Product::query()
                ->with(['variants'])
                ->select(['id', 'name_raw', 'name_processed', 'price', 'slug'])
                ->where(function ($q) use ($search) {
                    $q->where('name_processed', 'ILIKE', "%{$search}%")
                    ->orWhere('name_raw', 'ILIKE', "%{$search}%")
                    ->orWhereHas('variants', function ($vq) use ($search) {
                        $vq->where('name', 'ILIKE', "%{$search}%");
                    });
                });

            return $query->paginate(24)->toArray();
        });

        return response()->json($data);
    }
}
