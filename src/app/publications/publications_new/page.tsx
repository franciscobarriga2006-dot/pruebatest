"use client";
import { useState } from "react";
import Footer from "../../../components/footer";
import PublicationCardNew from "../../../components/PublicationCardNew";
import { ToastProvider } from "../../../components/ToastContext";
// import PublicarServicioForm from "../../../components/PublicarServicioForm"; // <-- Descomenta cuando esté listo

export default function PublicationsNewPage() {
  const [selectedForm, setSelectedForm] = useState<"trabajo" | "servicio">("trabajo");

  return (
    <ToastProvider>
      <main className="max-w-3xl mx-auto px-4 py-12 min-h-[70vh] flex flex-col items-center">
        {/* Título introductorio */}
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4 text-center">
          Crear una nueva publicación
        </h1>
        <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl">
          Selecciona el tipo de publicación que deseas crear. Puedes publicar una oferta de trabajo
          o un servicio.
        </p>

        {/* Botones de selección */}
        <div className="flex gap-6 mb-10">
          <button
            className={`px-6 py-3 rounded-xl font-semibold border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              selectedForm === "trabajo"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setSelectedForm("trabajo")}
          >
            Publicar Trabajo
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              selectedForm === "servicio"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setSelectedForm("servicio")}
            disabled
            title="Próximamente"
          >
            Publicar Servicio
          </button>
        </div>

        {/* Formulario dinámico */}
        {selectedForm === "trabajo" && <PublicationCardNew />}
        {selectedForm === "servicio" && (
          <p className="text-gray-500 text-center italic">
            El formulario para publicar servicio estará disponible próximamente.
          </p>
        )}
      </main>
      <Footer />
    </ToastProvider>
  );
}
