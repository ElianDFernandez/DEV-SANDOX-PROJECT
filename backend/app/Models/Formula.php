<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['producto_terminado_id', 'materia_prima_id', 'cantidad_necesaria'])]

class Formula extends Model
{
    use HasFactory;

    public function casts(): array
    {
        return [
            'cantidad_necesaria' => 'decimal:3',
        ];
    }

    public function productoTerminado()
    {
        return $this->belongsTo(Articulo::class, 'producto_terminado_id');
    }

    public function materiaPrima()
    {
        return $this->belongsTo(Articulo::class, 'materia_prima_id');
    }
}
