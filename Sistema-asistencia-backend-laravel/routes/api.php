<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\RegistroAsistenciaController;

// AUTH
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('check-session', [AuthController::class, 'checkSession']);
    Route::get('usuarios', [AuthController::class, 'getUsuarios']);
    Route::get('usuarios-historial', [AuthController::class, 'getUsuariosHistorial']);
});

// EVENTOS
Route::get('eventos', [EventoController::class, 'getEventos']);
Route::post('add-evento', [EventoController::class, 'addEvento']);
Route::put('eventos/{id}', [EventoController::class, 'updateEvento']);
Route::delete('eventos/{id}', [EventoController::class, 'deleteEvento']);
Route::get('usuarios-evento', [EventoController::class, 'getUsuariosEvento']);
Route::post('add-asiste', [EventoController::class, 'addAsiste']);
Route::delete('delete-asiste', [EventoController::class, 'deleteAsiste']);
Route::get('evento-por-nombre', [EventoController::class, 'getEventoPorNombre']);

// REGISTRO ASISTENCIA
Route::get('registros-asistencia', [RegistroAsistenciaController::class, 'getRegistrosAsistencia']);
Route::post('registrar-asistencia', [RegistroAsistenciaController::class, 'registrarAsistencia']);
Route::get('registros-asistencia-usuario-evento', [RegistroAsistenciaController::class, 'getRegistrosAsistenciaUsuarioEvento']);
