package api.example.apis;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DataSource dataSource;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    public void testLoginSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password");

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getLong("usuario_id")).thenReturn(1L);
        when(resultSet.getString("nom_rol")).thenReturn("USER");
        when(resultSet.getInt("dni")).thenReturn(12345678);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(loginRequest)))
                .andExpect(status().isOk());
    }

    @Test
    public void testLoginFailure() throws Exception {
        LoginRequest loginRequest = new LoginRequest("test@example.com", "wrongpassword");

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(false);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testRegisterSuccess() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("Doe", "John", 12345678, "123 Street", "test@example.com", "1990-01-01", "Masculino", "John", "password", 987654321, "Administrador");

        Connection connection = mock(Connection.class);
        PreparedStatement insertStatement = mock(PreparedStatement.class);
        PreparedStatement insertRoleStatement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(insertStatement).thenReturn(insertRoleStatement);
        when(insertStatement.executeUpdate()).thenReturn(1);
        when(insertRoleStatement.executeUpdate()).thenReturn(1);
        when(connection.prepareStatement("SELECT LAST_INSERT_ID()")).thenReturn(mock(PreparedStatement.class));
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getLong(1)).thenReturn(1L);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(registerRequest)))
                .andExpect(status().isCreated());
    }


    @Test
    public void testRegisterFailure() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("Doe", "John", 12345678, "123 Street", "test@example.com", "1990-01-01", "M", "John", "password", 987654321, "Administrador");

        Connection connection = mock(Connection.class);
        PreparedStatement insertStatement = mock(PreparedStatement.class);
        PreparedStatement insertRoleStatement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(insertStatement).thenReturn(insertRoleStatement);
        when(insertStatement.executeUpdate()).thenReturn(0);
        when(insertRoleStatement.executeUpdate()).thenReturn(0);
        when(connection.prepareStatement("SELECT LAST_INSERT_ID()")).thenReturn(mock(PreparedStatement.class));
        when(resultSet.next()).thenReturn(false);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(registerRequest)))
                .andExpect(status().isInternalServerError());
    }


    @Test
    public void testLogout() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk());
    }

    @Test
    public void testCheckSessionActive() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("usuarioId", 1L);

        mockMvc.perform(get("/api/auth/check-session")
                        .session(session))
                .andExpect(status().isOk());
    }

    @Test
    public void testCheckSessionInactive() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("usuarioId", null);

        mockMvc.perform(get("/api/auth/check-session")
                        .session(session))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testAddAsisteSuccess() throws Exception {
        Map<String, Long> request = new HashMap<>();
        request.put("idUsuario", 1L);
        request.put("idEvento", 1L);

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeUpdate()).thenReturn(1);

        mockMvc.perform(post("/api/auth/add-asiste")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(request)))
                .andExpect(status().isOk());
    }

    @Test
    public void testAddAsisteFailure() throws Exception {
        Map<String, Long> request = new HashMap<>();
        request.put("idUsuario", 1L);
        request.put("idEvento", 1L);

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeUpdate()).thenReturn(0);

        mockMvc.perform(post("/api/auth/add-asiste")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(request)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    public void testGetRegistrosAsistenciaSuccess() throws Exception {
        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true).thenReturn(false);
        when(resultSet.getLong("ID_Registro")).thenReturn(1L);
        when(resultSet.getLong("ID_Evento")).thenReturn(1L);
        when(resultSet.getString("NombreEvento")).thenReturn("Evento 1");

        mockMvc.perform(get("/api/auth/registros-asistencia"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetRegistrosAsistenciaNotFound() throws Exception {
        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(false);

        mockMvc.perform(get("/api/auth/registros-asistencia"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetEventosSuccess() throws Exception {
        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true).thenReturn(false);
        when(resultSet.getLong("ID_Evento")).thenReturn(1L);
        when(resultSet.getString("NombreEvento")).thenReturn("Evento 1");
        when(resultSet.getInt("Capacidad")).thenReturn(100);
        when(resultSet.getString("Descripcion")).thenReturn("Descripción del evento");
        when(resultSet.getTimestamp("FechaHoraEntrada")).thenReturn(Timestamp.valueOf("2023-10-01 10:00:00"));
        when(resultSet.getTimestamp("FechaHoraSalida")).thenReturn(Timestamp.valueOf("2023-10-01 12:00:00"));

        mockMvc.perform(get("/api/auth/eventos"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetEventosNotFound() throws Exception {
        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(false);

        mockMvc.perform(get("/api/auth/eventos"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testAddEventoSuccess() throws Exception {
        EventoRequest eventoRequest = new EventoRequest("Evento 1", "Descripción del evento", 100, "2023-10-01 10:00:00", "2023-10-01 12:00:00");

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeUpdate()).thenReturn(1);

        mockMvc.perform(post("/api/auth/add-evento")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(eventoRequest)))
                .andExpect(status().isOk());
    }

    @Test
    public void testAddEventoFailure() throws Exception {
        EventoRequest eventoRequest = new EventoRequest("Evento 1", "Descripción del evento", 100, "2023-10-01 10:00:00", "2023-10-01 12:00:00");

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeUpdate()).thenReturn(0);

        mockMvc.perform(post("/api/auth/add-evento")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(eventoRequest)))
                .andExpect(status().isInternalServerError());
    }

    // Método auxiliar para convertir objetos a JSON
    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
