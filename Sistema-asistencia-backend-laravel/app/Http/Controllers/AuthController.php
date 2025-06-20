<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use Illuminate\Http\Response;

class AuthController extends Controller
{
    /**
     * Login de usuario
     */
    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');
        Log::info('Intento de inicio de sesión para el usuario: ' . $email);

        $usuario = Usuario::where('email', $email)->first();
        if ($usuario && $usuario->password === $password) { // Si usas hash, cambia esto por Hash::check
            $rol = $usuario->roles()->first();
            Session::put('usuarioId', $usuario->id);
            Session::put('nomRol', $rol ? $rol->nom_rol : null);
            Log::info('Inicio de sesión exitoso para el usuario ID: ' . $usuario->id);
            return response()->json([
                'success' => true,
                'message' => 'Login exitoso',
                'usuarioId' => $usuario->id,
                'nomRol' => $rol ? $rol->nom_rol : null,
                'dni' => (string) $usuario->dni,
            ]);
        } else {
            Log::warning('Email o contraseña incorrectos para el usuario: ' . $email);
            return response()->json([
                'success' => false,
                'message' => 'Email o contraseña incorrectos',
            ], Response::HTTP_UNAUTHORIZED);
        }
    }

    /**
     * Registro de usuario
     */
    public function register(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');
        \Log::info('Registro de nuevo usuario: ' . $email);

        // Verificar si el usuario ya existe
        if (\App\Models\Usuario::where('email', $email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'El email ya está registrado',
            ], 409);
        }

        \DB::beginTransaction();
        try {
            $usuario = new \App\Models\Usuario();
            $usuario->ape_materno = $request->input('ape_materno');
            $usuario->ape_paterno = $request->input('ape_paterno');
            $usuario->dni = $request->input('dni');
            $usuario->domicilio = $request->input('domicilio');
            $usuario->email = $email;
            $usuario->fech_nacimiento = $request->input('fech_nacimiento');
            $usuario->genero = $request->input('genero');
            $usuario->nombre = $request->input('nombre');
            $usuario->password = $password; // Si usas hash, cambia esto por Hash::make($password)
            $usuario->telefono = $request->input('telefono');
            $usuario->save();

            // Obtener el rol ID
            $rol = \App\Models\Rol::where('nom_rol', $request->input('rol'))->first();
            if ($rol) {
                $usuario->roles()->attach($rol->id);
            }

            \DB::commit();
            \Log::info('Registro exitoso para el usuario: ' . $email);
            return response()->json([
                'success' => true,
                'message' => 'Registro exitoso',
            ], 201);
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Error al intentar registrar el usuario: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error en el servidor: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cerrar sesión
     */
    public function logout(Request $request)
    {
        \Session::flush();
        \Log::info('Sesión cerrada exitosamente.');
        // Opcional: borrar cookies manualmente si se usan cookies personalizadas
        $response = response()->json([
            'success' => true,
            'message' => 'Sesión cerrada con éxito',
        ]);
        // Laravel maneja la cookie de sesión automáticamente, pero si necesitas borrar cookies personalizadas:
        $response->headers->setCookie(cookie('usuarioId', null, -1));
        $response->headers->setCookie(cookie('nomRol', null, -1));
        $response->headers->setCookie(cookie('dni', null, -1));
        $response->headers->setCookie(cookie('laravel_session', null, -1));
        return $response;
    }

    /**
     * Verifica si la sesión está activa
     */
    public function checkSession(Request $request)
    {
        $usuarioId = \Session::get('usuarioId');
        if ($usuarioId !== null) {
            \Log::info('Sesión activa para el usuario ID: ' . $usuarioId);
            return response()->json([
                'success' => true,
                'message' => 'Sesión activa',
            ]);
        } else {
            \Log::warning('Sesión no activa.');
            return response()->json([
                'success' => false,
                'message' => 'Sesión no activa',
            ], 401);
        }
    }

    /**
     * Obtener la lista de usuarios
     */
    public function getUsuarios()
    {
        try {
            $usuarios = \App\Models\Usuario::select('id', 'dni', 'nombre', 'ape_paterno', 'ape_materno')->get();
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
                'message' => 'Error al obtener los usuarios: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtiene los usuarios que comparten eventos en común con el usuario logueado
     */
    public function getUsuariosHistorial(Request $request)
    {
        $usuarioId = $request->query('usuarioId');
        try {
            // Obtener los eventos del usuario logueado
            $usuario = \App\Models\Usuario::find($usuarioId);
            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado',
                ], 404);
            }
            $eventosIds = $usuario->eventos()->pluck('evento.ID_Evento')->toArray();
            if (empty($eventosIds)) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                ]);
            }
            // Obtener los usuarios que comparten eventos en común
            $usuarios = \App\Models\Usuario::whereHas('eventos', function ($query) use ($eventosIds) {
                $query->whereIn('evento.ID_Evento', $eventosIds);
            })->distinct()->get(['id', 'dni', 'nombre', 'ape_paterno', 'ape_materno']);
            $data = $usuarios->map(function ($usuario) {
                $eventos = $usuario->eventos()->pluck('NombreEvento')->toArray();
                return [
                    'id' => $usuario->id,
                    'dni' => $usuario->dni,
                    'nombre' => $usuario->nombre,
                    'ape_paterno' => $usuario->ape_paterno,
                    'ape_materno' => $usuario->ape_materno,
                    'eventos' => $eventos,
                ];
            });
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los usuarios: ' . $e->getMessage(),
            ], 500);
        }
    }
}
