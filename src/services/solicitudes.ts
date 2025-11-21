import type { User } from "@/types/user";

export type Solicitud = {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  respuesta?: string | null;
  clienteId: number;
  soporteId?: number | null;
  fecha: string;
  cliente?: User;
  soporte?: User | null;
};

async function fetchSolicitudes(): Promise<Solicitud[]> {
  const res = await fetch("/api/solicitudes", {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("No se pudieron obtener las solicitudes");
  }
  return res.json();
}

export async function fetchSolicitudesCliente(): Promise<Solicitud[]> {
  return fetchSolicitudes();
}

export async function fetchSolicitudesSoporte(): Promise<Solicitud[]> {
  return fetchSolicitudes();
}

export async function fetchSolicitudesAdmin(): Promise<Solicitud[]> {
  return fetchSolicitudes();
}

export async function crearSolicitudCliente(payload: {
  titulo: string;
  descripcion: string;
}): Promise<Solicitud> {
  return sendSolicitudRequest<Solicitud>("/api/solicitudes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function actualizarSolicitud(
  id: number,
  fields: Partial<Pick<Solicitud, "estado" | "respuesta" | "titulo" | "descripcion">>
): Promise<Solicitud> {
  return sendSolicitudRequest<Solicitud>(`/api/solicitudes/${id}`, {
    method: "PUT",
    body: JSON.stringify(fields),
  });
}

async function sendSolicitudRequest<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error ?? "Error al procesar la solicitud";
    throw new Error(message);
  }
  return data as T;
}
