import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import AttendanceModal from './CrearRegistro'; // Cambia por el nombre correcto del modal
import './estilos/Registro.css';
import axios from 'axios';

interface Evento {
  id: number;
  nombreEvento: string;
  fechaHoraEntrada: string;
  fechaHoraSalida: string;
  capacidad: number;
  descripcion: string;
}

const Registro: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/eventos');
        if (response.data.success) {
          setEventos(response.data.data);
        } else {
          console.error('No se encontraron eventos');
        }
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
      }
    };

    fetchEventos();
  }, []);

  const agregarEvento = (nuevoEvento: Evento) => {
    setEventos([...eventos, nuevoEvento]);
    setMostrarModal(false);
  };

  return (
    <div className="registro-container">
      <div className="registro-header d-flex justify-content-between align-items-center">
        <h2>Eventos</h2>
        <div className="Btn">
          <Button variant="warning">
            Añadir Usuario
          </Button>
          <Button variant="success" onClick={() => setMostrarModal(true)}>
            Crear Nuevo Evento
          </Button>
        </div>
      </div>

      <Table hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Fecha Entrada</th>
            <th>Fecha Salida</th>
            <th>Capacidad</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((evento) => (
            <tr key={evento.id}>
              <td>{evento.id}</td>
              <td>{evento.nombreEvento}</td>
              <td>{evento.fechaHoraEntrada}</td>
              <td>{evento.fechaHoraSalida}</td>
              <td>{evento.capacidad}</td>
              <td>{evento.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AttendanceModal
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        onSubmit={agregarEvento}
      />
    </div>
  );
};

export default Registro;
