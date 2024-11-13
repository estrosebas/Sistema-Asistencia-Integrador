import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa los estilos del calendario
import './estilos/CalendarioHistorial.css'; // Crea un archivo CSS para estilos

interface CalendarioHistorialProps {
  show: boolean;
  handleClose: () => void;
  usuario: any;
  grupo: string;
}

const CalendarioHistorial: React.FC<CalendarioHistorialProps> = ({ show, handleClose, usuario, grupo }) => {
  const [selectedGroup, setSelectedGroup] = useState(grupo);
  const [asistencia, setAsistencia] = useState<any>({}); // Manejar asistencia como un estado

  useEffect(() => {
    // Verificar si el grupo seleccionado tiene datos de asistencia
    if (usuario && usuario.asistencia && usuario.asistencia[selectedGroup]) {
      setAsistencia(usuario.asistencia[selectedGroup]);
    } else {
      // Si no hay datos para el grupo seleccionado, seleccionar el primer grupo disponible
      const firstGroup = usuario.grupo[0];
      setSelectedGroup(firstGroup);
      setAsistencia(usuario.asistencia[firstGroup]);
    }
  }, [selectedGroup, usuario]); // Dependencias para el efecto

  if (!usuario) return null;

  // Función para manejar el cambio de grupo
  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newGroup = event.target.value;
    setSelectedGroup(newGroup);
    setAsistencia(usuario.asistencia[newGroup]); // Actualiza la asistencia al cambiar de grupo
  };

  // Colores para asistencia
  const tileClassName = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    if (asistencia[dateString] === undefined) return ''; // No hay datos para esta fecha
    return asistencia[dateString] ? 'asistio' : 'no-asistio';
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl"> {/* Modal extra grande */}
      <Modal.Header closeButton>
        <Modal.Title>Historial de Asistencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}> {/* Columna izquierda */}
            <div className="mb-1">
              <div className="mb-2">
                <label className="form-label">Nombre: </label>
                <input 
                  name="nombre" 
                  value={usuario.nombre} 
                  readOnly 
                  className="form-control" 
                />
              </div>
              <div className="mb-2">
                <label className="form-label">ID de Usuario: </label>
                <input 
                  name="id" 
                  value={usuario.id} 
                  readOnly 
                  className="form-control" 
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Cantidad de Asistencia: </label>
                <input 
                  name="cantidadAsistencia" 
                  value={usuario.cantidadAsistencia} 
                  readOnly 
                  className="form-control" 
                />
              </div>
              <label htmlFor="grupo-select" className="form-label">Seleccionar Grupo:</label>
              <select 
                id="grupo-select" 
                value={selectedGroup} 
                onChange={handleGroupChange} 
                className="form-select mb-3"
              >
                {usuario.grupo.map((g: string) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </Col>
          <Col md={8}> {/* Columna derecha */}
            <div className="calendar-container"> {/* Contenedor para el calendario */}
              <Calendar
                tileClassName={tileClassName}
                // Puedes agregar más props aquí si es necesario
              />
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={ handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CalendarioHistorial;