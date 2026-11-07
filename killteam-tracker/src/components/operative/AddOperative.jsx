import { useState } from "react";
import { useNavigate } from "react-router";

const emptyForm = { name: "", wounds: "", movement: "", apl: "", save: "", img: "", teamId: "" };

export default function AddOperative({ onOperativeAdded }) {
  const [form, setForm] = useState(emptyForm);
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onOperativeAdded({ ...form, teamId: Number(form.teamId) });
    setForm(emptyForm);
  };

  return (
    <section>
      <h2>Agregar operative</h2>
      <form onSubmit={handleSubmit}>
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="name" type="text" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="wounds" type="number" placeholder="Heridas" value={form.wounds} onChange={handleChange} min="1" required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="movement" type="text" placeholder="Movimiento" value={form.movement} onChange={handleChange} required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="apl" type="number" placeholder="APL" value={form.apl} onChange={handleChange} min="1" required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="save" type="text" placeholder="Salvación" value={form.save} onChange={handleChange} required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="img" type="text" placeholder="URL de imagen" value={form.img} onChange={handleChange} required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="teamId" type="number" placeholder="ID del equipo" value={form.teamId} onChange={handleChange} min="1" required />
        <div className="flex gap-2">
          <button type="submit" className="bg-green-300">Agregar operativo</button>
          <button type="button" className="bg-red-300" onClick={() => navigate("/home", { replace: true })}>Cancelar operación/volver</button>
        </div>
      </form>
    </section>
  );
}