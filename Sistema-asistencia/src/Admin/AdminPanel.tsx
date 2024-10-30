import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./AdminPanel.css";
import Registro from "./componentes/Registro";
import Asistencia from "./componentes/Asistencia";
import Historial from "./componentes/Historial";
import Reporte from "./componentes/Reporte";
import Configurar from "./componentes/Configurar";

const AdminPanel: React.FC = () => {
  const [vistaActiva, setVistaActiva] = useState("registro");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);

  const toggleMenu = () => setMenuAbierto(prevState => !prevState);
  const toggleModoOscuro = () => setModoOscuro(prevState => !prevState);

  const seleccionarVista = (id: string) => {
    setVistaActiva(id);
    if (window.innerWidth <= 768) setMenuAbierto(false); // Cierra el menú en pantallas pequeñas
  };


  const opcionesMenu = [
    { id: "registro", icon: "fa-file-alt", label: "Registros", action: () => seleccionarVista("registro") },
    { id: "asistencia", icon: "fa-check-circle", label: "Asistencia", action: () => seleccionarVista("asistencia") },
    { id: "historial", icon: "fa-clock", label: "Historial de usuarios", action: () => seleccionarVista("historial") },
    { id: "reporte", icon: "fa-chart-bar", label: "Reporte de asistencia", action: () => seleccionarVista("reporte") },
    { id: "configurar", icon: "fa-cog", label: "Configurar", action: () => seleccionarVista("configurar") },
  ];

  return (
    <div id="admin-panel">
      <div className={`container-fluid-1 ${modoOscuro ? "modo-oscuro" : ""}`}>
        <div className={`panel-lateral ${menuAbierto ? "show" : "collapsed"}`}>
          <div className="menu-navegacion">
            <div className="nav-item">
              <button className="toggler" onClick={toggleMenu}>
                <span className="icono fa-solid fa-bars-staggered"></span>  
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
          {vistaActiva === "registro" ? (
            <Registro onNuevoRegistro={() => console.log("Nuevo registro")} />
          ) : vistaActiva === "asistencia" ? (
            <Asistencia />
          ) : vistaActiva === "historial" ? (
            <Historial />
          ) : vistaActiva === "reporte" ? (
            <Reporte />
          ) : (
            <Configurar />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
