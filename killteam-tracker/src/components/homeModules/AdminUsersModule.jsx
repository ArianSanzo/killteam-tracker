import { useEffect, useState } from "react";
import { apiJson } from "../../api/client";

export default function AdminUsersModule() {
  const [users, setUsers] = useState([]); const [roles, setRoles] = useState([]); const [error, setError] = useState("");
  const load = () => Promise.all([apiJson("/users"), apiJson("/roles")]).then(([u, r]) => { setUsers(u); setRoles(r); }).catch((err) => setError(err.message));
  useEffect(() => { load(); }, []);
  const changeRole = async (user, roleId) => { try { await apiJson(`/users/${user.id}/role`, { method: "PUT", body: JSON.stringify({ roleId: Number(roleId) }) }); await load(); } catch (err) { setError(err.message); } };
  const remove = async (user) => { if (!window.confirm(`¿Eliminar a ${user.name}? También se eliminarán sus partidas.`)) return; try { await apiJson(`/users/${user.id}`, { method: "DELETE" }); await load(); } catch (err) { setError(err.message); } };
  return <main><h2>Usuarios y roles</h2>{error && <p role="alert">{error}</p>}<ul className="divide-y">{users.map((user) => <li className="flex flex-wrap items-center justify-between gap-3 py-3" key={user.id}><span>{user.name} · {user.email}</span><span>Rol <select value={user.roleId ?? user.role?.id ?? ""} onChange={(e) => changeRole(user, e.target.value)}>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select> <button className="text-red-700" onClick={() => remove(user)}>Eliminar usuario</button></span></li>)}</ul></main>;
}
