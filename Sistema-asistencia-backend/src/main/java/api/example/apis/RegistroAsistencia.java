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

public class RegistroAsistencia {

    private Long id;
    private Long idEvento;
    private String nombreEvento;
    private String fecha;
    private String hora;

}

    // Constructor por defecto
    public RegistroAsistencia() {
    }

    // Constructor con todos los campos
    public RegistroAsistencia(Long id, Long idEvento, String nombreEvento, String fecha, String hora) {
        this.id = id;
        this.idEvento = idEvento;
        this.nombreEvento = nombreEvento;
        this.fecha = fecha;
        this.hora = hora;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdEvento() {
        return idEvento;
    }

    public void setIdEvento(Long idEvento) {
        this.idEvento = idEvento;
    }

    public String getNombreEvento() {
        return nombreEvento;
    }

    public void setNombreEvento(String nombreEvento) {
        this.nombreEvento = nombreEvento;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }
}
