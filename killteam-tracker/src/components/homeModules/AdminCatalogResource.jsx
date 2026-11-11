import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY = "killteam-tracker-token";
const noReferences = [];
const sections = [
  ["teams", "Equipos", "/admin/catalogs/teams"],
  ["operatives", "Operativos", "/admin/catalogs/operatives"],
  ["weapons", "Armas", "/admin/catalogs/weapons"],
  ["abilities", "Habilidades", "/admin/catalogs/abilities"],
  ["rules", "Reglas", "/admin/catalogs/rules"],
];

const emptyForm = (fields) => Object.fromEntries(fields.map(({ key }) => [key, ""]));
const validWounds = (value) => String(value).trim() !== "" && Number.isSafeInteger(Number(value)) && Number(value) >= 0;
const woundsError = "Las heridas deben ser números enteros iguales o mayores que cero.";

async function fetchResourceData(resource, references) {
  const [items, ...related] = await Promise.all([
    request(`/${resource}`),
    ...references.map(({ key, path }) => request(path).then((data) => [key, data])),
  ]);
  return { items, related };
}

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const { auth, ...fetchOptions } = options;
  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(auth ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event("killteam:unauthorized"));
  }
  if (!response.ok) {
    const result = response.status === 204 ? {} : await response.json();
    throw new Error(result.message || "No se pudo completar la operación.");
  }
  return response.status === 204 ? null : response.json();
}

export default function AdminCatalogResource({ resource, title, fields, references = noReferences }) {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [referenceData, setReferenceData] = useState({});
  const [form, setForm] = useState(() => emptyForm(fields));
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { items, related } = await fetchResourceData(resource, references);
      setRows(items);
      setReferenceData(Object.fromEntries(related));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    let active = true;
    fetchResourceData(resource, references)
      .then(({ items, related }) => {
        if (active) {
          setRows(items);
          setReferenceData(Object.fromEntries(related));
        }
      })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [resource, references]);

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const startEdit = (row) => {
    const initial = emptyForm(fields);
    for (const field of fields) {
      if (field.multiple) initial[field.key] = (row[field.relation] ?? []).map((item) => String(item.id));
      else if (field.relation) initial[field.key] = String(row[field.relationKey] ?? "");
      else initial[field.key] = row[field.key] ?? "";
    }
    setEditing(row.id);
    setForm(initial);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (resource === "operatives" && !validWounds(form.wounds)) {
      setError(woundsError);
      return;
    }
    setBusy(true);
    const body = { ...form };
    for (const field of fields) {
      if (field.multiple) body[field.key] = (body[field.key] ?? []).map(Number);
      else if (field.type === "number") body[field.key] = body[field.key] === "" && field.nullable ? null : Number(body[field.key]);
      else if (field.relation) body[field.key] = Number(body[field.key]);
    }
    try {
      await request(`/${resource}${editing ? `/${editing}` : ""}`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(body),
        auth: true,
      });
      setForm(emptyForm(fields));
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`¿Eliminar ${row.name}?`)) return;
    setError("");
    try {
      await request(`/${resource}/${row.id}`, { method: "DELETE", auth: true });
      if (editing === row.id) {
        setEditing(null);
        setForm(emptyForm(fields));
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return <main className="admin-page">
    <span className="eyebrow">Herramientas de administración</span>
    <h2 className="page-title">Catálogos · {title}</h2>
    <nav className="catalog-nav" aria-label="Secciones del catálogo">
      {sections.map(([key, label, path]) => <button key={key} type="button" className="button-quiet" aria-current={key === resource ? "page" : undefined} onClick={() => navigate(path)}>{label}</button>)}
    </nav>
    {error && <p role="alert">{error}</p>}
    <form className="section-card catalog-form" onSubmit={submit}>
      <h3>{editing ? "Editar" : "Nuevo elemento"} · {title}</h3>
      {fields.map(({ key, label, type = "text", relation, multiple, required = true, min }) => <label key={key}>{label}
        {relation ? <select multiple={multiple} required={required} value={form[key]} onChange={(event) => setValue(key, multiple ? Array.from(event.target.selectedOptions, (option) => option.value) : event.target.value)}>
          {!multiple && <option value="">Selecciona…</option>}
          {(referenceData[relation] ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select> : type === "textarea" ? <textarea name={key} value={form[key]} onChange={(event) => setValue(key, event.target.value)} required={required} /> : <input name={key} type={type} min={min} step={key === "wounds" ? "any" : undefined} value={form[key]} onChange={(event) => { setValue(key, event.target.value); if (key === "wounds") setError(""); }} required={required} />}
      </label>)}
      <div className="form-actions">
        <button disabled={busy}>{busy ? "Guardando…" : editing ? "Guardar cambios" : "Crear"}</button>
        {editing && <button className="button-quiet" type="button" onClick={() => { setEditing(null); setForm(emptyForm(fields)); setError(""); }}>Cancelar edición</button>}
      </div>
    </form>
    <section className="section-card catalog-list"><h3>{title} existentes</h3>
      <ul>{rows.map((row) => <li key={row.id}><span>{row.name} <small>ID {row.id}</small></span><span className="row-actions"><button className="button-secondary" type="button" onClick={() => startEdit(row)}>Editar</button><button className="button-danger" type="button" onClick={() => remove(row)}>Eliminar</button></span></li>)}</ul>
    </section>
  </main>;
}
