<?php

use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/users/login', [UserController::class, 'login'])->middleware('web');
Route::post('/users/logout', [UserController::class, 'logout'])->middleware('web');

Route::get('/users/me', [UserController::class, 'me'])
    ->middleware('auth:sanctum');
