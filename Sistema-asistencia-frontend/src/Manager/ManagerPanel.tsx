import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./ManagerPanel.css";
import Asistencia from "./componentes/Asistencia";
import Historial from "./componentes/Historial";
import Reporte from "./componentes/Reporte";
import Registro from "./componentes/Registro"; // Importar el componente Registro
import { useNavigate } from "react-router-dom";

const ManagerPanel: React.FC = () => {
  // Estados para manejar la vista activa, el menú abierto y el modo oscuro
  const [vistaActiva, setVistaActiva] = useState("registro"); // Cambiar el estado inicial a "registro"
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);

  // Función para alternar el estado del menú
  const toggleMenu = () => setMenuAbierto((prevState) => !prevState);

  // Función para alternar el modo oscuro
  const toggleModoOscuro = () => setModoOscuro((prevState) => !prevState);

  // URL de la API
  const API_URL = import.meta.env.VITE_API_URL;

  // Función para seleccionar la vista activa
  const seleccionarVista = (id: string) => {
    setVistaActiva(id);
    if (window.innerWidth <= 768) setMenuAbierto(false); // Cierra el menú en pantallas pequeñas
  };

  // Opciones del menú
  const opcionesMenu = [
    {
      id: "registro",
      icon: "fa-list-alt",
      label: "Registro",
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

  // Función para manejar el cierre de sesión
  const navigate = useNavigate();
  const cerrarSesion = async () => {
    try {
      // Llamada al backend para cerrar sesión
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Asegúrate de que la cookie se incluya en la solicitud
      });

      if (response.ok) {
        // Redirigir al usuario a la página de inicio o hacer otras acciones
        console.log("Sesión cerrada correctamente");
        navigate("/");
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error en la solicitud de cierre de sesión", error);
    }
  };

  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Efecto para verificar la autenticación al montar el componente
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/check-session`, {
          method: "GET",
          credentials: "include", // Esto asegura que la cookie sea enviada
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

  // Si no está autenticado, muestra un mensaje de redirección
  if (!isAuthenticated) {
    return <div>Redirigiendo...</div>; // Muestra algo mientras se verifica el estado
  }

  return (
    <div id="manager-panel">
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

export default ManagerPanel;
