import { useEffect, useState } from "react";
import AddMatch from "../match/addMatch";
import { apiJson } from "../../api/client";

const AddMatchModule = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleMatchAdded = async (matchData) => {
    return apiJson("/matches", {
      method: "POST",
      body: JSON.stringify(matchData),
    });
  };

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [teamsData, operativesData] = await Promise.all([
          apiJson("/team", { authenticated: false }),
          apiJson("/operatives", { authenticated: false }),
        ]);

        const teamsWithOperatives = teamsData.map((team) => ({
          ...team,
          operatives: operativesData.filter(
            (operative) => Number(operative.teamId) === Number(team.id)
          ),
        }));

        if (!cancelled) {
          setTeams(teamsWithOperatives);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Ocurrió un error al cargar los datos.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Cargando equipos y operativos…</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <AddMatch
      teams={teams}
      onMatchAdded={handleMatchAdded}
    />
  );
};

export default AddMatchModule;
