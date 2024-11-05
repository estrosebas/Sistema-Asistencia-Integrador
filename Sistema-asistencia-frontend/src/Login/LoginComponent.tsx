import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Resetear el error

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Aquí puedes manejar el mensaje de la respuesta
        console.log(data.nomRol);
        // Redirigir a diferentes páginas según el rol
        if (data.nomRol === "Administrador") {
          navigate("/admin"); // Ruta para administradores
        } else if (data.nomRol === "Usuario") {
          navigate("/user"); // Ruta para usuarios regulares
        } else if (data.nomRol === "Gerente") {
          navigate("/manager"); // ruta gerente
        } else {
          navigate("/"); // Ruta por defecto si no coincide con los roles anteriores
        }
      } else {
        const errorData = await response.json(); // Ahora esperamos un JSON
        setError(errorData.message); // Mostrar mensaje de error del backend
      }
    } catch (error) {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-half login-left text-white d-flex flex-column">
        <div className="login-top d-flex align-items-center justify-content-center">
          <h1>Sistema de Asistencia</h1>
        </div>
        <div className="login-bottom d-flex align-items-center justify-content-center">
          <img
            src="/assets/image.png"
            alt="Ilustración"
            className="login-image"
          />
        </div>
      </div>
      <div className="login-half d-flex align-items-center justify-content-center">
        <div className="login-form">
          <h3>Ingrese sus datos</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email">Correo</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Iniciar Sesión
            </button>
            <Link to="/register" className="btn btn-success w-100 ">
              Crear cuenta nueva
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
