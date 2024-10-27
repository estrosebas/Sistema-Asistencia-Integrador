import "./Home.css";
import { Link } from "react-router-dom";

// Define los tipos de las propiedades que recibirá FeatureCard
interface FeatureCardProps {
  title: string;
  description: string;
}

const Home = () => {
  return (
    <div className="container-fluid ">
      <div className="row hero-section align-items-center">
        <div className="col-12 col-md-8 offset-md-2 text-center hero-content">
          <h1>Bienvenido al Sistema de Asistencia</h1>
          <p>
            Gestiona fácilmente la asistencia de tus empleados o estudiantes con
            nuestro sistema intuitivo y fácil de usar.
          </p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary mx-2">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-secondary mx-2">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </div>

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

      <footer className="footer text-center py-3">
        <p>&copy; 2024 Sistema de Asistencia. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

// Asegúrate de especificar los tipos de las propiedades en FeatureCard
const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="col-12 col-md-4 my-3">
      <div className="card h-100">
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <p className="card-text">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
