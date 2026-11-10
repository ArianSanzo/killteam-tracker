import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY = "killteam-tracker-token";

export default function HistoryModule() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`${API_URL}/matches`, {
      headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
    })
      .then((response) => response.json().then((data) => {
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.dispatchEvent(new Event("killteam:unauthorized"));
          }
          throw new Error(data.message || "No se pudo cargar el historial.");
        }
        return data;
      }))
      .then(setMatches)
      .catch((err) => setError(err.message));
  }, []);
  const removeMatch = async (match) => {
    setError("");
    try {
      const response = await fetch(`${API_URL}/matches/${match.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
      });
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          window.dispatchEvent(new Event("killteam:unauthorized"));
        }
        throw new Error(data.message || "No se pudo eliminar la partida.");
      }
      setMatches((current) => current.filter((item) => item.id !== match.id));
    } catch (err) { setError(err.message); }
  };
  return <main><span className="eyebrow">Registros</span><h2 className="page-title">Historial de partidas</h2>
    <p className="muted">Tus combates recientes y sus estados.</p>
    {error && <p role="alert">{error}</p>}
    {matches.length === 0 ? <section className="section-card empty-state"><span className="action-icon" aria-hidden="true">▤</span><h3>Aún no hay partidas</h3><p className="muted">Cuando registres un combate, aparecerá aquí.</p><button className="primary-button" type="button" onClick={() => navigate("/addMatch")}>Crear una partida</button></section> : <ul className="match-grid">{matches.map((match) => <li className="match-card" key={match.id}>
      <div className="match-card-top"><span className={`status-pill ${match.isFinished ? "status-finished" : "status-active"}`}>{match.isFinished ? "FINALIZADA" : "EN CURSO"}</span><small className="muted">{new Date(match.date).toLocaleDateString()}</small></div>
      <h3>{match.name}</h3><p className="match-versus">{match.game_teams?.map((team) => team.team?.name ?? `Equipo ${team.teamId}`).join(" vs ")}</p><p>{new Date(match.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{match.user?.name ? ` · ${match.user.name}` : ""}</p>
      <button className="primary-button history-action" type="button" onClick={() => navigate(`/matches/${match.id}`)}>{match.isFinished ? "Ver partida" : "Abrir partida"}<span aria-hidden="true">→</span></button>
      <button className="button-danger" type="button" onClick={() => removeMatch(match)}>Eliminar partida</button>
    </li>)}</ul>}
  </main>;
}
