<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Genera extends Model
{
    protected $table = 'genera';
    public $timestamps = false;
    protected $fillable = [
        'ID_Reporte', 'ID_Registro'
    ];
    public function reporteAsistencia()
    {
        return $this->belongsTo(ReporteAsistencia::class, 'ID_Reporte', 'ID_Reporte');
    }
    public function registroAsistencia()
    {
        return $this->belongsTo(RegistroAsistencia::class, 'ID_Registro', 'ID_Registro');
    }
}
