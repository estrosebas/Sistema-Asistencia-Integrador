import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './estilos/CalendarioHistorial.css';

const API_URL = import.meta.env.VITE_API_URL;

interface CalendarioHistorialProps {
  show: boolean;
  handleClose: () => void;
  eventoSeleccionado: string; // Nueva propiedad para el evento seleccionado
  eventos: any[];
}

const CalendarioHistorial: React.FC<CalendarioHistorialProps> = ({ show, handleClose, eventoSeleccionado }) => {
  const [registrosAsistencia, setRegistrosAsistencia] = useState<any[]>([]);
  const [fechaHoraEntrada, setFechaHoraEntrada] = useState<string>('');

  // Obtener el usuarioId del localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const usuarioId = userData.usuarioId;

  useEffect(() => {
    if (show && eventoSeleccionado) {
      const fetchRegistrosAsistencia = async () => {
        try {
          console.log("usuarioId:", usuarioId);
          console.log("eventoNombre:", eventoSeleccionado);

          const response = await axios.get(`${API_URL}/auth/registros-asistencia-usuario-evento`, {
            params: {
              usuarioId: usuarioId,
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
  }, [show, eventoSeleccionado, usuarioId]);

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
        <Modal.Title>Historial de {userData.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
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
