<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReporteAsistencia extends Model
{
    use HasFactory;
    protected $table = 'reporte_asistencia';
    protected $primaryKey = 'ID_Reporte';
    protected $fillable = [
        'Tipo', 'FechaReporte'
    ];
    public function genera()
    {
        return $this->hasOne(Genera::class, 'ID_Reporte', 'ID_Reporte');
    }
}
