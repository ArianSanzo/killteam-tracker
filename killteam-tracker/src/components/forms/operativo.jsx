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
      wounds,
        movement: parseInt(amount, 10),
      apl: parseInt(value, 10),
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
        />
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 m-2"
          type="text"
          placeholder="vida"
          onChange={handleChangeWounds}
          value={value}
        />
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 m-2"
          type="text"
          placeholder="movimiento"
          onChange={handleChangeMovement}
          value={value}
        />
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 m-2"
          type="text"
          placeholder="apl"
          onChange={handleChangeApl}
          value={value}
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
          placeholder="salvacion"
          onChange={handleChangeSave}
          value={value}
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