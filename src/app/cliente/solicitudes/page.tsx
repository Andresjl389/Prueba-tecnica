"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchSolicitudesCliente,
  type Solicitud,
} from "@/services/solicitudes";
import { SolicitudCard } from "@/componentes/SolicitudCard";

export default function MisSolicitudes() {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const showToast = (type: "error" | "success", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSolicitudesCliente();
        setSolicitudes(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las solicitudes.";
        showToast("error", message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);
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
          <p className="text-sm font-semibold text-emerald-600">Mis tickets</p>
          <h1 className="text-3xl font-bold text-gray-900">Solicitudes</h1>
          <p className="text-sm text-gray-600">
            Revisa cada solicitud, su estado y las respuestas del equipo de
            soporte.
          </p>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-gray-200 bg-white/90 p-6 text-sm text-gray-600 shadow"
          >
            Cargando solicitudes...
          </motion.div>
        ) : solicitudes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0.9, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-gray-200 bg-white/80 p-8 text-center text-sm text-gray-600 shadow-sm"
          >
            Aún no tienes solicitudes. Crea la primera para recibir soporte.
          </motion.div>
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
                <SolicitudCard solicitud={s} showRespuesta />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
