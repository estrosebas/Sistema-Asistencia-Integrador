import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

interface ConfigurarProps {
  show: boolean;
  handleClose: () => void;
  evento: any;
  onSubmit: (evento: any) => void;
}

const apiUrl = import.meta.env.VITE_API_URL;

const Configurar: React.FC<ConfigurarProps> = ({
  show,
  handleClose,
  evento,
  onSubmit,
}) => {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/auth/eventos/${formData.id}`,
        {
          nombreEvento: formData.nombreEvento,
          descripcion: formData.descripcion,
          capacidad: formData.capacidad.toString(), // Convierte a String si es necesario
          fechaHoraEntrada: formData.fechaHoraEntrada,
          fechaHoraSalida: formData.fechaHoraSalida,
        }
      );

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
            <Form.Control
              type="text"
              name="id"
              value={formData.id}
              readOnly
              disabled
            />
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
