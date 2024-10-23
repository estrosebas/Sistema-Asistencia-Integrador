import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Registros.css"; // Asegúrate de tener este archivo CSS

interface AttendanceModalProps {
  show: boolean;
  handleClose: () => void;
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
                  className="form-control"
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
                    <Button variant="primary" className="btn-add">Añadir</Button>
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
