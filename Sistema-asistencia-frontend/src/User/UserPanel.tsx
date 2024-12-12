import React, { useState, useEffect } from "react";
import GenerarQR from "./components/GenerarQR"; // Asegúrate de que la ruta sea correcta
import Registro from "./components/Registro"; // Importar el componente Registro
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./UserPanel.css";

/**
 * Componente principal del panel de usuario.
 * @returns {JSX.Element} El componente UserPanel.
 */
const UserPanel: React.FC = () => {
  /**
   * Estado que controla la vista activa en el panel.
   */
  const [vistaActiva, setVistaActiva] = useState<string>("registro");

  /**
   * Estado que controla si el menú lateral está abierto o cerrado.
   */
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);

  /**
   * Estado que controla el modo oscuro.
   */
  const [modoOscuro, setModoOscuro] = useState<boolean>(false);

  /**
   * Función para alternar el estado del menú lateral.
   */
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  /**
   * Función para alternar el modo oscuro.
   */
  const toggleModoOscuro = () => setModoOscuro(!modoOscuro);

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
      icon: "fa-list",
      label: "Registro",
      action: () => seleccionarVista("registro"),
    },
    {
      id: "codigoQR",
      icon: "fa-qrcode",
      label: "Código QR",
      action: () => seleccionarVista("codigoQR"),
    },
  ];

  /**
   * Hook para la navegación.
   */
  const navigate = useNavigate();

  /**
   * Función para manejar el cierre de sesión.
   */
  const cerrarSesion = async () => {
    try {
      // Llamada al backend para cerrar sesión
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include", // Asegúrate de que la cookie se incluya en la solicitud
        }
      );

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
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/check-session`,
          {
            method: "GET",
            credentials: "include", // Esto asegura que la cookie sea enviada
          }
        );
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
    return <div>Redirigiendo...</div>; // Muestra algo mientras se verifica el estado
  }

  /**
   * Renderiza el componente UserPanel.
   */
  return (
    <div id="user-panel">
      <div className={`container-fluid-1 ${modoOscuro ? "modo-oscuro" : ""}`}>
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
          {vistaActiva === "registro" ? (
            <Registro />
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
