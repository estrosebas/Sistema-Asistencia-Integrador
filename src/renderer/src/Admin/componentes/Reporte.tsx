import React, { useState, useEffect } from "react";
import { Table, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import "./estilos/Registro.css";

interface Evento {
  id: number;
  nombreEvento: string;
  fechaHoraEntrada: string;
  fechaHoraSalida: string;
  capacidad: number;
  descripcion: string;
}

const Reporte: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Obtener eventos desde el backend
  const fetchEventos = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = userData.usuarioId;
    if (userId === null || userId === undefined) {
      console.error("El ID del usuario no está disponible en el localStorage.");
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/auth/eventos?usuarioId=${userId}`);
      if (response.data.success) {
        setEventos(response.data.data);
      } else {
        console.error("No se encontraron eventos");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.error("No se encontraron eventos para el usuario.");
      } else {
        console.error("Error al obtener los eventos:", error);
      }
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Función para formatear la fecha
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString();
  };

  // Función para formatear la hora
  const formatearHora = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Función para calcular la diferencia de horas
  const calcularDiferenciaHoras = (fechaEntrada: string, fechaSalida: string) => {
    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);
    const diff = salida.getTime() - entrada.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Función para filtrar eventos
  const filtrarEventos = () => {
    return eventos.filter(evento =>
      evento.nombreEvento.toLowerCase().startsWith(filtro.toLowerCase()) ||
      evento.id.toString().startsWith(filtro)
    );
  };

  // Función para generar reporte
  const generarReporte = (evento: Evento) => {
    setSelectedEvento(evento);
    setShowModal(true);
  };

  // Función para descargar el reporte en PDF
  const descargarReportePDF = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = userData.usuarioId;
    if (selectedEvento && userId) {
      const response = await axios.get(`${API_URL}/reporte/pdf/${selectedEvento.id}`, {
        responseType: 'blob',
        params: { usuarioId: userId }
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' })); // Ajustar el tipo de contenido
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte.pdf');
      document.body.appendChild(link);
      link.click();
      setShowModal(false);
    }
  };

  // Función para descargar el reporte en Excel
  const descargarReporteExcel = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = userData.usuarioId;
    if (selectedEvento && userId) {
      const response = await axios.get(`${API_URL}/reporte/excel/${selectedEvento.id}`, {
        responseType: 'blob',
        params: { usuarioId: userId }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte.xlsx');
      document.body.appendChild(link);
      link.click();
      setShowModal(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-header d-flex justify-content-between align-items-center">
        <h2>Reporte</h2>
      </div>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Buscar evento por nombre o ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese el nombre o ID del evento"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </Form.Group>

      {filtrarEventos().length > 0 ? (
        <Table hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Duración</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarEventos().map((evento) => (
              <tr key={evento.id}>
                <td>{evento.id}</td>
                <td>{evento.nombreEvento}</td>
                <td>{formatearFecha(evento.fechaHoraEntrada)}</td>
                <td>{formatearHora(evento.fechaHoraEntrada)} - {formatearHora(evento.fechaHoraSalida)}</td>
                <td>{calcularDiferenciaHoras(evento.fechaHoraEntrada, evento.fechaHoraSalida)}</td>
                <td>{evento.capacidad}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => generarReporte(evento)}>
                    Generar Reporte
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="anuncio">
          <h3>No hay eventos disponibles</h3>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Generar Reporte</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Seleccione el formato del reporte:</p>
          <Button variant="primary" onClick={descargarReportePDF}>
            Descargar PDF
          </Button>
          <Button variant="success" onClick={descargarReporteExcel}>
            Descargar Excel
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Reporte;
