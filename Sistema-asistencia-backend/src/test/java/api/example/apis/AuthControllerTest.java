package api.example.apis;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Clase de pruebas unitarias para el controlador de autenticación.
 */
public class AuthControllerTest {
    private MockMvc mockMvc;

    @Mock
    private DataSource dataSource;

    @InjectMocks
    private AuthController authController;

    private static final Logger logger = LogManager.getLogger(AuthControllerTest.class);

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    // Método auxiliar para convertir objetos a JSON
    private String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Prueba de inicio de sesión exitoso.
     *
     * <p>Esta prueba verifica que un usuario puede iniciar sesión correctamente con credenciales válidas.</p>
     *
     * <p>Pasos:</p>
     * <ol>
     *     <li>Configurar el entorno de prueba con datos simulados para el usuario.</li>
     *     <li>Realizar una solicitud POST a {@code /api/auth/login} con credenciales válidas.</li>
     *     <li>Verificar que la respuesta sea exitosa y contenga los datos esperados del usuario.</li>
     * </ol>
     *
     * <p>Resultados esperados:</p>
     * <ul>
     *     <li>Respuesta JSON:
     *         <pre>
     *         {
     *             "success": true,
     *             "message": "Login exitoso",
     *             "usuarioId": 1,
     *             "nomRol": "Usuario",
     *             "dni": "12345678"
     *         }
     *         </pre>
     *     </li>
     * </ul>
     *
     * @throws Exception si ocurre un error durante la prueba.
     */
    @Test
    public void testLoginSuccess() throws Exception {
        String email = "user@example.com";
        String password = "password";
        Long usuarioId = 1L;
        String nomRol = "Usuario";
        int dni = 12345678;

        LoginRequest loginRequest = new LoginRequest(email, password);

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getLong("usuario_id")).thenReturn(usuarioId);
        when(resultSet.getString("nom_rol")).thenReturn(nomRol);
        when(resultSet.getInt("dni")).thenReturn(dni);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login exitoso"))
                .andExpect(jsonPath("$.usuarioId").value(usuarioId))
                .andExpect(jsonPath("$.nomRol").value(nomRol))
                .andExpect(jsonPath("$.dni").value("12345678"))
                .andReturn();

