package api.example.apis;

import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import javax.sql.DataSource;
import java.sql.*;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class AuthControllerTest {

    @Mock
    private DataSource dataSource;

    @Mock
    private Connection connection;

    @Mock
    private PreparedStatement preparedStatement;

    @Mock
    private ResultSet resultSet;

    @InjectMocks
    private AuthController authController;

    @Test
    void testLogin_Success() throws SQLException {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password");
        
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getLong("usuario_id")).thenReturn(1L);
        when(resultSet.getString("nom_rol")).thenReturn("user");
        when(resultSet.getInt("dni")).thenReturn(12345678);

        // Act
        ResponseEntity<?> response = authController.login(loginRequest, null, null);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Login exitoso"));
    }

    @Test
    void testLogin_Failure_InvalidCredentials() throws SQLException {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("invalid@example.com", "wrongpassword");

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(false);

        // Act
        ResponseEntity<?> response = authController.login(loginRequest, null, null);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Email o contraseña incorrectos"));
    }
}
