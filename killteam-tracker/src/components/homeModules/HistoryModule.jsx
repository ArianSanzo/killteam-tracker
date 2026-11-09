import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiJson } from "../../api/client";

export default function HistoryModule() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { apiJson("/matches").then(setMatches).catch((err) => setError(err.message)); }, []);
  if (error) return <p role="alert">{error}</p>;
  return <main><Link to="/">← Inicio</Link><h2>Historial de partidas</h2>
    {matches.length === 0 ? <p>Aún no hay partidas.</p> : <ul className="grid gap-3 md:grid-cols-2">{matches.map((match) => <li className="rounded border p-4" key={match.id}>
      <h3>{match.name}</h3><p>{new Date(match.date).toLocaleString()}</p><p>{match.game_teams?.map((team) => team.team?.name ?? `Equipo ${team.teamId}`).join(" vs ")}</p><p>{match.isFinished ? "Finalizada" : "En curso"}{match.userId ? ` · Usuario ${match.userId}` : ""}</p>
      <Link className="underline" to={`/matches/${match.id}`}>{match.isFinished ? "Ver partida" : "Abrir partida"}</Link>
    </li>)}</ul>}
  </main>;
}