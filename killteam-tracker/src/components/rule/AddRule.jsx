import AdminCatalogResource from "../homeModules/AdminCatalogResource";

const fields = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción", type: "textarea" },
];

export default function AddRule() {
  return <AdminCatalogResource resource="rules" title="Reglas" fields={fields} />;
}
