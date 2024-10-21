import "bootstrap/dist/css/bootstrap.min.css";
import "./Registration.css"; // You'll need to create this CSS file

const Registration = () => {
  return (
    <div className="registration-container">
      <div className="registration-half">
        <div className="registration-form">
          <h3>Ingrese sus datos</h3>
          <form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nombres">Nombres</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombres"
                  placeholder="Ingrese sus nombres"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="correo">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  placeholder="Ingrese su correo"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="apellidos">Apellidos</label>
                <input
                  type="text"
                  className="form-control"
                  id="apellidos"
                  placeholder="Ingrese sus apellidos"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="contrasena">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="contrasena"
                  placeholder="Ingrese su contraseña"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="dni">DNI</label>
                <input
                  type="text"
                  className="form-control"
                  id="dni"
                  placeholder="Ingrese su DNI"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefono"
                  placeholder="Ingrese su teléfono"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="fechaNacimiento">Fecha Nacimiento</label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaNacimiento"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="domicilio">Domicilio</label>
                <input
                  type="text"
                  className="form-control"
                  id="domicilio"
                  placeholder="Ingrese su domicilio"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="genero">Género</label>
                <select className="form-control" id="genero">
                  <option value="">Seleccione</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="rol">Rol</label>
                <select className="form-control" id="rol">
                  <option value="">Seleccione</option>
                  <option value="estudiante">Estudiante</option>
                  <option value="profesor">Profesor</option>
                  <option value="administrativo">Administrativo</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Registrarse
            </button>
          </form>
        </div>
      </div>
      <div className="registration-half bg-primary text-white d-flex flex-column">
        <div className="registration-top d-flex align-items-center justify-content-center">
          <h1>Sistema de Asistencia</h1>
        </div>
        <div className="registration-bottom d-flex align-items-center justify-content-center">
          <img
            src="/assets/calendar.png"
            alt="Ilustración"
            className="registration-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Registration;
