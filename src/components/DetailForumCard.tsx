"use client";

export type ForoBase = {
  id_foro: number;
  id_usuario: number;
  titulo: string;
  consulta: string;
  fecha: string; // ISO DATETIME(3)
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

/* ===========================================================
   Helper local para formatear fechas
   =========================================================== */
function fmt(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/* ===========================================================
   Componente: muestra título, autor, fecha y consulta
   =========================================================== */
export default function DetailForumCard({ post }: { post: ForumDetail }) {
  const nombreAutor =
    post.autor?.nombres || post.autor?.apellidos
      ? `${post.autor?.nombres ?? ""} ${post.autor?.apellidos ?? ""}`.trim()
      : null;

  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">{post.titulo}</h2>

      <p className="text-gray-600 mt-1 text-sm">
        {nombreAutor ? <>Por {nombreAutor}</> : null}
        {post.autor?.rol ? <> · {post.autor.rol}</> : null}
        <> · {fmt(post.fecha)}</>
      </p>

      <p className="mt-3 text-gray-800 whitespace-pre-wrap">{post.consulta}</p>

      <p className="mt-3 text-sm text-gray-500">
        💬 {typeof post.total_respuestas === "number" ? post.total_respuestas : 0} respuestas
      </p>
    </article>
  );
}
