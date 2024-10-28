import "bootstrap/dist/css/bootstrap.min.css";
import "./Registration.css"; // Asegúrate de tener este archivo CSS
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Registration = () => {
  const [nombres, setNombres] = useState("");
  const [correo, setCorreo] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [genero, setGenero] = useState("");
  const [rol, setRol] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Resetear el error

    // Modificando el objeto registrationData para que coincida con la estructura requerida
    const registrationData = {
      nombre: nombres,
      ape_paterno: apellidos.split(" ")[0], // Suponiendo que el apellido paterno es el primer apellido
      ape_materno: apellidos.split(" ")[1] || "", // Si no hay segundo apellido, asignamos vacío
      dni: Number(dni), // Convertir a número
      domicilio,
      email: correo,
      fech_nacimiento: new Date(fechaNacimiento).toISOString(), // Convertir a formato ISO
      genero,
      telefono: Number(telefono), // Convertir a número
      password: contrasena,
      rol: rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase(), // Asegurarse que el rol inicie con mayúscula
    };

    try {
      const response = await fetch(`http://localhost:3000/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Mensaje de éxito
        navigate("/login"); // Redirigir a la página de inicio de sesión
      } else {
        const errorData = await response.json();
        setError(errorData.message); // Mostrar mensaje de error del backend
      }
    } catch (error) {
      setError("Error en el registro. Inténtalo de nuevo.");
      console.error(error);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-half">
        <div className="registration-form">
          <h3>Ingrese sus datos</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nombres">Nombres</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombres"
                  placeholder="Ingrese sus nombres"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="correo">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  placeholder="Ingrese su correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
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
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="contrasena">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="contrasena"
                  placeholder="Ingrese su contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
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
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefono"
                  placeholder="Ingrese su teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
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
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="domicilio">Domicilio</label>
                <input
                  type="text"
                  className="form-control"
                  id="domicilio"
                  placeholder="Ingrese su domicilio"
                  value={domicilio}
                  onChange={(e) => setDomicilio(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="genero">Género</label>
                <select
                  className="form-control"
                  id="genero"
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="rol">Rol</label>
                <select
                  className="form-control"
                  id="rol"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="usuario">Usuario</option>{" "}
                  <option value="gerente">Gerente</option>{" "}
                  <option value="administrador">Administrador</option>{" "}
                  {/* Asegúrate que este rol existe en la base de datos */}
                </select>
              </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">
              Registrarse
            </button>
            <Link to="/login" className="btn btn-secondary w-100 mt-3">
              Ya tengo cuenta
            </Link>
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
