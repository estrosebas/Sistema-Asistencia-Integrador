package api.example.apis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa una solicitud de registro de un usuario.
 * Contiene los datos necesarios para registrar un nuevo usuario en el sistema.
 *
 * @author Sebastian
 */

@Data
@AllArgsConstructor
@NoArgsConstructor

public class RegisterRequest {
    private String apeMaterno;
    private String apePaterno;
    private long dni;
    private String domicilio;
    private String email;
    private String fechaNacimiento; // Usar formato "yyyy-MM-dd HH:mm:ss" o "yyyy-MM-dd"
    private String genero;
    private String nombres;
    private String password;
    private long telefono;
    private String rol; // Rol asignado al usuario
}