import AdminCatalogResource from "../homeModules/AdminCatalogResource";

const fields = [
  { key: "name", label: "Nombre" },
  { key: "wounds", label: "Heridas", type: "number", min: 0 },
  { key: "movement", label: "Movimiento" },
  { key: "apl", label: "APL", type: "number", min: 1 },
  { key: "save", label: "Salvación" },
  { key: "img", label: "URL de imagen" },
  { key: "teamId", label: "Equipo", relation: "teams", relationKey: "teamId" },
  { key: "weaponIds", label: "Armas", relation: "weapons", multiple: true, required: true },
  { key: "abilityIds", label: "Habilidades", relation: "abilities", multiple: true, required: false },
];

export default function AddOperative() {
  return <AdminCatalogResource
    resource="operatives"
    title="Operativos"
    fields={fields}
    references={[
      { key: "teams", path: "/team" },
      { key: "weapons", path: "/weapons" },
      { key: "abilities", path: "/abilities" },
    ]}
  />;
}
