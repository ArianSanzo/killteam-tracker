import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { apiJson } from "../../api/client";
import { useAuth } from "../../auth/useAuth";

const pointFields = ["critOp", "tacOp", "killOp"];

export default function MatchDetailModule() {
  const { matchId } = useParams();
  const { user } = useAuth();
  const [match, setMatch] = useState(null);
  const [turningPoint, setTurningPoint] = useState(1);
  const [scores, setScores] = useState({});
  const [woundDrafts, setWoundDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await apiJson(`/matches/${matchId}`);
      setMatch(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => { load(); }, [load]);

  const saveScore = async (gameTeamId) => {
    const values = scores[gameTeamId] ?? {};
    try {
      await apiJson(`/matches/${matchId}/game-teams/${gameTeamId}/turning-points/${turningPoint}`, {
        method: "PUT",
        body: JSON.stringify(Object.fromEntries(pointFields.map((key) => [key, Number(values[key] || 0)]))),
      });
      setMessage("Puntaje guardado y copiado al siguiente turning point.");
      await load();
    } catch (err) { setError(err.message); }
  };

  const updateWounds = async (gameTeamId, operativeId, wounds) => {
    try {
      await apiJson(`/matches/${matchId}/game-teams/${gameTeamId}/operatives/${operativeId}/wounds`, {
        method: "PATCH", body: JSON.stringify({ wounds: Number(wounds) }),
      });
      setMatch((current) => ({ ...current, game_teams: current.game_teams.map((team) => team.id !== gameTeamId ? team : {
        ...team, game_operatives: team.game_operatives.map((operative) => operative.id === operativeId ? { ...operative, wounds: Number(wounds) } : operative),
      }) }));
      setMessage("Heridas actualizadas.");
    } catch (err) { setError(err.message); }
  };

  const finish = async () => {
    try {
      await apiJson(`/matches/${matchId}/finished`, { method: "PATCH", body: JSON.stringify({ isFinished: true }) });
      setMessage("Partida finalizada.");
      await load();
    } catch (err) { setError(err.message); }
  };

  if (loading) return <p role="status">Cargando partida…</p>;
  if (error && !match) return <section><p role="alert">{error}</p><Link to="/">Volver</Link></section>;
  if (!match) return null;

  const canEdit = !match.isFinished || ["admin", "superadmin"].includes(user?.roleKey);
  const getPoint = (team, tp) => (team.turning_points ?? team.points_tables ?? team.points ?? []).find((point) => Number(point.turningPoint) === tp) ?? {};
  return <main>
    <Link to="/">← Inicio</Link><h2>{match.name}</h2><p>{new Date(match.date).toLocaleString()}</p>
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    <label>Turning point <select value={turningPoint} onChange={(e) => setTurningPoint(Number(e.target.value))}>{[1,2,3,4].map((tp) => <option key={tp}>{tp}</option>)}</select></label>
    <div className="grid gap-4 md:grid-cols-2">{(match.game_teams ?? []).map((team) => {
      const point = getPoint(team, turningPoint);
      return <section className="rounded border p-4" key={team.id}>
        <h3>{team.team?.name ?? `Equipo ${team.teamId}`}</h3>
        <p>Puntaje TP {turningPoint}: {point.critOp ?? 0} críticos · {point.tacOp ?? 0} tácticos · {point.killOp ?? 0} bajas</p>
        {canEdit && <><div className="flex flex-wrap gap-2">{pointFields.map((field) => <label key={field}>{field}<input className="w-20 border p-1" type="number" min="0" value={scores[team.id]?.[field] ?? point[field] ?? 0} onChange={(e) => setScores((old) => ({ ...old, [team.id]: { ...(old[team.id] ?? {}), [field]: e.target.value } }))}/></label>)}</div><button className="my-2 rounded bg-green-200 px-3 py-1" onClick={() => saveScore(team.id)}>Guardar puntaje</button></>}
        {(team.game_operatives ?? []).map((operative) => <article className="my-3 rounded bg-slate-50 p-3" key={operative.id}>
          <strong>{operative.operative?.name} #{operative.number}</strong><p>Arma: {operative.weapon?.name}</p>
          <label>Heridas <input className="ml-2 w-20 border p-1" type="number" min="0" max={Number(operative.operative?.wounds ?? operative.wounds)} value={woundDrafts[operative.id] ?? operative.wounds} disabled={!canEdit} onChange={(e) => setWoundDrafts((drafts) => ({ ...drafts, [operative.id]: e.target.value }))} onBlur={(e) => { if (String(e.target.value) !== String(operative.wounds)) updateWounds(team.id, operative.id, e.target.value); }}/> / {operative.operative?.wounds}</label>
        </article>)}
      </section>;
    })}</div>
    {!match.isFinished && <button className="mt-4 rounded bg-red-200 px-4 py-2" onClick={finish}>Finalizar partida</button>}
  </main>;
}
