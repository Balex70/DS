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
        return StoreCategoryResource::collection(Category::orderBy('id')->get());
    }
}
