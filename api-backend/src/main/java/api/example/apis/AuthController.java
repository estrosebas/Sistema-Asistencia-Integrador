package api.example.apis;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.sql.DataSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:80", "http://localhost", "http://localhost:5173"})
public class AuthController {

    @Resource
    private DataSource dataSource;  // Inyectar el DataSource de Spring

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try (Connection connection = dataSource.getConnection()) {

            // Consulta para obtener el usuario y su rol
            String query = "SELECT u.id AS usuario_id, r.nom_rol FROM usuario u "
                    + "INNER JOIN usuarios_roles ur ON u.id = ur.usuario_id "
                    + "INNER JOIN rol r ON ur.rol_id = r.id "
                    + "WHERE u.email = ? AND u.password = ?";
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, loginRequest.getEmail());
            statement.setString(2, loginRequest.getPassword());

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                // Extraer los datos del resultado
                Long usuarioId = resultSet.getLong("usuario_id");
                String nomRol = resultSet.getString("nom_rol");

                // Crear el objeto de respuesta
                LoginResponse response = new LoginResponse(true, "Login exitoso", usuarioId, nomRol);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, "Email o contraseña incorrectos", null, null));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(false, "Error en el servidor", null, null));
        }
    }

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
            String insertQuery = "INSERT INTO usuario (email, password) VALUES (?, ?)";
            PreparedStatement insertStatement = connection.prepareStatement(insertQuery);
            insertStatement.setString(1, registerRequest.getEmail());
            insertStatement.setString(2, registerRequest.getPassword()); // Asegúrate de encriptar la contraseña
            insertStatement.executeUpdate();

            // Respuesta de éxito
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new RegisterResponse(true, "Registro exitoso"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegisterResponse(false, "Error en el servidor"));
        }
    }

}
