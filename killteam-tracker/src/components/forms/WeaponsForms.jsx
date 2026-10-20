
import { useState } from "react";
/*import { useNavigate } from "react-router";*/

export default function AddWeapon({ onWeaponAdded }) {
    const [nombre, setNombre] = useState("");
    const [ataque, setAtaque] = useState("");
    const [hit, setHit] = useState("");
    const [daño, setDaño] = useState("");

    /*const navigate = useNavigate();*/

    const handleChangeNombre = (e) => {
        setNombre(e.target.value);
    };

    const handleChangeAtaque = (e) => {
        setAtaque(e.target.value);
    };

    const handleChangeHit = (e) => {
        setHit(e.target.value);
    };

    const handleChangeDaño = (e) => {
        setDaño(e.target.value);
    };

    const handleAddWeapon = (event) => {
        event.preventDefault();

        const weapon = {
            nombre,
            ataque,
            hit,
            daño,
        };

        onWeaponAdded(weapon);

        setNombre("");
        setAtaque("");
        setHit("");
        setDaño("");
    };

    return (
        <section>
            <h2>Agregar Arma</h2>

            <form onSubmit={handleAddWeapon}>
                <input
                    className="border border-gray-300 rounded-lg px-3 py-2 m-2"
                    type="text"
                    placeholder="Nombre del arma"
                    onChange={handleChangeNombre}
                    value={nombre}
                    required
                />

                <input
                    className="border border-gray-300 rounded-lg px-3 py-2 m-2"
                    type="text"
                    placeholder="Ataque"
                    onChange={handleChangeAtaque}
                    value={ataque}
                    required
                />

                <input
                    className="border border-gray-300 rounded-lg px-3 py-2 m-2"
                    type="text"
                    placeholder="Hit"
                    onChange={handleChangeHit}
                    value={hit}
                    required
                />

                <input
                    className="border border-gray-300 rounded-lg px-3 py-2 m-2"
                    type="text"
                    placeholder="Daño"
                    onChange={handleChangeDaño}
                    value={daño}
                    required
                />

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-green-300"
                    >
                        Agregar arma
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

