import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiJson } from "../../api/client";

export default function HistoryModule() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { apiJson("/matches").then(setMatches).catch((err) => setError(err.message)); }, []);
  if (error) return <p role="alert">{error}</p>;
  return <main><span className="eyebrow">Registros</span><h2 className="page-title">Historial de partidas</h2>
    <p className="muted">Tus combates recientes y sus estados.</p>
    {matches.length === 0 ? <section className="section-card empty-state"><span className="action-icon" aria-hidden="true">▤</span><h3>Aún no hay partidas</h3><p className="muted">Cuando registres un combate, aparecerá aquí.</p><button className="primary-button" type="button" onClick={() => navigate("/addMatch")}>Crear una partida</button></section> : <ul className="match-grid">{matches.map((match) => <li className="match-card" key={match.id}>
      <div className="match-card-top"><span className={`status-pill ${match.isFinished ? "status-finished" : "status-active"}`}>{match.isFinished ? "FINALIZADA" : "EN CURSO"}</span><small className="muted">{new Date(match.date).toLocaleDateString()}</small></div>
      <h3>{match.name}</h3><p className="match-versus">{match.game_teams?.map((team) => team.team?.name ?? `Equipo ${team.teamId}`).join(" vs ")}</p><p>{new Date(match.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{match.userId ? ` · Usuario ${match.userId}` : ""}</p>
      <button className="primary-button history-action" type="button" onClick={() => navigate(`/matches/${match.id}`)}>{match.isFinished ? "Ver partida" : "Abrir partida"}<span aria-hidden="true">→</span></button>
    </li>)}</ul>}
  </main>;
}
