"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

type SearchParams = Record<string, string | string[] | null>;

type Publicacion = {
  id_publicacion: number;
  id_usuario: number;
  titulo: string;
  descripcion: string;
  direccion?: string | null;
  horario?: string | null;
  tipo?: string | null; // "necesidad" | "servicio"
  monto?: number | string | null;
  horas?: string | null;
  estado: "activa" | "pausada" | "cerrada" | "eliminada";
  ciudad?: string | null;
  region?: string | null;
  created_at?: string | null;
};

const clp = (v: number | string | null | undefined) => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n)
    ? new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
      }).format(n)
    : undefined;
};

const estadoStyle: Record<Publicacion["estado"], string> = {
  activa: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pausada: "bg-amber-50 text-amber-700 ring-amber-200",
  cerrada: "bg-gray-100 text-gray-700 ring-gray-300",
  eliminada: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function ServiceCard({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [items, setItems] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const params = useMemo(() => {
    const q = String(searchParams.q ?? "");
    const tipo = String(searchParams.tipo ?? "");
    const ciudad = String(searchParams.ciudad ?? "");
    const region = String(searchParams.region ?? "");
    const estado = String(searchParams.estado ?? "");
    return {
      ...(q ? { q } : {}),
      ...(ciudad ? { ciudad } : {}),
      ...(region ? { region } : {}),
      ...(estado ? { estado } : {}),
      __tipo: tipo || "",
      limit: 12,
      offset: 0,
    };
  }, [
    searchParams.q,
    searchParams.tipo,
    searchParams.ciudad,
    searchParams.region,
    searchParams.estado,
  ]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErr(null);

    api
      .get<{ items: Publicacion[]; limit: number; offset: number }>(
        "/publicaciones",
        {
          params: {
            q: (params as any).q,
            ciudad: (params as any).ciudad,
            region: (params as any).region,
            estado: (params as any).estado,
            limit: 12,
            offset: 0,
          },
          signal: controller.signal,
        }
      )
      .then(({ data }) => {
        const arr = Array.isArray(data?.items) ? data.items : [];
        const onlyServicio = arr.filter(
          (x) => (x.tipo ?? "").toLowerCase() === "servicio"
        );
        const byTipo = (params as any).__tipo
          ? onlyServicio.filter(
              (x) =>
                x.tipo?.toLowerCase() === (params as any).__tipo.toLowerCase()
            )
          : onlyServicio;
        setItems(byTipo);
      })
      .catch((e: any) => {
        if (e.name === "CanceledError") return;
        setErr(String(e?.response?.data?.error ?? e?.message ?? "Error"));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [params]);

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );

  if (err) return <p className="text-red-600">Error: {err}</p>;
  if (!items.length) return <p className="text-gray-500">Sin servicios.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p) => (
        <article
          key={p.id_publicacion}
          className="group relative rounded-2xl p-[1px] bg-gradient-to-tr from-emerald-500/30 via-teal-400/30 to-sky-500/30"
        >
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 h-full">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-tight line-clamp-2">
                {p.titulo}
              </h3>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs ring ${
                  estadoStyle[p.estado]
                }`}
              >
                {p.estado}
              </span>
            </div>

            {/* Subheader */}
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 ring-1 ring-emerald-200">
                Servicio
              </span>
              {(p.ciudad || p.region) && (
                <span className="text-gray-600">
                  📍 {p.ciudad}
                  {p.region ? `, ${p.region}` : ""}
                </span>
              )}
            </div>

            {/* Descripción */}
            <p className="mt-2 text-sm text-gray-700 line-clamp-3">
              {p.descripcion}
            </p>

            {/* Meta grid */}
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {p.monto != null && (
                <div className="rounded-xl bg-gray-50 p-2 ring-1 ring-gray-200">
                  <dt className="text-xs text-gray-500">Monto</dt>
                  <dd className="font-medium">{clp(p.monto) ?? "—"}</dd>
                </div>
              )}
              {p.horas && (
                <div className="rounded-xl bg-gray-50 p-2 ring-1 ring-gray-200">
                  <dt className="text-xs text-gray-500">Horas</dt>
                  <dd className="font-medium">{p.horas}</dd>
                </div>
              )}
              {p.direccion && (
                <div className="rounded-xl bg-gray-50 p-2 ring-1 ring-gray-200 col-span-2">
                  <dt className="text-xs text-gray-500">Dirección</dt>
                  <dd className="font-medium truncate">{p.direccion}</dd>
                </div>
              )}
              {p.horario && (
                <div className="rounded-xl bg-gray-50 p-2 ring-1 ring-gray-200 col-span-2">
                  <dt className="text-xs text-gray-500">Horario</dt>
                  <dd className="font-medium">{p.horario}</dd>
                </div>
              )}
            </dl>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {(p.created_at &&
                  new Date(p.created_at).toLocaleDateString("es-CL")) ||
                  ""}
              </span>
              <button
                onClick={() =>
                  (window.location.href = `/publications/publications_detail?id=${p.id_publicacion}`)
                }
                className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                type="button"
              >
                Ver detalles
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
