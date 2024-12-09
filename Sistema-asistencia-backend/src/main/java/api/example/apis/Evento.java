package api.example.apis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Evento {
    private Long id;
    private String nombreEvento;
    private String fechaHoraEntrada;
    private String fechaHoraSalida;
    private int capacidad;
    private String descripcion;
}
