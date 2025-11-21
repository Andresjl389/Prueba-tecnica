"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ClienteHome() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-3xl border border-gray-200 bg-white/90 p-10 shadow-xl backdrop-blur"
        >
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-emerald-600">Mi espacio</p>
            <h1 className="text-4xl font-bold text-gray-900">
              Panel de {user?.nombre}
            </h1>
            <p className="max-w-2xl text-base text-gray-600">
              Crea solicitudes y hazles seguimiento desde un solo lugar.
              Encuentra tus pendientes y los últimos movimientos rápidamente.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Link
              href="/cliente/crear"
              className="group block rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-lg transition hover:border-gray-300 hover:shadow-xl"
            >
              <div className="mb-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                Nuevo ticket
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Crear nueva solicitud
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Describe tu problema o requerimiento y alguien de soporte lo
                tomará. Obtén actualizaciones en tiempo real.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:gap-3">
                Comenzar
                <span aria-hidden>→</span>
              </span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Link
              href="/cliente/solicitudes"
              className="group block rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-lg transition hover:border-gray-300 hover:shadow-xl"
            >
              <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Seguimiento
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Ver mis solicitudes
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Consulta el estado, revisa respuestas del soporte y mantén un
                historial claro de cada solicitud enviada.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:gap-3">
                Revisar
                <span aria-hidden>→</span>
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
