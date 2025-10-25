"use client";

import { useMemo } from "react";

type NullableDate = string | number | Date | null | undefined;

type UsuarioLigero = {
  id_usuario?: number | null;
  nombres?: string | null;
  apellidos?: string | null;
  correo?: string | null;
};

type ResumenRespuesta = {
  total?: number | null;
  ultimaRespuesta?: NullableDate;
  ultimoUsuario?: UsuarioLigero | null;
};

export type DashboardForum = {
  id_foro: number;
  id_usuario: number;
  titulo: string;
  consulta: string;
  fecha: NullableDate;
  usuario?: UsuarioLigero | null;
  respuestas?: ResumenRespuesta | null;
};

type DashboardForumCardProps = {
  forum: DashboardForum;
  href?: string;
  onSelect?: (forumId: number) => void;
  actionLabel?: string;
};

const formatDateTime = (value: NullableDate) => {
  if (value == null) return "—";

  const date =
    value instanceof Date
      ? value
      : typeof value === "number"
      ? new Date(value)
      : typeof value === "string"
      ? new Date(value)
      : null;

  if (!date || Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getUsuarioNombre = (usuario: UsuarioLigero | null | undefined, fallbackId?: number) => {
  if (!usuario) return fallbackId ? `Usuario #${fallbackId}` : "—";

  const partes = [usuario.nombres, usuario.apellidos].filter(Boolean);

  if (partes.length) return partes.join(" ");
  if (usuario.correo) return usuario.correo;
  if (usuario.id_usuario) return `Usuario #${usuario.id_usuario}`;
  if (fallbackId) return `Usuario #${fallbackId}`;
  return "—";
};

export default function DashboardForumCard({ forum, href, onSelect, actionLabel = "Ver detalles" }: DashboardForumCardProps) {
  const respuestasTotales = forum.respuestas?.total ?? null;
  const hasRespuestas = typeof respuestasTotales === "number" && respuestasTotales > 0;

  const ultimaRespuestaTexto = useMemo(() => {
    if (!forum.respuestas?.ultimaRespuesta) return "—";
    return formatDateTime(forum.respuestas.ultimaRespuesta);
  }, [forum.respuestas?.ultimaRespuesta]);

  const ultimoUsuarioNombre = useMemo(() => {
    return getUsuarioNombre(forum.respuestas?.ultimoUsuario, forum.id_usuario);
  }, [forum.respuestas?.ultimoUsuario, forum.id_usuario]);

  const actionElement = href ? (
    <a
      className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
      href={href}
    >
      {actionLabel}
    </a>
  ) : onSelect ? (
    <button
      className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
      type="button"
      onClick={() => onSelect(forum.id_foro)}
    >
      {actionLabel}
    </button>
  ) : null;

  return (
    <article className="group relative h-full rounded-2xl bg-gradient-to-tr from-sky-500/25 via-indigo-500/25 to-purple-500/25 p-[1px]">
      <div className="flex h-full flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-600">#{forum.id_foro}</span>
              Foro
            </span>
            <h3 className="mt-1 text-lg font-semibold leading-tight text-slate-900 line-clamp-2">{forum.titulo}</h3>
          </div>

          {typeof respuestasTotales === "number" && (
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-600">
                {Math.max(0, respuestasTotales)}
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Respuestas</span>
                <span className="text-sm font-semibold text-slate-700">{respuestasTotales === 1 ? "1 respuesta" : `${Math.max(0, respuestasTotales)} respuestas`}</span>
              </div>
            </div>
          )}
        </header>

        <p className="text-sm text-slate-700 line-clamp-4">{forum.consulta}</p>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Creado por</dt>
            <dd className="mt-1 font-medium text-slate-800">{getUsuarioNombre(forum.usuario, forum.id_usuario)}</dd>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Fecha de creación</dt>
            <dd className="mt-1 font-medium text-slate-800">{formatDateTime(forum.fecha)}</dd>
          </div>

          {hasRespuestas && (
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Última respuesta</dt>
              <dd className="mt-1 font-medium text-slate-800">{ultimaRespuestaTexto}</dd>
            </div>
          )}

          {hasRespuestas && (
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Respondió por última vez</dt>
              <dd className="mt-1 font-medium text-slate-800">{ultimoUsuarioNombre}</dd>
            </div>
          )}
        </dl>

        {(typeof forum.id_usuario === "number" || actionElement) && (
          <footer className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-slate-500">ID usuario: #{forum.id_usuario}</span>
            {actionElement}
          </footer>
        )}
      </div>
    </article>
  );
}