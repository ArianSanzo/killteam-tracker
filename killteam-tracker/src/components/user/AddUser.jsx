import { useState } from "react";
import { useNavigate } from "react-router";

const emptyForm = { name: "", email: "", password: "", roleId: "" };

export default function AddUser({ onUserAdded }) {
  const [form, setForm] = useState(emptyForm);
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onUserAdded({ ...form, roleId: Number(form.roleId) });
    setForm(emptyForm);
  };

  return (
    <section>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="name" type="text" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        <input className="border border-gray-300 rounded-lg px-3 py-2 m-2" name="roleId" type="number" placeholder="ID del rol" value={form.roleId} onChange={handleChange} min="1" required />
        <div className="flex gap-2">
          <button type="submit" className="bg-green-300">Registrarse</button>
          <button type="button" className="bg-red-300" onClick={() => navigate("/home", { replace: true })}>Cancelar operación/volver</button>
        </div>
      </form>
    </section>
  );
}
