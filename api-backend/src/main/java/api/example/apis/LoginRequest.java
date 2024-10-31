package api.example.apis;

/**
 * Clase que representa una solicitud de inicio de sesión.
 * Contiene los datos necesarios para autenticar a un usuario.
 *
 * @author Sebastian
 */
public class LoginRequest {
    private String email;
    private String password;

    /**
     * Obtiene el email del usuario.
     *
     * @return Email del usuario.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Establece el email del usuario.
     *
     * @param email Email del usuario.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Obtiene la contraseña del usuario.
     *
     * @return Contraseña del usuario.
     */
    public String getPassword() {
        return password;
    }

    /**
     * Establece la contraseña del usuario.
     *
     * @param password Contraseña del usuario.
     */
    public void setPassword(String password) {
        this.password = password;
    }
}
