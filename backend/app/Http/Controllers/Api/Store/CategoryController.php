<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreCategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    public function __construct()
    {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Category::orderBy('id');
        $query->where('active', true);
        $query->with('translations');
        return StoreCategoryResource::collection($query->get());
    }
}
