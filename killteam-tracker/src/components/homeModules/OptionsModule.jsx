import { useNavigate } from "react-router";
import { useAuth } from "../../auth/useAuth";

const OptionsModule = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    return (
        <>
            <p>Sesión: {user.name} ({user.role})</p>
            <button type="button" onClick={() => { logout(); navigate("/login", { replace: true }); }}>Cerrar sesión</button>
            <button onClick={() => navigate("/addMatch", { replace: true })}>Nueva partida</button>
            <button>Continuar</button>
            <h4>Historial: </h4>
            <ul>
                <li>Partida 1</li>
            </ul>
        </>
    );

};

export default OptionsModule;