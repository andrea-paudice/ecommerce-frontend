import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/public/user/login", credentials);

      // ✅ Il backend ritorna un oggetto AuthResponse (username, role, token)
      const userData = {
        username: response.data.username,
        role: response.data.role,
        token: response.data.token,
      };

      // Salva nel contesto e nel localStorage
      login(userData);

      // ✅ Imposta il token come header predefinito per tutte le richieste future
      axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;

      // ✅ Redirect in base al ruolo
      if (userData.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Errore di login:", err);
      setError("Credenziali errate o utente non registrato.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button">
          Accedi
        </button>
      </form>
    </div>
  );
};

export default Login;
