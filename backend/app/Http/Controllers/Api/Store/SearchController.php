<?php
namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
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
                ->limit(15)
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
}
