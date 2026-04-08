<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Articulo;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ArticuloController extends Controller
{
    public function index(Request $request)
    {
        $query = Articulo::with('categoria');
        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }
        $articulos = $query->get();
        $categorias = Categoria::all();
        return response()->json([
            'articulos' => $articulos,
            'categorias' => $categorias
        ]);
    }

    public function store(Request $request)
    {
        $validado = $request->validate([
            'categoria_id' => 'nullable|exists:categorias,id',
            'tipo' => ['required', Rule::in(['insumo', 'producto_terminado'])],
            'sku' => 'nullable|string|unique:articulos,sku',
            'nombre' => 'required|string|max:255',
            'unidad_medida' => 'required|string|max:50',
            'stock_actual' => 'numeric|min:0',
            'stock_minimo' => 'numeric|min:0',
            'costo_base' => 'numeric|min:0',
            'margen_ganancia' => 'numeric|min:0',
            'esta_activo' => 'boolean'
        ]);

        $articulo = Articulo::create($validado);

        return response()->json([
            'mensaje' => 'Artículo creado con éxito',
            'articulo' => $articulo
        ], 201);
    }

    public function show(Articulo $articulo)
    {
        $articulo->load(['categoria', 'ingredientes', 'usadoEn']);
        return response()->json($articulo);
    }

    public function update(Request $request, Articulo $articulo)
    {
        $validado = $request->validate([
            'categoria_id' => 'nullable|exists:categorias,id',
            'tipo' => ['sometimes', 'required', Rule::in(['insumo', 'producto_terminado'])],
            'sku' => ['nullable', 'string', Rule::unique('articulos')->ignore($articulo->id)],
            'nombre' => 'sometimes|required|string|max:255',
            'unidad_medida' => 'sometimes|required|string|max:50',
            'stock_actual' => 'numeric|min:0',
            'stock_minimo' => 'numeric|min:0',
            'costo_base' => 'numeric|min:0',
            'margen_ganancia' => 'numeric|min:0',
            'esta_activo' => 'boolean'
        ]);

        $articulo->update($validado);

        return response()->json([
            'mensaje' => 'Artículo actualizado con éxito',
            'articulo' => $articulo
        ]);
    }

    public function destroy(Articulo $articulo)
    {
        $articulo->delete();

        return response()->json([
            'mensaje' => 'Artículo eliminado con éxito'
        ]);
    }

    public function recalcularCosto(Articulo $articulo)
    {
        if ($articulo->tipo !== 'producto_terminado') {
            return response()->json([
                'error' => 'Solo se puede recalcular costo para productos terminados.'
            ], 422);
        }

        $articulo->load('ingredientes');

        if ($articulo->ingredientes->isEmpty()) {
            return response()->json([
                'error' => 'El producto no tiene fórmula cargada.'
            ], 422);
        }

        $costoCalculado = 0;
        foreach ($articulo->ingredientes as $ingrediente) {
            $cantidadNecesaria = (float) $ingrediente->pivot->cantidad_necesaria;
            $costoIngrediente = (float) $ingrediente->costo_base;
            $costoCalculado += $costoIngrediente * $cantidadNecesaria;
        }

        $articulo->update([
            'costo_base' => round($costoCalculado, 2)
        ]);

        return response()->json([
            'mensaje' => 'Costo recalculado con éxito.',
            'articulo' => $articulo->fresh(['categoria'])
        ]);
    }
}