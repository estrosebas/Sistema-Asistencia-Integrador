import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Estrellas from "../../public/efectos/estrellas";

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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`, // Usando la variable de entorno
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
          credentials: "include",
        }
      );

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
      <div className="login-left">
        <div className="login-bottom d-flex align-items-center justify-content-center">
          <img
            src="/assets/login-image.png"
            alt="Ilustración"
            className="login-image"
          />
        </div>
      </div>

      <div className="login-rigth">
        <div className="login-top">
          <h1>Sistema de Asistencia</h1>
        </div>
        <div className="login-form">
          <h3>Ingrese sus datos</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4 my-4">
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
            <div className="form-group mb-4">
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

            <div className="cta-buttons py-3 d-flex row justify-content-center align-items-center gap-2">
              <button type="submit" className="btn btn-primary w-50 mb-3">
                Iniciar Sesión
              </button>
              <Link to="/register" className="btn btn-success w-50">
                Crear cuenta nueva
              </Link>
            </div>

            <Estrellas />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
