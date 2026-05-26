<?php

use App\Http\Controllers\Api\AiImagesController;
use App\Http\Controllers\Api\Store\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\Store\CategoryController as StoreCategoryController;
use App\Http\Controllers\Api\Store\OrderController as StoreOrderController;
use App\Http\Controllers\Api\Store\ProductController as StoreProductController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\EnsureCartToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::apiResource('users', UserController::class)->middleware('auth:sanctum');

Route::apiResource('categories', CategoryController::class)->middleware('auth:sanctum');
Route::post('categories/bulk-activate', [CategoryController::class, 'bulkActivate'])->middleware('auth:sanctum');
Route::post('categories/sync-full-paths', [CategoryController::class, 'syncFullPaths'])->middleware('auth:sanctum');
Route::get('store/categories', [StoreCategoryController::class, 'index']);

Route::apiResource('products', ProductController::class)->middleware('auth:sanctum');
Route::patch('products/enrich/{product}', [ProductController::class, 'enrich'])->middleware('auth:sanctum');
Route::middleware(['auth:sanctum', 'abilities:ai:texts'])->group(function () {
    Route::get('products/ai-texts/next', [ProductController::class, 'aiTextsNext']);
    Route::post('products/ai-texts/{product}/complete', [ProductController::class, 'aiTextsComplete']);
});
Route::middleware(['auth:sanctum', 'abilities:ai:images'])->group(function () {
    Route::get('products/ai-images/next', [AiImagesController::class, 'next']);
    Route::post('products/ai-images/{id}/complete', [AiImagesController::class, 'complete']);
});

Route::get('store/products', [StoreProductController::class, 'index']);
Route::get('store/products/{product}', [StoreProductController::class, 'show']);

// Customer
Route::prefix('customer')->group(function () {
    Route::post('/register', [CustomerController::class, 'register']);
    Route::post('/login', [CustomerController::class, 'login']);

    Route::middleware('auth:customers')->group(function () {
        Route::get('/me', [CustomerController::class, 'me']);
        Route::post('/logout', [CustomerController::class, 'logout']);
    });

    Route::get('/auth/google/redirect', [CustomerController::class, 'googleRedirect']);
    Route::get('/auth/google/callback', [CustomerController::class, 'googleCallback']);

});

// Order
Route::prefix('store')->group(function () {
    Route::post('orders/create', [StoreOrderController::class, 'store'])->middleware(EnsureCartToken::class);
    Route::post('cart/add', [CartController::class, 'add'])->middleware(EnsureCartToken::class);
    Route::get('cart', [CartController::class, 'show'])->middleware(EnsureCartToken::class);
    Route::post('cart/clear', [CartController::class, 'clear'])->middleware(EnsureCartToken::class);
    Route::post('cart/remove', [CartController::class, 'remove'])->middleware(EnsureCartToken::class);
    Route::post('cart/update', [CartController::class, 'update'])->middleware(EnsureCartToken::class);
});
