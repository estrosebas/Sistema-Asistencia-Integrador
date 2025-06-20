<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroAsistencia extends Model
{
    use HasFactory;
    protected $table = 'registro_asistencia';
    protected $primaryKey = 'ID_Registro';
    protected $fillable = [
        'Estado', 'FechaRegistro', 'ID_Evento', 'ID_Usuario'
    ];
    public function evento()
    {
        return $this->belongsTo(Evento::class, 'ID_Evento', 'ID_Evento');
    }
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'ID_Usuario', 'id');
    }
    public function genera()
    {
        return $this->hasOne(Genera::class, 'ID_Registro', 'ID_Registro');
    }
}
