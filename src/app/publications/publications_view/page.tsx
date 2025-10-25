// app/publicaciones/page.tsx
import FilterBar from "@/components/Filterbar";
import PublicationCard from "@/components/PublicationCard";
import ServiceCard from "@/components/ServiceCard";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <FilterBar
        defaults={{
          q: String(sp.q ?? ""),
          ciudad: String(sp.ciudad ?? ""),
          region: String(sp.region ?? ""),
          estado: String(sp.estado ?? ""),
        }}
      />

      {/* Publicaciones de trabajo u otros tipos no-servicio */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Publicaciones</h2>
        <PublicationCard searchParams={sp} />
      </section>

      {/* Publicaciones de servicios */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Servicios</h2>
        <ServiceCard searchParams={sp} />
      </section>
    </main>
  );
}
