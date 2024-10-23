import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminPanel.css";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState("registro");
  const [qrData, setQrData] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // Referencia al elemento de video
  const codeReader = new BrowserMultiFormatReader();
  const [startDate, setStartDate] = useState<string>("2024-01-01");
  const [endDate, setEndDate] = useState<string>("2024-10-10");

  useEffect(() => {
    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          if (result) {
            setQrData(result.getText());
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    // Limpiar el escáner al desmontar el componente
    return () => {
      codeReader.reset();
    };
  }, [codeReader]);

  const groups = [
    { name: "Grupo A", time: "08:00 AM", date: "01 / 09 / 2024", quantity: 25 },
    { name: "Grupo B", time: "09:30 AM", date: "02 / 09 / 2024", quantity: 28 },
    { name: "Grupo C", time: "10:00 AM", date: "03 / 09 / 2024", quantity: 26 },
    { name: "Grupo D", time: "07:45 AM", date: "04 / 09 / 2024", quantity: 24 },
    { name: "Grupo E", time: "11:15 AM", date: "05 / 09 / 2024", quantity: 27 },
    { name: "Grupo F", time: "08:30 AM", date: "06 / 09 / 2024", quantity: 23 },
    { name: "Grupo G", time: "09:00 AM", date: "07 / 09 / 2024", quantity: 29 },
  ];
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [manager, setManager] = useState<string>("");
  const users = [
    {
      id: 1,
      name: "Danny Venturas",
      registrationDate: "2024-01-01",
      lastActivity: "2024-10-10",
    },
    {
      id: 2,
      name: "Diego Sebastián",
      registrationDate: "2024-01-02",
      lastActivity: "2024-10-09",
    },
    {
      id: 3,
      name: "Winston Apaza",
      registrationDate: "2024-01-03",
      lastActivity: "2024-10-08",
    },
    {
      id: 4,
      name: "Cristofer Torres",
      registrationDate: "2024-01-04",
      lastActivity: "2024-10-07",
    },
    // Puedes añadir más usuarios aquí
  ];

  const renderView = () => {
    switch (activeView) {
      case "registro":
        return (
          <>
            <h2 className="mb-4">Registro</h2>
            <div className="mb-3">
              <button className="btn btn-success me-2">Nuevo Registro</button>
              <button className="btn btn-success">Añadir usuario</button>
            </div>
            <table className="table table-bordered table-hover">
              <thead className="table-success">
                <tr>
                  <th>Grupos</th>
                  <th>Hora de entrada</th>
                  <th>Fecha</th>
                  <th>Cantidad de Us</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group, index) => (
                  <tr key={index}>
                    <td>{group.name}</td>
                    <td>{group.time}</td>
                    <td>{group.date}</td>
                    <td>{group.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        );
      case "asistencia":
        return (
          <>
            <h2 className="mb-4">Asistencia</h2>
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Escáner QR</h5>
                    <video
                      ref={videoRef}
                      style={{ width: "100%", height: "300px" }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Resultado del QR</h5>
                    <p className="card-text">
                      {qrData ? qrData : "Esperando escaneo..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case "historial":
        return (
          <>
            <h2 className="mb-4">Historial de Usuarios</h2>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por ID de usuario"
                // Aquí puedes agregar un manejador de eventos para realizar la búsqueda
                // onChange={handleSearch}
              />
            </div>
            <table className="table table-bordered table-hover">
              <thead className="table-success">
                <tr>
                  <th>ID de Usuario</th>
                  <th>Nombre</th>
                  <th>Fecha de Registro</th>
                  <th>Última Actividad</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.registrationDate}</td>
                    <td>{user.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        );
      case "reporte":
        return (
          <>
            <h2 className="mb-4">Reporte de Asistencia</h2>
            <div className="mb-3">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="startDate" className="form-label">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="endDate" className="form-label">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <button className="btn btn-primary me-2">Generar Informe</button>
              <button className="btn btn-primary">Exportar Informe</button>
            </div>
          </>
        );
      case "configurar":
        return (
          <>
            <h2 className="mb-4">Configurar</h2>
            <div className="mb-4">
              <label htmlFor="groupSelect" className="form-label">
                Seleccionar Grupo
              </label>
              <select
                id="groupSelect"
                className="form-select"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">Seleccione un grupo</option>
                <option value="Grupo A">Grupo A</option>
                <option value="Grupo B">Grupo B</option>
                <option value="Grupo C">Grupo C</option>
                <option value="Grupo D">Grupo D</option>
                <option value="Grupo E">Grupo E</option>
                <option value="Grupo F">Grupo F</option>
                <option value="Grupo G">Grupo G</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="capacity" className="form-label">
                Capacidad
              </label>
              <input
                type="number"
                className="form-control"
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                min={0}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="form-label">
                Descripción
              </label>
              <textarea
                className="form-control"
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="manager" className="form-label">
                Añadir Gerente
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="manager"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                />
                <button className="btn btn-success" type="button">
                  Añadir
                </button>
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="startDate" className="form-label">
                Fecha de Inicio
              </label>
              <input type="date" className="form-control" id="startDate" />
            </div>
            <div className="col-md-6">
              <label htmlFor="endDate" className="form-label">
                Fecha de Fin
              </label>
              <input type="date" className="form-control" id="endDate" />
            </div>
            <div className="d-flex justify-content-center my-4">
              <button className="btn btn-primary me-5 btn-lg py-2">
                Cancelar
              </button>
              <button className="btn btn-primary btn-lg py-2">Guardar</button>
            </div>
          </>
        );
      default:
        return <h2>Vista no disponible</h2>;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 bg-primary text-white p-4">
          <div className="bg-secondary rounded p-3 mb-4">
            <div className="text-center mb-3 py-5">
              <img
                src="/assets/admin.png"
                alt="Admin"
                className="rounded-circle"
              />
            </div>
            <h4 className="text-center">ADMINISTRADOR</h4>
            <p className="text-center">Usuario: Diego Gonzales</p>
          </div>
          <div className="d-grid gap-2">
            <button
              className="btn btn-info py-3 mb-2"
              onClick={() => setActiveView("registro")}
            >
              Registros
            </button>
            <button
              className="btn btn-info py-3 mb-2"
              onClick={() => setActiveView("asistencia")}
            >
              Asistencia
            </button>
            <button
              className="btn btn-info py-3 mb-2"
              onClick={() => setActiveView("historial")}
            >
              Historial de usuarios
            </button>
            <button
              className="btn btn-info py-3 mb-2"
              onClick={() => setActiveView("reporte")}
            >
              Reporte de asistencia
            </button>
            <button
              className="btn btn-info py-3 mb-2"
              onClick={() => setActiveView("configurar")}
            >
              Configurar
            </button>
            <button className="btn btn-info py-3 mb-2">Cerrar Sesión</button>
          </div>
        </div>
        <div className="col-md-9 p-4">{renderView()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
