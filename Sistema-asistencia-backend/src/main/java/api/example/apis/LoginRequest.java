package api.example.apis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa una solicitud de inicio de sesión.
 * Contiene los datos necesarios para autenticar a un usuario.
 *
 * @author Sebastian
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}
