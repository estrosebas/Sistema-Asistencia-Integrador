package api.example.apis;

/**
 * Clase que representa la respuesta de una solicitud de registro.
 * Incluye el estado del registro y un mensaje informativo.
 *
 * @author Sebastian
 */
public class RegisterResponse {
    private boolean success;
    private String message;

    /**
     * Constructor para crear una respuesta de registro.
     *
     * @param success Indica si el registro fue exitoso.
     * @param message Mensaje informativo sobre el resultado del registro.
     */
    public RegisterResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    /**
     * Verifica si el registro fue exitoso.
     *
     * @return true si fue exitoso, false en caso contrario.
     */
    public boolean isSuccess() {
        return success;
    }

    /**
     * Establece el estado de éxito del registro.
     *
     * @param success true si fue exitoso, false en caso contrario.
     */
    public void setSuccess(boolean success) {
        this.success = success;
    }

    /**
     * Obtiene el mensaje informativo sobre el resultado del registro.
     *
     * @return Mensaje informativo.
     */
    public String getMessage() {
        return message;
    }

    /**
     * Establece el mensaje informativo sobre el resultado del registro.
     *
     * @param message Mensaje informativo.
     */
    public void setMessage(String message) {
        this.message = message;
    }
}
