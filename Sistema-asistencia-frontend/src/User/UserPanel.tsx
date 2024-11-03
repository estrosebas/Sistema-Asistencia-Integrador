import React, { useState } from "react";
import QRCode from "qrcode-generator";
import Calendar, { TileClassNameFunc } from "react-calendar"; // Importa el tipo correcto
import 'react-calendar/dist/Calendar.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./UserPanel.css";

const UserPanel: React.FC = () => {
  const [vistaActiva, setVistaActiva] = useState<string>("historial");
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [modoOscuro, setModoOscuro] = useState<boolean>(false);
  const [dni, setDni] = useState<string>("");
  const [qrCodeHtml, setQrCodeHtml] = useState<string>("");

  // Fechas de ejemplo para asistencia e inasistencia
  const fechasAsistencia: string[] = ["2024-11-01", "2024-11-03", "2024-11-07"];
  const fechasInasistencia: string[] = ["2024-11-02", "2024-11-04"];

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const toggleModoOscuro = () => setModoOscuro(!modoOscuro);

  const seleccionarVista = (id: string) => {
    setVistaActiva(id);
    if (window.innerWidth <= 768) setMenuAbierto(false);
  };

  const opcionesMenu = [
    { id: "historial", icon: "fa-clock", label: "Historial", action: () => seleccionarVista("historial") },
    { id: "codigoQR", icon: "fa-qrcode", label: "Código QR", action: () => seleccionarVista("codigoQR") },
  ];

  // Función para generar el código QR
  const generateQrCode = (data: string) => {
    if (!data) {
      alert("Por favor, ingrese un DNI válido.");
      return;
    }
    const qr = QRCode(0, "L");
    qr.addData(data);
    qr.make();
    setQrCodeHtml(qr.createImgTag(8));
  };

  // Función para determinar el estilo de los días en el calendario
  const marcarFechas: TileClassNameFunc = ({ date }) => {
    const fechaFormateada = date.toISOString().split("T")[0];

    if (fechasAsistencia.includes(fechaFormateada)) {
      return "asistencia"; // Clase CSS para días con asistencia
    } else if (fechasInasistencia.includes(fechaFormateada)) {
      return "inasistencia"; // Clase CSS para días con inasistencia
    }
    return null;
  };

  return (
    <div id="user-panel">
      <div className="container-fluid">
        <div className={`panel-lateral ${menuAbierto ? "show" : "collapsed"} ${modoOscuro ? "modo-oscuro" : ""}`}>
          <div className="menu-navegacion">
            <div className="nav-item">
              <button className="toggler" onClick={toggleMenu}>
                <span className="icono fa-solid fa-bars"></span>
                {menuAbierto && <span className="link-text">Menu</span>}
              </button>
            </div>
            {opcionesMenu.map(({ id, icon, label, action }) => (
              <div className="nav-item" key={id}>
                <button
                  className={`link-text ${vistaActiva === id ? "activo" : ""}`}
                  onClick={action}
                >
                  <span className={`icono fas ${icon}`}></span>
                  {menuAbierto && <span className="link-text">{label}</span>}
                </button>
              </div>
            ))}
            <div className="nav-item">
              <button className="link-text" onClick={() => console.log("Cerrar Sesión")}>
                <span className="icono fas fa-sign-out-alt"></span>
                {menuAbierto && <span className="link-text">Cerrar Sesión</span>}
              </button>
            </div>
          </div>
          {menuAbierto && (
            <div className="nav-item" style={{ marginTop: 'auto' }}>
              <button className="link-text" onClick={toggleModoOscuro}>
                <span className="icono fas fa-moon"></span>
                {menuAbierto && <span className="link-text">{modoOscuro ? "Modo Claro" : "Modo Oscuro"}</span>}
              </button>
            </div>
          )}
        </div>

        <div className={`contenido-principal ${menuAbierto ? "expanded" : "collapsed"}`}>
          {vistaActiva === "historial" ? (
            <div>
              <h2>Historial de Asistencia</h2>
              <Calendar
                tileClassName={marcarFechas}
              />
            </div>
          ) : vistaActiva === "codigoQR" ? (
            <div>
              <h2>Generar Código QR</h2>
              <input
                type="text"
                placeholder="Ingrese DNI para generar QR"
                className="form-control mb-3"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => generateQrCode(dni)}
              >
                Generar QR
              </button>
              <div
                className="mt-3 qr-output text-center"
                dangerouslySetInnerHTML={{ __html: qrCodeHtml }}
              ></div>
            </div>
          ) : (
            <h2>Vista no disponible</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPanel;