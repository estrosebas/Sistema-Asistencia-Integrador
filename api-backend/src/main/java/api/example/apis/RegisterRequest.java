package api.example.apis;

/**
 * Clase que representa una solicitud de registro de un usuario.
 * Contiene los datos necesarios para registrar un nuevo usuario en el sistema.
 *
 * @author Sebastian
 */
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

    /**
     * Obtiene el apellido materno del usuario.
     *
     * @return Apellido materno.
     */
    public String getApeMaterno() {
        return apeMaterno;
    }

    /**
     * Establece el apellido materno del usuario.
     *
     * @param apeMaterno Apellido materno.
     */
    public void setApeMaterno(String apeMaterno) {
        this.apeMaterno = apeMaterno;
    }

    /**
     * Obtiene el apellido paterno del usuario.
     *
     * @return Apellido paterno.
     */
    public String getApePaterno() {
        return apePaterno;
    }

    /**
     * Establece el apellido paterno del usuario.
     *
     * @param apePaterno Apellido paterno.
     */
    public void setApePaterno(String apePaterno) {
        this.apePaterno = apePaterno;
    }

    /**
     * Obtiene el DNI del usuario.
     *
     * @return DNI del usuario.
     */
    public long getDni() {
        return dni;
    }

    /**
     * Establece el DNI del usuario.
     *
     * @param dni DNI del usuario.
     */
    public void setDni(long dni) {
        this.dni = dni;
    }

    /**
     * Obtiene el domicilio del usuario.
     *
     * @return Domicilio del usuario.
     */
    public String getDomicilio() {
        return domicilio;
    }

    /**
     * Establece el domicilio del usuario.
     *
     * @param domicilio Domicilio del usuario.
     */
    public void setDomicilio(String domicilio) {
        this.domicilio = domicilio;
    }

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
     * Obtiene la fecha de nacimiento del usuario.
     *
     * @return Fecha de nacimiento en formato "yyyy-MM-dd HH:mm:ss" o "yyyy-MM-dd".
     */
    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    /**
     * Establece la fecha de nacimiento del usuario.
     *
     * @param fechaNacimiento Fecha de nacimiento en formato "yyyy-MM-dd HH:mm:ss" o "yyyy-MM-dd".
     */
    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    /**
     * Obtiene el género del usuario.
     *
     * @return Género del usuario.
     */
    public String getGenero() {
        return genero;
    }

    /**
     * Establece el género del usuario.
     *
     * @param genero Género del usuario.
     */
    public void setGenero(String genero) {
        this.genero = genero;
    }

    /**
     * Obtiene el nombre del usuario.
     *
     * @return Nombres del usuario.
     */
    public String getNombres() {
        return nombres;
    }

    /**
     * Establece el nombre del usuario.
     *
     * @param nombres Nombres del usuario.
     */
    public void setNombres(String nombres) {
        this.nombres = nombres;
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

    /**
     * Obtiene el número de teléfono del usuario.
     *
     * @return Teléfono del usuario.
     */
    public long getTelefono() {
        return telefono;
    }

    /**
     * Establece el número de teléfono del usuario.
     *
     * @param telefono Teléfono del usuario.
     */
    public void setTelefono(long telefono) {
        this.telefono = telefono;
    }

    /**
     * Obtiene el rol asignado al usuario.
     *
     * @return Rol del usuario.
     */
    public String getRol() {
        return rol;
    }

    /**
     * Establece el rol del usuario.
     *
     * @param rol Rol del usuario.
     */
    public void setRol(String rol) {
        this.rol = rol;
    }
}
