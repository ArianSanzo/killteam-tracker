
import { useState } from "react";
/* import { useNavigate } from "react-router"; */

export default function AddWRules({ onWRulesAdded }) {
    const [descripcion, setDescripcion] = useState("");

    /* const navigate = useNavigate(); */

    const handleChangeDescripcion = (e) => {
        setDescripcion(e.target.value);
    };

    const handleAddWRule = (event) => {
        event.preventDefault();

        const wRule = {
            descripcion,
        };

        onWRulesAdded(wRule);

        setDescripcion("");
    };

    return (
        <section>
            <h2>Agregar Regla de arma</h2>

            <form onSubmit={handleAddWRule}>
                <input
                    className="border border-gray-300 rounded-lg px-3 py-2 m-2"
                    type="text"
                    placeholder="Descripción de la regla"
                    onChange={handleChangeDescripcion}
                    value={descripcion}
                    required
                />

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-green-300"
                    >
                        Agregar descripción
                    </button>

                    {/*
                    <button
                        type="button"
                        className="bg-red-300"
                        onClick={() =>
                            navigate("/dashboard", { replace: true })
                        }
                    >
                        Cancelar operación/volver
                    </button>
                    */}
                </div>
            </form>
        </section>
    );
}
