"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/componentes/forms/input";
import { Button } from "@/componentes/forms/button";
import { crearSolicitudCliente } from "@/services/solicitudes";

export default function CrearSolicitud() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const showToast = (type: "error" | "success", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const crearSolicitud = async () => {
    setLoading(true);

    try {
      await crearSolicitudCliente({
        titulo,
        descripcion,
      });
      showToast("success", "Solicitud creada con éxito. Redirigiendo...");
      setTimeout(() => {
        window.location.href = "/cliente/solicitudes";
      }, 800);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo crear la solicitud. Intenta de nuevo.";
      showToast("error", message);
    } finally {
      setLoading(false);
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

      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-3xl rounded-3xl border border-gray-200 bg-white/95 p-10 shadow-xl backdrop-blur"
        >
          <motion.div
            initial={{ opacity: 0.8, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-2"
          >
            <p className="text-sm font-semibold text-emerald-600">
              Nuevo ticket
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Crear nueva solicitud
            </h1>
            <p className="text-sm text-gray-600">
              Cuéntanos qué necesitas; entre más detalle, más rápido podremos
              ayudarte.
            </p>
          </motion.div>

          <div className="grid gap-6">
            <Input
              label="Título"
              value={titulo}
              placeholder="Ej. Problema con el servicio"
              onChangeValue={setTitulo}
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">
                Descripción
              </label>
              <textarea
                className="w-full rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                rows={5}
                placeholder="Describe el problema con detalles, pasos, fechas..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>

            <Button onClick={crearSolicitud} disabled={loading} className="w-full">
              {loading ? "Enviando..." : "Crear solicitud"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
