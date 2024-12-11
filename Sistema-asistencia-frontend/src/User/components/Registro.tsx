import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import InformacionEvento from "./InformacionEvento";
import CalendarioHistorial from "./CalendarioHistorial"; // Importar el componente modal del calendario
import "./estilos/Registro.css";
import axios from "axios";

interface Evento {
  id: number;
  nombreEvento: string;
  fechaHoraEntrada: string;
  fechaHoraSalida: string;
  capacidad: number;
  descripcion: string;
}

const Registro: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mostrarModalInformacion, setMostrarModalInformacion] = useState(false);
  const [eventoInformacion, setEventoInformacion] = useState<Evento | null>(null);
  const [mostrarModalCalendario, setMostrarModalCalendario] = useState(false); // Nuevo estado para el modal del calendario
  const [eventoCalendario, setEventoCalendario] = useState<Evento | null>(null); // Nuevo estado para el evento a mostrar en el modal del calendario
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchEventos = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = userData.usuarioId;
    if (userId === null || userId === undefined) {
      console.error("El ID del usuario no está disponible en el localStorage.");
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/auth/eventos?usuarioId=${userId}`);
      if (response.data.success) {
        setEventos(response.data.data);
      } else {
        console.error("No se encontraron eventos");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.error("No se encontraron eventos para el usuario.");
      } else {
        console.error("Error al obtener los eventos:", error);
      }
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const mostrarInformacionEvento = (evento: Evento) => {
    setEventoInformacion(evento);
    setMostrarModalInformacion(true);
  };

  const mostrarCalendarioEvento = (evento: Evento) => {
    setEventoCalendario(evento);
    setMostrarModalCalendario(true);
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString();
  };

  const formatearHora = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calcularDiferenciaHoras = (fechaEntrada: string, fechaSalida: string) => {
    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);
    const diff = salida.getTime() - entrada.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="registro-container">
      <div className="registro-header d-flex justify-content-between align-items-center">
        <h2>Eventos</h2>
      </div>

      {eventos.length > 0 ? (
        <Table hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Duración</th>
              <th>Capacidad</th>
              <th>Acciones</th> {/* Nueva columna de Acciones */}
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id}>
                <td>{evento.id}</td>
                <td onClick={() => mostrarInformacionEvento(evento)} style={{ cursor: 'pointer', color: 'blue' }}>
                  {evento.nombreEvento}
                </td>
                <td>{formatearFecha(evento.fechaHoraEntrada)}</td>
                <td>{formatearHora(evento.fechaHoraEntrada)} - {formatearHora(evento.fechaHoraSalida)}</td>
                <td>{calcularDiferenciaHoras(evento.fechaHoraEntrada, evento.fechaHoraSalida)}</td>
                <td>{evento.capacidad}</td>
                <td>
                  <Button variant="warning" onClick={() => mostrarCalendarioEvento(evento)}>
                    Ver actividad
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="anuncio">
          <h3>No hay eventos disponibles</h3>
        </div>
      )}

      {/* Modal para mostrar información del evento */}
      <InformacionEvento
        show={mostrarModalInformacion}
        handleClose={() => setMostrarModalInformacion(false)}
        evento={eventoInformacion}
      />

      {/* Modal para mostrar el calendario del evento */}
      <CalendarioHistorial
        show={mostrarModalCalendario}
        handleClose={() => setMostrarModalCalendario(false)}
        eventos={eventos}
        eventoSeleccionado={eventoCalendario ? eventoCalendario.nombreEvento : ''}
      />
    </div>
  );
};

export default Registro;