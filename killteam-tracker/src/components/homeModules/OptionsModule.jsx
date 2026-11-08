import { useNavigate } from "react-router";

const OptionsModule = () => {
    const navigate = useNavigate();
    return (
        <>
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