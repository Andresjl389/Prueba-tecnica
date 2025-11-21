"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./forms/button";

const navByRole: Record<string, { label: string; href: string }[]> = {
  CLIENTE: [
    { label: "Inicio", href: "/cliente" },
    { label: "Crear", href: "/cliente/crear" },
    { label: "Solicitudes", href: "/cliente/solicitudes" },
  ],
  SOPORTE: [
    { label: "Inicio", href: "/soporte" },
    { label: "Solicitudes", href: "/soporte/solicitudes" },
  ],
  ADMIN: [
    { label: "Admin", href: "/admin" },
    { label: "Solicitudes", href: "/admin/solicitudes" },
    { label: "Dashboard", href: "/admin/dashboard" }
  ],
};

function getNav(role?: string) {
  if (!role) return [];
  return navByRole[role] ?? [];
}

function homeByRole(role?: string) {
  if (!role) return "/";
  if (role === "CLIENTE") return "/cliente";
  if (role === "SOPORTE") return "/soporte";
  if (role === "ADMIN") return "/admin";
  return "/";
}

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/login")) return null;

  const items = getNav(user?.role?.nombre);
  const homeHref = homeByRole(user?.role?.nombre);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href={homeHref} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white font-bold">
            GS
          </div>
          <span className="text-sm font-semibold text-gray-900">
            Gestion Solicitudes
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 transition ${
                  active
                    ? "bg-gray-900 text-white shadow-sm"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                onClick={async () => {
                  await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "include",
                  });
                  logout();
                  window.location.href = "/";
                }}
                className="px-3 py-2 text-sm"
              >
                Salir
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
