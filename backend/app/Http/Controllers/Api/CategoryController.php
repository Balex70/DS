<?php

namespace App\Http\Controllers\Api;

use App\Dropshipping\Services\CjCategoryService;
use App\Http\Controllers\Controller;
use App\Http\Requests\BulkActivateCategoryRequest;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Support\Facades\Gate;

class CategoryController extends Controller
{
    public function __construct(protected CjCategoryService $categories)
    {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Category::class);
        return CategoryResource::collection(Category::all());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return new CategoryResource($category);
    }

    public function bulkActivate(BulkActivateCategoryRequest $request)
    {
        Gate::authorize('bulkActivate', Category::class);
        $request->validated();

        // Activate selected
        Category::whereIn('id', $request->ids)
            ->update(['active' => true]);

        // Deactivate everything else
        Category::whereNotIn('id', $request->ids)
            ->update(['active' => false]);

        return response()->json(['success' => true]);
    }
}
