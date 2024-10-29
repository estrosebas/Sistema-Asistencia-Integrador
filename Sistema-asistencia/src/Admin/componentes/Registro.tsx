import React, { useState } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import './estilos/Registro.css';
import CrearRegistro from './CrearRegistro';
import AñadirUsuario from './AñadirUsuario';

interface Grupo {
  id: string;
  nombre: string;
  horaEntrada: string;
  fecha: string;
  cantidad: number;
  estado: 'activo' | 'inactivo';
}

interface RegistroProps {
  onNuevoRegistro: () => void;
}

const Registro: React.FC<RegistroProps> = ({ onNuevoRegistro }) => {
  const [ordenarPor, setOrdenarPor] = useState<'fecha' | 'nombre' | 'cantidad'>('fecha');
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalAñadirUsuario, setMostrarModalAñadirUsuario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos');

  const [grupos] = useState<Grupo[]>([
    { id: '1', nombre: 'Grupo A', horaEntrada: '08:00 AM', fecha: '2024-01-01', cantidad: 25, estado: 'activo' },
    { id: '2', nombre: 'Grupo B', horaEntrada: '09:30 AM', fecha: '2024-01-02', cantidad: 28, estado: 'activo' },
    { id: '3', nombre: 'Grupo C', horaEntrada: '10:00 AM', fecha: '2024-01-03', cantidad: 26, estado: 'inactivo' },
    { id: '4', nombre: 'Grupo D', horaEntrada: '07:45 AM', fecha: '2024-01-04', cantidad: 24, estado: 'activo' },
    { id: '5', nombre: 'Grupo E', horaEntrada: '11:15 AM', fecha: '2024-01-05', cantidad: 27, estado: 'inactivo' }
  ]);

  const filtrarGrupos = () => {
    let gruposFiltrados = [...grupos];
    if (busqueda) {
      gruposFiltrados = gruposFiltrados.filter(grupo =>
        grupo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        grupo.id.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    if (filtroEstado !== 'todos') {
      gruposFiltrados = gruposFiltrados.filter(grupo => grupo.estado === filtroEstado);
    }
    gruposFiltrados.sort((a, b) => {
      let comparacion = 0;
      switch (ordenarPor) {
        case 'fecha':
          comparacion = new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
          break;
        case 'nombre':
          comparacion = a.nombre.localeCompare(b.nombre);
          break;
        case 'cantidad':
          comparacion = a.cantidad - b.cantidad;
          break;
      }
      return ordenAscendente ? comparacion : -comparacion;
    });
    return gruposFiltrados;
  };

  const cambiarOrden = (campo: 'fecha' | 'nombre' | 'cantidad') => {
    if (ordenarPor === campo) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenarPor(campo);
      setOrdenAscendente(true);
    }
  };

  const cerrarModal = () => setMostrarModalRegistro(false);

  return (
    <div className="registro-container">
      <div className="registro-header d-flex justify-content-between align-items-center">
        <h2>Registros</h2>
        <div>
          <Button 
            variant="warning" 
            className="btn-añadir-usuario me-1"
            onClick={() => setMostrarModalAñadirUsuario(true)}
          >
            Añadir Usuario
          </Button>
          <Button 
            variant="success" 
            onClick={() => { 
              setMostrarModalRegistro(true); 
              onNuevoRegistro(); 
            }} 
            className="btn-nuevo-registro me-1"
          >
            Nuevo Registro
          </Button>
        </div>
      </div>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre o ID"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as 'todos' | 'activo' | 'inactivo')}>
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Form.Select>
        </Col>
      </Row>

      <div className="tabla-container">
        <Table hover responsive>
          <thead className="text-center">
            <tr>
              <th>ID</th>
              <th onClick={() => cambiarOrden('nombre')} className="ordenable">Nombre {ordenarPor === 'nombre' && (ordenAscendente ? '↑' : '↓')}</th>
              <th>Hora de entrada</th>
              <th onClick={() => cambiarOrden('fecha')} className="ordenable">Fecha {ordenarPor === 'fecha' && (ordenAscendente ? '↑' : '↓')}</th>
              <th onClick={() => cambiarOrden('cantidad')} className="ordenable">Cantidad {ordenarPor === 'cantidad' && (ordenAscendente ? '↑' : '↓')}</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="align-middle text-center">
            {filtrarGrupos().map(grupo => (
              <tr key={grupo.id}>
                <td>{grupo.id}</td>
                <td>{grupo.nombre}</td>
                <td>{grupo.horaEntrada}</td>
                <td>{new Date(grupo.fecha).toLocaleDateString()}</td>
                <td>{grupo.cantidad}</td>
                <td>
                  <span className={`estado-badge ${grupo.estado}`}>
                    {grupo.estado}
                  </span>
                </td>
                <td>
                  <div className="acciones-container">
                    <Button variant="outline-primary" size="sm" className="mx-2">Editar</Button>
                    <Button variant="outline-danger" size="sm" className="mx-2">Eliminar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {filtrarGrupos().length === 0 && (
        <div className="sin-resultados">No se encontraron registros que coincidan con los criterios de búsqueda.</div>
      )}

      {mostrarModalRegistro && <CrearRegistro show={mostrarModalRegistro} handleClose={cerrarModal} />}

      <AñadirUsuario
        show={mostrarModalAñadirUsuario}
        handleClose={() => setMostrarModalAñadirUsuario(false)}
        grupos={grupos.map(({ id, nombre }) => ({ id, nombre }))}
      />
    </div>
  );
};

export default Registro;
