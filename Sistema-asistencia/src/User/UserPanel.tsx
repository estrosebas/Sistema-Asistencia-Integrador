import React, { useState } from "react";
import QRCode from "qrcode-generator";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserPanel.css";
const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState("historial");
  const [qrCodeData, setQrCodeData] = useState<string>(""); // Almacenar el dato para generar el QR
  const generateQrCode = (data: string) => {
    const qr = QRCode(0, "L");
    qr.addData(data);
    qr.make();
    return qr.createImgTag(4); // Generar el QR como imagen
  };
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
      case "codigo-qr":
        return (
          <>
            <h2 className="mb-4">Código QR</h2>
            <div>
              <h3>Generar Código QR</h3>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Ingrese texto para generar QR"
                onChange={(e) => setQrCodeData(e.target.value)} // Almacena el valor
              />
              <button
                className="btn btn-primary"
                onClick={() => setQrCodeData(qrCodeData)}
              >
                Generar QR
              </button>
              <div
                className="mt-3"
                dangerouslySetInnerHTML={{
                  __html: qrCodeData ? generateQrCode(qrCodeData) : "",
                }} // Renderiza el QR generado
              ></div>
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
              onClick={() => setActiveView("historial")}
            >
              Historial
            </button>
            <button
              className="btn btn-info py-3 mb-2"
              onClick={() => setActiveView("codigo-qr")}
            >
              Codigo QR
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
