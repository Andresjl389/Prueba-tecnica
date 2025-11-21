"use client";

import type { Solicitud } from "@/services/solicitudes";
import clsx from "clsx";

type SolicitudCardProps = {
  solicitud: Solicitud;
  onClick?: () => void;
  showRespuesta?: boolean;
  className?: string;
};

const statusStyles: Record<string, string> = {
  PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
  EN_PROCESO: "bg-blue-50 text-blue-700 border-blue-200",
  RESUELTA: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function SolicitudCard({
  solicitud,
  onClick,
  showRespuesta = false,
  className = "",
}: SolicitudCardProps) {
  const content = (
    <div
      className={clsx(
        "flex h-full min-h-[180px] w-full min-w-[260px] flex-col rounded-2xl border border-gray-200 bg-white/90 p-6 text-left shadow transition hover:-translate-y-1 hover:shadow-lg focus:outline-none sm:min-w-[280px] md:min-w-0",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {solicitud.titulo}
        </h2>
        <span
          className={clsx(
            "rounded-full border px-3 py-1 text-xs font-semibold",
            statusStyles[solicitud.estado] ??
              "bg-gray-100 text-gray-700 border-gray-200"
          )}
        >
          {solicitud.estado.replace("_", " ")}
        </span>
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-gray-700 flex-1">
        {solicitud.descripcion}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Cliente: {solicitud.cliente?.nombre ?? "N/A"}</span>
        <span>ID #{solicitud.id}</span>
      </div>

      {showRespuesta && solicitud.respuesta && (
        <div className="mt-4 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Respuesta del soporte</p>
          <p className="text-gray-700">{solicitud.respuesta}</p>
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-left h-full w-full"
        aria-label={solicitud.titulo}
      >
        {content}
      </button>
    );
  }

  return content;
}
