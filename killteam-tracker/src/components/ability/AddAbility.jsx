import AdminCatalogResource from "../homeModules/AdminCatalogResource";

const fields = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción", type: "textarea" },
];

export default function AddAbility() {
  return <AdminCatalogResource resource="abilities" title="Habilidades" fields={fields} />;
}
