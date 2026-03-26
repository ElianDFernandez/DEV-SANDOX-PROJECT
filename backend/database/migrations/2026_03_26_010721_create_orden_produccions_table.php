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
        Schema::create('orden_produccions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_terminado_id')->constrained('articulos');
            $table->bigInteger('usuario_id')->constrained('users');
            $table->decimal('cantidad', 15, 3);
            $table->decimal('costo_total', 15, 2);
            $table->enum('estado', ['pendiente', 'en_proceso', 'completada', 'cancelada'])->default('pendiente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_produccions');
    }
};
