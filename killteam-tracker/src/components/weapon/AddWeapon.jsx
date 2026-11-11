import AdminCatalogResource from "../homeModules/AdminCatalogResource";

const fields = [
  { key: "name", label: "Nombre" },
  { key: "attack", label: "Ataques" },
  { key: "hit", label: "Impacto" },
  { key: "damage", label: "Daño" },
  { key: "range", label: "Alcance", type: "number", min: 0, nullable: true, required: false },
  { key: "ruleIds", label: "Reglas", relation: "rules", multiple: true, required: false },
];

export default function AddWeapon() {
  return <AdminCatalogResource
    resource="weapons"
    title="Armas"
    fields={fields}
    references={[{ key: "rules", path: "/rules" }]}
  />;
}
