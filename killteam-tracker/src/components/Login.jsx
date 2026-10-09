import { useState } from "react";
//import "./App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMensaje("");

    if (!email.trim() || !password) {
      setError("Completá todos los campos.");
      return;
    }

    if (!email.includes("@")) {
      setError("Ingresá un correo electrónico válido.");
      return;
    }

   
    setMensaje(
      "Formulario validado. Falta conectar el sistema de autenticación."
    );
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <header className="login-header">
          <div className="emblem">KT</div>

          <p className="eyebrow">SISTEMA DE IDENTIFICACIÓN</p>

          <h1>KILL TEAM</h1>

          <p className="subtitle">
            CENTRO DE OPERACIONES
          </p>
        </header>

        <div className="separator">
          <span />
          <p>ACCESO DE OPERADOR</p>
          <span />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              CORREO ELECTRÓNICO
            </label>

            <input
              id="email"
              type="email"
              placeholder="operador@ejemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              CONTRASEÑA
            </label>

            <div className="password-container">
              <input
                id="password"
                type={mostrarPassword ? "text" : "password"}
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />

              <button
                className="toggle-password"
                type="button"
                onClick={() =>
                  setMostrarPassword(!mostrarPassword)
                }
                aria-label={
                  mostrarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarPassword ? "OCULTAR" : "VER"}
              </button>
            </div>
          </div>

          {error && (
            <p className="feedback error" role="alert">
              {error}
            </p>
          )}

          {mensaje && (
            <p className="feedback success" role="status">
              {mensaje}
            </p>
          )}

          <button className="login-button" type="submit">
            INICIAR SESIÓN
          </button>
        </form>

        <div className="login-footer">
          <p>¿Nuevo en la zona de combate?</p>
          <button
            className="register-button"
            type="button"
            onClick={() =>
              setMensaje(
                "El registro de usuarios todavía no está implementado."
              )
            }
          >
            SOLICITAR REGISTRO
          </button>
        </div>

        <p className="classified">
          ARCHIVO CLASIFICADO // ACCESO RESTRINGIDO
        </p>
      </section>
    </main>
  );
}

export default Login;