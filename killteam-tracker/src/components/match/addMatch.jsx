import { useState } from "react";
import { useNavigate } from "react-router";


const AddMatch = ({ teams = [], onMatchAdded }) => {
  const [name, setName] = useState("");
  const [sides, setSides] = useState([
    {teamId: "", operatives: {}},
    {teamId: "", operatives: {}}
  ]);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const updateTeam = (sideIndex, teamId) => {
    setSides((current) =>
      current.map((side, index) =>
        index === sideIndex
          ? { teamId, operatives: {} }
          : side
      )
    );
  };

  const addOperativeCopy = (sideIndex, operativeId) => {
    setSides((current) =>
      current.map((side, index) => {
        if (index !== sideIndex){
          return side;
        } 

        const copies = side.operatives[operativeId] ?? [];

        return {
          ...side,
          operatives: {
            ...side.operatives,
            [operativeId]: [...copies, { weaponId: "" }],
          },
        };
      })
    );
  };

  const removeOperativeCopy = (sideIndex, operativeId, copyIndex) => {
    setSides((current) =>
      current.map((side, index) => {
        if (index !== sideIndex) {
          return side;
        } 

        const copies = [...(side.operatives[operativeId] ?? [])];
        copies.splice(copyIndex, 1);

        const operatives = { ...side.operatives };

        if (copies.length === 0) {
          delete operatives[operativeId];
        } else {
          operatives[operativeId] = copies;
        }

        return { ...side, operatives };
      })
    );
  };

  const updateCopyWeapon = (
    sideIndex,
    operativeId,
    copyIndex,
    weaponId
  ) => {
    setSides((current) =>
      current.map((side, index) => {
        if (index !== sideIndex) return side;

        const copies = [...(side.operatives[operativeId] ?? [])];
        copies[copyIndex] = { ...copies[copyIndex], weaponId };

        return {
          ...side,
          operatives: {
            ...side.operatives,
            [operativeId]: copies,
          },
        };
      })
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!onMatchAdded) {
      setSubmitError("No está configurado el guardado de partidas.");
      return;
    }

    setSaving(true);
    setSubmitError("");

    try {
      const result = await onMatchAdded({
        name: name.trim(),
        date: new Date().toISOString(),
        teams: sides.map((side) => ({
          teamId: Number(side.teamId),
          operatives: Object.entries(side.operatives).flatMap(
            ([operativeId, copies]) =>
              copies.map((copy) => ({
                operativeId: Number(operativeId),
                weaponId: Number(copy.weaponId),
              }))
          ),
        })),
      });

      const createdMatchId =
        result?.newMatch?.id ?? result?.match?.id ?? result?.id;

      if (!createdMatchId) {
        throw new Error("La partida se creó, pero el servidor no devolvió su identificador.");
      }

      navigate(`/matches/${createdMatchId}`, { replace: true });
    } catch (err) {
      setSubmitError(err.message || "No se pudo crear la partida.");
    } finally {
      setSaving(false);
    }
  };

  const renderSide = (side, sideIndex) => {
    const selectedTeam = teams.find(
      (team) => Number(team.id) === Number(side.teamId)
    );
    const teamOperatives = selectedTeam?.operatives ?? [];

    return (
      <fieldset className="side-picker" key={sideIndex}>
        <legend>Equipo {sideIndex + 1}</legend>

        <label htmlFor={`team-${sideIndex}`}>Elegir equipo</label>
        <select
          id={`team-${sideIndex}`}
          value={side.teamId}
          onChange={(event) => updateTeam(sideIndex, event.target.value)}
          required
        >
          <option value="">Selecciona un equipo</option>

          {teams.map((team) => {
            const usedByOtherSide = sides.some(
              (otherSide, index) =>
                index !== sideIndex &&
                Number(otherSide.teamId) === Number(team.id)
            );

            return (
              <option
                key={team.id}
                value={team.id}
                disabled={usedByOtherSide}
              >
                {team.name}
              </option>
            );
          })}
        </select>

        {side.teamId && (
          <div className="operative-selection">
            <p className="muted">Agrega los operativos que participan:</p>

            {teamOperatives.length === 0 ? (
              <p>Este equipo no tiene operativos disponibles.</p>
            ) : (
              teamOperatives.map((operative) => {
                const copies = side.operatives[operative.id] ?? [];
                const weapons = operative.weapons ?? [];

                return (
                  <div className="operative-choice" key={operative.id}>
                    <h4>{operative.name}</h4>

                    <button
                      className="button-secondary add-copy-button"
                      type="button"
                      onClick={() =>
                        addOperativeCopy(sideIndex, operative.id)
                      }
                    >
                      Agregar copia
                    </button>

                    {copies.map((copy, copyIndex) => (
                      <div className="weapon-copy" key={`${operative.id}-${copyIndex}`}>
                        <label htmlFor={`weapon-${sideIndex}-${operative.id}-${copyIndex}`}>
                          Arma de la copia {copyIndex + 1}
                        </label>

                        <select
                          id={`weapon-${sideIndex}-${operative.id}-${copyIndex}`}
                          value={copy.weaponId}
                          onChange={(event) =>
                            updateCopyWeapon(
                              sideIndex,
                              operative.id,
                              copyIndex,
                              event.target.value
                            )
                          }
                          required
                        >
                          <option value="">Selecciona un arma</option>
                          {weapons.map((weapon) => (
                            <option key={weapon.id} value={weapon.id}>
                              {weapon.name}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="button-quiet"
                          onClick={() =>
                            removeOperativeCopy(
                              sideIndex,
                              operative.id,
                              copyIndex
                            )
                          }
                        >
                          Quitar copia
                        </button>
                      </div>
                    ))}

                    {copies.length > 0 && weapons.length === 0 && (
                      <p>Este operativo no tiene armas asociadas.</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </fieldset>
    );
  };

  const canSubmit =
    name.trim() !== "" &&
    sides.every((side) => {
      const copies = Object.values(side.operatives).flat();

      return (
        side.teamId &&
        copies.length > 0 &&
        copies.every((copy) => copy.weaponId)
      );
    });

  return (
    <section className="match-setup">
      <span className="eyebrow">Preparación de escuadras</span>
      <h2 className="page-title">Crear partida</h2>
      <p className="muted">Elige dos equipos, añade sus operativos y asigna un arma a cada copia.</p>

      <form className="match-setup-form" onSubmit={handleSubmit}>
        {submitError && <p role="alert">{submitError}</p>}

        <div className="match-name-field"><label htmlFor="match-name">Nombre de la partida</label>
          <input id="match-name" 
          name="name" 
          type="text" 
          placeholder="Ej.: Mántifex vs Marines" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required />
        </div>

        {sides.map(renderSide)}

        <div className="match-actions">
          <button type="submit" disabled={!canSubmit || saving}>
            {saving ? "Creando…" : "Crear"}
          </button>
          <button
            type="button"
            className="button-quiet"
            onClick={() => navigate("/", { replace: true })}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddMatch;
