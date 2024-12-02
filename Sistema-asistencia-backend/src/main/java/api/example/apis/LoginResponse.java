package api.example.apis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa la respuesta de una solicitud de inicio de sesión.
 * Incluye información sobre el estado de la autenticación y los detalles del usuario en caso de éxito.
 *
 * @author Sebastian
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private boolean success;
    private String message;
    private Long usuarioId;
    private String nomRol;

    /**
     * Constructor para crear una respuesta de login sin datos de usuario.
     *
     * @param success Indica si la autenticación fue exitosa.
     * @param message Mensaje de respuesta.
     */
    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
