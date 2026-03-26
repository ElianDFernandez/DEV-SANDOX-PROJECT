<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['producto_terminado_id', 'usuario_id', 'cantidad', 'costo_total', 'estado'])]

class OrdenProduccion extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'cantidad' => 'decimal:3',
            'costo_total' => 'decimal:2',
            'estado' => 'string',
        ];
    }

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    public function productoTerminado()
    {
        return $this->belongsTo(Articulo::class, 'producto_terminado_id');
    }
}
