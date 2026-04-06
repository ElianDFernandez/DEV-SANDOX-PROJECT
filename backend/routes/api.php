<?php

use App\Http\Controllers\Api\ArticuloController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\FormulaController;
use App\Http\Controllers\Api\MovimientoInventarioController;
use App\Http\Controllers\Api\OrdenProduccionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
Route::post('/login', [AuthController::class, 'login']);


// ==========================================
// RUTAS PROTEGIDAS
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    
    // AUTENTICACIÓN
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/perfil', [AuthController::class, 'perfil']);
    Route::put('/perfil', [AuthController::class, 'actualizarPerfil']);

    // CATEGORÍAS
    Route::apiResource('categorias', CategoriaController::class);

    // ARTÍCULOS
    Route::apiResource('articulos', ArticuloController::class);

    // FÓRMULA
    Route::apiResource('articulos.formulas', FormulaController::class)->only(['index', 'store', 'destroy']);

    // MOVIMIENTOS DE INVENTARIO
    Route::apiResource('movimientos', MovimientoInventarioController::class)->only(['index', 'store']);

    // ORDENES DE PRODUCCIÓN
    Route::get('ordenes', [OrdenProduccionController::class, 'index']);
    Route::post('ordenes', [OrdenProduccionController::class, 'store']);
    Route::patch('ordenes/{orden}/estado', [OrdenProduccionController::class, 'cambiarEstado']);
    Route::post('ordenes/{orden}/completar', [OrdenProduccionController::class, 'completar']);
});