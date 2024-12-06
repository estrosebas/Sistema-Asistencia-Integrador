package api.example.apis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * La clase Evento representa un evento con detalles como el nombre, fecha y hora de entrada,
 * fecha y hora de salida, capacidad y descripción.
 */
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
