<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Articulo;
use App\Models\OrdenProduccion;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrdenProduccionController extends Controller
{
    public function index()
    {
        $ordenes = OrdenProduccion::with('productoTerminado')->orderBy('created_at', 'desc')->get();
        return response()->json($ordenes);
    }

    public function store(Request $request)
    {
        $validado = $request->validate([
            'producto_terminado_id' => 'required|exists:articulos,id',
            'usuario_id' => 'required|integer',
            'cantidad' => 'required|numeric|min:0.01'
        ]);
        $producto = Articulo::with('ingredientes')->findOrFail($validado['producto_terminado_id']);
        if ($producto->tipo !== 'producto_terminado') {
            return response()->json(['error' => 'Solo se pueden fabricar productos terminados.'], 422);
        }
        $costoTotal = 0;
        foreach ($producto->ingredientes as $ingrediente) {
            $cantidadNecesariaPorUnidad = $ingrediente->pivot->cantidad_necesaria;
            $costoTotal += ($ingrediente->costo_base * $cantidadNecesariaPorUnidad) * $validado['cantidad'];
        }
        $orden = OrdenProduccion::create([
            'producto_terminado_id' => $producto->id,
            'usuario_id' => $validado['usuario_id'],
            'cantidad' => $validado['cantidad'],
            'costo_total' => $costoTotal,
            'estado' => 'pendiente'
        ]);

        return response()->json([
            'mensaje' => 'Orden de producción creada con éxito',
            'orden' => $orden
        ], 201);
    }

    public function cambiarEstado(Request $request, OrdenProduccion $orden)
    {
        $validado = $request->validate([
            'estado' => ['required', Rule::in(['pendiente', 'en_proceso', 'cancelada'])]
        ]);

        if ($orden->estado === 'completada') {
            return response()->json([
                'error' => 'No puedes cambiar el estado de una orden que ya fue completada y procesada en inventario.'
            ], 422);
        }

        if ($orden->estado === 'cancelada' && $validado['estado'] !== 'cancelada') {
            return response()->json([
                'error' => 'Esta orden ya fue cancelada. Debes crear una nueva.'
            ], 422);
        }

        $orden->update(['estado' => $validado['estado']]);

        return response()->json([
            'mensaje' => "El estado de la orden #{$orden->id} ha cambiado a: {$validado['estado']}",
            'orden' => $orden
        ]);
    }

    public function completar(OrdenProduccion $orden)
    {
        if ($orden->estado !== 'pendiente' && $orden->estado !== 'en_proceso') {
            return response()->json(['error' => 'La orden ya fue procesada o cancelada.'], 422);
        }
        $producto = $orden->productoTerminado()->with('ingredientes')->first();
        try {
            DB::transaction(function () use ($orden, $producto) {
                foreach ($producto->ingredientes as $ingrediente) {
                    $cantidadADescontar = $ingrediente->pivot->cantidad_necesaria * $orden->cantidad;
                    if ($ingrediente->stock_actual < $cantidadADescontar) {
                        throw new \Exception("Stock insuficiente de: {$ingrediente->nombre}. Faltan " . ($cantidadADescontar - $ingrediente->stock_actual));
                    }
                    MovimientoInventario::create([
                        'articulo_id' => $ingrediente->id,
                        'tipo_movimiento' => 'salida',
                        'cantidad' => $cantidadADescontar,
                        'motivo' => "Consumo por Orden de Producción #{$orden->id}",
                        'usuario_id' => $orden->usuario_id,
                        'referencia_id' => $orden->id
                    ]);
                    $ingrediente->decrement('stock_actual', $cantidadADescontar);
                }
                MovimientoInventario::create([
                    'articulo_id' => $producto->id,
                    'tipo_movimiento' => 'entrada',
                    'cantidad' => $orden->cantidad,
                    'motivo' => "Ingreso por Orden de Producción #{$orden->id}",
                    'usuario_id' => $orden->usuario_id,
                    'referencia_id' => $orden->id
                ]);
                $producto->increment('stock_actual', $orden->cantidad);
                $orden->update(['estado' => 'completada']);
            });

            return response()->json([
                'mensaje' => 'Producción completada. Inventario actualizado.',
                'orden' => $orden->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}