<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::get('/categories', 'App\Http\Controllers\Api\CategoryController@index');
// Route::get('/category/{id}', 'App\Http\Controllers\Api\CategoryController@show');
// Route::post('/category', 'App\Http\Controllers\Api\CategoryController@store');
// Route::put('/category/{id}', 'App\Http\Controllers\Api\CategoryController@update');
// Route::delete('/category/{id}', 'App\Http\Controllers\Api\CategoryController@destroy');
// Route::get('categories', [CategoryController::class, 'index']);
Route::post('/users/login', [UserController::class, 'login']);
Route::apiResource('users', UserController::class)->middleware('auth:sanctum');
Route::apiResource('categories', CategoryController::class);
