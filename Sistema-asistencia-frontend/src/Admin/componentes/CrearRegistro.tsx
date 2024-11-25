import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface AttendanceModalProps {
  show: boolean;
  handleClose: () => void;
  onSubmit: (evento: any) => void; // Recibe función para crear evento
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ show, handleClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombreEvento: "",
    fechaHoraEntrada: "",
    fechaHoraSalida: "",
    capacidad: 0,
    descripcion: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const evento = {
      nombreEvento: formData.nombreEvento,
      descripcion: formData.descripcion,
      capacidad: Number(formData.capacidad), // Convierte a número
      fechaHoraEntrada: formData.fechaHoraEntrada,
      fechaHoraSalida: formData.fechaHoraSalida,
    };
    
    onSubmit(evento); // Envía el objeto correctamente tipado al backend
    handleClose();
  };
  

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear Evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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
          Crear
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttendanceModal;
