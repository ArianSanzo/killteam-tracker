import { useState } from "react";
import { Link, useNavigate } from "react-router";
import ThemeToggle from "../../theme/ThemeToggle";

const AddUser = ({ onUserAdded }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onUserAdded(form);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "No se pudo crear la cuenta.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-theme-toggle"><ThemeToggle /></div>
        <h1>Crear cuenta</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="register-name">Nombre</label>
          <input
            id="register-name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="register-email">Correo</label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="register-password">Contraseña</label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" disabled={saving}>
            {saving ? "Creando cuenta…" : "Registrarme"}
          </button>
        </form>
        <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </section>
    </main>
  );
};

export default AddUser;

