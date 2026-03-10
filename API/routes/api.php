<?php

use App\Http\Controllers\Api\Admin\UserManagementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmailVerificationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
    ->middleware('throttle:6,1');

Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->name('verification.verify')
    ->middleware('signed');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware(['verified', 'role_api:admin'])->prefix('admin')->group(function (): void {
        Route::get('/roles', [UserManagementController::class, 'roles']);
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::patch('/users/{user}/role', [UserManagementController::class, 'updateRole']);
    });
});
