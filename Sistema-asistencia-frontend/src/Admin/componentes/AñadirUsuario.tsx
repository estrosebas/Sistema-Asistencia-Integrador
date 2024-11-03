// AñadirUsuario.tsx
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import './estilos/AñadirUsuario.css'; 

interface AñadirUsuarioProps {
  show: boolean;
  handleClose: () => void;
  grupos: Array<{ id: string; nombre: string }>;
}

const AñadirUsuario: React.FC<AñadirUsuarioProps> = ({ show, handleClose, grupos }) => {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState('');
  const [idBusqueda, setIdBusqueda] = useState('');

  const handleGuardar = () => {
    console.log('Grupo:', grupoSeleccionado);
    console.log('ID:', idBusqueda);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Añadir Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="grupoSeleccionado">
                <Form.Label>Seleccionar Grupo</Form.Label>
                <Form.Select
                  value={grupoSeleccionado}
                  onChange={(e) => setGrupoSeleccionado(e.target.value)}
                >
                  <option value="">Selecciona un grupo</option>
                  {grupos.map((grupo) => (
                    <option key={grupo.id} value={grupo.id}>
                      {grupo.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="idBusqueda">
                <Form.Label>Buscar ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar ID"
                  value={idBusqueda}
                  onChange={(e) => setIdBusqueda(e.target.value)}
                />
              </Form.Group>
              <Button variant="info" className="mt-2">Buscar</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>Cancelar</Button>
        <Button variant="success" onClick={handleGuardar}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AñadirUsuario;
