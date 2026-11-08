import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AddMatch from "../match/addMatch";

const API_URL = "http://localhost:3000";
const TEMP_USER_ID = 1;

const AddMatchModule = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleMatchAdded = async (matchData) => {
    const response = await fetch(`${API_URL}/matchs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...matchData, userId: TEMP_USER_ID }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "No se pudo crear la partida.");
    }

    return result;
  };

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [teamsResponse, operativesResponse] = await Promise.all([
          fetch(`${API_URL}/team`),
          fetch(`${API_URL}/operatives`),
        ]);

        if (!teamsResponse.ok || !operativesResponse.ok) {
          throw new Error("No se pudieron cargar equipos y operativos.");
        }

        const [teamsData, operativesData] = await Promise.all([
          teamsResponse.json(),
          operativesResponse.json(),
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