        logger.info("Prueba de inicio de sesión exitoso completada.");
        logger.info("Respuesta JSON: " + result.getResponse().getContentAsString());
    }

    /**
     * Prueba de inicio de sesión fallido por email inválido.
     *
     * <p>Esta prueba verifica que el inicio de sesión falla cuando se proporciona un email inválido.</p>
     *
     * <p>Pasos:</p>
     * <ol>
     *     <li>Configurar el entorno de prueba con datos simulados para el usuario.</li>
     *     <li>Realizar una solicitud POST a {@code /api/auth/login} con un email inválido.</li>
     *     <li>Verificar que la respuesta indique un fallo de autenticación.</li>
     * </ol>
     *
     * <p>Resultados esperados:</p>
     * <ul>
     *     <li>Respuesta JSON:
     *         <pre>
     *         {
     *             "success": false,
     *             "message": "Email o contraseña incorrectos"
     *         }
     *         </pre>
     *     </li>
     * </ul>
     *
     * @throws Exception si ocurre un error durante la prueba.
     */
    @Test
    public void testLoginFailureInvalidEmail() throws Exception {
        String email = "invalid@example.com";
        String password = "password";

        LoginRequest loginRequest = new LoginRequest(email, password);

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(false);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email o contraseña incorrectos"))
                .andReturn();

        logger.info("Prueba de inicio de sesión fallido por email inválido completada.");
        logger.info("Respuesta JSON: " + result.getResponse().getContentAsString());
    }

    /**
     * Prueba de inicio de sesión fallido por contraseña inválida.
     *
     * <p>Esta prueba verifica que el inicio de sesión falla cuando se proporciona una contraseña inválida.</p>
     *
     * <p>Pasos:</p>
     * <ol>
     *     <li>Configurar el entorno de prueba con datos simulados para el usuario.</li>
     *     <li>Realizar una solicitud POST a {@code /api/auth/login} con una contraseña inválida.</li>
     *     <li>Verificar que la respuesta indique un fallo de autenticación.</li>
     * </ol>
     *
     * <p>Resultados esperados:</p>
     * <ul>
     *     <li>Respuesta JSON:
     *         <pre>
     *         {
     *             "success": false,
     *             "message": "Email o contraseña incorrectos"
     *         }
     *         </pre>
     *     </li>
     * </ul>
     *
     * @throws Exception si ocurre un error durante la prueba.
     */
    @Test
    public void testLoginFailureInvalidPassword() throws Exception {
        String email = "user@example.com";
        String password = "wrongpassword";

        LoginRequest loginRequest = new LoginRequest(email, password);

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(false);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email o contraseña incorrectos"))
                .andReturn();

        logger.info("Prueba de inicio de sesión fallido por contraseña inválida completada.");
        logger.info("Respuesta JSON: " + result.getResponse().getContentAsString());
    }

    /**
     * Prueba de registro de usuario exitoso.
     *
     * <p>Esta prueba verifica que un nuevo usuario puede registrarse correctamente.</p>
     *
     * <p>Pasos:</p>
     * <ol>
     *     <li>Configurar el entorno de prueba con datos simulados para el registro de usuario.</li>
     *     <li>Realizar una solicitud POST a {@code /api/auth/register} con datos válidos de usuario.</li>
     *     <li>Verificar que la respuesta sea exitosa y contenga el mensaje de registro exitoso.</li>
     * </ol>
     *
     * <p>Resultados esperados:</p>
     * <ul>
     *     <li>Respuesta JSON:
     *         <pre>
     *         {
     *             "success": true,
     *             "message": "Registro exitoso"
     *         }
     *         </pre>
     *     </li>
     * </ul>
     *
     * @throws Exception si ocurre un error durante la prueba.
     */
    @Test
    public void testRegisterSuccess() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("Materno", "Paterno", 12345678, "Domicilio", "email@example.com", "2000-01-01", "M", "Nombre", "password", 987654321, "Usuario");

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(false);
        when(statement.getGeneratedKeys()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getLong(1)).thenReturn(1L);

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Registro exitoso"))
                .andReturn();

        logger.info("Prueba de registro de usuario exitoso completada.");
        logger.info("Respuesta JSON: " + result.getResponse().getContentAsString());
    }

    /**
     * Prueba de cierre de sesión.
     *
     * <p>Esta prueba verifica que un usuario puede cerrar sesión correctamente.</p>
     *
     * <p>Pasos:</p>
     * <ol>
     *     <li>Realizar una solicitud POST a {@code /api/auth/logout}.</li>
     *     <li>Verificar que la respuesta sea exitosa y contenga el mensaje de cierre de sesión exitoso.</li>
     * </ol>
     *
     * <p>Resultados esperados:</p>
     * <ul>
     *     <li>Respuesta JSON:
     *         <pre>
     *         {
     *             "message": "Sesión cerrada con éxito"
     *         }
     *         </pre>
     *     </li>
     * </ul>
     *
     * @throws Exception si ocurre un error durante la prueba.
     */
    @Test
    public void testLogout() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(content().string("Sesión cerrada con éxito"))
                .andReturn();

        logger.info("Prueba de cierre de sesión completada.");
        logger.info("Respuesta JSON: " + result.getResponse().getContentAsString());
    }

    /**
     * Prueba de obtención de registros de asistencia.
     *
     * <p>Esta prueba verifica que se pueden obtener los registros de asistencia correctamente.</p>
     *
     * <p>Pasos:</p>
     * <ol>
     *     <li>Configurar el entorno de prueba con datos simulados para los registros de asistencia.</li>
     *     <li>Realizar una solicitud GET a {@code /api/auth/registros-asistencia}.</li>
     *     <li>Verificar que la respuesta sea exitosa y contenga los registros de asistencia esperados.</li>
     * </ol>
     *
     * <p>Resultados esperados:</p>
     * <ul>
     *     <li>Respuesta JSON:
     *         <pre>
     *         {
     *             "success": true,
     *             "data": [
     *                 {
     *                     "id": 1,
     *                     "idEvento": 1,
     *                     "nombreEvento": "Evento 1"
     *                 }
     *             ]
     *         }
     *         </pre>
     *     </li>
     * </ul>
     *
     * @throws Exception si ocurre un error durante la prueba.
     */
    @Test
    public void testGetRegistrosAsistencia() throws Exception {
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

        MvcResult result = mockMvc.perform(get("/api/auth/registros-asistencia"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].idEvento").value(1))
                .andExpect(jsonPath("$.data[0].nombreEvento").value("Evento 1"))
                .andReturn();

        logger.info("Prueba de obtención de registros de asistencia completada.");
        logger.info("Respuesta JSON: " + result.getResponse().getContentAsString());
    }

    /**
     * Prueba de obtención de usuarios de un evento.
     *
     * <p>Esta prueba verifica que se pueden obtener los usuarios de un evento específico correctamente.</p>
     *
     * <p>Pasos:</p>
     * <ol>
     *     <li>Configurar el entorno de prueba con datos simulados para los usuarios del evento.</li>
     *     <li>Realizar una solicitud GET a {@code /api/auth/usuarios-evento} con el ID del evento.</li>
     *     <li>Verificar que la respuesta sea exitosa y contenga los usuarios del evento esperados.</li>
     * </ol>
     *
     * <p>Resultados esperados:</p>
     * <ul>
     *     <li>Respuesta JSON:
     *         <pre>
     *         {
     *             "success": true,
     *             "data": [
     *                 {
     *                     "id": 1,
     *                     "dni": 12345678,
     *                     "nombre": "Nombre",
     *                     "ape_paterno": "Paterno",
     *                     "ape_materno": "Materno"
     *                 }
     *             ]
     *         }
     *         </pre>
     *     </li>
     * </ul>
     *
     * @throws Exception si ocurre un error durante la prueba.
     */
    @Test
    public void testGetUsuariosEvento() throws Exception {
        Long eventoId = 1L;

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true).thenReturn(false);
        when(resultSet.getLong("id")).thenReturn(1L);
        when(resultSet.getLong("dni")).thenReturn(12345678L);
        when(resultSet.getString("nombre")).thenReturn("Nombre");
        when(resultSet.getString("ape_paterno")).thenReturn("Paterno");
        when(resultSet.getString("ape_materno")).thenReturn("Materno");

        MvcResult result = mockMvc.perform(get("/api/auth/usuarios-evento")
                        .param("eventoId", eventoId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].dni").value(12345678))
                .andExpect(jsonPath("$.data[0].nombre").value("Nombre"))
                .andExpect(jsonPath("$.data[0].ape_paterno").value("Paterno"))
                .andExpect(jsonPath("$.data[0].ape_materno").value("Materno"))
                .andReturn();

        logger.info("Prueba de obtención de usuarios de un evento completada.");
        logger.info("Respuesta JSON: " + result.getResponse().getContentAsString());
    }

    /**
     * Prueba de obtención de un evento por nombre.
     *
     * <p>Esta prueba verifica que se puede obtener un evento específico por su nombre correctamente.</p>
     *
     * <p>Pasos:</p>
     * <ol>
     *     <li>Configurar el entorno de prueba con datos simulados para el evento.</li>
     *     <li>Realizar una solicitud GET a {@code /api/auth/evento-por-nombre} con el nombre del evento.</li>
     *     <li>Verificar que la respuesta sea exitosa y contenga los detalles del evento esperados.</li>
     * </ol>
     *
     * <p>Resultados esperados:</p>
     * <ul>
     *     <li>Respuesta JSON:
     *         <pre>
     *         {
     *             "success": true,
     *             "data": {
     *                 "id": 1,
     *                 "nombreEvento": "Evento 1",
     *                 "capacidad": 100,
     *                 "descripcion": "Descripción del evento",
     *                 "fechaHoraEntrada": "2024-12-01T10:00",
     *                 "fechaHoraSalida": "2024-12-01T18:00"
     *             }
     *         }
     *         </pre>
     *     </li>
     * </ul>
     *
     * @throws Exception si ocurre un error durante la prueba.
     */
    @Test
    public void testGetEventoPorNombre() throws Exception {
        String nombreEvento = "Evento 1";

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        ResultSet resultSet = mock(ResultSet.class);

        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(statement);
        when(statement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getLong("ID_Evento")).thenReturn(1L);
        when(resultSet.getString("NombreEvento")).thenReturn("Evento 1");
        when(resultSet.getInt("Capacidad")).thenReturn(100);
        when(resultSet.getString("Descripcion")).thenReturn("Descripción del evento");
        when(resultSet.getTimestamp("FechaHoraEntrada")).thenReturn(java.sql.Timestamp.valueOf("2024-12-01 10:00:00"));
        when(resultSet.getTimestamp("FechaHoraSalida")).thenReturn(java.sql.Timestamp.valueOf("2024-12-01 18:00:00"));

        MvcResult result = mockMvc.perform(get("/api/auth/evento-por-nombre")
                        .param("nombreEvento", nombreEvento))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.nombreEvento").value("Evento 1"))
                .andExpect(jsonPath("$.data.capacidad").value(100))
                .andExpect(jsonPath("$.data.descripcion").value("Descripción del evento"))
                .andExpect(jsonPath("$.data.fechaHoraEntrada").value("2024-12-01T10:00"))
                .andExpect(jsonPath("$.data.fechaHoraSalida").value("2024-12-01T18:00"))
                .andReturn();

        logger.info("Prueba de obtención de un evento por nombre completada.");
        logger.info("Respuesta JSON: " + result.getResponse().getContentAsString());
    }
}
