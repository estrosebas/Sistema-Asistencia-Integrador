/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Excels;

/**
 *
 * @author Sebastian
 */

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
public class ApachepoiAsistencias {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    public ApachepoiAsistencias(LocalDate fechaInicio, LocalDate fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public void generarExcel(String nombreArchivo) {
        List<Asistencia> datosAsistencia = obtenerDatosAsistencia();
        exportarAsistenciaAExcel(datosAsistencia, nombreArchivo);
    }
    private List<Asistencia> obtenerDatosAsistencia() {
        List<Asistencia> listaAsistencia = new ArrayList<>();

        // Datos de conexión a la base de datos
        String url = "jdbc:mysql://localhost:3306/bd_sistema_asistencia"; 
        String user = "root"; // 
        String password = "root"; 

        String consultaSQL = "SELECT ID_Usuario, ID_Evento, fecha FROM asiste WHERE fecha BETWEEN ? AND ?";

        try (Connection conexion = DriverManager.getConnection(url, user, password);
             PreparedStatement statement = conexion.prepareStatement(consultaSQL)) {

            // Asignamos las fechas al PreparedStatement
            statement.setDate(1, Date.valueOf(fechaInicio));
            statement.setDate(2, Date.valueOf(fechaFin));

            ResultSet resultSet = statement.executeQuery();

            // Iteramos sobre los resultados y los añadimos a la lista
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

    private void exportarAsistenciaAExcel(List<Asistencia> datosAsistencia, String nombreArchivo) {
        // Creamos el libro de trabajo de Excel
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Asistencia");

        // Creamos el encabezado
        String[] encabezados = {"ID_Usuario", "ID_Evento", "Fecha"};
        Row headerRow = sheet.createRow(0);

        for (int i = 0; i < encabezados.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(encabezados[i]);
            cell.setCellStyle(crearEstiloEncabezado(workbook));
        }

        int rowNum = 1;
        for (Asistencia asistencia : datosAsistencia) {
            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(asistencia.getIdUsuario());
            row.createCell(1).setCellValue(asistencia.getIdEvento());
            row.createCell(2).setCellValue(asistencia.getFecha().toString());
        }

        for (int i = 0; i < encabezados.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Guardamos el archivo Excel
        try (FileOutputStream fileOut = new FileOutputStream(nombreArchivo)) {
            workbook.write(fileOut);
            System.out.println("Archivo Excel creado exitosamente: " + nombreArchivo);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                workbook.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private CellStyle crearEstiloEncabezado(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        return style;
    }


    static class Asistencia {
        private long idUsuario;
        private long idEvento;
        private LocalDate fecha;

        public Asistencia(long idUsuario, long idEvento, LocalDate fecha) {
            this.idUsuario = idUsuario;
            this.idEvento = idEvento;
            this.fecha = fecha;
        }

        public long getIdUsuario() {
            return idUsuario;
        }

        public long getIdEvento() {
            return idEvento;
        }

        public LocalDate getFecha() {
            return fecha;
        }
    }
}
