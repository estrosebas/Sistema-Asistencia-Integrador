// Historial.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import './estilos/Historial.css';
import CalendarioHistorial from './CalendarioHistorial';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Historial: React.FC = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [busquedaDni, setBusquedaDni] = useState('');
  const [eventosUsuarioLogueado, setEventosUsuarioLogueado] = useState<any[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string>(''); // Nuevo estado para el grupo seleccionado

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const usuarioId = userData.usuarioId;

    if (!usuarioId) {
      console.error("El ID del usuario no está disponible en el localStorage.");
      return;
    }

    // Obtener los eventos del usuario logueado
    const fetchEventos = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/eventos?usuarioId=${usuarioId}`);
        if (response.data.success) {
          console.log("Eventos obtenidos:", response.data.data); // Verificar los datos obtenidos
          setEventosUsuarioLogueado(response.data.data);
        } else {
          console.error("No se encontraron eventos");
        }
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    };

    // Obtener la lista de usuarios que comparten eventos en común
    const fetchUsuariosHistorial = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/usuarios-historial?usuarioId=${usuarioId}`);
        if (response.data.success) {
          console.log("Usuarios obtenidos:", response.data.data); // Verificar los datos obtenidos
          setUsuarios(response.data.data);
        } else {
          console.error("No se encontraron usuarios");
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchEventos();
    fetchUsuariosHistorial();
  }, []);

  const filtrarUsuarios = () => {
    return usuarios.filter(usuario => {
      const coincideDni = busquedaDni ? usuario.dni.toString().startsWith(busquedaDni) : true;
      const coincideEvento = eventoSeleccionado ? usuario.eventos && usuario.eventos.includes(eventoSeleccionado) : true;
      return coincideDni && coincideEvento;
    });
  };

  const handleVerActividad = (usuario: any) => {
    setUsuarioSeleccionado(usuario);
    setGrupoSeleccionado(usuario.eventos.join(', ')); // Establecer el grupo seleccionado
    setShowPopup(true);
  };

  const handleEventoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventoSeleccionado(e.target.value);
  };

  return (
    <Container>
      <h2 className="mb-4">Historial de Usuarios</h2>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por DNI de usuario"
            value={busquedaDni}
            onChange={(e) => setBusquedaDni(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Select
              value={eventoSeleccionado}
              onChange={handleEventoChange}
              className="form-select"
            >
              <option value="">Seleccionar evento</option>
              {eventosUsuarioLogueado.map((evento: any) => (
                <option key={evento.id} value={evento.nombreEvento}>
                  {evento.nombreEvento}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Table hover>
        <thead className="text-center">
          <tr>
            <th>DNI de Usuario</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Eventos en Común</th>
            <th>Actividad</th>
          </tr>
        </thead>
        <tbody className="align-middle text-center">
          {filtrarUsuarios().map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.dni}</td>
              <td>{usuario.nombre}</td>
              <td>{`${usuario.ape_paterno} ${usuario.ape_materno}`}</td>
              <td>{usuario.eventos.join(', ')}</td>
              <td>
                <Button variant="primary" onClick={() => handleVerActividad(usuario)}>
                  Ver Actividad
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {usuarioSeleccionado && (
        <CalendarioHistorial
          show={showPopup}
          handleClose={() => setShowPopup(false)}
          usuario={usuarioSeleccionado}
          grupo={grupoSeleccionado} // Pasar el grupo seleccionado al CalendarioHistorial
          eventos={eventosUsuarioLogueado} // Pasar los eventos comunes al CalendarioHistorial
        />
      )}
    </Container>
  );
};

export default Historial;
