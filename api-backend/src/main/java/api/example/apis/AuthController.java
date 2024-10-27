package api.example.apis;

import com.google.common.base.Preconditions;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.sql.DataSource;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:80", "http://localhost", "http://localhost:5173"})
public class AuthController {

    @Resource
    private DataSource dataSource;

    // Definición de la caché para almacenar las respuestas de autenticación
    private final LoadingCache<String, LoginResponse> loginCache = CacheBuilder.newBuilder()
            .expireAfterWrite(10, TimeUnit.MINUTES)  // Configura la duración de almacenamiento en caché
            .build(new CacheLoader<String, LoginResponse>() {
                @Override
                public LoginResponse load(String email) throws Exception {
                    return autenticarUsuarioDesdeDB(email); // Llama a la autenticación desde la base de datos
                }
            });

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Validación de entrada usando Preconditions
            Preconditions.checkNotNull(loginRequest.getEmail(), "El email no puede ser nulo");
            Preconditions.checkArgument(!loginRequest.getEmail().isEmpty(), "El email no puede estar vacío");
            Preconditions.checkNotNull(loginRequest.getPassword(), "La contraseña no puede ser nula");
            Preconditions.checkArgument(!loginRequest.getPassword().isEmpty(), "La contraseña no puede estar vacía");

            // Consulta la caché para obtener la respuesta
            LoginResponse response = loginCache.get(loginRequest.getEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Retorna un error de solicitud incorrecta si las validaciones fallan
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new LoginResponse(false, e.getMessage(), null, null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(false, "Error en el servidor", null, null));
        }
    }

    // Método auxiliar para realizar la autenticación en la base de datos si no está en caché
    private LoginResponse autenticarUsuarioDesdeDB(String email) throws Exception {
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
                return new LoginResponse(true, "Login exitoso", usuarioId, nomRol);
            } else {
                return new LoginResponse(false, "Email o contraseña incorrectos", null, null);
            }
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

// package api.example.apis;

// import java.sql.Connection;
// import java.sql.PreparedStatement;
// import java.sql.ResultSet;

// import javax.sql.DataSource;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import jakarta.annotation.Resource;

// @RestController
// @RequestMapping("/api/auth")
// @CrossOrigin(origins = {"http://localhost:80", "http://localhost", "http://localhost:5173"})
// public class AuthController {

// @Resource
//     private DataSource dataSource;  // Inyectar el DataSource de Spring

//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
//         try (Connection connection = dataSource.getConnection()) {
            
//             // Consulta para obtener el usuario y su rol
//             String query = "SELECT u.id AS usuario_id, r.nom_rol FROM usuario u " +
//                            "INNER JOIN usuarios_roles ur ON u.id = ur.usuario_id " +
//                            "INNER JOIN rol r ON ur.rol_id = r.id " +
//                            "WHERE u.email = ? AND u.password = ?";
//             PreparedStatement statement = connection.prepareStatement(query);
//             statement.setString(1, loginRequest.getEmail());
//             statement.setString(2, loginRequest.getPassword());

//             ResultSet resultSet = statement.executeQuery();

//             if (resultSet.next()) {
//                 // Extraer los datos del resultado
//                 Long usuarioId = resultSet.getLong("usuario_id");
//                 String nomRol = resultSet.getString("nom_rol");

//                 // Crear el objeto de respuesta
//                 LoginResponse response = new LoginResponse(true, "Login exitoso", usuarioId, nomRol);
//                 return ResponseEntity.ok(response);
//             } else {
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                                      .body(new LoginResponse(false, "Email o contraseña incorrectos", null, null));
//             }

//         } catch (Exception e) {
//             e.printStackTrace();
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                                  .body(new LoginResponse(false, "Error en el servidor", null, null));
//         }
//     }

//     // Clase para la respuesta del login
//     public static class LoginResponse {
//         private boolean success;
//         private String message;
//         private Long usuario_id;
//         private String nom_rol;

//         public LoginResponse(boolean success, String message, Long usuario_id, String nom_rol) {
//             this.success = success;
//             this.message = message;
//             this.usuario_id = usuario_id;
//             this.nom_rol = nom_rol;
//         }

//         // Getters y Setters
//         public boolean isSuccess() {
//             return success;
//         }

//         public void setSuccess(boolean success) {
//             this.success = success;
//         }

//         public String getMessage() {
//             return message;
//         }

//         public void setMessage(String message) {
//             this.message = message;
//         }

//         public Long getUsuarioId() {
//             return usuario_id;
//         }

//         public void setUsuarioId(Long usuario_id) {
//             this.usuario_id = usuario_id;
//         }

//         public String getNomRol() {
//             return nom_rol;
//         }

//         public void setNomRol(String nom_rol) {
//             this.nom_rol = nom_rol;
//         }
//     }
// }