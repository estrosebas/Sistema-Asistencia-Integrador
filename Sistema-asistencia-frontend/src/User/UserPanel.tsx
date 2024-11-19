// UserPanel.tsx
import React, { useState, useEffect } from "react";
import Historial from "./components/Historial"; // Asegúrate de que la ruta sea correcta
import GenerarQR from "./components/GenerarQR"; // Asegúrate de que la ruta sea correcta
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./UserPanel.css";

// Definir la URL base de la API desde la variable de entorno
const API_URL = import.meta.env.VITE_API_URL;

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
    {
      id: "historial",
      icon: "fa-clock",
      label: "Historial",
      action: () => seleccionarVista("historial"),
    },
    {
      id: "codigoQR",
      icon: "fa-qrcode",
      label: "Código QR",
      action: () => seleccionarVista("codigoQR"),
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

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Estado de autenticación
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

  if (!isAuthenticated) {
    return <div>Redirigiendo...</div>; // Muestra algo mientras se verifica el estado
  }

  return (
    <div id="user-panel">
      <div className="container-fluid">
        <div
          className={`panel-lateral ${menuAbierto ? "show" : "collapsed"} ${
            modoOscuro ? "modo-oscuro" : ""
          }`}
        >
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
