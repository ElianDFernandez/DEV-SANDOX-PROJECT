<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Articulo;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ArticuloController extends Controller
{
    public function index()
    {
        $articulos = Articulo::with('categoria')->get();
        return response()->json($articulos);
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
}