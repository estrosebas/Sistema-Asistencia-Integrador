import React, { useState } from 'react';
import usuariosData from './prueba/HistorialUsuario.json';
import { Table, Form, Button, ButtonGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Reporte: React.FC = () => {
  const [searchId, setSearchId] = useState<number | ''>('');
  const [filteredUsers, setFilteredUsers] = useState(usuariosData);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSearch = () => {
    if (searchId) {
      const filtered = usuariosData.filter(user => user.id === searchId);
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(usuariosData);
    }
  };

  const handleGenerateReport = () => {
    // Lógica para generar el reporte
    alert('Reporte generado');
  };

  const handleExportReport = () => {
    // Lógica para exportar el reporte
    alert('Reporte exportado');
  };

  return (
    <div className="container mt-5">
      <h2>Reporte de Usuario</h2>
      <div className="d-flex mb-3">
        <Form.Control
          type="number"
          placeholder="Buscar por ID"
          value={searchId}
          onChange={(e) => setSearchId(Number(e.target.value))}
          className="me-2"
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </div>
      <Table hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Grupo</th>
            <th>Cantidad de Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.grupo.join(', ')}</td>
              <td>{user.cantidadAsistencia}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Calendarios para seleccionar fechas */}
      <div className="d-flex mb-3">
        <div className="me-2">
          <label>Fecha Inicio:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy/MM/dd"
            className="form-control"
          />
        </div>
        <div>
          <label>Fecha Fin:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy/MM/dd"
            className="form-control"
          />
        </div>
      </div>

      <ButtonGroup className="mt-3">
        <Button variant="success" onClick={handleGenerateReport} className="me-2">Generar Reporte</Button>
        <Button variant="success" onClick={handleExportReport} className="me-2">Exportar Reporte</Button>
      </ButtonGroup>
    </div>
  );
};

export default Reporte;