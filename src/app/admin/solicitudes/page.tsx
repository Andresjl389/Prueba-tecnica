"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AdminSolicitudesFilters } from "@/componentes/AdminSolicitudesFilters";
import { AdminSolicitudesTable } from "@/componentes/AdminSolicitudesTable";
import { fetchSolicitudesAdmin, type Solicitud } from "@/services/solicitudes";

export default function SolicitudesAdmin() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const [estado, setEstado] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const solicitudesData = await fetchSolicitudesAdmin();
        setSolicitudes(solicitudesData);
      } catch (error) {
        console.error("No se pudieron obtener las solicitudes", error);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return solicitudes.filter((s) => {
      if (clienteId && s.clienteId !== Number(clienteId)) return false;
      if (
        clienteNombre &&
        !s.cliente?.nombre.toLowerCase().includes(clienteNombre.toLowerCase())
      )
        return false;
      if (estado && s.estado !== estado) return false;
      if (fecha && s.fecha.slice(0, 10) !== fecha) return false;
      return true;
    });
  }, [solicitudes, clienteId, clienteNombre, estado, fecha]);

  const resumen = useMemo(() => {
    const base = { PENDIENTE: 0, EN_PROCESO: 0, RESUELTA: 0 };
    filtered.forEach((s) => {
      base[s.estado as keyof typeof base] =
        (base[s.estado as keyof typeof base] ?? 0) + 1;
    });
    return base;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col gap-2"
        >
          <p className="text-sm font-semibold text-gray-600">Panel admin</p>
          <h1 className="text-3xl font-bold text-gray-900">Solicitudes</h1>
          <p className="text-sm text-gray-600">
            Filtra por cliente, estado o fecha y revisa el listado completo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow">
            <p className="text-sm font-semibold text-gray-700">Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {filtered.length}
            </p>
            <p className="text-xs text-gray-500">Tras filtros aplicados</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow">
            <p className="text-sm font-semibold text-gray-700">Pendientes</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {resumen.PENDIENTE ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow">
            <p className="text-sm font-semibold text-gray-700">Resueltas</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {resumen.RESUELTA ?? 0}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
        >
          <AdminSolicitudesFilters
            estado={estado}
            clienteNombre={clienteNombre}
            fecha={fecha}
            onEstadoChange={setEstado}
            onClienteChange={setClienteId}
            onClienteNombreChange={setClienteNombre}
            onFechaChange={setFecha}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
        >
          <AdminSolicitudesTable data={filtered} />
        </motion.div>
      </div>
    </div>
  );
}
