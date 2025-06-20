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
        Schema::create('usuario', function (Blueprint $table) {
            $table->id();
            $table->string('ape_materno')->nullable();
            $table->string('ape_paterno')->nullable();
            $table->unsignedBigInteger('dni')->nullable();
            $table->string('domicilio')->nullable();
            $table->string('email')->unique()->nullable();
            $table->dateTime('fech_nacimiento')->nullable();
            $table->string('genero')->nullable();
            $table->string('nombre')->nullable();
            $table->string('password')->nullable();
            $table->unsignedBigInteger('telefono')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuario');
    }
};
