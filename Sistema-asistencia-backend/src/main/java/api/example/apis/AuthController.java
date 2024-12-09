package api.example.apis;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;

import javax.sql.DataSource;

/**
 * Controlador de autenticación que gestiona el login y registro de usuarios.
 *
 * @author Sebastian
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "https://qrattendarequipa.sytes.net:3000", "https://qrattendarequipa.sytes.net", "http://localhost:5173"}, allowedHeaders = "*", allowCredentials = "true")

public class AuthController {

    private static final Logger logger = LogManager.getLogger(AuthController.class); // Inicializar Logger

    @Resource
    private DataSource dataSource;

    /**
     * Método que permite iniciar sesión.
     *
     * @param loginRequest Objeto que contiene el email y la contraseña.
     * @param session Sesión HTTP.
     * @param response Respuesta HTTP.
     * @return ResponseEntity con la respuesta de autenticación.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session, HttpServletResponse response) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        logger.info("Intento de inicio de sesión para el usuario: " + email); // Log de inicio de sesión

        try (Connection connection = dataSource.getConnection()) {
            String query = "SELECT u.id AS usuario_id, r.nom_rol, u.dni FROM usuario u "
                    + "INNER JOIN usuarios_roles ur ON u.id = ur.usuario_id "
                    + "INNER JOIN rol r ON ur.rol_id = r.id "
                    + "WHERE u.email = ? AND u.password = ?";
            try (PreparedStatement statement = connection.prepareStatement(query)) {
                statement.setString(1, email);
                statement.setString(2, password);

                ResultSet resultSet = statement.executeQuery();

                if (resultSet.next()) {
                    Long usuarioId = resultSet.getLong("usuario_id");
                    String nomRol = resultSet.getString("nom_rol");
                    session.setAttribute("usuarioId", usuarioId);
                    session.setAttribute("nomRol", nomRol);

                    int dni = resultSet.getInt("dni");
                    String dniString = String.valueOf(dni);

                    logger.info("Inicio de sesión exitoso para el usuario ID: " + usuarioId); // Log de éxito

                    return ResponseEntity.ok(new HashMap<String, Object>() {{
                        put("success", true);
                        put("message", "Login exitoso");
                        put("usuarioId", usuarioId);
                        put("nomRol", nomRol);
                        put("dni", dniString);
                    }});
                } else {
                    logger.warn("Email o contraseña incorrectos para el usuario: " + email); // Log de advertencia
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new HashMap<String, Object>() {{
                                put("success", false);
                                put("message", "Email o contraseña incorrectos");
                            }});
                }
            }
        } catch (SQLException e) {
            logger.error("Error al intentar iniciar sesión: ", e); // Log de error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "Error interno del servidor");
                    }});
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
        String email = registerRequest.getEmail();
        String password = registerRequest.getPassword();
        logger.info("Registro de nuevo usuario: " + email); // Log de registro

        try (Connection connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);

            // Verificar si el usuario ya existe
            if (isUserExists(connection, email)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new RegisterResponse(false, "El email ya está registrado"));
            }

            // Insertar nuevo usuario
            String insertQuery = "INSERT INTO usuario (ape_materno, ape_paterno, dni, domicilio, email, fech_nacimiento, genero, nombre, password, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement insertStatement = connection.prepareStatement(insertQuery)) {
                setUserParameters(insertStatement, registerRequest);
                insertStatement.executeUpdate();

                // Obtener el rol ID
                long rolId = getRoleIdByName(connection, registerRequest.getRol());

                // Insertar en la tabla de usuarios_roles
                String insertRoleQuery = "INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (?, ?)";
                try (PreparedStatement insertRoleStatement = connection.prepareStatement(insertRoleQuery)) {
                    long usuarioId = getLastInsertId(connection);
                    insertRoleStatement.setLong(1, usuarioId);
                    insertRoleStatement.setLong(2, rolId);
                    insertRoleStatement.executeUpdate();
                }

                connection.commit();
                logger.info("Registro exitoso para el usuario: " + email); // Log de éxito
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(new RegisterResponse(true, "Registro exitoso"));
            } catch (Exception e) {
                connection.rollback();
                logger.error("Error al intentar registrar el usuario: ", e); // Log de error
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new RegisterResponse(false, "Error en el servidor: " + e.getMessage()));
            }
        } catch (SQLException e) {
            logger.error("Error al intentar registrar el usuario: ", e); // Log de error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegisterResponse(false, "Error en el servidor: " + e.getMessage()));
        }
    }

    /**
     * Obtiene el ID de un rol dado su nombre.
     *
     * @param connection Conexión a la base de datos.
     * @param roleName Nombre del rol.
     * @return ID del rol.
     * @throws SQLException Si ocurre un error en la base de datos.
     */
    private long getRoleIdByName(Connection connection, String roleName) throws SQLException {
        String query = "SELECT id FROM rol WHERE nom_rol = ?";
        try (PreparedStatement statement = connection.prepareStatement(query)) {
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

    /**
     * Verifica si un usuario ya existe en la base de datos.
     *
     * @param connection Conexión a la base de datos.
     * @param email Email del usuario.
     * @return true si el usuario ya existe, false en caso contrario.
     * @throws SQLException Si ocurre un error en la base de datos.
     */
    private boolean isUserExists(Connection connection, String email) throws SQLException {
        String checkUserQuery = "SELECT COUNT(*) FROM usuario WHERE email = ?";
        try (PreparedStatement checkUserStatement = connection.prepareStatement(checkUserQuery)) {
            checkUserStatement.setString(1, email);
            ResultSet userCheckResult = checkUserStatement.executeQuery();
            if (userCheckResult != null && userCheckResult.next()) {
                return userCheckResult.getInt(1) > 0;
            } else {
                throw new SQLException("ResultSet is null or empty");
            }
        }
    }

    /**
     * Configura las propiedades de una cookie.
     *
     * @param cookie Cookie a configurar.
     */
    private void configureCookie(Cookie cookie) {
        cookie.setMaxAge(7 * 24 * 60 * 60); // Dura 7 días
        cookie.setPath("/");
        cookie.setHttpOnly(true);
    }

    /**
     * Establece los parámetros del usuario en el PreparedStatement.
     *
     * @param statement PreparedStatement.
     * @param registerRequest Objeto que contiene los datos del usuario.
     * @throws SQLException Si ocurre un error en la base de datos.
     */
    private void setUserParameters(PreparedStatement statement, RegisterRequest registerRequest) throws SQLException {
        statement.setString(1, registerRequest.getApeMaterno());
        statement.setString(2, registerRequest.getApePaterno());
        statement.setLong(3, registerRequest.getDni());
        statement.setString(4, registerRequest.getDomicilio());
        statement.setString(5, registerRequest.getEmail());
        statement.setString(6, registerRequest.getFechaNacimiento());
        statement.setString(7, registerRequest.getGenero());
        statement.setString(8, registerRequest.getNombres());
        statement.setString(9, registerRequest.getPassword()); // Asegúrate de encriptar la contraseña
        statement.setLong(10, registerRequest.getTelefono());
    }

    /**
     * Método que permite cerrar sesión.
     *
     * @param response Respuesta HTTP.
     * @param session Sesión HTTP.
     * @return ResponseEntity con la respuesta de cierre de sesión.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response, HttpSession session) {
        session.invalidate();
        logger.info("Sesión cerrada exitosamente."); // Log de cierre de sesión

        Cookie usuarioIdCookie = new Cookie("usuarioId", null);
        Cookie nomRolCookie = new Cookie("nomRol", null);
        Cookie dniCookie = new Cookie("dni", null);
        Cookie sessionCookie = new Cookie("JSESSIONID", null);

        configureCookie(usuarioIdCookie);
        configureCookie(nomRolCookie);
        configureCookie(dniCookie);
        configureCookie(sessionCookie);

        response.addCookie(usuarioIdCookie);
        response.addCookie(nomRolCookie);
        response.addCookie(dniCookie);
        response.addCookie(sessionCookie);

        return ResponseEntity.ok("Sesión cerrada con éxito");
    }

    /**
     * Método que verifica si la sesión está activa.
     *
     * @param session Sesión HTTP.
     * @return ResponseEntity con la respuesta de verificación de sesión.
     */
    @GetMapping("/check-session")
    public ResponseEntity<?> checkSession(HttpSession session) {
        if (session.getAttribute("usuarioId") != null) {
            logger.info("Sesión activa para el usuario ID: " + session.getAttribute("usuarioId")); // Log de sesión activa
            return ResponseEntity.ok(new SessionResponse(true, "Sesión activa"));
        } else {
            logger.warn("Sesión no activa."); // Log de advertencia
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new SessionResponse(false, "Sesión no activa"));
        }
    }

    /**
     * Método que obtiene los registros de asistencia.
     *
     * @return ResponseEntity con la lista de registros de asistencia.
     */
    @GetMapping("/registros-asistencia")
    public ResponseEntity<?> getRegistrosAsistencia() {
        try (Connection connection = dataSource.getConnection()) {
            String query = "SELECT ra.ID_Registro, ra.ID_Evento, e.NombreEvento "
                    + "FROM registro_asistencia ra "
                    + "INNER JOIN evento e ON ra.ID_Evento = e.ID_Evento";

            PreparedStatement statement = connection.prepareStatement(query);
            ResultSet resultSet = statement.executeQuery();

            List<RegistroAsistencia> registros = new ArrayList<>();

            while (resultSet.next()) {
                RegistroAsistencia registro = new RegistroAsistencia();
                registro.setId(resultSet.getLong("ID_Registro"));
                registro.setIdEvento(resultSet.getLong("ID_Evento"));
                registro.setNombreEvento(resultSet.getString("NombreEvento"));
                registros.add(registro);
            }

            if (!registros.isEmpty()) {
                return ResponseEntity.ok(new HashMap<String, Object>() {{
                    put("success", true);
                    put("data", registros);
                }});
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new HashMap<String, Object>() {{
                            put("message", "No se encontraron registros de asistencia");
                            put("success", false);
                        }});
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, Object>() {{
                        put("message", "Error al obtener los registros de asistencia: " + e.getMessage());
                        put("success", false);
                    }});
        }
    }

    @GetMapping("/eventos")
    public ResponseEntity<?> getEventos(@RequestParam(value = "usuarioId", required = false) String usuarioIdStr) {
        Long usuarioId = null;
        try {
            if (usuarioIdStr != null && !usuarioIdStr.isEmpty()) {
                usuarioId = Long.parseLong(usuarioIdStr);
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "El parámetro 'usuarioId' debe ser un número válido.");
                    }});
        }

        try (Connection connection = dataSource.getConnection()) {
            String query = "SELECT e.* FROM evento e "
                    + "INNER JOIN asiste a ON e.ID_Evento = a.ID_Evento "
                    + "WHERE a.ID_Usuario = ?";
            PreparedStatement statement = connection.prepareStatement(query);
            if (usuarioId != null) {
                statement.setLong(1, usuarioId);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new HashMap<String, Object>() {{
                            put("success", false);
                            put("message", "El parámetro 'usuarioId' es requerido.");
                        }});
            }
            ResultSet resultSet = statement.executeQuery();

            List<Evento> eventos = new ArrayList<>();

            while (resultSet.next()) {
                Evento evento = new Evento();
                evento.setId(resultSet.getLong("ID_Evento"));
                evento.setNombreEvento(resultSet.getString("NombreEvento"));
                evento.setCapacidad(resultSet.getInt("Capacidad"));
                evento.setDescripcion(resultSet.getString("Descripcion"));
                evento.setFechaHoraEntrada(resultSet.getTimestamp("FechaHoraEntrada").toString());
                evento.setFechaHoraSalida(resultSet.getTimestamp("FechaHoraSalida").toString());
                eventos.add(evento);
            }

            if (!eventos.isEmpty()) {
                return ResponseEntity.ok(new HashMap<String, Object>() {{
                    put("success", true);
                    put("data", eventos);
                }});
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new HashMap<String, Object>() {{
                            put("message", "No se encontraron eventos");
                            put("success", false);
                        }});
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, Object>() {{
                        put("message", "Error al obtener los eventos: " + e.getMessage());
                        put("success", false);
                    }});
        }
    }

    @PostMapping("/add-evento")
    public ResponseEntity<?> addEvento(@RequestBody Map<String, Object> eventoRequest) {
        String nombreEvento = (String) eventoRequest.get("nombreEvento");
        String descripcion = (String) eventoRequest.get("descripcion");
        Integer capacidad = (Integer) eventoRequest.get("capacidad");
        String fechaHoraEntrada = (String) eventoRequest.get("fechaHoraEntrada");
        String fechaHoraSalida = (String) eventoRequest.get("fechaHoraSalida");
        Long idUsuario = Long.parseLong(eventoRequest.get("idUsuario").toString()); // Se obtiene del frontend

        String insertEventoQuery = "INSERT INTO evento (NombreEvento, Descripcion, Capacidad, FechaHoraEntrada, FechaHoraSalida) VALUES (?, ?, ?, ?, ?)";
        String getLastIdQuery = "SELECT LAST_INSERT_ID()";
        String insertAsisteQuery = "INSERT INTO asiste (ID_Usuario, ID_Evento) VALUES (?, ?)";

        try (Connection connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);

            // Insertar el evento
            long eventoId;
            try (PreparedStatement insertEventoStatement = connection.prepareStatement(insertEventoQuery);
                 PreparedStatement getLastIdStatement = connection.prepareStatement(getLastIdQuery)) {

                insertEventoStatement.setString(1, nombreEvento);
                insertEventoStatement.setString(2, descripcion);
                insertEventoStatement.setInt(3, capacidad);
                insertEventoStatement.setString(4, fechaHoraEntrada);
                insertEventoStatement.setString(5, fechaHoraSalida);

                int rowsInserted = insertEventoStatement.executeUpdate();
                if (rowsInserted == 0) {
                    connection.rollback();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "Error al crear el evento.");
                    }});
                }

                // Obtener el ID del evento creado
                ResultSet resultSet = getLastIdStatement.executeQuery();
                if (resultSet.next()) {
                    eventoId = resultSet.getLong(1);
                } else {
                    connection.rollback();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "No se pudo obtener el ID del evento recién creado.");
                    }});
                }
            }

            // Insertar en la tabla asiste
            try (PreparedStatement insertAsisteStatement = connection.prepareStatement(insertAsisteQuery)) {
                insertAsisteStatement.setLong(1, idUsuario);
                insertAsisteStatement.setLong(2, eventoId);
                insertAsisteStatement.executeUpdate();
            }

            connection.commit();

            // Devolver el evento recién creado
            Map<String, Object> nuevoEvento = new HashMap<>();
            nuevoEvento.put("id", eventoId);
            nuevoEvento.put("nombreEvento", nombreEvento);
            nuevoEvento.put("descripcion", descripcion);
            nuevoEvento.put("capacidad", capacidad);
            nuevoEvento.put("fechaHoraEntrada", fechaHoraEntrada);
            nuevoEvento.put("fechaHoraSalida", fechaHoraSalida);

            return ResponseEntity.ok(new HashMap<String, Object>() {{
                put("success", true);
                put("message", "Evento creado exitosamente y registro en 'asiste' agregado.");
                put("evento", nuevoEvento);
            }});
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Error en el servidor: " + e.getMessage());
            }});
        }
    }

    @PutMapping("/eventos/{id}")
    public ResponseEntity<?> updateEvento(@PathVariable("id") Long idEvento, @RequestBody Map<String, Object> eventoRequest) {
        String nombreEvento = (String) eventoRequest.get("nombreEvento");
        String descripcion = (String) eventoRequest.get("descripcion");
        Integer capacidad = Integer.valueOf((String) eventoRequest.get("capacidad")); // Convierte a Integer
        String fechaHoraEntrada = (String) eventoRequest.get("fechaHoraEntrada");
        String fechaHoraSalida = (String) eventoRequest.get("fechaHoraSalida");

        String updateEventoQuery = "UPDATE evento SET NombreEvento = ?, Descripcion = ?, Capacidad = ?, FechaHoraEntrada = ?, FechaHoraSalida = ? WHERE ID_Evento = ?";

        try (Connection connection = dataSource.getConnection(); PreparedStatement statement = connection.prepareStatement(updateEventoQuery)) {
            statement.setString(1, nombreEvento);
            statement.setString(2, descripcion);
            statement.setInt(3, capacidad); // Usa el Integer convertido
            statement.setString(4, fechaHoraEntrada);
            statement.setString(5, fechaHoraSalida);
            statement.setLong(6, idEvento);

            int rowsUpdated = statement.executeUpdate();
            if (rowsUpdated > 0) {
                return ResponseEntity.ok(new HashMap<String, Object>() {{
                    put("success", true);
                    put("message", "Evento actualizado exitosamente.");
                }});
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new HashMap<String, Object>() {{
                    put("success", false);
                    put("message", "Evento no encontrado.");
                }});
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Error en el servidor: " + e.getMessage());
            }});
        }
    }

    @DeleteMapping("/eventos/{id}")
    public ResponseEntity<?> deleteEvento(@PathVariable("id") Long idEvento) {
        String deleteAsisteQuery = "DELETE FROM asiste WHERE ID_Evento = ?";
        String deleteEventoQuery = "DELETE FROM evento WHERE ID_Evento = ?";

        try (Connection connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);

            try (PreparedStatement deleteAsisteStatement = connection.prepareStatement(deleteAsisteQuery);
                 PreparedStatement deleteEventoStatement = connection.prepareStatement(deleteEventoQuery)) {

                deleteAsisteStatement.setLong(1, idEvento);
                int rowsDeletedAsiste = deleteAsisteStatement.executeUpdate();

                deleteEventoStatement.setLong(1, idEvento);
                int rowsDeletedEvento = deleteEventoStatement.executeUpdate();

                if (rowsDeletedEvento > 0) {
                    connection.commit();
                    return ResponseEntity.ok(new HashMap<String, Object>() {{
                        put("success", true);
                        put("message", "Evento eliminado exitosamente.");
                    }});
                } else {
                    connection.rollback();
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "Evento no encontrado.");
                    }});
                }
            } catch (SQLException e) {
                connection.rollback();
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<String, Object>() {{
                    put("success", false);
                    put("message", "Error en el servidor: " + e.getMessage());
                }});
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Error en el servidor: " + e.getMessage());
            }});
        }
    }

    @GetMapping("/usuarios")
    public ResponseEntity<?> getUsuarios() {
        try (Connection connection = dataSource.getConnection()) {
            String query = "SELECT id, dni, nombre, ape_paterno, ape_materno FROM usuario";
            PreparedStatement statement = connection.prepareStatement(query);
            ResultSet resultSet = statement.executeQuery();

            List<Map<String, Object>> usuarios = new ArrayList<>();

            while (resultSet.next()) {
                Map<String, Object> usuario = new HashMap<>();
                usuario.put("id", resultSet.getLong("id"));
                usuario.put("dni", resultSet.getLong("dni"));
                usuario.put("nombre", resultSet.getString("nombre"));
                usuario.put("ape_paterno", resultSet.getString("ape_paterno"));
                usuario.put("ape_materno", resultSet.getString("ape_materno"));
                usuarios.add(usuario);
            }

            return ResponseEntity.ok(new HashMap<String, Object>() {{
                put("success", true);
                put("data", usuarios);
            }});
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, Object>() {{
                        put("message", "Error al obtener los usuarios: " + e.getMessage());
                        put("success", false);
                    }});
        }
    }

    @GetMapping("/usuarios-evento")
    public ResponseEntity<?> getUsuariosEvento(@RequestParam("eventoId") Long eventoId) {
        try (Connection connection = dataSource.getConnection()) {
            String query = "SELECT u.id, u.dni, u.nombre, u.ape_paterno, u.ape_materno "
                    + "FROM usuario u "
                    + "INNER JOIN asiste a ON u.id = a.ID_Usuario "
                    + "WHERE a.ID_Evento = ?";
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setLong(1, eventoId);
            ResultSet resultSet = statement.executeQuery();

            List<Map<String, Object>> usuariosEvento = new ArrayList<>();

            while (resultSet.next()) {
                Map<String, Object> usuario = new HashMap<>();
                usuario.put("id", resultSet.getLong("id"));
                usuario.put("dni", resultSet.getLong("dni"));
                usuario.put("nombre", resultSet.getString("nombre"));
                usuario.put("ape_paterno", resultSet.getString("ape_paterno"));
                usuario.put("ape_materno", resultSet.getString("ape_materno"));
                usuariosEvento.add(usuario);
            }

            return ResponseEntity.ok(new HashMap<String, Object>() {{
                put("success", true);
                put("data", usuariosEvento);
            }});
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, Object>() {{
                        put("message", "Error al obtener los usuarios del evento: " + e.getMessage());
                        put("success", false);
                    }});
        }
    }

    @PostMapping("/add-asiste")
    public ResponseEntity<?> addAsiste(@RequestBody Map<String, Long> request) {
        Long idUsuario = request.get("idUsuario");
        Long idEvento = request.get("idEvento");

        if (idUsuario == null || idEvento == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "Se deben proporcionar los valores 'idUsuario' y 'idEvento'.");
                    }});
        }

        String insertQuery = "INSERT INTO asiste (ID_Usuario, ID_Evento) VALUES (?, ?)";
        try (Connection connection = dataSource.getConnection(); PreparedStatement statement = connection.prepareStatement(insertQuery)) {
            statement.setLong(1, idUsuario);
            statement.setLong(2, idEvento);

            int rowsInserted = statement.executeUpdate();

            if (rowsInserted > 0) {
                return ResponseEntity.ok(new HashMap<String, Object>() {{
                    put("success", true);
                    put("message", "Registro insertado correctamente en la tabla 'asiste'.");
                }});
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new HashMap<String, Object>() {{
                            put("success", false);
                            put("message", "No se pudo insertar el registro en la tabla 'asiste'.");
                        }});
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "Error al realizar la operación en la base de datos: " + e.getMessage());
                    }});
        }
    }

    @DeleteMapping("/delete-asiste")
    public ResponseEntity<?> deleteAsiste(@RequestParam("idUsuario") Long idUsuario, @RequestParam("idEvento") Long idEvento) {
        String deleteQuery = "DELETE FROM asiste WHERE ID_Usuario = ? AND ID_Evento = ?";

        try (Connection connection = dataSource.getConnection(); PreparedStatement statement = connection.prepareStatement(deleteQuery)) {
            statement.setLong(1, idUsuario);
            statement.setLong(2, idEvento);

            int rowsDeleted = statement.executeUpdate();

            if (rowsDeleted > 0) {
                return ResponseEntity.ok(new HashMap<String, Object>() {{
                    put("success", true);
                    put("message", "Usuario eliminado exitosamente del evento.");
                }});
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new HashMap<String, Object>() {{
                    put("success", false);
                    put("message", "Usuario no encontrado en el evento.");
                }});
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Error en el servidor: " + e.getMessage());
            }});
        }
    }

    @PostMapping("/registrar-asistencia")
    public ResponseEntity<?> registrarAsistencia(@RequestBody Map<String, Object> request) {
        String dni = (String) request.get("dni");
        Long idEvento = Long.parseLong((String) request.get("idEvento"));
        String fechaRegistroStr = (String) request.get("fechaRegistro");

        // Convertir la fecha y hora a Timestamp
        Timestamp fechaRegistro = Timestamp.valueOf(fechaRegistroStr);

        try (Connection connection = dataSource.getConnection()) {
            // Obtener el ID del usuario usando el DNI
            String getUserIdQuery = "SELECT id FROM usuario WHERE dni = ?";
            try (PreparedStatement getUserIdStatement = connection.prepareStatement(getUserIdQuery)) {
                getUserIdStatement.setLong(1, Long.parseLong(dni));
                ResultSet resultSet = getUserIdStatement.executeQuery();
                if (!resultSet.next()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "Usuario no encontrado");
                    }});
                }
                Long userId = resultSet.getLong("id");

                // Obtener la información del evento
                String getEventoQuery = "SELECT FechaHoraEntrada, FechaHoraSalida FROM evento WHERE ID_Evento = ?";
                try (PreparedStatement getEventoStatement = connection.prepareStatement(getEventoQuery)) {
                    getEventoStatement.setLong(1, idEvento);
                    ResultSet eventoResultSet = getEventoStatement.executeQuery();
                    if (!eventoResultSet.next()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new HashMap<String, Object>() {{
                            put("success", false);
                            put("message", "Evento no encontrado");
                        }});
                    }
                    Timestamp fechaHoraEntrada = eventoResultSet.getTimestamp("FechaHoraEntrada");
                    Timestamp fechaHoraSalida = eventoResultSet.getTimestamp("FechaHoraSalida");

                    // Verificar si la fecha actual está dentro del rango del evento
                    String estado = fechaRegistro.before(fechaHoraEntrada) || fechaRegistro.after(fechaHoraSalida) ? "falta" : "asiste";

                    // Insertar el registro de asistencia
                    String insertRegistroQuery = "INSERT INTO registro_asistencia (Estado, FechaRegistro, ID_Evento, ID_Usuario) VALUES (?, ?, ?, ?)";
                    try (PreparedStatement insertRegistroStatement = connection.prepareStatement(insertRegistroQuery)) {
                        insertRegistroStatement.setString(1, estado);
                        insertRegistroStatement.setTimestamp(2, fechaRegistro);
                        insertRegistroStatement.setLong(3, idEvento);
                        insertRegistroStatement.setLong(4, userId);
                        insertRegistroStatement.executeUpdate();
                    }

                    return ResponseEntity.ok(new HashMap<String, Object>() {{
                        put("success", true);
                        put("message", "Asistencia registrada correctamente");
                    }});
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Error en el servidor: " + e.getMessage());
            }});
        }
    }

    @GetMapping("/usuarios-historial")
    public ResponseEntity<?> getUsuariosHistorial(@RequestParam("usuarioId") Long usuarioId) {
        try (Connection connection = dataSource.getConnection()) {
            // Obtener los eventos del usuario logueado
            String eventosQuery = "SELECT e.ID_Evento, e.NombreEvento "
                    + "FROM evento e "
                    + "INNER JOIN asiste a ON e.ID_Evento = a.ID_Evento "
                    + "WHERE a.ID_Usuario = ?";
            PreparedStatement eventosStatement = connection.prepareStatement(eventosQuery);
            eventosStatement.setLong(1, usuarioId);
            ResultSet eventosResultSet = eventosStatement.executeQuery();

            List<Long> eventosIds = new ArrayList<>();
            while (eventosResultSet.next()) {
                eventosIds.add(eventosResultSet.getLong("ID_Evento"));
            }

            // Obtener los usuarios que comparten eventos en común
            String usuariosQuery = "SELECT DISTINCT u.id, u.dni, u.nombre, u.ape_paterno, u.ape_materno "
                    + "FROM usuario u "
                    + "INNER JOIN asiste a ON u.id = a.ID_Usuario "
                    + "WHERE a.ID_Evento IN (";

            for (int i = 0; i < eventosIds.size(); i++) {
                usuariosQuery += "?";
                if (i < eventosIds.size() - 1) {
                    usuariosQuery += ", ";
                }
            }

            usuariosQuery += ")";

            PreparedStatement usuariosStatement = connection.prepareStatement(usuariosQuery);
            for (int i = 0; i < eventosIds.size(); i++) {
                usuariosStatement.setLong(i + 1, eventosIds.get(i));
            }

            ResultSet usuariosResultSet = usuariosStatement.executeQuery();

            List<Map<String, Object>> usuarios = new ArrayList<>();
            while (usuariosResultSet.next()) {
                Map<String, Object> usuario = new HashMap<>();
                usuario.put("id", usuariosResultSet.getLong("id"));
                usuario.put("dni", usuariosResultSet.getLong("dni"));
                usuario.put("nombre", usuariosResultSet.getString("nombre"));
                usuario.put("ape_paterno", usuariosResultSet.getString("ape_paterno"));
                usuario.put("ape_materno", usuariosResultSet.getString("ape_materno"));
                usuario.put("eventos", new ArrayList<String>());
                usuarios.add(usuario);
            }

            // Agregar los eventos a los usuarios
            for (Map<String, Object> usuario : usuarios) {
                String eventosUsuarioQuery = "SELECT e.NombreEvento "
                        + "FROM evento e "
                        + "INNER JOIN asiste a ON e.ID_Evento = a.ID_Evento "
                        + "WHERE a.ID_Usuario = ?";
                PreparedStatement eventosUsuarioStatement = connection.prepareStatement(eventosUsuarioQuery);
                eventosUsuarioStatement.setLong(1, (Long) usuario.get("id"));
                ResultSet eventosUsuarioResultSet = eventosUsuarioStatement.executeQuery();
                while (eventosUsuarioResultSet.next()) {
                    ((List<String>) usuario.get("eventos")).add(eventosUsuarioResultSet.getString("NombreEvento"));
                }
            }

            return ResponseEntity.ok(new HashMap<String, Object>() {{
                put("success", true);
                put("data", usuarios);
            }});
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, Object>() {{
                        put("message", "Error al obtener los usuarios: " + e.getMessage());
                        put("success", false);
                    }});
        }
    }
    @GetMapping("/registros-asistencia-usuario-evento")
    public ResponseEntity<?> getRegistrosAsistenciaUsuarioEvento(@RequestParam("usuarioId") Long usuarioId, @RequestParam("eventoNombre") String eventoNombre) {
        try (Connection connection = dataSource.getConnection()) {
            // Obtener el ID del evento utilizando el nombre del evento
            String eventoIdQuery = "SELECT ID_Evento FROM evento WHERE NombreEvento = ?";
            PreparedStatement eventoIdStatement = connection.prepareStatement(eventoIdQuery);
            eventoIdStatement.setString(1, eventoNombre);
            ResultSet eventoIdResultSet = eventoIdStatement.executeQuery();

            if (!eventoIdResultSet.next()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new HashMap<String, Object>() {{
                            put("success", false);
                            put("message", "Evento no encontrado");
                        }});
            }

            Long eventoId = eventoIdResultSet.getLong("ID_Evento");

            // Obtener los registros de asistencia
            String query = "SELECT ra.FechaRegistro, ra.Estado "
                    + "FROM registro_asistencia ra "
                    + "WHERE ra.ID_Usuario = ? AND ra.ID_Evento = ?";
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setLong(1, usuarioId);
            statement.setLong(2, eventoId);
            ResultSet resultSet = statement.executeQuery();

            List<Map<String, Object>> registros = new ArrayList<>();
            while (resultSet.next()) {
                Map<String, Object> registro = new HashMap<>();
                registro.put("fechaRegistro", resultSet.getTimestamp("FechaRegistro").toLocalDateTime());
                registro.put("estado", resultSet.getString("Estado"));
                registros.add(registro);
            }

            return ResponseEntity.ok(new HashMap<String, Object>() {{
                put("success", true);
                put("data", registros);
            }});
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, Object>() {{
                        put("message", "Error al obtener los registros de asistencia: " + e.getMessage());
                        put("success", false);
                    }});
        }
    }


    @GetMapping("/evento-por-nombre")
    public ResponseEntity<?> getEventoPorNombre(@RequestParam("nombreEvento") String nombreEvento) {
        try (Connection connection = dataSource.getConnection()) {
            String query = "SELECT * FROM evento WHERE NombreEvento = ?";
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, nombreEvento);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                Evento evento = new Evento();
                evento.setId(resultSet.getLong("ID_Evento"));
                evento.setNombreEvento(resultSet.getString("NombreEvento"));
                evento.setCapacidad(resultSet.getInt("Capacidad"));
                evento.setDescripcion(resultSet.getString("Descripcion"));
                evento.setFechaHoraEntrada(resultSet.getTimestamp("FechaHoraEntrada").toLocalDateTime().toString());
                evento.setFechaHoraSalida(resultSet.getTimestamp("FechaHoraSalida").toLocalDateTime().toString());

                return ResponseEntity.ok(new HashMap<String, Object>() {{
                    put("success", true);
                    put("data", evento);
                }});
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new HashMap<String, Object>() {{
                            put("message", "No se encontró el evento");
                            put("success", false);
                        }});
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, Object>() {{
                        put("message", "Error al obtener el evento: " + e.getMessage());
                        put("success", false);
                    }});
        }
    }


}
