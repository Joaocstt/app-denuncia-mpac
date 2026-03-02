<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ApiDenunciaController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware([\App\Http\Middleware\ApiTokenMiddleware::class])->prefix('denuncias')->group(function () {
    Route::post('/', [ApiDenunciaController::class, 'store']);
    Route::get('/minhas', [ApiDenunciaController::class, 'minhas']);
    Route::get('/mapa', [ApiDenunciaController::class, 'mapa']);
    Route::post('/transcribe', [ApiDenunciaController::class, 'transcribe']);
});
