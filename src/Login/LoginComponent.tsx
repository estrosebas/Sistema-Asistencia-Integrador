import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <div className="login-container">
      <div className="login-half login-left text-white d-flex flex-column">
        <div className="login-top d-flex align-items-center justify-content-center">
          <h1>Sistema de Asistencia</h1>
        </div>
        <div className="login-bottom d-flex align-items-center justify-content-center">
          <img
            src="src/assets/image.png"
            alt="Ilustración"
            className="login-image"
          />
        </div>
      </div>
      <div className="login-half d-flex align-items-center justify-content-center">
        <div className="login-form">
          <h3>Ingrese sus datos</h3>
          <form>
            <div className="form-group mb-3">
              <label htmlFor="email">Correo</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Ingrese su correo"
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Ingrese su contraseña"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Iniciar Sesión
            </button>
            <Link to="/register" className="btn btn-primary w-100 ">
              Crear cuenta nueva
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
