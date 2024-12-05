import React, { useState, useEffect } from "react";

import {
  Modal,
  Button,
  Form,
  Table,
  Alert,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";

interface GestionarUsuariosProps {
  show: boolean;
  handleClose: () => void;
  evento: {
    id: number;
    nombreEvento: string;
    fechaHoraEntrada: string;
    fechaHoraSalida: string;
    capacidad: number;
    descripcion: string;
  };
}

const GestionarUsuarios: React.FC<GestionarUsuariosProps> = ({
  show,
  handleClose,
  evento,
}) => {
  const [dni, setDni] = useState("");
  const [usuariosEvento, setUsuariosEvento] = useState<any[]>([]);
  const [usuariosTemporales, setUsuariosTemporales] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    setUsuarioId(userData.usuarioId);
    if (show) {
      fetchUsuariosEvento();
    }
  }, [show]);

  const fetchUsuariosEvento = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/auth/usuarios-evento?eventoId=${evento.id}`
      );
      if (response.data.success) {
        const usuariosFiltrados = response.data.data.filter(
          (u: any) => u.id !== usuarioId
        );
        setUsuariosEvento(usuariosFiltrados);
      } else {
        console.error("No se encontraron usuarios para el evento");
      }
    } catch (error) {
      console.error("Error al obtener los usuarios del evento:", error);
    }
  };

  const buscarUsuario = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/usuarios`);
      if (response.data.success) {
        const usuarioEncontrado = response.data.data.find(
          (u: any) => u.dni === parseInt(dni)
        );
        if (usuarioEncontrado) {
          const usuarioYaEnEvento = usuariosEvento.some(
            (u: any) => u.dni === usuarioEncontrado.dni
          );
          if (usuarioYaEnEvento) {
            setMensaje("El usuario ya está en el evento");
          } else if (usuarioEncontrado.id === usuarioId) {
            setMensaje("No puedes añadirte a ti mismo al evento");
          } else {
            setMensaje(`Usuario encontrado: ${usuarioEncontrado.nombre}`);
            setUsuariosTemporales([...usuariosTemporales, usuarioEncontrado]);
          }
          setDni("");
        } else {
          setMensaje("Usuario no encontrado");
        }
      } else {
        console.error("No se encontraron usuarios");
      }
    } catch (error) {
      console.error("Error al buscar el usuario:", error);
    }
  };

  const quitarUsuarioTemporal = (dni: number) => {
    setUsuariosTemporales(usuariosTemporales.filter((u: any) => u.dni !== dni));
  };

  const añadirUsuarios = async () => {
    try {
      for (const usuario of usuariosTemporales) {
        const response = await axios.post(`${API_URL}/auth/add-asiste`, {
          idUsuario: usuario.id,
          idEvento: evento.id,
        });
        if (!response.data.success) {
          alert("Error al añadir el usuario: " + usuario.nombre);
        }
      }
      alert("Usuarios añadidos exitosamente");
      fetchUsuariosEvento();
      limpiarCampos();
    } catch (error) {
      console.error("Error al añadir los usuarios:", error);
    }
  };

  const eliminarUsuario = async (idUsuario: number) => {
    try {
      const response = await axios.delete(
        `${API_URL}/auth/delete-asiste?idUsuario=${idUsuario}&idEvento=${evento.id}`
      );
      if (response.data.success) {
        setUsuariosEvento(
          usuariosEvento.filter((u: any) => u.id !== idUsuario)
        );
        alert("Usuario eliminado exitosamente");
      } else {
        alert("Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const limpiarCampos = () => {
    setDni("");
    setUsuariosTemporales([]);
    setMensaje("");
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose();
        limpiarCampos();
      }}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Gestionar Usuarios del Evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <h4>Lista de Usuarios del Evento</h4>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DNI</th>
                  <th>Nombre</th>
                  <th>Apellido Paterno</th>
                  <th>Apellido Materno</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosEvento.length > 0 ? (
                  usuariosEvento.map((usuario: any) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.dni}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.ape_paterno}</td>
                      <td>{usuario.ape_materno}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => eliminarUsuario(usuario.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No hay usuarios en el evento
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            <h4>Añadir Usuario</h4>
            <Form>
              <Form.Group controlId="formDni">
                <Form.Label>DNI del Usuario</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el DNI del usuario"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                  />
                  <Button variant="primary" onClick={buscarUsuario}>
                    Buscar Usuario
                  </Button>
                </InputGroup>
              </Form.Group>
            </Form>
            {mensaje && <Alert variant="info">{mensaje}</Alert>}
            {usuariosTemporales.length > 0 && (
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DNI</th>
                    <th>Nombre</th>
                    <th>Apellido Paterno</th>
                    <th>Apellido Materno</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosTemporales.map((usuario: any) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.dni}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.ape_paterno}</td>
                      <td>{usuario.ape_materno}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => quitarUsuarioTemporal(usuario.dni)}
                        >
                          Quitar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            handleClose();
            limpiarCampos();
          }}
        >
          Cerrar
        </Button>
        <Button variant="primary" onClick={añadirUsuarios}>
          Añadir Usuarios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GestionarUsuarios;
