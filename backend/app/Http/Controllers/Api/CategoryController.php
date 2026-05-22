<?php

namespace App\Http\Controllers\Api;

use App\Dropshipping\Services\CjCategoryService;
use App\Http\Controllers\Controller;
use App\Http\Requests\BulkActivateCategoryRequest;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function __construct(
        protected CjCategoryService $categories,
        protected CategoryService $categoryService
        )
    {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Category::class);
        return CategoryResource::collection(Category::orderBy('id')->get());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $data = $request->validated();

        // handle image upload
        if ($request->hasFile('image')) {

            // delete old image if exists
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            // store new image
            // $path = $request->file('image')->store('categories', 'public');
            $path = $request->file('image')->store("categories/{$category->id}", 'public');
            // Storage::disk('public')->put($fileName, $contents);

            $data['image'] = $path;
        }

        $category->update($data);

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

    public function syncFullPaths()
    {
        Gate::authorize('syncFullPaths', Category::class);
        $this->categoryService->syncFullPaths();
        return response()->json(['success' => true]);
    }
}
