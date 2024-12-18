import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./AdminPanel.css";
import Registro from "./componentes/Registro";
import Asistencia from "./componentes/Asistencia";
import Historial from "./componentes/Historial";
import Reporte from "./componentes/Reporte";
import { useNavigate } from "react-router-dom";

/**
 * Componente principal del panel de administración.
 * @returns {JSX.Element} El componente AdminPanel.
 */
const AdminPanel: React.FC = () => {
  /**
   * Estado que controla la vista activa en el panel.
   */
  const [vistaActiva, setVistaActiva] = useState("registro");

  /**
   * Estado que controla si el menú lateral está abierto o cerrado.
   */
  const [menuAbierto, setMenuAbierto] = useState(false);

  /**
   * Estado que controla el modo oscuro.
   */
  const [modoOscuro, setModoOscuro] = useState(false);

  /**
   * URL de la API obtenida desde las variables de entorno.
   */
  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * Función para alternar el estado del menú lateral.
   */
  const toggleMenu = () => setMenuAbierto((prevState) => !prevState);

  /**
   * Función para alternar el modo oscuro.
   */
  const toggleModoOscuro = () => setModoOscuro((prevState) => !prevState);

  /**
   * Función para seleccionar la vista activa.
   * @param {string} id - El identificador de la vista a seleccionar.
   */
  const seleccionarVista = (id: string) => {
    setVistaActiva(id);
    if (window.innerWidth <= 768) setMenuAbierto(false); // Cierra el menú en pantallas pequeñas
  };

  /**
   * Opciones del menú de navegación.
   */
  const opcionesMenu = [
    {
      id: "registro",
      icon: "fa-list-alt",
      label: "Registros",
      action: () => seleccionarVista("registro"),
    },
    {
      id: "asistencia",
      icon: "fa-check-circle",
      label: "Asistencia",
      action: () => seleccionarVista("asistencia"),
    },
    {
      id: "historial",
      icon: "fa-clock",
      label: "Historial de usuarios",
      action: () => seleccionarVista("historial"),
    },
    {
      id: "reporte",
      icon: "fa-chart-bar",
      label: "Reporte de asistencia",
      action: () => seleccionarVista("reporte"),
    },
  ];

  /**
   * Hook para la navegación.
   */
  const navigate = useNavigate();

  /**
   * Función para cerrar la sesión del usuario.
   */
  const cerrarSesion = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Sesión cerrada correctamente");
        navigate("/");
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error en la solicitud de cierre de sesión", error);
    }
  };

  /**
   * Estado que controla si el usuario está autenticado.
   */
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  /**
   * Efecto para verificar la autenticación del usuario al montar el componente.
   */
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/check-session`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    checkAuthentication();
  }, [navigate]);

  /**
   * Si el usuario no está autenticado, redirige a la página de inicio de sesión.
   */
  if (!isAuthenticated) {
    return <div>Redirigiendo...</div>;
  }

  /**
   * Renderiza el componente AdminPanel.
   */
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
              <button className="link-text" onClick={cerrarSesion}>
                <span className="icono fas fa-sign-out-alt"></span>
                {menuAbierto && (
                  <span className="link-text">Cerrar Sesión</span>
                )}
              </button>
            </div>
          </div>
          {menuAbierto && (
            <div className="nav-item" style={{ marginTop: "auto" }}>
              <button className="link-text" onClick={toggleModoOscuro}>
                <span className="icono fas fa-moon"></span>
                {menuAbierto && (
                  <span className="link-text">
                    {modoOscuro ? "Modo Claro" : "Modo Oscuro"}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        <div
          className={`contenido-principal ${
            menuAbierto ? "expanded" : "collapsed"
          }`}
        >
          {vistaActiva === "registro" ? (
            <Registro />
          ) : vistaActiva === "asistencia" ? (
            <Asistencia />
          ) : vistaActiva === "historial" ? (
            <Historial />
          ) : vistaActiva === "reporte" ? (
            <Reporte />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
