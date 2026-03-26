<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable([
    'categoria_id', 
    'tipo', 
    'sku', 
    'nombre', 
    'unidad_medida', 
    'stock_actual', 
    'stock_minimo', 
    'costo_base', 
    'margen_ganancia', 
    'esta_activo'
])]

class Articulo extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'stock_actual' => 'decimal:3',
            'stock_minimo' => 'decimal:3',
            'costo_base' => 'decimal:2',
            'margen_ganancia' => 'decimal:2',
            'esta_activo' => 'boolean',
        ];
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function ingredientes()
    {
        return $this->belongsToMany(Articulo::class, 'formulas', 'producto_terminado_id', 'materia_prima_id')->withPivot('cantidad_necesaria');
    }

    public function usadoEn()
    {
        return $this->belongsToMany(Articulo::class, 'formulas', 'materia_prima_id', 'producto_terminado_id')->withPivot('cantidad_necesaria');
    }
}
