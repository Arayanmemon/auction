<?php

use App\Http\Controllers\Api\HomeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BuyerController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SellerController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::get('verify-email', [AuthController::class, 'verifyEmail'])->name('verification.verify');
    Route::post('send-otp', [AuthController::class, 'sendOtp']);
    Route::post('verify-phone', [AuthController::class, 'verifyPhone']);
    
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'currentUser']);
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
    // Route::post('watchlist/add', [BuyerController::class, 'addToWatchlist']);
    // Route::delete('watchlist/remove/{id}', [BuyerController::class, 'removeFromWatchlist']);
});

// Seller routes
Route::middleware('auth:sanctum')->prefix('seller')->group(function () {
    Route::post('payout-method/add', [SellerController::class, 'addPayoutMethod']);
    Route::get('payout-methods', [SellerController::class, 'payoutMethods']);
    Route::get('auctions', [SellerController::class, 'auctions']);
    Route::post('auction/create', [SellerController::class, 'createAuction']);
    Route::put('auction/update/{id}', [SellerController::class, 'updateAuction']);
    Route::get('sales-history', [SellerController::class, 'salesHistory']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auction/{id}/bid', [HomeController::class, 'placeBid']);
    Route::post('watchlist/add/{id}', [BuyerController::class, 'addToWatchlist']);
    Route::delete('watchlist/remove/{id}', [BuyerController::class, 'removeFromWatchlist']);
});

Route::get('auctions/all', [HomeController::class, 'allAuctions']);
Route::get('auction/{id}', [HomeController::class, 'auctionDetails']);
Route::get('auction/{id}/bids', [HomeController::class, 'getBidsForAuction']);
Route::get('categories', [HomeController::class, 'categories']);
Route::get('category/{id}/auctions', [HomeController::class, 'auctionsByCategory']);
Route::get('search', [HomeController::class, 'searchAuctions']);