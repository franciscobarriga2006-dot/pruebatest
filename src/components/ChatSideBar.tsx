"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatItem } from "./Chat";

// Tipo basado en la tabla Chats de la BD
type ChatItemData = {
  id_chat: number;          // de la tabla Chats
  name: string;             // nombre del otro usuario
  lastMessage: string;      // último mensaje
  fecha: string;            // DATETIME(3) como ISO string
  avatarBg?: string;        // generado en frontend
};

// MOCK - en producción vendrá del backend
const MOCK: ChatItemData[] = [
  { id_chat: 1, name: "Ricardo López", lastMessage: "Hola Ricardo te dejo la información que pediste sobre la oferta.", fecha: new Date().toISOString(), avatarBg: "bg-blue-100 text-blue-700" },
  { id_chat: 2, name: "Ana García", lastMessage: "Entendido, gracias por confirmar. Te envío todo en la tarde.", fecha: new Date(Date.now() - 1000 * 60 * 60).toISOString(), avatarBg: "bg-green-100 text-green-700" },
  { id_chat: 3, name: "Carlos Ruiz", lastMessage: "Perfecto, nos vemos el miércoles para la clase.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), avatarBg: "bg-purple-100 text-purple-700" },
  { id_chat: 4, name: "Sofía Martínez", lastMessage: "¿Podrías enviarme tu portafolio cuando tengas un rato?", fecha: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), avatarBg: "bg-pink-100 text-pink-700" },
  { id_chat: 5, name: "Javier Pérez", lastMessage: "Sí, el plazo de entrega es el viernes. Todo bien por aquí.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), avatarBg: "bg-yellow-100 text-yellow-700" },
  { id_chat: 6, name: "Luis Torres", lastMessage: "Gracias por tu respuesta, coordinamos mañana.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), avatarBg: "bg-indigo-100 text-indigo-700" },
  { id_chat: 7, name: "Alberto Caro", lastMessage: "Si no estudias, estas frito!!", fecha: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), avatarBg: "bg-cyan-100 text-cyan-700" },
  { id_chat: 8, name: "María Fernández", lastMessage: "Excelente trabajo en el proyecto, felicitaciones!", fecha: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), avatarBg: "bg-rose-100 text-rose-700" },
  { id_chat: 9, name: "Diego Vargas", lastMessage: "Necesito que revises los documentos cuando puedas.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), avatarBg: "bg-orange-100 text-orange-700" },
  { id_chat: 10, name: "Valentina Silva", lastMessage: "¿A qué hora es la reunión de mañana?", fecha: new Date(Date.now() - 1000 * 60 * 60 * 192).toISOString(), avatarBg: "bg-teal-100 text-teal-700" },
  { id_chat: 11, name: "Mateo Rojas", lastMessage: "Te envié el correo con toda la info, revísalo.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 216).toISOString(), avatarBg: "bg-violet-100 text-violet-700" },
  { id_chat: 12, name: "Camila Soto", lastMessage: "Perfecto, nos coordinamos para la próxima semana.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(), avatarBg: "bg-fuchsia-100 text-fuchsia-700" },
  { id_chat: 13, name: "Sebastián Mora", lastMessage: "Oye, podrías ayudarme con ese tema que conversamos?", fecha: new Date(Date.now() - 1000 * 60 * 60 * 264).toISOString(), avatarBg: "bg-lime-100 text-lime-700" },
  { id_chat: 14, name: "Isabella Castro", lastMessage: "Gracias por tu tiempo, fue muy útil la reunión.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 288).toISOString(), avatarBg: "bg-amber-100 text-amber-700" },
  { id_chat: 15, name: "Nicolás Herrera", lastMessage: "Listo, ya quedó todo programado para el viernes.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 312).toISOString(), avatarBg: "bg-emerald-100 text-emerald-700" },
  { id_chat: 16, name: "Francisca Muñoz", lastMessage: "Hola! Te quería consultar sobre el presupuesto.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 336).toISOString(), avatarBg: "bg-sky-100 text-sky-700" },
  { id_chat: 17, name: "Benjamín Ortiz", lastMessage: "Dale, nos vemos el lunes entonces. Saludos!", fecha: new Date(Date.now() - 1000 * 60 * 60 * 360).toISOString(), avatarBg: "bg-red-100 text-red-700" },
  { id_chat: 18, name: "Martina Reyes", lastMessage: "Claro que sí, sin problema. Cuenta conmigo.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 384).toISOString(), avatarBg: "bg-slate-100 text-slate-700" },
];

export default function ChatSidebar() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatItemData[]>(MOCK);
  const [selectedChatId, setSelectedChatId] = useState<number | string | null>(null);

  const handleSelectChat = (id?: number | string) => {
    if (!id) return;
    setSelectedChatId(id);
    const selected = chats.find((c) => c.id_chat === id);
    if (!selected) return;
    const newList = [selected, ...chats.filter((c) => c.id_chat !== id)];
    setChats(newList);

    // 📡 Redirección comentada temporalmente
    // router.push(`/chat/${id}`);
  };

  return (
    <div className="flex h-screen max-w-7xl mx-auto">
      <aside className="w-96 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-800">
            Mensajes
          </h2>
        </div>

        {/* Lista scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="space-y-0">
            {chats.map((c) => (
              <div key={c.id_chat} className="relative">
                {selectedChatId === c.id_chat && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 z-10" />
                )}
                <ChatItem
                  id={c.id_chat}
                  name={c.name}
                  lastMessage={c.lastMessage}
                  fecha={c.fecha}
                  avatarBg={c.avatarBg}
                  onClick={handleSelectChat}
                  className={`rounded-none border-b border-gray-100 transition-all ${
                    selectedChatId === c.id_chat 
                      ? 'bg-blue-50 hover:bg-blue-50' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Área de chat principal */}
      <main className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-lg font-medium text-gray-500">Selecciona un chat para comenzar</p>
        </div>
      </main>
    </div>
  );
}