<?php

use App\Http\Controllers\Api\AiImagesController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::apiResource('users', UserController::class)->middleware('auth:sanctum');
Route::apiResource('categories', CategoryController::class)->middleware('auth:sanctum');
Route::post('categories/bulk-activate', [CategoryController::class, 'bulkActivate'])->middleware('auth:sanctum');

Route::apiResource('products', ProductController::class)->middleware('auth:sanctum');
Route::patch('enrich/{product}', [ProductController::class, 'enrich'])->middleware('auth:sanctum');
Route::get('ai-images/next', [AiImagesController::class, 'next']);
Route::post('ai-images/{id}/complete', [AiImagesController::class, 'complete']);
