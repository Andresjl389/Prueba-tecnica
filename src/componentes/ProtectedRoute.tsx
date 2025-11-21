"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/types/user";

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: string[];
  redirectTo?: string;
};

export default function ProtectedRoute({
  children,
  roles,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, login } = useAuth();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const ensureAuth = async () => {
      try {
        let currentUser: User | null = user;

        // Si no hay usuario en el contexto, rehidrata desde la sesión en el servidor
        if (!currentUser) {
          const res = await fetch("/api/auth/me", {
            credentials: "include",
          });
          if (!res.ok) {
            router.replace(redirectTo);
            return;
          }
          const fetched = (await res.json()) as User;
          currentUser = fetched;
          login(fetched);
        }

        if (!currentUser) {
          router.replace(redirectTo);
          return;
        }

        // Validar rol si se requiere
        if (roles && roles.length > 0) {
          const allowed = roles.includes(currentUser.role.nombre);
          if (!allowed) {
            router.replace(redirectTo);
            return;
          }
        }

        if (isMounted) {
          setAuthorized(true);
        }
      } catch {
        router.replace(redirectTo);
      } finally {
        if (isMounted) setChecking(false);
      }
    };

    ensureAuth();
    return () => {
      isMounted = false;
    };
  }, [user, roles, redirectTo, router, login]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-600">
        Cargando...
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
