import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/useAuth";
import { apiJson } from "../../api/client";

const OptionsModule = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState("");
    useEffect(() => { apiJson("/matches").then(setMatches).catch((err) => setError(err.message)); }, []);
    const canAdmin = ["admin", "superadmin"].includes(user.roleKey);
    const ownActive = matches.find((match) => Number(match.userId) === Number(user.id) && !match.isFinished);
    return (
        <>
            <p>Sesión: {user.name} ({user.role})</p>
            <button type="button" onClick={() => { logout(); navigate("/login", { replace: true }); }}>Cerrar sesión</button>
            <button onClick={() => navigate("/addMatch", { replace: true })}>Nueva partida</button>
            {ownActive && <button onClick={() => navigate(`/matches/${ownActive.id}`)}>Continuar: {ownActive.name}</button>}
            <button onClick={() => navigate("/history")}>Ver historial</button>
            {error && <p role="alert">{error}</p>}
            {canAdmin && <button onClick={() => navigate("/admin/catalogs")}>Administrar catálogos</button>}
            {user.roleKey === "superadmin" && <button onClick={() => navigate("/admin/users")}>Administrar usuarios</button>}
        </>
    );

};

export default OptionsModule;
