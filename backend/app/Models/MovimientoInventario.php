<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['articulo_id', 'usuario_id', 'tipo', 'motivo', 'cantidad', 'referencia_id'])]

class MovimientoInventario extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'cantidad' => 'decimal:3',
        ];
    }

    public function articulo()
    {
        return $this->belongsTo(Articulo::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }
}
