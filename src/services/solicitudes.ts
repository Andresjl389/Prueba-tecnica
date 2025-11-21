import type { User } from "@/types/user";

export type Solicitud = {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  respuesta?: string | null;
  clienteId: number;
  cliente?: User;
  soporte?: User | null;
};

export async function fetchSolicitudesCliente(): Promise<Solicitud[]> {
  const res = await fetch("/api/solicitudes", {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("No se pudieron obtener las solicitudes");
  }
  return res.json();
}

export async function crearSolicitudCliente(payload: {
  titulo: string;
  descripcion: string;
}) {
  const res = await fetch("/api/solicitudes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("No se pudo crear la solicitud");
  }
  return res.json();
}
