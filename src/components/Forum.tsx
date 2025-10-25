"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// ❌ quita axios
// import axios from "axios";
import DetailForumCard from "./DetailForumCard";

// ✅ importa tus funciones de mock ya definidas
import { mockFetchForums, mockFetchForumById } from "./Forum.mocks";

/* -------------------------
   Tipos inline (BD)
   ------------------------- */
export type ForoBase = {
  id_foro: number;
  id_usuario: number;
  titulo: string;
  consulta: string;
  fecha: string;
};

export type ForoAutor = {
  id_usuario: number;
  nombres?: string | null;
  apellidos?: string | null;
  rol?: "admin" | "empleador" | "trabajador" | null;
};

export type ForumDetail = ForoBase & {
  autor?: ForoAutor;
  total_respuestas?: number;
};

/* -------------------------
   Config API (queda, aunque no se usa)
   ------------------------- */
const API = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

/* -------------------------
   fetchForums (MOCK)
   ------------------------- */
export async function fetchForums(params?: { q?: string }): Promise<ForumDetail[]> {
  const data = await mockFetchForums(params); // <- usa mock
  return (Array.isArray(data) ? data : []).map((x) => ({
    ...x,
    autor: x.autor ?? undefined,
    total_respuestas:
      typeof x.total_respuestas === "number" ? x.total_respuestas : undefined,
  }));
}

/* -------------------------
   fetchForumById (MOCK)
   ------------------------- */
export async function fetchForumById(id_foro: number): Promise<ForumDetail> {
  const data = await mockFetchForumById(id_foro); // <- usa mock
  return {
    ...data,
    autor: data?.autor ?? undefined,
    total_respuestas:
      typeof data?.total_respuestas === "number" ? data.total_respuestas : undefined,
  } as ForumDetail;
}

/* -------------------------
   Componente Forum (igual)
   ------------------------- */
export default function Forum() {
  const sp = useSearchParams();
  const [foros, setForos] = useState<ForumDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedFull, setSelectedFull] = useState<ForumDetail | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);

  useEffect(() => {
    const q = sp.get("q") ?? undefined;
    setLoading(true);
    setErr(null);
    fetchForums({ q })
      .then(setForos)
      .catch(() => setErr("Error al cargar foros"))
      .finally(() => setLoading(false));
  }, [sp]);

  useEffect(() => {
    if (selectedId === null) {
      setSelectedFull(null);
      return;
    }
    let mounted = true;
    setSelectedLoading(true);
    fetchForumById(selectedId)
      .then((d) => {
        if (!mounted) return;
        setSelectedFull(d);
      })
      .catch(() => {
        if (!mounted) return;
        setErr("Error al cargar detalle del foro");
      })
      .finally(() => {
        if (!mounted) return;
        setSelectedLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [selectedId]);

  if (loading) return <div className="p-6 text-gray-500">Cargando foros…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!foros.length) return <div className="p-6 text-gray-500">No hay foros que coincidan.</div>;

  return (
    <div className="relative">
      <div className="space-y-4 p-4">
        {foros.map((f) => (
          <article
            key={f.id_foro}
            onClick={() => setSelectedId(f.id_foro)}
            className="cursor-pointer transition-transform hover:scale-[1.01]"
          >
            <DetailForumCard post={f} />
          </article>
        ))}
      </div>

      {selectedId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="max-w-2xl w-full mx-4 rounded-2xl bg-white shadow-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {selectedLoading ? (
              <div className="p-6 text-center text-gray-500">Cargando detalle…</div>
            ) : selectedFull ? (
              <DetailForumCard post={selectedFull} />
            ) : (
              <div className="p-6 text-gray-500">No se encontró detalle.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
