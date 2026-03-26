<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nombre', 'descripcion'])]

class Categoria extends Model
{
    use HasFactory;

    public function articulos()
    {
        return $this->hasMany(Articulo::class);
    }
}
