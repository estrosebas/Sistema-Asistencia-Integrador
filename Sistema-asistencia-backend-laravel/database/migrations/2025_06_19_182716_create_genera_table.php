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
        Schema::create('genera', function (Blueprint $table) {
            $table->unsignedBigInteger('ID_Reporte')->nullable();
            $table->unsignedBigInteger('ID_Registro')->nullable();

            $table->foreign('ID_Reporte')->references('ID_Reporte')->on('reporte_asistencia')->onDelete('cascade');
            $table->foreign('ID_Registro')->references('ID_Registro')->on('registro_asistencia')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('genera');
    }
};
