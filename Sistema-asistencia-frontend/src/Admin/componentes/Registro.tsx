import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import AttendanceModal from "./CrearRegistro";
import Configurar from "./Configurar";
import GestionarUsuarios from "./GestionarUsuarios";
import InformacionEvento from "./InformacionEvento"; // Importar el nuevo componente modal
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
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalGestionarUsuarios, setMostrarModalGestionarUsuarios] = useState(false);
  const [mostrarModalInformacion, setMostrarModalInformacion] = useState(false); // Nuevo estado para el modal de información
  const [eventoEditar, setEventoEditar] = useState<Evento | null>(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [eventoInformacion, setEventoInformacion] = useState<Evento | null>(null); // Nuevo estado para el evento a mostrar en el modal
  const API_URL = import.meta.env.VITE_API_URL;

  // Obtener eventos desde el backend
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

  // Agregar evento al estado
  const agregarEvento = async (nuevoEvento: Partial<Evento>) => {
    try {
      if (!nuevoEvento.id) {
        const response = await axios.get(`${API_URL}/auth/eventos`);
        const eventosActualizados = response.data.data;
        setEventos(eventosActualizados);
      } else {
        setEventos((prevEventos) => [...prevEventos, nuevoEvento as Evento]);
      }
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al agregar el evento:", error);
    }
  };

  // Eliminar evento
  const eliminarEvento = async (id: number) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este evento?");
    if (confirmacion) {
      try {
        const response = await axios.delete(`${API_URL}/auth/eventos/${id}`);
        if (response.data.success) {
          setEventos((prevEventos) => prevEventos.filter((evento) => evento.id !== id));
          alert(response.data.message);
        } else {
          console.error("Error al eliminar el evento.");
        }
      } catch (error) {
        console.error("Error en la solicitud de eliminación:", error);
      }
    }
  };

  // Editar evento
  const editarEvento = (evento: Evento) => {
    setEventoEditar(evento);
    setMostrarModalEditar(true);
  };

  // Actualizar evento en el estado
  const actualizarEvento = (eventoActualizado: Evento) => {
    setEventos((prevEventos) =>
      prevEventos.map((evento) => (evento.id === eventoActualizado.id ? eventoActualizado : evento))
    );
  };

  // Abrir modal para gestionar usuarios
  const gestionarUsuarios = (evento: Evento) => {
    setEventoSeleccionado(evento);
    setMostrarModalGestionarUsuarios(true);
  };

  // Mostrar información del evento en el modal
  const mostrarInformacionEvento = (evento: Evento) => {
    setEventoInformacion(evento);
    setMostrarModalInformacion(true);
  };

  // Función para formatear la fecha
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString();
  };

  // Función para formatear la hora
  const formatearHora = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Función para calcular la diferencia de horas
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
        <div className="Btn">
          <Button variant="success" onClick={() => setMostrarModal(true)}>
            Crear Nuevo Evento
          </Button>
        </div>
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
              <th>Usuario</th>
              <th>Acciones</th>
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
                  <Button variant="warning" size="sm" onClick={() => gestionarUsuarios(evento)}>
                    Gestionar Usuarios
                  </Button>
                </td>
                <td>
                  <Button variant="primary" size="sm" className="me-2" onClick={() => editarEvento(evento)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => eliminarEvento(evento.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="anuncio">
          <h3>No hay eventos disponibles</h3>
          <p>¡Crea un nuevo evento para comenzar!</p>
        </div>
      )}

      {/* Modal para crear evento */}
      <AttendanceModal show={mostrarModal} handleClose={() => setMostrarModal(false)} onSubmit={agregarEvento} />

      {/* Modal para editar evento */}
      {eventoEditar && (
        <Configurar
          show={mostrarModalEditar}
          handleClose={() => setMostrarModalEditar(false)}
          evento={eventoEditar}
          onSubmit={actualizarEvento}
        />
      )}

      {/* Modal para gestionar usuarios */}
      {eventoSeleccionado && (
        <GestionarUsuarios
          show={mostrarModalGestionarUsuarios}
          handleClose={() => setMostrarModalGestionarUsuarios(false)}
          evento={eventoSeleccionado}
        />
      )}

      {/* Modal para mostrar información del evento */}
      <InformacionEvento
        show={mostrarModalInformacion}
        handleClose={() => setMostrarModalInformacion(false)}
        evento={eventoInformacion}
      />
    </div>
  );
};

export default Registro;
