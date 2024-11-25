package api.example.apis;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que representa un registro de asistencia.
 *
 * @author Sebastian
 */

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistroAsistencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long idEvento;
    private String nombreEvento;
    private String fecha;
    private String hora;
}
