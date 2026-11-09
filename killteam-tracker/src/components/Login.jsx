import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth/useAuth";
import ThemeToggle from "../theme/ThemeToggle";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);
        try {
            await login({ email, password });
            navigate(location.state?.from?.pathname || "/", { replace: true });
        } catch (requestError) {
            setError(requestError.message || "No se pudo iniciar sesión.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card">
        <div className="auth-theme-toggle"><ThemeToggle /></div>
                <h1>Iniciar sesión</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="login-email">Correo</label>
                    <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label htmlFor="login-password">Contraseña</label>
                    <input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    {error && <p className="form-error" role="alert">{error}</p>}
                    <button type="submit" disabled={saving}>
                        {saving ? "Ingresando…" : "Ingresar"}
                    </button>
                </form>
                <p>¿No tienes cuenta? <Link to="/register">Registrate</Link></p>
            </section>
        </main>
    );
};

export default Login;
