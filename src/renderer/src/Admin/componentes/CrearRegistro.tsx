import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface AttendanceModalProps {
  show: boolean;
  handleClose: () => void;
  onSubmit: (evento: any) => void;
}
const apiUrl = import.meta.env.VITE_API_URL; // Usa la variable de entorno

const CrearRegistro: React.FC<AttendanceModalProps> = ({
  show,
  handleClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    nombreEvento: "",
    fechaHoraEntrada: "",
    fechaHoraSalida: "",
    capacidad: 0,
    descripcion: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = "00";
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (!userData || !userData.usuarioId) {
      console.error("El usuario no está autenticado o no tiene un ID válido.");
      return;
    }

    const evento = {
      nombreEvento: formData.nombreEvento,
      descripcion: formData.descripcion,
      capacidad: Number(formData.capacidad),
      fechaHoraEntrada: formatDateTime(formData.fechaHoraEntrada),
      fechaHoraSalida: formatDateTime(formData.fechaHoraSalida),
      idUsuario: userData.usuarioId,
    };

    try {
      const response = await fetch(`${apiUrl}/auth/add-evento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(evento),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.evento) {
          onSubmit(result.evento);
          handleClose();
        } else {
          console.error("Error al crear el evento:", result.message);
        }
      } else {
        const error = await response.json();
        console.error("Error al crear el evento:", error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
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

export default CrearRegistro;
