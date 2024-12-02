import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import AttendanceModal from "./CrearRegistro";
import Configurar from "./Configurar";
import GestionarUsuarios from "./GestionarUsuarios"; // Importar el nuevo componente
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
  const [eventoEditar, setEventoEditar] = useState<Evento | null>(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);

  // Obtener eventos desde el backend
  const fetchEventos = async () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}'); // Obtener el objeto userData desde el localStorage
    const userId = userData.usuarioId; // Extraer el ID del usuario
    if (userId === null || userId === undefined) {
      console.error("El ID del usuario no está disponible en el localStorage.");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/api/auth/eventos?usuarioId=${userId}`);
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
        const response = await axios.get("http://localhost:3000/api/auth/eventos");
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
        const response = await axios.delete(`http://localhost:3000/api/auth/eventos/${id}`);
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
              <th>Fecha Entrada</th>
              <th>Fecha Salida</th>
              <th>Capacidad</th>
              <th>Descripción</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id}>
                <td>{evento.id}</td>
                <td>{evento.nombreEvento}</td>
                <td>{evento.fechaHoraEntrada}</td>
                <td>{evento.fechaHoraSalida}</td>
                <td>{evento.capacidad}</td>
                <td>{evento.descripcion}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => gestionarUsuarios(evento)}
                  >
                    Gestionar Usuarios
                  </Button>
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => editarEvento(evento)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => eliminarEvento(evento.id)}
                  >
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
      <AttendanceModal
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        onSubmit={agregarEvento}
      />

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
    </div>
  );
};

export default Registro;
