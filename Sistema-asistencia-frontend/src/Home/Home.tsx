import { Link } from "react-router-dom";
import "./Homes.css";
import FeatureCard from "./FeatureCard";
import Bubbles from "../../public/efectos/Bubbles";

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <Bubbles /> {/* Componente de burbujas */}
        <div className="hero-content">
          <h1 className="py-4">Bienvenido al Sistema de Asistencia</h1>
          <h5>
            Gestiona fácilmente la asistencia de tus empleados o estudiantes con
            nuestro sistema intuitivo y fácil de usar.
          </h5>

          <div className="cta-buttons py-3">
            <div className="row justify-content-center">
              <div className="col-auto py-3">
                <Link to="/login" className="btn btn-primary mx-2 px-4">
                  Iniciar Sesión
                </Link>
              </div>
              <div className="col-auto py-3">
                <Link to="/register" className="btn btn-secondary mx-2 px-4">
                  Crear Cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="features">
        <div className="features-section text-center py-5">
          <h2>Características del Sistema</h2>
          <div className="row features-grid">
            <FeatureCard
              title="Fácil de Usar"
              description="Interfaz sencilla y amigable para gestionar asistencia en pocos clics."
            />
            <FeatureCard
              title="Reporte de Asistencia"
              description="Genera informes detallados para un seguimiento completo."
            />
            <FeatureCard
              title="Seguro"
              description="Protegemos los datos de todos los usuarios con altos estándares de seguridad."
            />
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Sistema de Asistencia. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
