package api.example.apis;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
//import com.google.common.base.Preconditions;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.Cookie;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

/**
 * Controlador de autenticación que gestiona el login y registro de usuarios.
 *
 * @author Sebastian
 */
@RestController
@RequestMapping("/api/auth")

@CrossOrigin(origins = {"http://localhost:80", "http://localhost", "http://localhost:5173", "http://149.50.144.68", "https://149.50.144.68"}, allowCredentials = "true")
public class AuthController {

    @Resource
    private DataSource dataSource;

    /**
     * Método que permite iniciar sesión.
     *
     * @param loginRequest Objeto que contiene el email y la contraseña.
     * @return ResponseEntity con la respuesta de autenticación.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session, HttpServletResponse response) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        try (Connection connection = dataSource.getConnection()) {
            String query = "SELECT u.id AS usuario_id, r.nom_rol, u.dni FROM usuario u "
                    + "INNER JOIN usuarios_roles ur ON u.id = ur.usuario_id "
                    + "INNER JOIN rol r ON ur.rol_id = r.id "
                    + "WHERE u.email = ? AND u.password = ?";
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, email);
            statement.setString(2, password);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                Long usuarioId = resultSet.getLong("usuario_id");
                String nomRol = resultSet.getString("nom_rol");
                session.setAttribute("usuarioId", usuarioId);
                session.setAttribute("nomRol", nomRol); // Opcional si también necesitas validar roles

                int dni = resultSet.getInt("dni");
                String dniString = String.valueOf(dni);

                Cookie usuarioIdCookie = new Cookie("usuarioId", String.valueOf(usuarioId));
                Cookie nomRolCookie = new Cookie("nomRol", nomRol);
                Cookie dniCookie = new Cookie("dni", dniString);

                //usuarioIdCookie.setHttpOnly(true); // Evita acceso desde JavaScript
                usuarioIdCookie.setMaxAge(7 * 24 * 60 * 60); // Dura 7 días
                usuarioIdCookie.setPath("/");

                //nomRolCookie.setHttpOnly(true); // Evita acceso desde JavaScript
                nomRolCookie.setMaxAge(7 * 24 * 60 * 60); // Dura 7 días
                nomRolCookie.setPath("/");

                //dniCookie.setHttpOnly(true); // Evita acceso desde JavaScript
                dniCookie.setMaxAge(7 * 24 * 60 * 60); // Dura 7 días
                dniCookie.setPath("/");

                response.addCookie(usuarioIdCookie);
                response.addCookie(nomRolCookie);
                response.addCookie(dniCookie);

                return ResponseEntity.ok(new LoginResponse(true, "Login exitoso", usuarioId, nomRol));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, "Email o contraseña incorrectos"));
            }
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(false, "Error en el servidor"));
        }
    }

    /**
     * Método que permite registrar un nuevo usuario.
     *
     * @param registerRequest Objeto que contiene los datos del usuario.
     * @return ResponseEntity con la respuesta de registro.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try (Connection connection = dataSource.getConnection()) {
            // Verificar si el usuario ya existe
            String checkUserQuery = "SELECT COUNT(*) FROM usuario WHERE email = ?";
            PreparedStatement checkUserStatement = connection.prepareStatement(checkUserQuery);
            checkUserStatement.setString(1, registerRequest.getEmail());
            ResultSet userCheckResult = checkUserStatement.executeQuery();
            userCheckResult.next();

            if (userCheckResult.getInt(1) > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new RegisterResponse(false, "El email ya está registrado"));
            }

            // Insertar nuevo usuario
            String insertQuery = "INSERT INTO usuario (ape_materno, ape_paterno, dni, domicilio, email, fech_nacimiento, genero, nombre, password, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement insertStatement = connection.prepareStatement(insertQuery);
            insertStatement.setString(1, registerRequest.getApeMaterno());
            insertStatement.setString(2, registerRequest.getApePaterno());
            insertStatement.setLong(3, registerRequest.getDni());
            insertStatement.setString(4, registerRequest.getDomicilio());
            insertStatement.setString(5, registerRequest.getEmail());
            insertStatement.setString(6, registerRequest.getFechaNacimiento());
            insertStatement.setString(7, registerRequest.getGenero());
            insertStatement.setString(8, registerRequest.getNombres());
            insertStatement.setString(9, registerRequest.getPassword()); // Asegúrate de encriptar la contraseña
            insertStatement.setLong(10, registerRequest.getTelefono());
            insertStatement.executeUpdate();

            // Obtener el rol ID
            long rolId = getRoleIdByName(registerRequest.getRol());

            // Insertar en la tabla de usuarios_roles
            String insertRoleQuery = "INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (?, ?)";
            PreparedStatement insertRoleStatement = connection.prepareStatement(insertRoleQuery);
            long usuarioId = getLastInsertId(connection);
            insertRoleStatement.setLong(1, usuarioId);
            insertRoleStatement.setLong(2, rolId);
            insertRoleStatement.executeUpdate();

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new RegisterResponse(true, "Registro exitoso"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegisterResponse(false, "Error en el servidor"));
        }
    }

    /**
     * Obtiene el ID de un rol dado su nombre.
     *
     * @param roleName Nombre del rol.
     * @return ID del rol.
     * @throws SQLException Si ocurre un error en la base de datos.
     */
    private long getRoleIdByName(String roleName) throws SQLException {
        String query = "SELECT id FROM rol WHERE nom_rol = ?";
        try (Connection connection = dataSource.getConnection(); PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, roleName);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getLong("id");
            } else {
                throw new SQLException("Rol no encontrado: " + roleName);
            }
        }
    }

    /**
     * Obtiene el último ID insertado en la base de datos.
     *
     * @param connection Conexión a la base de datos.
     * @return Último ID insertado.
     * @throws SQLException Si ocurre un error en la base de datos.
     */
    private long getLastInsertId(Connection connection) throws SQLException {
        String query = "SELECT LAST_INSERT_ID()";
        try (PreparedStatement statement = connection.prepareStatement(query); ResultSet resultSet = statement.executeQuery()) {
            if (resultSet.next()) {
                return resultSet.getLong(1);
            }
            throw new SQLException("No se pudo obtener el último ID insertado.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response, HttpSession session) {
        // Invalida la sesión
        session.invalidate();

        Cookie usuarioIdCookie = new Cookie("usuarioId", null);
        usuarioIdCookie.setPath("/"); // Asegura que se borra para todo el dominio
        usuarioIdCookie.setMaxAge(0); // Hace que expire la cookie inmediatamente
        usuarioIdCookie.setHttpOnly(true);

        Cookie nomRolCookie = new Cookie("nomRol", null);
        nomRolCookie.setPath("/");
        nomRolCookie.setMaxAge(0);
        nomRolCookie.setHttpOnly(true);

        Cookie dniCookie = new Cookie("dni", null); // Aquí creas la cookie para borrar el dni
        dniCookie.setPath("/"); // Asegura que se borra para todo el dominio
        dniCookie.setMaxAge(0); // Hace que expire la cookie inmediatamente
        dniCookie.setHttpOnly(true); // Se asegura que la cookie es solo accesible por el servidor

        // Borra la cookie de sesión (JSESSIONID)
        Cookie sessionCookie = new Cookie("JSESSIONID", null);
        sessionCookie.setPath("/");
        sessionCookie.setMaxAge(0);
        sessionCookie.setHttpOnly(true);

        // Agregar cookies a la respuesta para su eliminación
        response.addCookie(usuarioIdCookie);
        response.addCookie(nomRolCookie);
        response.addCookie(dniCookie); // Aquí añades la cookie para borrar el dni
        response.addCookie(sessionCookie);

        return ResponseEntity.ok("Sesión cerrada con éxito");
    }

    @GetMapping("/check-session")
    public ResponseEntity<?> checkSession(HttpSession session) {
        // Verifica si la sesión contiene atributos específicos
        if (session.getAttribute("usuarioId") != null) {
            // La sesión es válida
            return ResponseEntity.ok(new SessionResponse(true, "Sesión activa"));
        } else {
            // La sesión no es válida
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new SessionResponse(false, "Sesión no activa"));
        }
    }

    @PostMapping("/add-asiste")
    public ResponseEntity<?> addAsiste(@RequestBody Map<String, Long> request) {
        Long idUsuario = request.get("idUsuario");
        Long idEvento = request.get("idEvento");

        // Verificar que los valores no sean nulos
        if (idUsuario == null || idEvento == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Se deben proporcionar los valores 'idUsuario' y 'idEvento'.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        String insertQuery = "INSERT INTO asiste (ID_Usuario, ID_Evento) VALUES (?, ?)";
        try (Connection connection = dataSource.getConnection(); PreparedStatement statement = connection.prepareStatement(insertQuery)) {

            // Establecer los parámetros para la consulta SQL
            statement.setLong(1, idUsuario);
            statement.setLong(2, idEvento);

            int rowsInserted = statement.executeUpdate();

            Map<String, Object> response = new HashMap<>();
            if (rowsInserted > 0) {
                response.put("success", true);
                response.put("message", "Registro insertado correctamente en la tabla 'asiste'.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "No se pudo insertar el registro en la tabla 'asiste'.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al realizar la operación en la base de datos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/registros-asistencia")
    public ResponseEntity<?> getRegistrosAsistencia() {
        try (Connection connection = dataSource.getConnection()) {
            // Especificamos explícitamente las columnas que queremos seleccionar
            String query = "SELECT ra.ID_Registro, ra.ID_Evento, e.NombreEvento "
                    + "FROM registro_asistencia ra "
                    + "INNER JOIN evento e ON ra.ID_Evento = e.ID_Evento";

            PreparedStatement statement = connection.prepareStatement(query);
            ResultSet resultSet = statement.executeQuery();

            List<RegistroAsistencia> registros = new ArrayList<>();

            while (resultSet.next()) {
                RegistroAsistencia registro = new RegistroAsistencia();
                registro.setId(resultSet.getLong("ID_Registro"));       // Usamos el nombre exacto de la columna
                registro.setIdEvento(resultSet.getLong("ID_Evento"));
                registro.setNombreEvento(resultSet.getString("NombreEvento"));
                registros.add(registro);
            }

            if (!registros.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", registros);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new HashMap<String, Object>() {
                            {
                                put("message", "No se encontraron registros de asistencia");
                                put("success", false);
                            }
                        });
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, Object>() {
                        {
                            put("message", "Error al obtener los registros de asistencia: " + e.getMessage());
                            put("success", false);
                        }
                    });
        }
    }
}
