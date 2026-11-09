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
  return <main className="match-page">
    <Link to="/history">← Historial</Link><div className="match-heading"><div><span className="eyebrow">{match.isFinished ? "Combate finalizado" : "Combate en curso"}</span><h2>{match.name}</h2><p className="muted">{new Date(match.date).toLocaleString()}</p></div>{!match.isFinished && <span className="status-pill status-active">EN CURSO</span>}</div>
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    <label className="tp-picker">Turning point <select value={turningPoint} onChange={(e) => setTurningPoint(Number(e.target.value))}>{[1,2,3,4].map((tp) => <option key={tp}>{tp}</option>)}</select></label>
    <div className="team-grid">{(match.game_teams ?? []).map((team) => {
      const point = getPoint(team, turningPoint);
      return <section className="section-card team-panel" key={team.id}>
        <h3>{team.team?.name ?? `Equipo ${team.teamId}`}</h3>
        <p className="score-summary">TP {turningPoint} <strong>{point.critOp ?? 0}</strong> crit · <strong>{point.tacOp ?? 0}</strong> tac · <strong>{point.killOp ?? 0}</strong> bajas</p>
        {canEdit && <div className="score-editor"><div className="score-fields">{pointFields.map((field, index) => <label key={field}>{["Críticos", "Tácticos", "Bajas"][index]}<input type="number" min="0" value={scores[team.id]?.[field] ?? point[field] ?? 0} onChange={(e) => setScores((old) => ({ ...old, [team.id]: { ...(old[team.id] ?? {}), [field]: e.target.value } }))}/></label>)}</div><button onClick={() => saveScore(team.id)}>Guardar puntaje</button></div>}
        <div className="operative-stack">{(team.game_operatives ?? []).map((operative) => <article className="operative-card" key={operative.id}>
          <div className="operative-heading"><div><strong>{operative.operative?.name} <span className="operative-number">#{operative.number}</span></strong><p className="muted">{operative.weapon?.name}</p></div><span className="wound-count">{woundDrafts[operative.id] ?? operative.wounds}<small> / {operative.operative?.wounds} PV</small></span></div>
          <label className="wound-editor">Heridas actuales <input type="number" min="0" max={Number(operative.operative?.wounds ?? operative.wounds)} value={woundDrafts[operative.id] ?? operative.wounds} disabled={!canEdit} onChange={(e) => setWoundDrafts((drafts) => ({ ...drafts, [operative.id]: e.target.value }))} onBlur={(e) => { if (String(e.target.value) !== String(operative.wounds)) updateWounds(team.id, operative.id, e.target.value); }}/></label>
        </article>)}</div>
      </section>;
    })}</div>
    {!match.isFinished && <button className="button-danger finish-button" onClick={finish}>Finalizar partida</button>}
  </main>;
}
