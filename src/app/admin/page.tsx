"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminHome() {
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
            <p className="text-sm font-semibold text-gray-600">Panel admin</p>
            <h1 className="text-4xl font-bold text-gray-900">
              Administración y control
            </h1>
            <p className="max-w-2xl text-base text-gray-600">
              Accede rápidamente al tablero de métricas y al listado completo de
              solicitudes para gestionarlas o auditar estados.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Link
              href="/admin/solicitudes"
              className="group block rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-lg transition hover:border-gray-300 hover:shadow-xl"
            >
              <div className="mb-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                Listado
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Ver solicitudes
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Filtra por cliente, estado o fecha y revisa el detalle de cada
                ticket creado en el sistema.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:gap-3">
                Ir al listado
                <span aria-hidden>→</span>
              </span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Link
              href="/admin/dashboard"
              className="group block rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-lg transition hover:border-gray-300 hover:shadow-xl"
            >
              <div className="mb-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                Métricas
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Visualiza estados, top clientes y actividad reciente para tomar
                decisiones rápidas.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:gap-3">
                Ver dashboard
                <span aria-hidden>→</span>
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
