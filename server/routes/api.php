<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BuyerController;
use App\Http\Controllers\Api\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('verify-email', [AuthController::class, 'verifyEmail'])->name('verification.verify');
    Route::post('send-otp', [AuthController::class, 'sendOtp']);
    Route::post('verify-phone', [AuthController::class, 'verifyPhone']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('resend-email-verification', [AuthController::class, 'resendEmailVerification']);
    });
});

// User routes
Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    Route::get('profile', [UserController::class, 'profile']);
    Route::put('profile/update', [UserController::class, 'updateProfile']);
    Route::put('update-address', [UserController::class, 'updateAddress']);
});

// Buyer routes
Route::middleware('auth:sanctum')->prefix('buyer')->group(function () {
    Route::get('dashboard', [BuyerController::class, 'dashboard']);
    Route::get('bids', [BuyerController::class, 'bids']);
    Route::get('purchases', [BuyerController::class, 'purchases']);
    Route::get('watchlist', [BuyerController::class, 'watchlist']);
    Route::post('watchlist/add', [BuyerController::class, 'addToWatchlist']);
    Route::delete('watchlist/remove/{id}', [BuyerController::class, 'removeFromWatchlist']);
});