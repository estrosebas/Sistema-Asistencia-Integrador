package api.example.apis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa una solicitud para crear un nuevo evento.
 * Contiene los datos necesarios para crear un evento.
 *
 * @author Sebastian
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventoRequest {
    private String nombreEvento;
    private String descripcion;
    private Integer capacidad;
    private String fechaHoraEntrada;
    private String fechaHoraSalida;
}
