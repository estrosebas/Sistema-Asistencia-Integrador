package api.example.apis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa la respuesta de una verificación de sesión.
 * Incluye el estado de la autenticación y un mensaje informativo.
 *
 * @author Sebastian
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionResponse {
    private boolean authenticated;
    private String message;
}
