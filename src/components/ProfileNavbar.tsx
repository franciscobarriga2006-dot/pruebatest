"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";

type NavItem = {
  id: string;
  label: string;
};

const items: NavItem[] = [
  { id: "personal", label: "Información" },
  { id: "publicaciones", label: "Publicaciones" },
  { id: "pendientes", label: "Pendientes" },
  { id: "favoritos", label: "Favoritos" },
  { id: "historial", label: "Historial" },
];

export default function ProfileNavbar({ className = "" }: { className?: string }) {
  const [active, setActive] = useState<string>(items[0].id);
  const [panelOpenFor, setPanelOpenFor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [panelPosition, setPanelPosition] = useState<{ left?: number; top?: number; width?: number; height?: number } | null>(null);

  useEffect(() => {
    const onScroll = () => {
      // detect which section is nearest to top and set active accordingly
      let nearest = active;
      let nearestDist = Number.POSITIVE_INFINITY;

      items.forEach((it) => {
        const el = document.getElementById(it.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - 120); // offset
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = it.id;
        }
      });

      setActive(nearest);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  const handleClick = async (id: string) => {
    // same scroll behavior
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);

    // do NOT open the inline panel for 'personal' (Información)
    if (id === 'personal') {
      setPanelOpenFor(null);
      setPreview([]);
      return;
    }

    // open inline preview panel only for certain sections
  if (id === "publicaciones" || id === "pendientes" || id === "favoritos" || id === "historial") {
      // toggle if already open
      if (panelOpenFor === id) {
        setPanelOpenFor(null);
        setPreview([]);
        return;
      }

      setPanelOpenFor(id);
      // compute panel position/size so it exactly overlays the profile card
      try {
        const card = document.querySelector('.max-w-4xl.mx-auto.bg-white.rounded-2xl') as HTMLElement | null;
        if (card) {
          const cardRect = card.getBoundingClientRect();
          // use viewport coords (fixed positioning)
          setPanelPosition({ left: Math.floor(cardRect.left), top: Math.floor(cardRect.top), width: Math.floor(cardRect.width), height: Math.floor(cardRect.height) });
        } else {
          setPanelPosition(null);
        }
      } catch (e) {
        setPanelPosition(null);
      }
      setLoading(true);
      setPreview([]);
      try {
        if (id === "publicaciones") {
          const res = await api.get<{ items: any[] }>('/publicaciones', { params: { limit: 6, offset: 0 } });
          setPreview(Array.isArray(res.data.items) ? res.data.items.slice(0, 6) : []);
        } else if (id === "pendientes") {
          const res = await api.get<{ items: any[] }>('/mis_postulaciones', { params: { limit: 6, offset: 0 } });
          setPreview(Array.isArray(res.data.items) ? res.data.items.slice(0, 6) : []);
        } else {
          // favoritos / historial: no dedicated API here in frontend helper — show placeholder
          setPreview([]);
        }
      } catch (e) {
        console.error('Preview load error', e);
        setPreview([]);
      } finally {
        setLoading(false);
      }
    } else {
      // if other section clicked, close panel
      setPanelOpenFor(null);
      setPreview([]);
    }
  };

  const renderPanelContent = () => (
    loading ? (
      <div className="text-center text-sm text-gray-500">Cargando...</div>
    ) : panelOpenFor === 'personal' ? (
      // mini profile card (should not be reached because personal doesn't open panel)
      preview[0]?.__miniProfile ? (
        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-lg">{(preview[0].name || 'U').charAt(0)}</div>
          <div>
            <div className="text-base font-semibold">{preview[0].name}</div>
            {preview[0].title && <div className="text-sm text-indigo-600">{preview[0].title}</div>}
            {preview[0].location && <div className="text-xs text-gray-500 mt-1">{preview[0].location}</div>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm">Editar perfil</button>
            <a href="/profile" className="text-sm text-gray-600 underline">Ver perfil</a>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">Información no disponible.</div>
      )
    ) : panelOpenFor === 'favoritos' || panelOpenFor === 'historial' ? (
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-2">Esta sección tiene su página dedicada.</div>
        <div className="flex gap-2">
          <a href={panelOpenFor === 'favoritos' ? '/profile/favorites' : '/profile/profilehistory'} className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">Ir a {panelOpenFor === 'favoritos' ? 'Favoritos' : 'Historial'}</a>
          <button onClick={() => { setPanelOpenFor(null); setPreview([]); }} className="px-3 py-2 border rounded-md text-sm">Cerrar</button>
        </div>
      </div>
    ) : preview.length === 0 ? (
      <div className="text-sm text-gray-500">No hay resultados.</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {preview.map((p: any, i: number) => (
          <article key={i} className="group bg-white rounded-lg border hover:shadow-md p-3">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-semibold line-clamp-2">{p.titulo ?? p.publicacion_titulo ?? 'Sin título'}</h5>
                  {p.estado && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{p.estado}</span>}
                </div>
                { (p.descripcion || p.mensaje) && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.descripcion ?? p.mensaje}</p> }
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  {(p.ciudad || p.region) && <span>📍 { [p.ciudad, p.region].filter(Boolean).join(', ') }</span> }
                  {p.monto != null && <span className="ml-auto font-medium text-gray-800">{typeof p.monto === 'number' ? new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(p.monto) : p.monto}</span>}
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <a href={p.id_publicacion ? `/publications/publications_view?id=${p.id_publicacion}` : '#'} className="px-3 py-1 rounded bg-indigo-600 text-white text-xs">Abrir</a>
                <div className="text-xs text-gray-400">{p.created_at ? new Date(p.created_at).toLocaleDateString('es-CL') : ''}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    )
  );

  return (
    <div className="relative">
      <nav className={`w-full ${className}`} aria-label="Perfil navigation">
        <div className="max-w-4xl mx-auto bg-white rounded-md p-2 shadow-sm">
          <ul className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {items.map((it) => (
            <li key={it.id}>
              <button
                className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active === it.id ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleClick(it.id)}
                aria-current={active === it.id}
              >
                {it.label}
              </button>
            </li>
          ))}
          </ul>
        </div>
      </nav>

      {/* Inline preview panel */}
      {panelOpenFor && (panelPosition ? (
        <div className="fixed z-50" style={{ left: panelPosition.left, top: panelPosition.top, width: panelPosition.width, height: panelPosition.height }}>
          <div className="bg-white rounded-2xl p-6 shadow-2xl ring-1 ring-gray-50 h-full overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold">
                {panelOpenFor === 'publicaciones' ? 'Últimas publicaciones'
                  : panelOpenFor === 'pendientes' ? 'Mis postulaciones'
                  : panelOpenFor === 'favoritos' ? 'Favoritos'
                  : panelOpenFor === 'historial' ? 'Historial'
                  : ''}
              </h4>
              <button className="text-xs text-gray-500" onClick={() => { setPanelOpenFor(null); setPreview([]); }}>Cerrar</button>
            </div>
            {renderPanelContent()}
          </div>
        </div>
      ) : (
        <div className="absolute left-0 right-0 mt-2 z-50 flex justify-center">
          <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl ring-1 ring-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold">
                {panelOpenFor === 'publicaciones' ? 'Últimas publicaciones'
                  : panelOpenFor === 'pendientes' ? 'Mis postulaciones'
                  : panelOpenFor === 'favoritos' ? 'Favoritos'
                  : panelOpenFor === 'historial' ? 'Historial'
                  : ''}
              </h4>
              <button className="text-xs text-gray-500" onClick={() => { setPanelOpenFor(null); setPreview([]); }}>Cerrar</button>
            </div>
            {renderPanelContent()}
          </div>
        </div>
      ))}
    </div>
  );
}
