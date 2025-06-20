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
        Schema::create('registro_asistencia', function (Blueprint $table) {
            $table->id('ID_Registro');
            $table->string('Estado', 50)->nullable();
            $table->dateTime('FechaRegistro')->nullable();
            $table->unsignedBigInteger('ID_Evento')->nullable();
            $table->unsignedBigInteger('ID_Usuario')->nullable();

            $table->foreign('ID_Evento')->references('ID_Evento')->on('evento')->onDelete('set null');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registro_asistencia');
    }
};
