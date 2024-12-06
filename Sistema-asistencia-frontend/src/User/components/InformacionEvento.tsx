import React from "react";
import { Modal, Button } from "react-bootstrap";

interface Evento {
  id: number;
  nombreEvento: string;
  fechaHoraEntrada: string;
  fechaHoraSalida: string;
  capacidad: number;
  descripcion: string;
}

interface InformacionEventoProps {
  show: boolean;
  handleClose: () => void;
  evento: Evento | null;
}

const InformacionEvento: React.FC<InformacionEventoProps> = ({ show, handleClose, evento }) => {
  if (!evento) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Información del Evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>ID:</strong> {evento.id}</p>
        <p><strong>Nombre del Evento:</strong> {evento.nombreEvento}</p>
        <p><strong>Fecha Hora Entrada:</strong> {evento.fechaHoraEntrada}</p>
        <p><strong>Fecha Hora Salida:</strong> {evento.fechaHoraSalida}</p>
        <p><strong>Capacidad:</strong> {evento.capacidad}</p>
        <p><strong>Descripción:</strong> {evento.descripcion}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InformacionEvento;
