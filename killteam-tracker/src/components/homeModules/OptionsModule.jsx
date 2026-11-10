import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/useAuth";
import { apiJson } from "../../api/client";

const OptionsModule = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState("");
    useEffect(() => { apiJson("/matches").then(setMatches).catch((err) => setError(err.message)); }, []);
    const canAdmin = ["admin", "superadmin"].includes(user.roleKey);
    const ownActive = matches.find((match) => Number(match.userId) === Number(user.id) && !match.isFinished);
    return (
        <main className="dashboard-page">
            <section className="dashboard-hero">
                <span className="eyebrow">Centro de mando · {user.role}</span>
                <h1>Hola, {user.name?.split(" ")[0] ?? "jugador"}.</h1>
                <p>Prepara tu escuadra, sigue el combate y consulta tus registros desde un solo lugar.</p>
            </section>

            {error && <p role="alert">{error}</p>}

            <div className="action-grid" aria-label="Acciones">
                <button className="action-card" type="button" onClick={() => navigate("/addMatch")}><span className="action-icon" aria-hidden="true">＋</span><strong>Nueva partida</strong><span>Elige dos equipos y sus operativos.</span></button>
                {ownActive ? <button className="action-card" type="button" onClick={() => navigate(`/matches/${ownActive.id}`)}><span className="action-icon" aria-hidden="true">▶</span><strong>Continuar partida</strong><span>{ownActive.name}</span></button> : <button className="action-card" type="button" onClick={() => navigate("/history")}><span className="action-icon" aria-hidden="true">◎</span><strong>Partidas recientes</strong><span>Vuelve a consultar tus registros.</span></button>}
                <button className="action-card" type="button" onClick={() => navigate("/history")}><span className="action-icon" aria-hidden="true">▤</span><strong>Historial</strong><span>Revisa partidas anteriores y resultados.</span></button>
                {canAdmin && <button className="action-card" type="button" onClick={() => navigate("/admin/catalogs")}><span className="action-icon" aria-hidden="true">⚙</span><strong>Catálogos</strong><span>Gestiona equipos, operativos y reglas.</span></button>}
                {user.roleKey === "superadmin" && <button className="action-card" type="button" onClick={() => navigate("/admin/users")}><span className="action-icon" aria-hidden="true">♙</span><strong>Usuarios</strong><span>Administra cuentas y permisos.</span></button>}
            </div>

            <section aria-labelledby="active-matches-title">
                <div className="section-heading"><h2 id="active-matches-title">Partida en curso</h2>{ownActive && <span className="status-pill status-active">EN CURSO</span>}</div>
                {ownActive ? <article className="match-card"><h3>{ownActive.name}</h3><p>{new Date(ownActive.date).toLocaleString()}</p><button onClick={() => navigate(`/matches/${ownActive.id}`)}>Volver al combate <span aria-hidden="true">→</span></button></article> : <p className="muted">No tienes partidas activas. Puedes crear una nueva cuando quieras.</p>}
            </section>
        </main>
    );

};

export default OptionsModule;
