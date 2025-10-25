// components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/publications/publications_view", label: "Publicaciones" },
  { href: "/publications/publications_own", label: "Mis Publicaciones" },
  { href: "/chat", label: "Mis Chats" },
  { href: "/forum", label: "Foro" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [animatingItems, setAnimatingItems] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const logout = async () => {
    try {
      setSigningOut(true);
      if (typeof window !== "undefined") localStorage.removeItem("uid");
      await api.post("/auth/logout").catch(() => {});
    } finally {
      setSigningOut(false);
      router.push("/auth/homepublic");
      router.refresh();
    }
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Activar animación cuando se abre el dropdown
  useEffect(() => {
    if (dropdownOpen) {
      setAnimatingItems(false);
      const timer = setTimeout(() => setAnimatingItems(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimatingItems(false);
    }
  }, [dropdownOpen]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-16">
          {/* Izquierda: Logo + nombre */}
          <div className="flex items-center gap-2 justify-self-start">
            <img
              src="/JobMatch.png"
              alt="JobMatch Logo"
              className="h-16 w-16"
            />
            <span className="text-2xl font-bold text-blue-600">JobMatch</span>
          </div>

          {/* Centro: Nav */}
          <nav className="hidden md:flex justify-center items-center gap-8">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={[
                  "text-sm font-medium transition-colors duration-200",
                  isActive(href)
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Derecha: Avatar con dropdown */}
          <div className="justify-self-end relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Menú de usuario"
              title="Abrir menú"
              className="group relative inline-block h-10 w-10 rounded-full p-[2px]
                         bg-gradient-to-tr from-blue-600 via-cyan-400 to-purple-500
                         transition-transform duration-200 hover:scale-105
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              type="button"
            >
              <span
                className="pointer-events-none absolute inset-0 rounded-full blur-[6px]
                           opacity-40 group-hover:opacity-70
                           bg-gradient-to-tr from-blue-600/40 via-cyan-400/40 to-purple-500/40"
                aria-hidden="true"
              />
              <span className="relative block h-full w-full rounded-full overflow-hidden bg-white ring-1 ring-black/5">
                <Image
                  src="/avatar.png"
                  alt="Foto de perfil"
                  fill
                  sizes="40px"
                  className="object-cover"
                  priority
                />
              </span>
              <span
                className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                aria-hidden="true"
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                  style={{
                    opacity: animatingItems ? 1 : 0,
                    transform: animatingItems
                      ? "translateY(0)"
                      : "translateY(-10px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    transitionDelay: "0ms",
                  }}
                >
                  Ver perfil
                </Link>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                  style={{
                    opacity: animatingItems ? 1 : 0,
                    transform: animatingItems
                      ? "translateY(0)"
                      : "translateY(-10px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    transitionDelay: "80ms",
                  }}
                >
                  Ayuda
                </button>
                <div
                  className="border-t border-gray-100 my-1"
                  style={{
                    opacity: animatingItems ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    transitionDelay: "160ms",
                  }}
                ></div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  disabled={signingOut}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-60 transition-colors duration-200"
                  type="button"
                  style={{
                    opacity: animatingItems ? 1 : 0,
                    transform: animatingItems
                      ? "translateY(0)"
                      : "translateY(-10px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    transitionDelay: "240ms",
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <nav className="flex justify-center flex-wrap gap-4">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={[
                  "text-xs font-medium transition-colors duration-200",
                  isActive(href)
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
