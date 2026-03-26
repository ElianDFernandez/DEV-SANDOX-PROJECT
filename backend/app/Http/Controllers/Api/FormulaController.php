<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Articulo;
use Illuminate\Http\Request;

class FormulaController extends Controller
{
    public function index(Articulo $articulo)
    {
        return response()->json([
            'producto' => $articulo->nombre,
            'formula' => $articulo->ingredientes
        ]);
    }

    public function store(Request $request, Articulo $articulo)
    {
        $validado = $request->validate([
            'materia_prima_id' => 'required|exists:articulos,id|different:' . $articulo->id,
            'cantidad_necesaria' => 'required|numeric|min:0.001'
        ]);

        $articulo->ingredientes()->syncWithoutDetaching([
            $validado['materia_prima_id'] => [
                'cantidad_necesaria' => $validado['cantidad_necesaria']
            ]
        ]);

        return response()->json([
            'mensaje' => 'Materia prima agregada a la fórmula con éxito',
            'formula' => $articulo->ingredientes()->get() 
        ], 201);
    }

    public function destroy(Articulo $articulo, $materiaPrimaId)
    {
        $articulo->ingredientes()->detach($materiaPrimaId);

        return response()->json([
            'mensaje' => 'Materia prima removida de la fórmula'
        ]);
    }
}