import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './estilos/CalendarioHistorial.css';

const API_URL = import.meta.env.VITE_API_URL;

interface CalendarioHistorialProps {
  show: boolean;
  handleClose: () => void;
  usuario: any;
  grupo: string;
  eventos: any[];
}

const CalendarioHistorial: React.FC<CalendarioHistorialProps> = ({ show, handleClose, usuario, eventos }) => {
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('');
  const [registrosAsistencia, setRegistrosAsistencia] = useState<any[]>([]);
  const [fechaHoraEntrada, setFechaHoraEntrada] = useState<string>('');

  const handleEventoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventoSeleccionado(e.target.value);
  };

  useEffect(() => {
    if (show && eventoSeleccionado) {
      const fetchRegistrosAsistencia = async () => {
        try {
          const response = await axios.get(`${API_URL}/auth/registros-asistencia-usuario-evento`, {
            params: {
              usuarioId: usuario.id,
              eventoNombre: eventoSeleccionado
            }
          });
          if (response.data.success) {
            console.log("Registros de asistencia:", response.data.data);
            setRegistrosAsistencia(response.data.data);
          } else {
            console.error("No se encontraron registros de asistencia");
          }
        } catch (error) {
          console.error("Error al obtener los registros de asistencia:", error);
        }
      };

      const fetchEvento = async () => {
        try {
          const response = await axios.get(`${API_URL}/auth/evento-por-nombre`, {
            params: {
              nombreEvento: eventoSeleccionado
            }
          });
          if (response.data.success) {
            const evento = response.data.data;
            setFechaHoraEntrada(evento.fechaHoraEntrada);
          } else {
            console.error("No se encontró el evento");
          }
        } catch (error) {
          console.error("Error al obtener la fecha y hora de entrada del evento:", error);
        }
      };

      fetchRegistrosAsistencia();
      fetchEvento();
    }
  }, [show, eventoSeleccionado]);

  const tileClassName = ({ date, view }: any) => {
    if (view === 'month') {
      const fecha = date.toISOString().split('T')[0];
      const registro = registrosAsistencia.find((registro: any) => registro.fechaRegistro.split('T')[0] === fecha);
      if (registro) {
        switch (registro.estado) {
          case 'asiste':
            console.log(`Aplicando clase 'asiste' para la fecha ${fecha}`);
            return 'asiste';
          case 'falta':
            console.log(`Aplicando clase 'falta' para la fecha ${fecha}`);
            return 'falta';
          case 'tarde':
            console.log(`Aplicando clase 'tarde' para la fecha ${fecha}`);
            return 'tarde';
          case 'justificado':
            console.log(`Aplicando clase 'justificado' para la fecha ${fecha}`);
            return 'justificado';
          default:
            return '';
        }
      } else if (fecha === fechaHoraEntrada.split('T')[0]) {
        console.log(`Aplicando clase 'gris' para la fecha ${fecha}`);
        return 'gris';
      }
    }
    return '';
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Historial de {usuario.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={5}>
            <p><strong>DNI:</strong> {usuario.dni}</p>
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Apellido:</strong> {usuario.ape_paterno} {usuario.ape_materno}</p>
            <Form.Group>
              <Form.Label className="fw-bold">Seleccionar Evento</Form.Label>
              <Form.Select
                value={eventoSeleccionado}
                onChange={handleEventoChange}
                className="form-select"
              >
                <option value="">Seleccionar evento</option>
                {eventos.map((evento: any) => (
                  <option key={evento.nombreEvento} value={evento.nombreEvento}>
                    {evento.nombreEvento}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={7}>
            {eventoSeleccionado && fechaHoraEntrada && (
              <div id="custom-calendar">
                <Calendar
                  tileClassName={tileClassName}
                  value={new Date(fechaHoraEntrada)}
                  onChange={() => {}}
                />
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CalendarioHistorial;
