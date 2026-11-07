import { useState } from "react";
import { useNavigate } from "react-router";

export default function AddAbility({ onAbilityAdded }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAbilityAdded({ ...form });
    setForm({ name: "", description: "" });
  };

  return (
    <section>
      <h2>Agregar habilidad</h2>
      <form onSubmit={handleSubmit}>
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="name" type="text" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        <textarea className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />
        <div className="flex gap-2">
          <button type="submit" className="bg-green-300">Agregar habilidad</button>
          <button type="button" className="bg-red-300" onClick={() => navigate("/home", { replace: true })}>Cancelar operación/volver</button>
        </div>
      </form>
    </section>
  );
}
