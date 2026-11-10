import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { apiJson } from "../../api/client";
import { useAuth } from "../../auth/useAuth";

const pointFields = ["critOp", "tacOp", "killOp"];
const getTeamPoint = (team, turningPoint) =>
  (team.turning_points ?? team.points_tables ?? team.points ?? []).find(
    (point) => Number(point.turningPoint) === Number(turningPoint)
  ) ?? {};
const getOperativeWounds = (operative, turningPoint) => {
  const states = operative.game_operative_states ?? [];
  const exact = states.find((state) => Number(state.turningPoint) === Number(turningPoint));
  if (exact) return Number(exact.wounds);

  const previous = states
    .filter((state) => Number(state.turningPoint) < Number(turningPoint))
    .sort((a, b) => Number(b.turningPoint) - Number(a.turningPoint))[0];
  return Number(previous?.wounds ?? operative.wounds);
};

const isNonNegativeInteger = (value) =>
  !(typeof value === "string" && value.trim() === "") &&
  Number.isSafeInteger(Number(value)) &&
  Number(value) >= 0;
const fetchMatch = (matchId) => apiJson(`/matches/${matchId}`);

export default function MatchDetailModule() {
  const { pathname } = useLocation();
  const matchId = pathname.match(/^\/matches\/([^/]+)/)?.[1];
  const { user } = useAuth();
  const [match, setMatch] = useState(null);
  const [turningPoint, setTurningPoint] = useState(1);
  const [scores, setScores] = useState({});
  const [woundDrafts, setWoundDrafts] = useState({});
  const [savingScores, setSavingScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetchMatch(matchId)
      .then((data) => {
        if (!active) return;
        setMatch(data);
        setError("");
      })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [matchId]);

  const refresh = async () => {
    const data = await fetchMatch(matchId);
    setMatch(data);
    setError("");
  };

  const saveScore = async (gameTeamId) => {
    const scoreKey = `${gameTeamId}:${turningPoint}`;
    if (savingScores[scoreKey]) return;
    setError("");
    const gameTeam = match.game_teams.find((team) => team.id === gameTeamId);
    const currentPoint = gameTeam ? getTeamPoint(gameTeam, turningPoint) : {};
    const draft = scores[scoreKey] ?? {};
    const values = Object.fromEntries(pointFields.map((field) => [
      field,
      draft[field] ?? currentPoint[field] ?? 0,
    ]));

    if (pointFields.some((field) => !isNonNegativeInteger(values[field]))) {
      setError("Los puntajes deben ser números enteros iguales o mayores que cero.");
      return;
    }

    setSavingScores((current) => ({ ...current, [scoreKey]: true }));
    try {
      await apiJson(`/matches/${matchId}/game-teams/${gameTeamId}/turning-points/${turningPoint}`, {
        method: "PUT",
        body: JSON.stringify(Object.fromEntries(pointFields.map((field) => [field, Number(values[field])]))),
      });
      setScores((current) => {
        const next = { ...current };
        delete next[scoreKey];
        return next;
      });
      setMessage("Puntaje guardado y copiado al siguiente turning point.");
      await refresh();
    } catch (err) { setError(err.message); }
    finally { setSavingScores((current) => ({ ...current, [scoreKey]: false })); }
  };

  const updateWounds = async (gameTeamId, operativeId, wounds) => {
    setError("");
    const value = Number(wounds);
    const operative = match.game_teams
      .find((team) => team.id === gameTeamId)
      ?.game_operatives.find((item) => item.id === operativeId);
    const maximum = Number(operative?.operative?.wounds ?? operative?.wounds);
    const woundKey = `${operativeId}:${turningPoint}`;

    if (!isNonNegativeInteger(wounds) || value > maximum) {
      setError(`Las heridas deben ser un entero entre 0 y ${maximum}.`);
      return;
    }

    try {
      await apiJson(`/matches/${matchId}/game-teams/${gameTeamId}/operatives/${operativeId}/turning-points/${turningPoint}/wounds`, {
        method: "PATCH", body: JSON.stringify({ wounds: value }),
      });
      setWoundDrafts((current) => {
        const next = { ...current };
        delete next[woundKey];
        return next;
      });
      setMessage(`Heridas del TP ${turningPoint} guardadas y heredadas por los siguientes TP.`);
      await refresh();
    } catch (err) { setError(err.message); }
  };

  const finish = async () => {
    setError("");
    try {
      await apiJson(`/matches/${matchId}/finished`, { method: "PATCH", body: JSON.stringify({ isFinished: true }) });
      setMessage("Partida finalizada.");
      await refresh();
    } catch (err) { setError(err.message); }
  };

  if (loading) return <p role="status">Cargando partida…</p>;
  if (error && !match) return <section><p role="alert">{error}</p><Link to="/">Volver</Link></section>;
  if (!match) return null;

  const canEdit = !match.isFinished || ["admin", "superadmin"].includes(user?.roleKey);
  return <main className="match-page">
    <Link to="/history">← Historial</Link><div className="match-heading"><div><span className="eyebrow">{match.isFinished ? "Combate finalizado" : "Combate en curso"}</span><h2>{match.name}</h2><p className="muted">{new Date(match.date).toLocaleString()}</p></div>{!match.isFinished && <span className="status-pill status-active">EN CURSO</span>}</div>
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    <label className="tp-picker">Turning point <select value={turningPoint} onChange={(e) => setTurningPoint(Number(e.target.value))}>{[1,2,3,4].map((tp) => <option key={tp}>{tp}</option>)}</select></label>
    <div className="team-grid">{(match.game_teams ?? []).map((team) => {
      const point = getTeamPoint(team, turningPoint);
      const scoreKey = `${team.id}:${turningPoint}`;
      return <section className="section-card team-panel" key={team.id}>
        <h3>{team.team?.name ?? `Equipo ${team.teamId}`}</h3>
        <p className="score-summary">TP {turningPoint} <strong>{point.critOp ?? 0}</strong> crit · <strong>{point.tacOp ?? 0}</strong> tac · <strong>{point.killOp ?? 0}</strong> bajas</p>
        {canEdit && <div className="score-editor"><div className="score-fields">{pointFields.map((field, index) => <label key={field}>{["Críticos", "Tácticos", "Bajas"][index]}<input type="number" min="0" step="1" inputMode="numeric" value={scores[scoreKey]?.[field] ?? point[field] ?? 0} onChange={(e) => setScores((old) => ({ ...old, [scoreKey]: { ...(old[scoreKey] ?? {}), [field]: e.target.value } }))}/></label>)}</div><button disabled={savingScores[scoreKey]} onClick={() => saveScore(team.id)}>{savingScores[scoreKey] ? "Guardando…" : "Guardar puntaje"}</button></div>}
        <div className="operative-stack">{(team.game_operatives ?? []).map((operative) => <article className="operative-card" key={operative.id}>
          <div className="operative-heading"><div><strong>{operative.operative?.name} <span className="operative-number">#{operative.number}</span></strong><p className="muted">{operative.weapon?.name}</p></div><span className="wound-count">{woundDrafts[`${operative.id}:${turningPoint}`] ?? getOperativeWounds(operative, turningPoint)}<small> / {operative.operative?.wounds} PV</small></span></div>
          <label className="wound-editor">Heridas actuales <input type="number" min="0" max={Number(operative.operative?.wounds ?? operative.wounds)} step="1" inputMode="numeric" value={woundDrafts[`${operative.id}:${turningPoint}`] ?? getOperativeWounds(operative, turningPoint)} disabled={!canEdit} onChange={(e) => setWoundDrafts((drafts) => ({ ...drafts, [`${operative.id}:${turningPoint}`]: e.target.value }))} onBlur={(e) => { if (Number(e.target.value) !== getOperativeWounds(operative, turningPoint)) updateWounds(team.id, operative.id, e.target.value); }}/></label>
        </article>)}</div>
      </section>;
    })}</div>
    {!match.isFinished && <button className="button-danger finish-button" onClick={finish}>Finalizar partida</button>}
  </main>;
}
