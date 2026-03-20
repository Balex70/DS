<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::get('/categories', 'App\Http\Controllers\Api\CategoryController@index');
// Route::get('/category/{id}', 'App\Http\Controllers\Api\CategoryController@show');
// Route::post('/category', 'App\Http\Controllers\Api\CategoryController@store');
// Route::put('/category/{id}', 'App\Http\Controllers\Api\CategoryController@update');
// Route::delete('/category/{id}', 'App\Http\Controllers\Api\CategoryController@destroy');
// Route::get('categories', [CategoryController::class, 'index']);
Route::apiResource('categories', CategoryController::class);
