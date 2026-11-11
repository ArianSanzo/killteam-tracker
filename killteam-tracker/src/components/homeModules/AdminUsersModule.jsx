import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY = "killteam-tracker-token";

export default function AdminUsersModule() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const load = () => Promise.all(["/users", "/roles"].map((path) => fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` } }).then((response) => response.json().then((data) => { if (!response.ok) { if (response.status === 401) { localStorage.removeItem(TOKEN_KEY); window.dispatchEvent(new Event("killteam:unauthorized")); } throw new Error(data.message || "No se pudo cargar la administración."); } return data; })))).then(([u, r]) => { setUsers(u); setRoles(r); }).catch((err) => setError(err.message));
  useEffect(() => { load(); }, []);
  const changeRole = async (user, roleId) => {
    try {
      const response = await fetch(`${API_URL}/users/${user.id}/role`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` }, body: JSON.stringify({ roleId: Number(roleId) }) });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          window.dispatchEvent(new Event("killteam:unauthorized"));
        }
        throw new Error(data.message || "No se pudo cambiar el rol.");
      }
      await load();
    }
    catch (err) { setError(err.message); }
  };
  const remove = async (user) => {
    if (!window.confirm(`¿Eliminar a ${user.name}? También se eliminarán sus partidas.`)) return;
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` } });
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          window.dispatchEvent(new Event("killteam:unauthorized"));
        }
        throw new Error(data.message || "No se pudo eliminar el usuario.");
      }
      await load();
    } catch (err) { setError(err.message); }
  };
  return <main className="admin-page"><span className="eyebrow">Control de acceso</span><h2 className="page-title">Usuarios y roles</h2>{error && <p role="alert">{error}</p>}<ul className="user-list">{users.map((user) => <li className="user-row" key={user.id}><span className="user-identity"><strong>{user.name}</strong><small>{user.email}</small></span><label>Rol <select value={user.roleId ?? user.role?.id ?? ""} onChange={(e) => changeRole(user, e.target.value)}>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label><button className="button-danger" onClick={() => remove(user)}>Eliminar</button></li>)}</ul></main>;
}
