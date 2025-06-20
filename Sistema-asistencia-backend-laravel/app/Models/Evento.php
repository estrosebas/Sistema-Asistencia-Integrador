<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;
    protected $table = 'evento';
    protected $primaryKey = 'ID_Evento';
    protected $fillable = [
        'NombreEvento', 'Capacidad', 'Descripcion', 'FechaHoraEntrada', 'FechaHoraSalida'
    ];
    public function usuarios()
    {
        return $this->belongsToMany(Usuario::class, 'asiste', 'ID_Evento', 'ID_Usuario');
    }
    public function registrosAsistencia()
    {
        return $this->hasMany(RegistroAsistencia::class, 'ID_Evento', 'ID_Evento');
    }
}
