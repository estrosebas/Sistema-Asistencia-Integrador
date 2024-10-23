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
            String query = "SELECT u.id AS usuario_id, r.nom_rol FROM usuario u " +
                           "INNER JOIN usuarios_roles ur ON u.id = ur.usuario_id " +
                           "INNER JOIN rol r ON ur.rol_id = r.id " +
                           "WHERE u.email = ? AND u.password = ?";
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

    // Clase para la respuesta del login
    public static class LoginResponse {
        private boolean success;
        private String message;
        private Long usuario_id;
        private String nom_rol;

        public LoginResponse(boolean success, String message, Long usuario_id, String nom_rol) {
            this.success = success;
            this.message = message;
            this.usuario_id = usuario_id;
            this.nom_rol = nom_rol;
        }

        // Getters y Setters
        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Long getUsuarioId() {
            return usuario_id;
        }

        public void setUsuarioId(Long usuario_id) {
            this.usuario_id = usuario_id;
        }

        public String getNomRol() {
            return nom_rol;
        }

        public void setNomRol(String nom_rol) {
            this.nom_rol = nom_rol;
        }
    }
}