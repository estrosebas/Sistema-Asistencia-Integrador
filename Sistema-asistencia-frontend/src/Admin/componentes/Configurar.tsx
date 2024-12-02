import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

interface ConfigurarProps {
  show: boolean;
  handleClose: () => void;
  evento: any;
  onSubmit: (evento: any) => void;
}

const Configurar: React.FC<ConfigurarProps> = ({ show, handleClose, evento, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: evento.id,
    nombreEvento: evento.nombreEvento,
    fechaHoraEntrada: evento.fechaHoraEntrada,
    fechaHoraSalida: evento.fechaHoraSalida,
    capacidad: evento.capacidad,
    descripcion: evento.descripcion,
  });

  useEffect(() => {
    setFormData({
      id: evento.id,
      nombreEvento: evento.nombreEvento,
      fechaHoraEntrada: evento.fechaHoraEntrada,
      fechaHoraSalida: evento.fechaHoraSalida,
      capacidad: evento.capacidad,
      descripcion: evento.descripcion,
    });
  }, [evento]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/api/auth/eventos/${formData.id}`, {
        nombreEvento: formData.nombreEvento,
        descripcion: formData.descripcion,
        capacidad: formData.capacidad.toString(), // Convierte a String si es necesario
        fechaHoraEntrada: formData.fechaHoraEntrada,
        fechaHoraSalida: formData.fechaHoraSalida,
      });
      if (response.data.success) {
        onSubmit(formData);
        handleClose();
      } else {
        console.error("Error al actualizar el evento:", response.data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  
  

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" name="id" value={formData.id} readOnly disabled />
          </Form.Group>
          <Form.Group>
            <Form.Label>Nombre del Evento</Form.Label>
            <Form.Control
              type="text"
              name="nombreEvento"
              value={formData.nombreEvento}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fecha Hora Entrada</Form.Label>
            <Form.Control
              type="datetime-local"
              name="fechaHoraEntrada"
              value={formData.fechaHoraEntrada}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fecha Hora Salida</Form.Label>
            <Form.Control
              type="datetime-local"
              name="fechaHoraSalida"
              value={formData.fechaHoraSalida}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              name="capacidad"
              value={formData.capacidad}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Configurar;
import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import './estilos/Configurar.css';

interface GrupoConfig {
  id: string;
  nombre: string;
  capacidad: number;
  descripcion: string;
  gerente: string;
  fecha: Date | null;
  hora: Date | null; // Usaremos un objeto Date para la hora también
}

const Configurar: React.FC = () => {
  const [grupo, setGrupo] = useState<GrupoConfig>({
    id: '',
    nombre: '',
    capacidad: 0,
    descripcion: '',
    gerente: '',
    fecha: null,
    hora: null, // Inicialmente null
  });

  const [mensaje, setMensaje] = useState<{tipo: string; texto: string} | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGrupo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setGrupo(prev => ({
      ...prev,
      fecha: date
    }));
  };

  const handleTimeChange = (time: Date | null) => {
    setGrupo(prev => ({
      ...prev,
      hora: time
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la configuración
    console.log('Configuración guardada:', grupo);
    setMensaje({
      tipo: 'success',
      texto: 'Configuración guardada exitosamente'
    });
    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <div className="configurar-container">
      <h2 className="mb-4">Configuración del Sistema</h2>

      {mensaje && (
        <Alert variant={mensaje.tipo} onClose={() => setMensaje(null)} dismissible>
          {mensaje.texto}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <h5 className="mb-0">Configuración de Grupos</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ID del Grupo</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={grupo.id}
                    onChange={handleInputChange}
                    placeholder="Ej: G001"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Grupo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={grupo.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Grupo A "
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacidad</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacidad"
                    value={grupo.capacidad}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gerente</Form.Label>
                  <Form.Control
                    type="text"
                    name="gerente"
                    value={grupo.gerente}
                    onChange={handleInputChange}
                    placeholder="Id del gerente"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="descripcion"
                    value={grupo.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Descripción del grupo"
                    className="descripcion-textarea"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <div className="date-time-container">
                  <Form.Label className="date-time-label">Fecha</Form.Label>
                  <DatePicker
                    selected={grupo.fecha}
                    onChange={handleDateChange}
                    placeholderText="Seleccione una fecha"
                    required
                    className="form-control text-center"
                  />
                  <Form.Label className="date-time-label">Hora</Form.Label>
                  <DatePicker
                    selected={grupo.hora}
                    onChange={handleTimeChange}                    
                    placeholderText="Seleccione una Hora"
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Hora"
                    dateFormat="h:mm aa"
                    className="form-control text-center"
                  />
                </div>
              </Col>
            </Row>
            <br></br>
            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="danger" 
                onClick={() => {
                  setGrupo({
                    id: '',
                    nombre: '',
                    capacidad: 0,
                    descripcion: '',
                    gerente: '',
                    fecha: null,
                    hora: null,
                  });
                }}
              >
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Guardar Configuración
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Configurar;
