// UserPanel.tsx
import React, { useState } from "react";
import Historial from "./components/Historial"; // Asegúrate de que la ruta sea correcta
import GenerarQR from "./components/GenerarQR"; // Asegúrate de que la ruta sea correcta
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./UserPanel.css";

const UserPanel: React.FC = () => {
  const [vistaActiva, setVistaActiva] = useState<string>("historial");
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [modoOscuro, setModoOscuro] = useState<boolean>(false);

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
            <Historial />
          ) : vistaActiva === "codigoQR" ? (
            <GenerarQR />
          ) : (
            <h2>Vista no disponible</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPanel;