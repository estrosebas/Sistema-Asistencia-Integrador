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
/**
 * Clase que representa la respuesta de una solicitud de inicio de sesión.
 * Incluye información sobre el estado de la autenticación y los detalles del usuario en caso de éxito.
 */
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

    /**
     * Constructor para crear una respuesta de login con detalles del usuario.
     *
     * @param success   Indica si la autenticación fue exitosa.
     * @param message   Mensaje de respuesta.
     * @param usuarioId ID del usuario.
     * @param nomRol    Nombre del rol del usuario.
     */
    public LoginResponse(boolean success, String message, Long usuarioId, String nomRol) {
        this.success = success;
        this.message = message;
        this.usuarioId = usuarioId;
        this.nomRol = nomRol;
    }

    /**
     * Obtiene el ID del usuario.
     *
     * @return ID del usuario.
     */
    public Long getUsuarioId() {
        return usuarioId;
    }

    /**
     * Establece el ID del usuario.
     *
     * @param usuarioId ID del usuario.
     */
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    /**
     * Obtiene el nombre del rol del usuario.
     *
     * @return Nombre del rol.
     */
    public String getNomRol() {
        return nomRol;
    }

    /**
     * Establece el nombre del rol del usuario.
     *
     * @param nomRol Nombre del rol.
     */
    public void setNomRol(String nomRol) {
        this.nomRol = nomRol;
    }

    /**
     * Indica si la autenticación fue exitosa.
     *
     * @return true si fue exitosa, false en caso contrario.
     */
    public boolean isSuccess() {
        return success;
    }

    /**
     * Establece el estado de éxito de la autenticación.
     *
     * @param success true si fue exitosa, false en caso contrario.
     */
    public void setSuccess(boolean success) {
        this.success = success;
    }

    /**
     * Obtiene el mensaje de respuesta.
     *
     * @return Mensaje de respuesta.
     */
    public String getMessage() {
        return message;
    }

    /**
     * Establece el mensaje de respuesta.
     *
     * @param message Mensaje de respuesta.
     */
    public void setMessage(String message) {
        this.message = message;
    }
}
