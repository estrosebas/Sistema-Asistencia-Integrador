<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\RegistroAsistencia;
use App\Models\Evento;

class RegistroAsistenciaController extends Controller
{
    /**
     * Obtener los registros de asistencia con nombre de evento
     */
    public function getRegistrosAsistencia()
    {
        try {
            $registros = RegistroAsistencia::with('evento:ID_Evento,NombreEvento')
                ->get(['ID_Registro', 'ID_Evento']);

            $data = $registros->map(function ($registro) {
                return [
                    'ID_Registro' => $registro->ID_Registro,
                    'ID_Evento' => $registro->ID_Evento,
                    'NombreEvento' => $registro->evento ? $registro->evento->NombreEvento : null,
                ];
            });

            if ($data->isNotEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => $data,
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron registros de asistencia',
                ], 404);
            }
        } catch (\Exception $e) {
            Log::error('Error al obtener los registros de asistencia: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los registros de asistencia: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Registra la asistencia de un usuario a un evento
     */
    public function registrarAsistencia(Request $request)
    {
        $dni = $request->input('dni');
        $idEvento = $request->input('idEvento');
        $fechaRegistroStr = $request->input('fechaRegistro');
        try {
            $usuario = \App\Models\Usuario::where('dni', $dni)->first();
            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado',
                ], 404);
            }
            $evento = \App\Models\Evento::find($idEvento);
            if (!$evento) {
                return response()->json([
                    'success' => false,
                    'message' => 'Evento no encontrado',
                ], 404);
            }
            $fechaHoraEntrada = $evento->FechaHoraEntrada;
            $fechaHoraSalida = $evento->FechaHoraSalida;
            $fechaRegistro = $fechaRegistroStr;
            // Si necesitas convertir a Carbon:
            $fechaRegistroCarbon = \Carbon\Carbon::parse($fechaRegistro);
            $entradaCarbon = \Carbon\Carbon::parse($fechaHoraEntrada);
            $salidaCarbon = \Carbon\Carbon::parse($fechaHoraSalida);
            $estado = ($fechaRegistroCarbon->lt($entradaCarbon) || $fechaRegistroCarbon->gt($salidaCarbon)) ? 'falta' : 'asiste';
            \App\Models\RegistroAsistencia::create([
                'Estado' => $estado,
                'FechaRegistro' => $fechaRegistro,
                'ID_Evento' => $evento->ID_Evento,
                'ID_Usuario' => $usuario->id,
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Asistencia registrada correctamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en el servidor: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtiene los registros de asistencia de un usuario para un evento específico
     */
    public function getRegistrosAsistenciaUsuarioEvento(Request $request)
    {
        $usuarioId = $request->query('usuarioId');
        $eventoNombre = $request->query('eventoNombre');
        try {
            $evento = \App\Models\Evento::where('NombreEvento', $eventoNombre)->first();
            if (!$evento) {
                return response()->json([
                    'success' => false,
                    'message' => 'Evento no encontrado',
                ], 404);
            }
            $registros = \App\Models\RegistroAsistencia::where('ID_Usuario', $usuarioId)
                ->where('ID_Evento', $evento->ID_Evento)
                ->get(['FechaRegistro', 'Estado']);
            $data = $registros->map(function ($registro) {
                return [
                    'fechaRegistro' => $registro->FechaRegistro,
                    'estado' => $registro->Estado,
                ];
            });
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los registros de asistencia: ' . $e->getMessage(),
            ], 500);
        }
    }
}
