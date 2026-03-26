<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articulos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categoria_id')->constrained('categorias');
            $table->enum('tipo', ['insumo', 'producto_terminado']);
            $table->string('sku')->unique()->nullable();
            $table->string('nombre');
            $table->string('unidad_medida')->default('un');
            $table->decimal('stock_actual', 15, 3)->default(0);
            $table->decimal('stock_minimo', 15, 3)->default(0);
            $table->decimal('costo_base', 15, 2)->default(0);
            $table->decimal('margen_ganancia', 5, 2)->default(0);
            $table->boolean('esta_activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articulos');
    }
};
