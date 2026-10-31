
import { useState } from "react";
import { useNavigate } from "react-router";

export default function AddUser({ onUserAdded, users = [] }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleAddUser = (event) => {
    event.preventDefault();
    setError("");

    if (!email.includes("@") || !email.endsWith(".com")) {
      setError("El correo debe contener @ y terminar en .com.");
      return;
    }

    const nameExists = users.some(
      (user) =>
        user.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (nameExists) {
      setError("Ese nombre de usuario ya existe.");
      return;
    }

    const passwordExists = users.some(
      (user) => user.password === password
    );

    if (passwordExists) {
      setError("Esa contraseña ya está en uso.");
      return;
    }

    const user = {
      name: name.trim(),
      password,
      email: email.trim(),
    };

    onUserAdded(user);

    setName("");
    setPassword("");
    setEmail("");
  };

  return (
    <section>
      <h2>Agregar user</h2>

      <form onSubmit={handleAddUser}>
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
          type="password"
          placeholder="contraseña"
          onChange={handleChangePassword}
          value={password}
          required
        />

        <input
          className="border border-gray-300 rounded-lg px-3 py-2 m-2"
          type="text"
          placeholder="correo"
          onChange={handleChangeEmail}
          value={email}
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" className="bg-green-300">
            Agregar user
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
