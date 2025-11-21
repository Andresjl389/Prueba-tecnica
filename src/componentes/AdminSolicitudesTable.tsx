"use client";

import type { Solicitud } from "@/services/solicitudes";
import { AnimatePresence, motion } from "framer-motion";

const statusStyles: Record<string, string> = {
  PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
  EN_PROCESO: "bg-blue-50 text-blue-700 border-blue-200",
  RESUELTA: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

type Props = {
  data: Solicitud[];
};

export function AdminSolicitudesTable({ data }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-lg">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Título</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Fecha</th>
            <th className="p-3">Soporte</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <AnimatePresence initial={false}>
            {data.map((s, index) => (
              <motion.tr
                key={s.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
                className="hover:bg-gray-50"
              >
              <td className="p-3 font-semibold text-gray-900">{s.id}</td>
              <td className="p-3 text-gray-800">{s.cliente?.nombre ?? "-"}</td>
              <td className="p-3 text-gray-800">{s.titulo}</td>
              <td className="p-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                    statusStyles[s.estado] ??
                    "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                  {s.estado.replace("_", " ")}
                </span>
              </td>
              <td className="p-3 text-gray-700">
                {s.fecha ? s.fecha.slice(0, 10) : "-"}
              </td>
              <td className="p-3 text-gray-700">
                {s.soporte?.nombre ?? "-"}
              </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
      {data.length === 0 && (
        <p className="py-6 text-center text-gray-600">
          No se encontraron resultados.
        </p>
      )}
    </div>
  );
}
