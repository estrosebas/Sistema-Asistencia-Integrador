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
        Schema::create('evento', function (Blueprint $table) {
            $table->id('ID_Evento');
            $table->string('NombreEvento')->nullable();
            $table->integer('Capacidad')->nullable();
            $table->text('Descripcion')->nullable();
            $table->dateTime('FechaHoraEntrada')->nullable();
            $table->dateTime('FechaHoraSalida')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
