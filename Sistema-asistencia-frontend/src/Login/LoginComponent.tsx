import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Estrellas from "../../public/efectos/estrellas";

/**
 * Login Component
 *
 * This component represents the login page of the application.
 * It includes a form for users to enter their email and password,
 * and handles the login process by sending a request to the backend.
 */
const Login = () => {
  /**
   * State to manage the email input.
   * @type {string}
   */
  const [email, setEmail] = useState("");

  /**
   * State to manage the password input.
   * @type {string}
   */
  const [password, setPassword] = useState("");

  /**
   * State to manage the error message.
   * @type {string}
   */
  const [error, setError] = useState("");

  /**
   * Navigate function from react-router-dom.
   */
  const navigate = useNavigate();

  /**
   * Function to handle form submission.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset the error message

    /**
     * Login data object.
     * @type {{email: string, password: string}}
     */
    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`, // Using the environment variable
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
        console.log(data.message); // Handle the response message here
        console.log(data.nomRol);

        // Save user data in localStorage
        localStorage.setItem("userData", JSON.stringify(data));

        // Redirect to different pages based on the user role
        if (data.nomRol === "Administrador") {
          navigate("/admin"); // Route for administrators
        } else if (data.nomRol === "Usuario") {
          navigate("/user"); // Route for regular users
        } else if (data.nomRol === "Gerente") {
          navigate("/manager"); // Route for managers
        } else {
          navigate("/"); // Default route if the role does not match
        }
      } else {
        const errorData = await response.json(); // Now we expect a JSON
        setError(errorData.message); // Display error message from the backend
      }
    } catch (error) {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
      console.error(error);
    }
  };

  /**
   * Render the Login component.
   */
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
