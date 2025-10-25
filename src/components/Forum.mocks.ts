// mocks/forums.ts
import dashboardForumCardMocks from "@/components/DashboardForumCard.mocks";

// Replica mínima del shape que espera tu UI
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

const map = (x: any): ForumDetail => ({
  id_foro: x.id_foro,
  id_usuario: x.id_usuario,
  titulo: x.titulo,
  consulta: x.consulta,
  fecha: x.fecha,
  autor: x.usuario
    ? {
        id_usuario: x.usuario.id_usuario,
        nombres: x.usuario.nombres ?? null,
        apellidos: x.usuario.apellidos ?? null,
        rol: null,
      }
    : undefined,
  total_respuestas:
    typeof x.respuestas?.total === "number" ? x.respuestas.total : undefined,
});

export async function mockFetchForums(params?: { q?: string }): Promise<ForumDetail[]> {
  const q = (params?.q ?? "").toLowerCase().trim();
  const arr = dashboardForumCardMocks.map(map);
  return q
    ? arr.filter(
        f =>
          f.titulo.toLowerCase().includes(q) ||
          f.consulta.toLowerCase().includes(q)
      )
    : arr;
}

export async function mockFetchForumById(id_foro: number): Promise<ForumDetail> {
  const raw = dashboardForumCardMocks.find(m => m.id_foro === Number(id_foro));
  if (!raw) throw new Error("Foro no encontrado");
  return map(raw);
}
