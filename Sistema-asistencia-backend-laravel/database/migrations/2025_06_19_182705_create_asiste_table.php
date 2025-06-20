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
        Schema::create('asiste', function (Blueprint $table) {
            $table->unsignedBigInteger('ID_Usuario')->nullable();
            $table->unsignedBigInteger('ID_Evento')->nullable();

            $table->foreign('ID_Usuario')->references('id')->on('usuario')->onDelete('cascade');
            $table->foreign('ID_Evento')->references('ID_Evento')->on('evento')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asiste');
    }
};
