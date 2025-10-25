import DashboardProfileCard from "@/components/DashboardProfileCard";
import ProfileNavbar from "@/components/ProfileNavbar";

export default function Demo() {
  // Perfil ejemplo con datos temporales
  const perfilEjemplo = {
    ciudad: "Temuco",
    region: "Araucanía",
    insignia: 4.7,
    experiencia:
      "Especialista en limpieza residencial con más de 4 años de experiencia.\nTrabajo detallista y eficiente.",
    habilidades: "Limpieza profunda, Fontanería básica, Desinfección de espacios",
    disponibilidad_horaria: "Lunes a Viernes 9:00 - 18:00",
    updated_at: "2025-10-14T13:20:00.000Z",
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <ProfileNavbar className="mb-6" />
        <DashboardProfileCard perfil={perfilEjemplo} />
      </div>
    </div>
  );
}
