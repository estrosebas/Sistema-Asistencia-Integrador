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
import React, { useState } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import './estilos/Registro.css';
import CrearRegistro from './CrearRegistro';
import AñadirUsuario from './AñadirUsuario';

interface Grupo {
  id: string;
  nombre: string;
  horaEntrada: string;
  fecha: string;
  cantidad: number;
  estado: 'activo' | 'inactivo';
}

interface RegistroProps {
  onNuevoRegistro: () => void;
}

const Registro: React.FC<RegistroProps> = ({ onNuevoRegistro }) => {
  const [ordenarPor, setOrdenarPor] = useState<'fecha' | 'nombre' | 'cantidad'>('fecha');
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalAñadirUsuario, setMostrarModalAñadirUsuario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos');

  const [grupos] = useState<Grupo[]>([
    { id: '1', nombre: 'Grupo A', horaEntrada: '08:00 AM', fecha: '2024-01-01', cantidad: 25, estado: 'activo' },
    { id: '2', nombre: 'Grupo B', horaEntrada: '09:30 AM', fecha: '2024-01-02', cantidad: 28, estado: 'activo' },
    { id: '3', nombre: 'Grupo C', horaEntrada: '10:00 AM', fecha: '2024-01-03', cantidad: 26, estado: 'inactivo' },
    { id: '4', nombre: 'Grupo D', horaEntrada: '07:45 AM', fecha: '2024-01-04', cantidad: 24, estado: 'activo' },
    { id: '5', nombre: 'Grupo E', horaEntrada: '11:15 AM', fecha: '2024-01-05', cantidad: 27, estado: 'inactivo' }
  ]);

  const filtrarGrupos = () => {
    let gruposFiltrados = [...grupos];
    if (busqueda) {
      gruposFiltrados = gruposFiltrados.filter(grupo =>
        grupo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        grupo.id.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    if (filtroEstado !== 'todos') {
      gruposFiltrados = gruposFiltrados.filter(grupo => grupo.estado === filtroEstado);
    }
    gruposFiltrados.sort((a, b) => {
      let comparacion = 0;
      switch (ordenarPor) {
        case 'fecha':
          comparacion = new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
          break;
        case 'nombre':
          comparacion = a.nombre.localeCompare(b.nombre);
          break;
        case 'cantidad':
          comparacion = a.cantidad - b.cantidad;
          break;
      }
      return ordenAscendente ? comparacion : -comparacion;
    });
    return gruposFiltrados;
  };

  const cambiarOrden = (campo: 'fecha' | 'nombre' | 'cantidad') => {
    if (ordenarPor === campo) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenarPor(campo);
      setOrdenAscendente(true);
    }
  };

  const cerrarModal = () => setMostrarModalRegistro(false);


  return (
    <div className="registro-container">
      <div className="registro-header d-flex justify-content-between align-items-center">

        <h2>Eventos</h2>
        <div className="Btn">
          <Button variant="success" onClick={() => setMostrarModal(true)}>
            Crear Nuevo Evento
        <h2>Registros</h2>
        <div>
          <Button 
            variant="warning" 
            className="btn-añadir-usuario me-1"
            onClick={() => setMostrarModalAñadirUsuario(true)}
          >
            Añadir Usuario
          </Button>
          <Button 
            variant="success" 
            onClick={() => { 
              setMostrarModalRegistro(true); 
              onNuevoRegistro(); 
            }} 
            className="btn-nuevo-registro me-1"
          >
            Nuevo Registro
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
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre o ID"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as 'todos' | 'activo' | 'inactivo')}>
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Form.Select>
        </Col>
      </Row>

      <div className="tabla-container">
        <Table hover responsive>
          <thead className="text-center">
            <tr>
              <th>ID</th>
              <th onClick={() => cambiarOrden('nombre')} className="ordenable">Nombre {ordenarPor === 'nombre' && (ordenAscendente ? '↑' : '↓')}</th>
              <th>Hora de entrada</th>
              <th onClick={() => cambiarOrden('fecha')} className="ordenable">Fecha {ordenarPor === 'fecha' && (ordenAscendente ? '↑' : '↓')}</th>
              <th onClick={() => cambiarOrden('cantidad')} className="ordenable">Cantidad {ordenarPor === 'cantidad' && (ordenAscendente ? '↑' : '↓')}</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="align-middle text-center">
            {filtrarGrupos().map(grupo => (
              <tr key={grupo.id}>
                <td>{grupo.id}</td>
                <td>{grupo.nombre}</td>
                <td>{grupo.horaEntrada}</td>
                <td>{new Date(grupo.fecha).toLocaleDateString()}</td>
                <td>{grupo.cantidad}</td>
                <td>
                  <span className={`estado-badge ${grupo.estado}`}>
                    {grupo.estado}
                  </span>
                </td>
                <td>
                  <div className="acciones-container">
                    <Button variant="outline-primary" size="sm" className="mx-2">Editar</Button>
                    <Button variant="outline-danger" size="sm" className="mx-2">Eliminar</Button>
                  </div>
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

      {filtrarGrupos().length === 0 && (
        <div className="sin-resultados">No se encontraron registros que coincidan con los criterios de búsqueda.</div>
      )}

      {mostrarModalRegistro && <CrearRegistro show={mostrarModalRegistro} handleClose={cerrarModal} />}

      <AñadirUsuario
        show={mostrarModalAñadirUsuario}
        handleClose={() => setMostrarModalAñadirUsuario(false)}
        grupos={grupos.map(({ id, nombre }) => ({ id, nombre }))}
      />
    </div>
  );
};

export default Registro;
