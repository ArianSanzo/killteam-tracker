import { useEffect, useState } from "react";
import AddMatch from "../match/addMatch";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY = "killteam-tracker-token";

const AddMatchModule = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleMatchAdded = async (matchData) => {
    const response = await fetch(`${API_URL}/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
      body: JSON.stringify(matchData),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        window.dispatchEvent(new Event("killteam:unauthorized"));
      }
      throw new Error(data.message || "No se pudo crear la partida.");
    }
    return data;
  };

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [teamsResponse, operativesResponse] = await Promise.all([
          fetch(`${API_URL}/team`),
          fetch(`${API_URL}/operatives`),
        ]);
        const [teamsData, operativesData] = await Promise.all([
          teamsResponse.json(),
          operativesResponse.json(),
        ]);
        if (!teamsResponse.ok || !operativesResponse.ok) {
          throw new Error(teamsData.message || operativesData.message || "No se pudieron cargar los equipos y operativos.");
        }

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
