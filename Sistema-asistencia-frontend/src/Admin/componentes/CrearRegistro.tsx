import React, { useState } from "react";

import { Modal, Button, Form } from "react-bootstrap";

import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./estilos/Registro.css";


interface AttendanceModalProps {
  show: boolean;
  handleClose: () => void;

  onSubmit: (evento: any) => void; 
}

const CrearRegistro: React.FC<AttendanceModalProps> = ({ show, handleClose, onSubmit }) => {
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
    // Obtén el usuario del localStorage
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
      const response = await fetch("http://localhost:3000/api/auth/add-evento", {
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

const AttendanceModal: React.FC<AttendanceModalProps> = ({ show, handleClose }) => {
  const initialFormData = {
    nombre: "",
    capacidad: "",
    descripcion: "",
    gerenteId: "",
    fecha: "",
    hora: new Date(),
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (date: Date | null) => {
    setFormData({ ...formData, hora: date || new Date() });
  };

  const handleSubmit = () => {
    console.log(formData);
    handleClose(); // Cierra el modal al guardar
    setFormData(initialFormData); // Resetea el formulario
  };

  const handleModalClose = () => {
    if (window.confirm("¿Deseas descartar la creación del registro?")) {
      handleClose();
      setFormData(initialFormData); // Resetea el formulario
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
    <Modal show={show} onHide={handleModalClose} centered dialogClassName="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Crear registro de asistencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Nombres</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ejem: Grupo A"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Capacidad</Form.Label>
                <Form.Control
                  type="number"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleChange}
                  min={1}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Hora</Form.Label>
                <DatePicker
                  selected={formData.hora}
                  onChange={handleTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Hora"
                  dateFormat="h:mm aa"
                  className="form-control text-center"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Descripcion</Form.Label>
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
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Añadir Gerente (ID)</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="text"
                      name="gerenteId"
                      value={formData.gerenteId}
                      onChange={handleChange}
                      placeholder="Ejem: U20214529"
                    />
                  </Col>
                  <Col>
                  <button type="button" className="mx-2 btn btn-outline-primary">Añadir</button>
                  </Col>
                </Row>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleModalClose}>

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
