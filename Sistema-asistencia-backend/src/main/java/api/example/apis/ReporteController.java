package api.example.apis;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.io.ByteArrayOutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@RestController
@RequestMapping("/api/reporte")
@CrossOrigin(origins = {"http://localhost:3000", "https://qrattendarequipa.sytes.net", "https://qrattendarequipa.sytes.net:3000", "http://localhost:5173"}, allowedHeaders = "*", allowCredentials = "true")
public class ReporteController {

    private final DataSource dataSource;

    public ReporteController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/pdf/{eventoId}")
    public ResponseEntity<byte[]> generarReportePDF(@PathVariable Long eventoId, @RequestParam Long usuarioId) {
        try (Connection connection = dataSource.getConnection()) {
            // Obtener información del evento
            String eventoQuery = "SELECT * FROM evento WHERE ID_Evento = ?";
            PreparedStatement eventoStatement = connection.prepareStatement(eventoQuery);
            eventoStatement.setLong(1, eventoId);
            ResultSet eventoResultSet = eventoStatement.executeQuery();
            eventoResultSet.next();

            String nombreEvento = eventoResultSet.getString("NombreEvento");
            String descripcion = eventoResultSet.getString("Descripcion");
            int capacidad = eventoResultSet.getInt("Capacidad");
            String fechaHoraEntrada = eventoResultSet.getTimestamp("FechaHoraEntrada").toString();
            String fechaHoraSalida = eventoResultSet.getTimestamp("FechaHoraSalida").toString();

            // Obtener información del usuario que genera el reporte
            String usuarioQuery = "SELECT * FROM usuario WHERE id = ?";
            PreparedStatement usuarioStatement = connection.prepareStatement(usuarioQuery);
            usuarioStatement.setLong(1, usuarioId);
            ResultSet usuarioResultSet = usuarioStatement.executeQuery();
            usuarioResultSet.next();

            String nombreUsuario = usuarioResultSet.getString("nombre");
            String apePaterno = usuarioResultSet.getString("ape_paterno");
            String apeMaterno = usuarioResultSet.getString("ape_materno");
            String dniUsuario = usuarioResultSet.getString("dni");

            // Obtener información de los usuarios que asisten al evento
            String asistentesQuery = "SELECT u.dni, u.nombre, u.ape_paterno, u.ape_materno, ra.FechaRegistro, ra.Estado " +
                    "FROM usuario u " +
                    "INNER JOIN asiste a ON u.id = a.ID_Usuario " +
                    "LEFT JOIN registro_asistencia ra ON u.id = ra.ID_Usuario AND ra.ID_Evento = ? " +
                    "WHERE a.ID_Evento = ? AND u.id <> ?";
            PreparedStatement asistentesStatement = connection.prepareStatement(asistentesQuery);
            asistentesStatement.setLong(1, eventoId);
            asistentesStatement.setLong(2, eventoId);
            asistentesStatement.setLong(3, usuarioId);
            ResultSet asistentesResultSet = asistentesStatement.executeQuery();

            // Crear el PDF
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Agregar contenido al PDF
            document.add(new Paragraph("Reporte del Evento ID: " + eventoId));
            document.add(new Paragraph("Nombre del Evento: " + nombreEvento));
            document.add(new Paragraph("Descripción: " + descripcion));
            document.add(new Paragraph("Capacidad: " + capacidad));
            document.add(new Paragraph("Fecha y Hora de Entrada: " + fechaHoraEntrada));
            document.add(new Paragraph("Fecha y Hora de Salida: " + fechaHoraSalida));
            document.add(new Paragraph("Generado por: " + nombreUsuario + " " + apePaterno + " " + apeMaterno + " (DNI: " + dniUsuario + ")"));

            // Crear la tabla de asistentes
            float[] pointColumnWidths = {150F, 150F, 150F, 150F, 150F};
            Table table = new Table(pointColumnWidths);
            table.setWidth(UnitValue.createPercentValue(100));

            // Añadir encabezado de la tabla
            table.addHeaderCell("DNI");
            table.addHeaderCell("Nombre");
            table.addHeaderCell("Apellidos");
            table.addHeaderCell("Fecha de Registro");
            table.addHeaderCell("Estado");

            // Añadir filas de la tabla
            while (asistentesResultSet.next()) {
                String dni = asistentesResultSet.getString("dni");
                String nombre = asistentesResultSet.getString("nombre");
                String apellidos = asistentesResultSet.getString("ape_paterno") + " " + asistentesResultSet.getString("ape_materno");
                String fechaRegistro = asistentesResultSet.getString("FechaRegistro");
                String estado = asistentesResultSet.getString("Estado");

                if (fechaRegistro == null) {
                    fechaRegistro = "";
                    estado = "falta";
                }

                table.addCell(dni);
                table.addCell(nombre);
                table.addCell(apellidos);
                table.addCell(fechaRegistro);
                table.addCell(estado);
            }

            // Añadir la tabla al documento
            document.add(new Paragraph("Lista de Asistentes:"));
            document.add(table);

            document.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "reporte.pdf");

            return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/excel/{eventoId}")
    public ResponseEntity<byte[]> generarReporteExcel(@PathVariable Long eventoId, @RequestParam Long usuarioId) {
        try (Connection connection = dataSource.getConnection()) {
            // Obtener información del evento
            String eventoQuery = "SELECT * FROM evento WHERE ID_Evento = ?";
            PreparedStatement eventoStatement = connection.prepareStatement(eventoQuery);
            eventoStatement.setLong(1, eventoId);
            ResultSet eventoResultSet = eventoStatement.executeQuery();
            eventoResultSet.next();

            String nombreEvento = eventoResultSet.getString("NombreEvento");
            String descripcion = eventoResultSet.getString("Descripcion");
            int capacidad = eventoResultSet.getInt("Capacidad");
            String fechaHoraEntrada = eventoResultSet.getTimestamp("FechaHoraEntrada").toString();
            String fechaHoraSalida = eventoResultSet.getTimestamp("FechaHoraSalida").toString();

            // Obtener información del usuario que genera el reporte
            String usuarioQuery = "SELECT * FROM usuario WHERE id = ?";
            PreparedStatement usuarioStatement = connection.prepareStatement(usuarioQuery);
            usuarioStatement.setLong(1, usuarioId);
            ResultSet usuarioResultSet = usuarioStatement.executeQuery();
            usuarioResultSet.next();

            String nombreUsuario = usuarioResultSet.getString("nombre");
            String apePaterno = usuarioResultSet.getString("ape_paterno");
            String apeMaterno = usuarioResultSet.getString("ape_materno");
            String dniUsuario = usuarioResultSet.getString("dni");

            // Obtener información de los usuarios que asisten al evento
            String asistentesQuery = "SELECT u.dni, u.nombre, u.ape_paterno, u.ape_materno, ra.FechaRegistro, ra.Estado " +
                    "FROM usuario u " +
                    "INNER JOIN asiste a ON u.id = a.ID_Usuario " +
                    "LEFT JOIN registro_asistencia ra ON u.id = ra.ID_Usuario AND ra.ID_Evento = ? " +
                    "WHERE a.ID_Evento = ? AND u.id <> ?";
            PreparedStatement asistentesStatement = connection.prepareStatement(asistentesQuery);
            asistentesStatement.setLong(1, eventoId);
            asistentesStatement.setLong(2, eventoId);
            asistentesStatement.setLong(3, usuarioId);
            ResultSet asistentesResultSet = asistentesStatement.executeQuery();

            // Crear el libro de Excel
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Reporte de Evento");

            // Añadir contenido al Excel
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Reporte de Evento: " + nombreEvento);
            headerRow.createCell(1).setCellValue("Descripción: " + descripcion);
            headerRow.createCell(2).setCellValue("Capacidad: " + capacidad);
            headerRow.createCell(3).setCellValue("Fecha y Hora de Entrada: " + fechaHoraEntrada);
            headerRow.createCell(4).setCellValue("Fecha y Hora de Salida: " + fechaHoraSalida);
            headerRow.createCell(5).setCellValue("Generado por: " + nombreUsuario + " " + apePaterno + " " + apeMaterno + " (DNI: " + dniUsuario + ")");

            Row asistentesHeaderRow = sheet.createRow(2);
            asistentesHeaderRow.createCell(0).setCellValue("DNI");
            asistentesHeaderRow.createCell(1).setCellValue("Nombre");
            asistentesHeaderRow.createCell(2).setCellValue("Apellidos");
            asistentesHeaderRow.createCell(3).setCellValue("Fecha de Registro");
            asistentesHeaderRow.createCell(4).setCellValue("Estado");

            int rowNum = 3;
            while (asistentesResultSet.next()) {
                Row row = sheet.createRow(rowNum++);
                String dni = asistentesResultSet.getString("dni");
                String nombre = asistentesResultSet.getString("nombre");
                String apellidos = asistentesResultSet.getString("ape_paterno") + " " + asistentesResultSet.getString("ape_materno");
                String fechaRegistro = asistentesResultSet.getString("FechaRegistro");
                String estado = asistentesResultSet.getString("Estado");

                if (fechaRegistro == null) {
                    fechaRegistro = "";
                    estado = "falta";
                }

                row.createCell(0).setCellValue(dni);
                row.createCell(1).setCellValue(nombre);
                row.createCell(2).setCellValue(apellidos);
                row.createCell(3).setCellValue(fechaRegistro);
                row.createCell(4).setCellValue(estado);
            }

            // Ajustar el ancho de las columnas
            for (int i = 0; i < 5; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            workbook.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "reporte.xlsx");

            return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
