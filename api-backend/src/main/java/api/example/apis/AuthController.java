package api.example.apis;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import com.google.common.base.Preconditions;


import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import javax.sql.DataSource;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:80", "http://localhost", "http://localhost:5173"})
public class AuthController {

    @Resource
    private DataSource dataSource;

    // Definición de la caché para almacenar las respuestas de autenticación
    /*private final LoadingCache<String, LoginResponse> loginCache = CacheBuilder.newBuilder()
            .expireAfterWrite(10, TimeUnit.MINUTES)  // Configura la duración de almacenamiento en caché
            .build(new CacheLoader<String, LoginResponse>() {
                @Override
                public LoginResponse load(String email) throws Exception {
                    return autenticarUsuarioDesdeDB(email); // Llama a la autenticación desde la base de datos
                }
            });*/

            @PostMapping("/login")
            public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
                try {
                    // Validación de entrada usando Preconditions
                    Preconditions.checkNotNull(loginRequest.getEmail(), "El email no puede ser nulo");
                    Preconditions.checkArgument(!loginRequest.getEmail().isEmpty(), "El email no puede estar vacío");
                    Preconditions.checkNotNull(loginRequest.getPassword(), "La contraseña no puede ser nula");
                    Preconditions.checkArgument(!loginRequest.getPassword().isEmpty(), "La contraseña no puede estar vacía");
            
                    // Consulta la caché para obtener la respuesta (si decides habilitar esta lógica en el futuro)
                    /*LoginResponse response = loginCache.get(loginRequest.getEmail());
                    return ResponseEntity.ok(response);*/
            
                    // Devolver respuesta predeterminada si no hay un login exitoso
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new LoginResponse(false, "Credenciales inválidas"));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(new LoginResponse(false, e.getMessage()));
                } catch (Exception e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(new LoginResponse(false, "Error en el servidor"));
                }
            }
            

    // Método auxiliar para realizar la autenticación en la base de datos si no está en caché
    /*private LoginResponse autenticarUsuarioDesdeDB(String email) throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            String query = "SELECT u.id AS usuario_id, r.nom_rol FROM usuario u " +
                    "INNER JOIN usuarios_roles ur ON u.id = ur.usuario_id " +
                    "INNER JOIN rol r ON ur.rol_id = r.id " +
                    "WHERE u.email = ?";
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, email);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                Long usuarioId = resultSet.getLong("usuario_id");
                String nomRol = resultSet.getString("nom_rol");
                return new LoginResponse(true, "Login exitoso");
            } else {
                return new LoginResponse(false, "Email o contraseña incorrectos");
            }
        }
    }*/

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
            // Suponiendo que obtienes el ID del usuario que acabas de insertar
            long usuarioId = getLastInsertId(connection); // Método para obtener el ID del último usuario insertado
            insertRoleStatement.setLong(1, usuarioId);
            insertRoleStatement.setLong(2, rolId);
            insertRoleStatement.executeUpdate();
    
            // Respuesta de éxito
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new RegisterResponse(true, "Registro exitoso"));
    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegisterResponse(false, "Error en el servidor"));
        }
    }
    private long getRoleIdByName(String roleName) throws SQLException {
        String query = "SELECT id FROM rol WHERE nom_rol = ?"; // Asegúrate de que la tabla se llame correctamente
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, roleName);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getLong("id"); // Devuelve el ID del rol
            } else {
                throw new SQLException("Rol no encontrado: " + roleName);
            }
        }
    }
    private long getLastInsertId(Connection connection) throws SQLException {
        String query = "SELECT LAST_INSERT_ID()";
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            if (resultSet.next()) {
                return resultSet.getLong(1);
            }
            throw new SQLException("No se pudo obtener el último ID insertado.");
        }
    }
}
