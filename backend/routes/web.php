<?php

use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/users/login', [UserController::class, 'login'])->middleware('web');
Route::post('/users/logout', [ProfileController::class, 'logout'])->middleware('web');

Route::get('/users/me', [ProfileController::class, 'me'])->middleware('web');
Route::put('/users/me', [ProfileController::class, 'update'])->middleware('web');
