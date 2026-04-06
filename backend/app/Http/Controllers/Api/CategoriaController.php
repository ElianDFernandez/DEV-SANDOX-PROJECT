<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index()
    {
        $categorias = Categoria::withCount('articulos')->get();
        return response()->json($categorias);
    }

    public function store(Request $request)
    {
        $validado = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string'
        ]);

        $categoria = Categoria::create($validado);

        return response()->json([
            'mensaje' => 'Categoría creada con éxito',
            'categoria' => $categoria
        ], 201);
    }

    public function show(Categoria $categoria)
    {
        return response()->json($categoria);
    }

    public function update(Request $request, Categoria $categoria)
    {
        $validado = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string'
        ]);

        $categoria->update($validado);

        return response()->json([
            'mensaje' => 'Categoría actualizada con éxito',
            'categoria' => $categoria
        ]);
    }

    public function destroy(Categoria $categoria)
    {
        $categoria->delete();
        
        return response()->json([
            'mensaje' => 'Categoría eliminada con éxito'
        ]);
    }
}