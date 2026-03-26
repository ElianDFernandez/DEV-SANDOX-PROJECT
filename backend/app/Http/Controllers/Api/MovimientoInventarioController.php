<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Articulo;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class MovimientoInventarioController extends Controller
{
    public function index()
    {
        $movimientos = MovimientoInventario::with('articulo')->orderBy('created_at', 'desc')->get();
        return response()->json($movimientos);
    }

    public function store(Request $request)
    {
        $validado = $request->validate([
            'articulo_id' => 'required|exists:articulos,id',
            'usuario_id' => 'required|exists:users,id',
            'tipo' => ['required', Rule::in(['entrada', 'salida'])],
            'motivo' => 'required|string|max:255',
            'cantidad' => 'required|numeric|min:0.01',
            'referencia_id' => 'nullable|integer'
        ]);

        $articulo = Articulo::findOrFail($validado['articulo_id']);

        if ($validado['tipo'] === 'salida' && $articulo->stock_actual < $validado['cantidad']) {
            return response()->json([
                'error' => 'Stock insuficiente para realizar esta salida.'
            ], 422);
        }

        $movimiento = DB::transaction(function () use ($validado, $articulo) {
            $nuevoMovimiento = MovimientoInventario::create($validado);
            if ($validado['tipo'] === 'entrada') {
                $articulo->stock_actual += $validado['cantidad'];
            } else {
                $articulo->stock_actual -= $validado['cantidad'];
            }
            $articulo->save();

            return $nuevoMovimiento;
        });

        return response()->json([
            'mensaje' => 'Movimiento registrado y stock actualizado con éxito',
            'movimiento' => $movimiento,
            'stock_actual_articulo' => $articulo->stock_actual
        ], 201);
    }
}