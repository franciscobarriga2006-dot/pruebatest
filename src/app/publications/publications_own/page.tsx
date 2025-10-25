// src/app/publications/publications_own/page.tsx
import PublicationCard from "@/components/PublicationCard";
import MyPostulationCard from "@/components/MyPostulationCard";
import PostulationFilterbar from "@/components/PostulationFilterbar";

type SP = Record<string, string | string[] | null>;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const normalized = Object.fromEntries(
    Object.entries(sp).map(([k, v]) => [k, v ?? null])
  ) as SP;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12 lg:px-24">
      {/* Sección de publicaciones propias */}
      <section className="space-y-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">
          Mis publicaciones
        </h1>

        {/* Contenedor de las publicaciones */}
        <div className="space-y-4">
          <PublicationCard searchParams={normalized} scope="mine" />
        </div>
      </section>

      {/* Divisor */}
      <div className="my-16 border-t border-gray-300"></div>

      {/* Sección de postulaciones */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-blue-600 text-center">
          Mis postulaciones
        </h2>

        {/* Filtro de postulaciones (agregado) */}
        <PostulationFilterbar />

        {/* Contenedor de las postulaciones */}
        <div className="space-y-4">
          <MyPostulationCard />
        </div>
      </section>
    </main>
  );
}
