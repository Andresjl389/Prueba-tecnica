"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchSolicitudesSoporte,
  actualizarSolicitud,
  type Solicitud,
} from "@/services/solicitudes";
import { Button } from "@/componentes/forms/button";
import { SolicitudCard } from "@/componentes/SolicitudCard";

export default function SolicitudesSoporte() {
  useAuth(); // solo para asegurar contexto
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [selected, setSelected] = useState<Solicitud | null>(null);
  const [respuestaModal, setRespuestaModal] = useState("");
  const [estadoModal, setEstadoModal] = useState<string>("PENDIENTE");

  const showToast = (type: "error" | "success", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 1000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchSolicitudesSoporte();
      setSolicitudes(data);
      if (selected) {
        const refreshed = data.find((d) => d.id === selected.id);
        if (refreshed) {
          setSelected(refreshed);
          setRespuestaModal(refreshed.respuesta ?? "");
          setEstadoModal(refreshed.estado);
        }
      }
    } catch {
      showToast("error", "No se pudieron cargar las solicitudes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSolicitud = async (id: number, fields: Partial<Solicitud>) => {
    setSavingId(id);
    try {
      const updated = await actualizarSolicitud(id, fields);
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
      );
      if (selected?.id === id) {
        setSelected(updated);
        setRespuestaModal(updated.respuesta ?? "");
        setEstadoModal(updated.estado);
        setTimeout(() => setSelected(null), 50);
      }
      showToast("success", "Solicitud actualizada");
    } catch {
      showToast("error", "No se pudo actualizar la solicitud");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-1/2 z-50 max-w-md -translate-x-1/2 rounded-xl border px-4 py-3 text-sm shadow-lg ${
              toast.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col gap-2"
        >
          <p className="text-sm font-semibold text-blue-600">Bandeja</p>
          <h1 className="text-3xl font-bold text-gray-900">
            Solicitudes asignadas
          </h1>
          <p className="text-sm text-gray-600">
            Cambia estados y responde a los clientes desde aquí.
          </p>
        </motion.div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 text-sm text-gray-600 shadow">
            Cargando solicitudes...
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/80 p-8 text-center text-sm text-gray-600 shadow-sm">
            No tienes solicitudes asignadas.
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-4 md:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {solicitudes.map((s, index) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
              >
                <SolicitudCard
                  solicitud={s}
                  onClick={() => {
                    setSelected(s);
                    setRespuestaModal(s.respuesta ?? "");
                    setEstadoModal(s.estado);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-blue-600">Ticket</p>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {selected.titulo}
                  </h2>
                  <p className="text-sm text-gray-600">ID #{selected.id}</p>
                </div>
                <button
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => setSelected(null)}
                >
                  Cerrar
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-800">{selected.descripcion}</p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Estado</p>
                  <select
                    value={estadoModal}
                    onChange={(e) => setEstadoModal(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                    disabled={savingId === selected.id}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PROCESO">En proceso</option>
                    <option value="RESUELTA">Resuelta</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Cliente</p>
                  <p className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-800">
                    {selected.cliente?.nombre ?? "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Responder</p>
                  <textarea
                    value={respuestaModal}
                    onChange={(e) => setRespuestaModal(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                    rows={4}
                    placeholder="Escribe la respuesta para el cliente..."
                    disabled={savingId === selected.id}
                  />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  className="px-4 py-2 text-sm"
                  variant="secondary"
                  onClick={() => setSelected(null)}
                  disabled={savingId === selected.id}
                >
                  Cancelar
                </Button>
                <Button
                  className="px-4 py-2 text-sm"
                  disabled={savingId === selected.id}
                  onClick={() =>
                    updateSolicitud(selected.id, {
                      estado: estadoModal,
                      respuesta: respuestaModal,
                    })
                    
                  }
                >
                  {savingId === selected.id ? "Guardando..." : "Enviar respuesta"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
