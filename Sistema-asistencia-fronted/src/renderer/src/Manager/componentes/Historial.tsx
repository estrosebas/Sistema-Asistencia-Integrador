import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import './estilos/Historial.css';
import CalendarioHistorial from './CalendarioHistorial'; // Asegúrate de que la ruta sea correcta
import usuariosData from './prueba/HistorialUsuario.json'; // Asegúrate de que la ruta sea correcta

const Historial: React.FC = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string>('todos');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null);
  const [grupoSeleccionadoHistorial, setGrupoSeleccionadoHistorial] = useState<string>('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setUsuarios(usuariosData);
  }, []);

  const filtrarUsuarios = () => {
    return usuarios.filter(usuario => {
      const coincideId = busquedaId ? usuario.id.toString() === busquedaId : true;
      const coincideGrupo = grupoSeleccionado === 'todos' || usuario.grupo.includes(grupoSeleccionado);
      return coincideId && coincideGrupo;
    });
  };

  const handleVerActividad = (usuario: any) => {
    setUsuarioSeleccionado(usuario);
    setGrupoSeleccionadoHistorial(usuario.grupo[0]); // Establece el primer grupo por defecto
    setShowPopup(true);
  };

  return (
    <Container>
      <h2 className="mb-4">Historial de Usuarios</h2>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por ID de usuario"
            value={busquedaId}
            onChange={(e) => setBusquedaId(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select value={grupoSeleccionado} onChange={(e) => setGrupoSeleccionado(e.target.value)}>
            <option value="todos">Todos los grupos</option>
            <option value="Grupo A">Grupo A</option>
            <option value="Grupo B">Grupo B</option>
            <option value="Grupo C">Grupo C</option>
            <option value="Grupo D">Grupo D</option>
            <option value="Grupo E">Grupo E</option>
          </Form.Select>
        </Col>
      </Row>

      <Table hover>
        <thead className="text-center">
          <tr>
            <th>ID de Usuario</th>
            <th>Nombre</th>
            <th>Grupo</th>
            <th>Actividad</th>
          </tr>
        </thead>
        <tbody className="align-middle text-center">
          {filtrarUsuarios().map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.grupo.join(', ')}</td>
              <td>
                <Button variant="link" onClick={() => handleVerActividad(usuario)}>
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
          grupo={grupoSeleccionadoHistorial} // Pasar el grupo seleccionado al CalendarioHistorial
        />
      )}
    </Container>
  );
};

export default Historial;