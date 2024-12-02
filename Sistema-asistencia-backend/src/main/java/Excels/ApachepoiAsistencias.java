package Excels;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.*;

import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Clase que permite generar un archivo Excel con registros de asistencia
 * obtenidos de una base de datos entre un rango de fechas especificado.
 *
 * @author Sebastian
 */
public class ApachepoiAsistencias {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    /**
     * Constructor que inicializa el rango de fechas para la consulta de asistencia.
     *
     * @param fechaInicio Fecha de inicio del rango.
     * @param fechaFin Fecha de fin del rango.
     */
    public ApachepoiAsistencias(LocalDate fechaInicio, LocalDate fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    /**
     * Obtiene la fecha de inicio del rango.
     *
     * @return Fecha de inicio.
     */
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    /**
     * Establece la fecha de inicio del rango.
     *
     * @param fechaInicio Fecha de inicio.
     */
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    /**
     * Obtiene la fecha de fin del rango.
     *
     * @return Fecha de fin.
     */
    public LocalDate getFechaFin() {
        return fechaFin;
    }

    /**
     * Establece la fecha de fin del rango.
     *
     * @param fechaFin Fecha de fin.
     */
    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }


    /**
     * Obtiene los datos de asistencia desde la base de datos entre las fechas especificadas.
     *
     * @return Lista de objetos Asistencia con los registros obtenidos.
     */
    private List<Asistencia> obtenerDatosAsistencia() {
        List<Asistencia> listaAsistencia = new ArrayList<>();

        String url = "jdbc:mysql://localhost:3306/bd_sistema_asistencia";
        String user = "root";
        String password = "root";

        String consultaSQL = "SELECT ID_Usuario, ID_Evento, fecha FROM asiste WHERE fecha BETWEEN ? AND ?";

        try (Connection conexion = DriverManager.getConnection(url, user, password);
             PreparedStatement statement = conexion.prepareStatement(consultaSQL)) {

            statement.setDate(1, Date.valueOf(fechaInicio));
            statement.setDate(2, Date.valueOf(fechaFin));

            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                long idUsuario = resultSet.getLong("ID_Usuario");
                long idEvento = resultSet.getLong("ID_Evento");
                LocalDate fecha = resultSet.getDate("fecha").toLocalDate();

                listaAsistencia.add(new Asistencia(idUsuario, idEvento, fecha));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return listaAsistencia;
    }


    /**
     * Crea y devuelve un estilo de encabezado para el archivo Excel.
     *
     * @param workbook Libro de trabajo en el cual se aplicará el estilo.
     * @return Estilo de celda con fuente en negrita.
     */
    private CellStyle crearEstiloEncabezado(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        return style;
    }

    /**
     * Clase interna que representa un registro de asistencia.
     */
    static class Asistencia {
        private long idUsuario;
        private long idEvento;
        private LocalDate fecha;

        /**
         * Constructor para inicializar un objeto Asistencia.
         *
         * @param idUsuario ID del usuario.
         * @param idEvento ID del evento.
         * @param fecha Fecha de asistencia.
         */
        public Asistencia(long idUsuario, long idEvento, LocalDate fecha) {
            this.idUsuario = idUsuario;
            this.idEvento = idEvento;
            this.fecha = fecha;
        }

        /**
         * Obtiene el ID del usuario.
         *
         * @return ID del usuario.
         */
        public long getIdUsuario() {
            return idUsuario;
        }

        /**
         * Obtiene el ID del evento.
         *
         * @return ID del evento.
         */
        public long getIdEvento() {
            return idEvento;
        }

        /**
         * Obtiene la fecha de asistencia.
         *
         * @return Fecha de asistencia.
         */
        public LocalDate getFecha() {
            return fecha;
        }
    }
}
