<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;
    protected $table = 'usuario';
    protected $fillable = [
        'ape_materno', 'ape_paterno', 'dni', 'domicilio', 'email', 'fech_nacimiento', 'genero', 'nombre', 'password', 'telefono'
    ];
    public function roles()
    {
        return $this->belongsToMany(Rol::class, 'usuarios_roles', 'usuario_id', 'rol_id');
    }
    public function eventos()
    {
        return $this->belongsToMany(Evento::class, 'asiste', 'ID_Usuario', 'ID_Evento');
    }
    public function registrosAsistencia()
    {
        return $this->hasMany(RegistroAsistencia::class, 'ID_Usuario', 'id');
    }
}
