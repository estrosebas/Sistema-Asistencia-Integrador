<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Evento;
use App\Models\Usuario;

class EventoController extends Controller
{
    /**
     * Obtener los eventos de un usuario
     */
    public function getEventos(Request $request)
    {
        $usuarioId = $request->query('usuarioId');
        if (empty($usuarioId) || !is_numeric($usuarioId)) {
            return response()->json([
                'success' => false,
                'message' => $usuarioId === null ? "El parámetro 'usuarioId' es requerido." : "El parámetro 'usuarioId' debe ser un número válido."
            ], 400);
        }
        try {
            $usuario = Usuario::find($usuarioId);
            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado',
                ], 404);
            }
            $eventos = $usuario->eventos()->get();
            $data = $eventos->map(function ($evento) {
                return [
                    'ID_Evento' => $evento->ID_Evento,
                    'NombreEvento' => $evento->NombreEvento,
                    'Capacidad' => $evento->Capacidad,
                    'Descripcion' => $evento->Descripcion,
                    'FechaHoraEntrada' => $evento->FechaHoraEntrada,
                    'FechaHoraSalida' => $evento->FechaHoraSalida,
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
                    'message' => 'No se encontraron eventos',
                ], 404);
            }
        } catch (\Exception $e) {
            Log::error('Error al obtener los eventos: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los eventos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Agrega un nuevo evento y lo asocia a un usuario
     */
    public function addEvento(Request $request)
    {
        $nombreEvento = $request->input('nombreEvento');
        $descripcion = $request->input('descripcion');
        $capacidad = $request->input('capacidad');
        $fechaHoraEntrada = $request->input('fechaHoraEntrada');
        $fechaHoraSalida = $request->input('fechaHoraSalida');
        $idUsuario = $request->input('idUsuario');

        \DB::beginTransaction();
        try {
            $evento = new \App\Models\Evento();
            $evento->NombreEvento = $nombreEvento;
            $evento->Descripcion = $descripcion;
            $evento->Capacidad = $capacidad;
            $evento->FechaHoraEntrada = $fechaHoraEntrada;
            $evento->FechaHoraSalida = $fechaHoraSalida;
            $evento->save();

            // Asociar el evento al usuario en la tabla asiste
            $evento->usuarios()->attach($idUsuario);

            \DB::commit();
            $nuevoEvento = [
                'id' => $evento->ID_Evento,
                'nombreEvento' => $evento->NombreEvento,
                'descripcion' => $evento->Descripcion,
                'capacidad' => $evento->Capacidad,
                'fechaHoraEntrada' => $evento->FechaHoraEntrada,
                'fechaHoraSalida' => $evento->FechaHoraSalida,
            ];
            return response()->json([
                'success' => true,
                'message' => "+ Evento creado exitosamente y registro en 'asiste' agregado.",
                'evento' => $nuevoEvento,
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error en el servidor: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualiza un evento existente
     */
    public function updateEvento($id, Request $request)
    {
        $nombreEvento = $request->input('nombreEvento');
        $descripcion = $request->input('descripcion');
        $capacidad = $request->input('capacidad');
        if (is_string($capacidad)) {
            $capacidad = intval($capacidad);
        }
        $fechaHoraEntrada = $request->input('fechaHoraEntrada');
        $fechaHoraSalida = $request->input('fechaHoraSalida');

        try {
            $evento = \App\Models\Evento::find($id);
            if (!$evento) {
                return response()->json([
                    'success' => false,
                    'message' => 'Evento no encontrado.',
                ], 404);
            }
            $evento->NombreEvento = $nombreEvento;
            $evento->Descripcion = $descripcion;
            $evento->Capacidad = $capacidad;
            $evento->FechaHoraEntrada = $fechaHoraEntrada;
            $evento->FechaHoraSalida = $fechaHoraSalida;
            $evento->save();
            return response()->json([
                'success' => true,
                'message' => 'Evento actualizado exitosamente.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en el servidor: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Elimina un evento existente y sus relaciones
     */
    public function deleteEvento($id)
    {
        \DB::beginTransaction();
        try {
            // Eliminar registros de asistencia relacionados
            \App\Models\RegistroAsistencia::where('ID_Evento', $id)->delete();
            // Eliminar relaciones en asiste
            $evento = \App\Models\Evento::find($id);
            if ($evento) {
                $evento->usuarios()->detach();
                $evento->delete();
                \DB::commit();
                return response()->json([
                    'success' => true,
                    'message' => 'Evento eliminado exitosamente.',
                ]);
            } else {
                \DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Evento no encontrado.',
                ], 404);
            }
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error en el servidor: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener los usuarios de un evento
     */
    public function getUsuariosEvento(Request $request)
    {
        $eventoId = $request->query('eventoId');
        try {
            $evento = \App\Models\Evento::find($eventoId);
            if (!$evento) {
                return response()->json([
                    'success' => false,
                    'message' => 'Evento no encontrado.',
                ], 404);
            }
            $usuarios = $evento->usuarios()->select('id', 'dni', 'nombre', 'ape_paterno', 'ape_materno')->get();
            $data = $usuarios->map(function ($usuario) {
                return [
                    'id' => $usuario->id,
                    'dni' => $usuario->dni,
                    'nombre' => $usuario->nombre,
                    'ape_paterno' => $usuario->ape_paterno,
                    'ape_materno' => $usuario->ape_materno,
                ];
            });
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los usuarios del evento: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Agrega un registro en la tabla 'asiste'
     */
    public function addAsiste(Request $request)
    {
        $idUsuario = $request->input('idUsuario');
        $idEvento = $request->input('idEvento');

        if (empty($idUsuario) || empty($idEvento)) {
            return response()->json([
                'success' => false,
                'message' => "Se deben proporcionar los valores 'idUsuario' y 'idEvento'."
            ], 400);
        }

        try {
            $evento = \App\Models\Evento::find($idEvento);
            if (!$evento) {
                return response()->json([
                    'success' => false,
                    'message' => 'Evento no encontrado.'
                ], 404);
            }
            $evento->usuarios()->attach($idUsuario);
            return response()->json([
                'success' => true,
                'message' => "Registro insertado correctamente en la tabla 'asiste'."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al realizar la operación en la base de datos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Elimina un registro de la tabla 'asiste'
     */
    public function deleteAsiste(Request $request)
    {
        $idUsuario = $request->query('idUsuario');
        $idEvento = $request->query('idEvento');

        if (empty($idUsuario) || empty($idEvento)) {
            return response()->json([
                'success' => false,
                'message' => "Se deben proporcionar los valores 'idUsuario' y 'idEvento'."
            ], 400);
        }

        try {
            $evento = \App\Models\Evento::find($idEvento);
            if (!$evento) {
                return response()->json([
                    'success' => false,
                    'message' => 'Evento no encontrado.'
                ], 404);
            }
            $detached = $evento->usuarios()->detach($idUsuario);
            if ($detached > 0) {
                return response()->json([
                    'success' => true,
                    'message' => 'Usuario eliminado exitosamente del evento.'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado en el evento.'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en el servidor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtiene un evento por su nombre
     */
    public function getEventoPorNombre(Request $request)
    {
        $nombreEvento = $request->query('nombreEvento');
        try {
            $evento = \App\Models\Evento::where('NombreEvento', $nombreEvento)->first();
            if ($evento) {
                $data = [
                    'ID_Evento' => $evento->ID_Evento,
                    'NombreEvento' => $evento->NombreEvento,
                    'Capacidad' => $evento->Capacidad,
                    'Descripcion' => $evento->Descripcion,
                    'FechaHoraEntrada' => $evento->FechaHoraEntrada,
                    'FechaHoraSalida' => $evento->FechaHoraSalida,
                ];
                return response()->json([
                    'success' => true,
                    'data' => $data,
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontró el evento',
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el evento: ' . $e->getMessage(),
            ], 500);
        }
    }
}
