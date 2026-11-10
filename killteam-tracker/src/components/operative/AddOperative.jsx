import { useState } from "react";
import { useNavigate } from "react-router";

const validWounds = (value) => typeof value !== "string" || value.trim() !== "" ? Number.isSafeInteger(Number(value)) && Number(value) >= 0 : false;
const woundsError = "Las heridas deben ser números enteros iguales o mayores que cero.";

const emptyForm = { name: "", wounds: "", movement: "", apl: "", save: "", img: "", teamId: "" };

export default function AddOperative({ onOperativeAdded }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validWounds(form.wounds)) {
      setError(woundsError);
      return;
    }
    setError("");
    onOperativeAdded({ ...form, wounds: Number(form.wounds), teamId: Number(form.teamId) });
    setForm(emptyForm);
  };

  return (
    <section>
      <h2>Agregar operative</h2>
      <form onSubmit={handleSubmit}>
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" 
        name="name" 
        type="text" 
        placeholder="Nombre" 
        value={form.name} 
        onChange={handleChange} 
        required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" 
        name="wounds" 
        type="number" 
        placeholder="Heridas" 
        value={form.wounds} 
        onChange={(e) => { handleChange(e); setError(""); }} 
        step="any" />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" 
        name="movement" 
        type="text" 
        placeholder="Movimiento" 
        value={form.movement} 
        onChange={handleChange} 
        required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" 
        name="apl" 
        type="number" 
        placeholder="APL" 
        value={form.apl} 
        onChange={handleChange} 
        min="1" 
        required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" 
        name="save" 
        type="text" 
        placeholder="Salvación" 
        value={form.save} onChange={handleChange} 
        required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" 
        name="img" 
        type="text" 
        placeholder="URL de imagen" 
        value={form.img} 
        onChange={handleChange} 
        required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" 
        name="teamId" 
        type="number" 
        placeholder="ID del equipo" 
        value={form.teamId} 
        onChange={handleChange} 
        min="1" 
        required />
        {error && <p role="alert">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="bg-green-300">Agregar</button>
          <button type="button" className="bg-red-300" onClick={() => navigate("/home", { replace: true })}>Cancelar</button>
        </div>
      </form>
    </section>
  );
}