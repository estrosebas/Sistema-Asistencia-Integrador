// HistorialAsistencia.tsx
import React from "react";
import Calendar, { TileClassNameFunc } from "react-calendar";
import "./estilos/Historial.css";
import 'react-calendar/dist/Calendar.css';

// Fechas de ejemplo para asistencia e inasistencia
const fechasAsistencia: string[] = ["2024-11-01", "2024-11-03", "2024-11-07"];
const fechasInasistencia: string[] = ["2024-11-02", "2024-11-04"];

const marcarFechas: TileClassNameFunc = ({ date }) => {
  const fechaFormateada = date.toISOString().split("T")[0];

  if (fechasAsistencia.includes(fechaFormateada)) {
    return "asistencia"; // Clase CSS para días con asistencia
  } else if (fechasInasistencia.includes(fechaFormateada)) {
    return "inasistencia"; // Clase CSS para días con inasistencia
  }
  return null;
};

// Datos de ejemplo para la tabla
const datosTabla = [
  { idGrupo: 1, nombreGrupo: "Grupo A", fecha: "2024-11-01", asistencia: "Sí", actividad: "Reunión" },
  { idGrupo: 2, nombreGrupo: "Grupo B", fecha: "2024-11-02", asistencia: "No", actividad: "Taller" },
  { idGrupo: 3, nombreGrupo: "Grupo C", fecha: "2024-11-03", asistencia: "Sí", actividad: "Clase" },
  // Agrega más datos según sea necesario
];

const Historial: React.FC = () => {
  return (
    <div id="user-historial">
    <div className="historial-container">
      <h2>Historial de Asistencia</h2>
      <div className="historial-content">        
        <div className="calendario-container">          
          <h2>Calendario de Asistencia</h2>
          <Calendar tileClassName={marcarFechas} />
        </div>
        <div className="tabla-container">       
          <h2>Tabla de asistencia</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID Grupo</th>
                <th>Nombre Grupo</th>
                <th>Fecha</th>
                <th>Asistencia</th>
                <th>Actividad</th>
              </tr>
            </thead>
            <tbody>
              {datosTabla.map((item) => (
                <tr key={item.idGrupo}>
                  <td>{item.idGrupo}</td>
                  <td>{item.nombreGrupo}</td>
                  <td>{item.fecha}</td>
                  <td>{item.asistencia}</td>
                  <td>{item.actividad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Historial;