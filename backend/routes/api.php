<?php

use App\Http\Controllers\Api\AiImagesController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CurrencyController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductVariantController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\Store\CartController;
use App\Http\Controllers\Api\Store\CategoryController as StoreCategoryController;
use App\Http\Controllers\Api\Store\OrderController as StoreOrderController;
use App\Http\Controllers\Api\Store\PaymentController as StorePaymentController;
use App\Http\Controllers\Api\Store\ProductController as StoreProductController;
use App\Http\Controllers\Api\Store\SearchController as StoreSearchController;
use App\Http\Controllers\Api\Store\SettingController as StoreSettingController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\EnsureCartToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Users
Route::post('users/login', [UserController::class, 'login'])->middleware('web');
Route::post('users/logout', [ProfileController::class, 'logout'])->middleware('web');
Route::get('users/me', [ProfileController::class, 'me'])->middleware('web');
Route::put('users/me', [ProfileController::class, 'update'])->middleware('web');
Route::apiResource('users', UserController::class)->middleware('auth:sanctum');

// Categories
Route::apiResource('categories', CategoryController::class)->middleware('auth:sanctum');
Route::post('categories/bulk-activate', [CategoryController::class, 'bulkActivate'])->middleware('auth:sanctum');
Route::post('categories/sync-full-paths', [CategoryController::class, 'syncFullPaths'])->middleware('auth:sanctum');

// Products
Route::apiResource('products', ProductController::class)->middleware('auth:sanctum');
Route::patch('products/enrich/{product}', [ProductController::class, 'enrich'])->middleware('auth:sanctum');
Route::middleware(['auth:sanctum', 'abilities:ai:texts'])->group(function () {
    Route::get('products/ai-texts/next', [ProductController::class, 'aiTextsNext']);
    Route::get('products/ai-variant-texts/next', [ProductController::class, 'aiVariantTextsNext']);
    Route::get('products/ai-texts-translate/next/{locale}', [ProductController::class, 'aiTextsTranslateNext']);
    Route::get('products/ai-variant-texts-translate/next/{locale}', [ProductController::class, 'aiVariantTextsTranslateNext']);
    Route::post('products/ai-texts/{product}/complete', [ProductController::class, 'aiTextsComplete']);
    Route::post('products/ai-variant-texts/{productVariant}/complete', [ProductController::class, 'aiVariantTextsComplete']);
    Route::post('products/ai-texts-translate/{product}/complete', [ProductController::class, 'aiTextsTranslateComplete']);
    Route::post('products/ai-variant-texts-translate/{productVariant}/complete', [ProductController::class, 'aiVariantTextsTranslateComplete']);
});
Route::middleware(['auth:sanctum', 'abilities:ai:images'])->group(function () {
    Route::get('products/ai-images/next', [AiImagesController::class, 'next']);
    Route::post('products/ai-images/{id}/complete', [AiImagesController::class, 'complete']);
});

// Product Variants
Route::get('product-variants/{product}', [ProductVariantController::class, 'index'])->middleware('auth:sanctum');
Route::patch('product-variants/{productVariant}', [ProductVariantController::class, 'update'])->middleware('auth:sanctum');

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

// Orders
Route::get('orders', [OrderController::class, 'index'])->middleware('auth:sanctum');
Route::post('orders/{order}/send', [OrderController::class, 'sendOrder'])->middleware('auth:sanctum');
Route::post('orders/{order}/check-ds-status', [OrderController::class, 'checkOrderStatusInDSProvider'])->middleware('auth:sanctum');
Route::post('orders/{order}/cancel', [OrderController::class, 'cancel'])->middleware('auth:sanctum');
Route::post('orders/{order}/simulate-pay', [OrderController::class, 'simulatePayOrder'])->middleware('auth:sanctum');
Route::post('orders/{order}/track-info', [OrderController::class, 'trackInfo'])->middleware('auth:sanctum');

// Payments
Route::get('payments', [PaymentController::class, 'index'])->middleware('auth:sanctum');
Route::post('payments/{payment}/update-status', [PaymentController::class, 'updateStatus'])->middleware('auth:sanctum');

// Materials
Route::get('materials', [MaterialController::class, 'index'])->middleware('auth:sanctum');
Route::patch('materials/{material}', [MaterialController::class, 'update'])->middleware('auth:sanctum');

// Currencies
Route::get('currencies', [CurrencyController::class, 'index'])->middleware('auth:sanctum');
Route::get('currency/sync-rate', [CurrencyController::class, 'syncRate'])->middleware('auth:sanctum');

// Settings
Route::get('settings', [SettingController::class, 'index'])->middleware('auth:sanctum');
Route::put('settings', [SettingController::class, 'update'])->middleware('auth:sanctum');

// Store Order
Route::prefix('store')->group(function () {
    // Categories
    Route::get('categories', [StoreCategoryController::class, 'index']);
    Route::get('category-section', [StoreCategoryController::class, 'categorySection']);

    // Products
    Route::get('products', [StoreProductController::class, 'index']);
    Route::get('products/filters', [StoreProductController::class, 'filters']);
    Route::get('products/latest', [StoreProductController::class, 'latest']);
    Route::get('products/{product}', [StoreProductController::class, 'show']);

    // Orders
    Route::post('orders/create', [StoreOrderController::class, 'store'])->middleware(EnsureCartToken::class);
    Route::post('orders/shipping-calculate', [StoreOrderController::class, 'shippingCalculate'])->middleware(EnsureCartToken::class);
    Route::get('orders/public-token/{token}', [StoreOrderController::class, 'showByPublicToken']);
    Route::get('orders/track-info/{trackNumber}', [StoreOrderController::class, 'trackInfo']);

    // Cart
    Route::post('cart/add', [CartController::class, 'add'])->middleware(EnsureCartToken::class);
    Route::get('cart', [CartController::class, 'show'])->middleware(EnsureCartToken::class);
    Route::post('cart/clear', [CartController::class, 'clear'])->middleware(EnsureCartToken::class);
    Route::post('cart/remove', [CartController::class, 'remove'])->middleware(EnsureCartToken::class);
    Route::post('cart/update', [CartController::class, 'update'])->middleware(EnsureCartToken::class);

    // Payments
    Route::post('payments/{order}/create', [StorePaymentController::class, 'create']);
    Route::post('payments/available-gateway', [StorePaymentController::class, 'availableGateway']);
    Route::post('payments/{gateway}/webhook', [StorePaymentController::class, 'webhook']);

    // Search
    Route::get('search', [StoreSearchController::class, 'search']);
    Route::get('full-search', [StoreSearchController::class, 'fullSearch']);

    // Settings
    Route::get('settings', [StoreSettingController::class, 'index']);
});
