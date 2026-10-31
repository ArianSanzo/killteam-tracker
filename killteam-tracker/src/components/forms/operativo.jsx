
import { useState } from "react";
import { useNavigate } from "react-router";

export default function AddOperative({ onOperativeAdded }) {
  const [name, setName] = useState("");
  const [wounds, setWounds] = useState("");
  const [movement, setMovement] = useState("");
  const [apl, setApl] = useState("");
  const [image, setImage] = useState("");
  const [save, setSave] = useState("");

  const navigate = useNavigate();

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeWounds = (e) => {
    setWounds(e.target.value);
  };

  const handleChangeMovement = (e) => {
    setMovement(e.target.value);
  };

  const handleChangeApl = (e) => {
    setApl(e.target.value);
  };

  const handleChangeImage = (e) => {
    setImage(e.target.value);
  };

  const handleChangeSave = (e) => {
    setSave(e.target.value);
  };

  const handleAddOperative = (event) => {
    event.preventDefault();

    const operative = {
      name,
      wounds: parseInt(wounds, 10),
      movement: parseInt(movement, 10),
      apl: parseInt(apl, 10),
      image,
      save,
    };

    onOperativeAdded(operative);

    setName("");
    setWounds("");
    setMovement("");
    setApl("");
    setImage("");
    setSave("");
  };

  return (
    <section>
      <h2>Agregar Operative</h2>

      <form onSubmit={handleAddOperative}>
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 m-2"
          type="text"
          placeholder="Nombre"
          onChange={handleChangeName}
          value={name}
          required
        />

        <input
          className="border border-gray-300 rounded-lg px-3 py-2 m-2"
          type="number"
          placeholder="Vida"
          onChange={handleChangeWounds}
          value={wounds}
          min="1"
          required
        />

        <input
          className="border border-gray-300 rounded-lg px-3 py-2 m-2"
          type="number"
          placeholder="Movimiento"
          onChange={handleChangeMovement}
          value={movement}
          min="1"
          required
        />

        <input
          className="border border-gray-300 rounded-lg px-3 py-2 m-2"
          type="number"
          placeholder="APL"
          onChange={handleChangeApl}
          value={apl}
          min="1"
          required
        />

        <input
          className="border border-gray-300 rounded-lg px-3 py-2 m-2"
          type="text"
          placeholder="URL de imagen"
          onChange={handleChangeImage}
          value={image}
        />

        <input
          className="border border-gray-300 rounded-lg px-3 py-2 m-2"
          type="text"
          placeholder="Salvación"
          onChange={handleChangeSave}
          value={save}
          required
        />

        <div className="flex gap-2">
          <button type="submit" className="bg-green-300">
            Agregar Operative
          </button>

          <button
            type="button"
            className="bg-red-300"
            onClick={() => navigate("/dashboard", { replace: true })}
          >
            Cancelar operacion/volver
          </button>
        </div>
      </form>
    </section>
  );
}
