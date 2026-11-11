import AdminCatalogResource from "./AdminCatalogResource";

const fields = [
  { key: "name", label: "Nombre" },
  { key: "logo", label: "URL del logo", required: false },
];

export default function AdminCatalogModule() {
  return <AdminCatalogResource resource="team" title="Equipos" fields={fields} />;
}
