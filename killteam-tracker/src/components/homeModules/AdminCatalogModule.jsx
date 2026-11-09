import { useCallback, useEffect, useState } from "react";
import { apiJson } from "../../api/client";

const resources = {
  teams: { title: "Equipos", path: "/team", fields: [{ key: "name", label: "Nombre" }, { key: "logo", label: "URL del logo" }] },
  operatives: { title: "Operativos", path: "/operatives", fields: [{ key: "name", label: "Nombre" }, { key: "wounds", label: "Heridas", type: "number" }, { key: "movement", label: "Movimiento" }, { key: "apl", label: "APL", type: "number" }, { key: "save", label: "Salvación" }, { key: "img", label: "URL de imagen" }, { key: "teamId", label: "Equipo", relation: "teams" }, { key: "weaponIds", label: "Armas", relation: "weapons", multiple: true }, { key: "abilityIds", label: "Habilidades", relation: "abilities", multiple: true }] },
  weapons: { title: "Armas", path: "/weapons", fields: [{ key: "name", label: "Nombre" }, { key: "attack", label: "Ataques" }, { key: "hit", label: "Impacto" }, { key: "damage", label: "Daño" }, { key: "range", label: "Alcance", type: "number" }, { key: "ruleIds", label: "Reglas", relation: "rules", multiple: true }] },
  rules: { title: "Reglas", path: "/rules", fields: [{ key: "name", label: "Nombre" }, { key: "description", label: "Descripción", type: "textarea" }] },
  abilities: { title: "Habilidades", path: "/abilities", fields: [{ key: "name", label: "Nombre" }, { key: "description", label: "Descripción", type: "textarea" }] },
};
const empty = (resource) => Object.fromEntries(resource.fields.map(({ key }) => [key, ""]));

export default function AdminCatalogModule() {
  const [catalog, setCatalog] = useState("teams");
  const [data, setData] = useState({});
  const [form, setForm] = useState(empty(resources.teams));
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const config = resources[catalog];

  const load = useCallback(async () => {
    try {
      const keys = Object.keys(resources);
      const values = await Promise.all(keys.map((key) => apiJson(resources[key].path, { authenticated: false })));
      setData(Object.fromEntries(keys.map((key, index) => [key, values[index]])));
    } catch (err) { setError(err.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const startEdit = (row) => {
    const initial = empty(config);
    config.fields.forEach(({ key, relation, multiple }) => {
      if (relation && multiple) initial[key] = (row[relation] ?? []).map((item) => String(item.id));
      else if (relation) initial[key] = String(row[`${relation.slice(0, -1)}Id`] ?? row[`${relation.slice(0, -1)}Id`] ?? "");
      else initial[key] = row[key] ?? "";
    });
    if (catalog === "operatives") {
      initial.weaponIds = (row.weapons ?? []).map((item) => String(item.id));
      initial.abilityIds = (row.abilities ?? []).map((item) => String(item.id));
    }
    if (catalog === "weapons") initial.ruleIds = (row.rules ?? []).map((item) => String(item.id));
    setEditing(row.id); setForm(initial); setError("");
  };

  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    const body = { ...form };
    config.fields.forEach(({ key, relation, multiple, type }) => {
      if (relation && multiple) body[key] = (body[key] ?? []).map(Number);
      else if (relation || type === "number") body[key] = Number(body[key]);
    });
    try {
      await apiJson(editing ? `${config.path}/${editing}` : config.path, { method: editing ? "PUT" : "POST", body: JSON.stringify(body) });
      setForm(empty(config)); setEditing(null); await load();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const remove = async (row) => {
    if (!window.confirm(`¿Eliminar ${row.name}?`)) return;
    try { await apiJson(`${config.path}/${row.id}`, { method: "DELETE" }); await load(); }
    catch (err) { setError(err.message); }
  };

  return <main className="admin-page">
    <span className="eyebrow">Herramientas de administración</span><h2 className="page-title">Catálogos</h2>
    {error && <p role="alert">{error}</p>}
    <label>Tipo de contenido <select className="ml-2 border p-2" value={catalog} onChange={(e) => { setCatalog(e.target.value); setForm(empty(resources[e.target.value])); setEditing(null); }}>{Object.entries(resources).map(([key, value]) => <option key={key} value={key}>{value.title}</option>)}</select></label>
    <form className="section-card catalog-form" onSubmit={submit}><h3>{editing ? "Editar" : "Crear"}: {config.title.slice(0, -1)}</h3>
      {config.fields.map(({ key, label, type = "text", relation, multiple }) => <label key={key} className="grid gap-1">{label}
        {relation ? <select className="border p-2" multiple={multiple} required={!multiple || (catalog === "operatives" && key === "weaponIds")} value={form[key]} onChange={(e) => setForm({ ...form, [key]: multiple ? Array.from(e.target.selectedOptions, (option) => option.value) : e.target.value })}>
          {!multiple && <option value="">Selecciona…</option>}{(data[relation] ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select> : type === "textarea" ? <textarea className="border p-2" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required /> : <input className="border p-2" type={type} min={type === "number" ? 0 : undefined} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />}
      </label>)}
      <div className="form-actions"><button disabled={busy}>{busy ? "Guardando…" : editing ? "Guardar cambios" : "Crear"}</button>{editing && <button className="button-quiet" type="button" onClick={() => { setEditing(null); setForm(empty(config)); }}>Cancelar edición</button>}</div>
    </form>
    <section className="section-card catalog-list"><h3>{config.title} existentes</h3><ul>{(data[catalog] ?? []).map((row) => <li key={row.id}><span>{row.name} <small>ID {row.id}</small></span><span className="row-actions"><button className="button-secondary" onClick={() => startEdit(row)}>Editar</button><button className="button-danger" onClick={() => remove(row)}>Eliminar</button></span></li>)}</ul></section>
  </main>;
}
