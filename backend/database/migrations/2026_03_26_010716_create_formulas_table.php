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
        Schema::create('formulas', function (Blueprint $table) {
            $table->foreignId('producto_terminado_id')->constrained('articulos')->onDelete('cascade');
            $table->foreignId('materia_prima_id')->constrained('articulos')->onDelete('cascade');
            $table->decimal('cantidad_necesaria', 15, 3);
            $table->primary(['producto_terminado_id', 'materia_prima_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formulas');
    }
};
