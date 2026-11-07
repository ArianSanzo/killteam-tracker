import { useState } from "react";

export default function AddWeapon({ onWeaponAdded }) {
  const [form, setForm] = useState({ name: "", attack: "", hit: "", damage: "", range: "" });

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onWeaponAdded({ ...form, range: Number(form.range) });
    setForm({ name: "", attack: "", hit: "", damage: "", range: "" });
  };

  return (
    <section>
      <h2>Agregar arma</h2>
      <form onSubmit={handleSubmit}>
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="name" type="text" placeholder="Nombre del arma" value={form.name} onChange={handleChange} required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="attack" type="text" placeholder="Ataques" value={form.attack} onChange={handleChange} required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="hit" type="text" placeholder="Impacto" value={form.hit} onChange={handleChange} required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="damage" type="text" placeholder="Daño" value={form.damage} onChange={handleChange} required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="range" type="number" placeholder="Alcance" value={form.range} onChange={handleChange} min="0" required />
        <button type="submit" className="bg-green-300">Agregar arma</button>
      </form>
    </section>
  );
}

