"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";
import { SolicitudCard } from "@/componentes/SolicitudCard";
import type { Solicitud } from "@/services/solicitudes";

const COLORS = ["#4F46E5", "#EAB308", "#22C55E"];

export default function DashboardAdmin() {
  const [stats, setStats] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/solicitudes");
      const data = await res.json();

      const counts = {
        PENDIENTE: 0,
        EN_PROCESO: 0,
        RESUELTA: 0,
      };

      data.forEach((s: Solicitud) => {
        const key = s.estado as keyof typeof counts;
        counts[key] = (counts[key] ?? 0) + 1;
      });

      setSolicitudes(data);
      setStats([
        { name: "Pendiente", value: counts.PENDIENTE, color: COLORS[1] },
        { name: "En proceso", value: counts.EN_PROCESO, color: COLORS[0] },
        { name: "Resuelta", value: counts.RESUELTA, color: COLORS[2] },
      ]);
      setLoading(false);
    };

    load();
  }, []);

  const totals = useMemo(
    () => stats.reduce((acc, s) => acc + s.value, 0),
    [stats]
  );

  const ultimas = useMemo(() => solicitudes.slice(0, 4), [solicitudes]);

  const porCliente = useMemo(() => {
    const map = new Map<string, number>();
    solicitudes.forEach((s) => {
      const nombre = s.cliente?.nombre ?? "Desconocido";
      map.set(nombre, (map.get(nombre) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [solicitudes]);

  const porDia = useMemo(() => {
    // últimas 7 fechas incluyendo días sin datos
    const today = new Date();
    const days: { date: string; value: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      days.push({ date: iso, value: 0 });
    }

    const counts = new Map<string, number>();
    solicitudes.forEach((s) => {
      const day = s.fecha.slice(0, 10);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    });

    return days.map((d) => ({ ...d, value: counts.get(d.date) ?? 0 }));
  }, [solicitudes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col gap-2"
        >
          <p className="text-sm font-semibold text-gray-600">Panel admin</p>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Visor rápido de estados y últimas solicitudes creadas.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow"
          >
            <p className="text-sm font-semibold text-gray-700">Total solicitudes</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totals}</p>
            <p className="text-xs text-gray-500 mt-1">
              Pendientes, en proceso y resueltas
            </p>
          </motion.div>
          {stats.map((s, index) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * (index + 1), ease: "easeOut" }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow"
            >
              <p className="text-sm font-semibold text-gray-700">{s.name}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{s.value}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span>Estado {s.name.toLowerCase()}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Estado general</p>
                <p className="text-xs text-gray-500">Distribución por estado</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <PieChart width={360} height={320}>
                <Pie
                  data={stats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  fill="#8884d8"
                  label
                >
                  {stats.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
            className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-lg max-h-[520px] overflow-auto"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Últimas solicitudes
                </p>
                <p className="text-xs text-gray-500">Las más recientes</p>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-gray-600">Cargando...</p>
            ) : ultimas.length === 0 ? (
              <p className="text-sm text-gray-600">Sin solicitudes registradas.</p>
            ) : (
              <div className="grid gap-4">
                {ultimas.map((s, index) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                  >
                    <SolicitudCard solicitud={s} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Top clientes</p>
                <p className="text-xs text-gray-500">Quiénes generan más tickets</p>
              </div>
            </div>
            {porCliente.length === 0 ? (
              <p className="text-sm text-gray-600">Sin datos suficientes.</p>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={porCliente} layout="vertical" margin={{ left: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 8, 8]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
            className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Evolución 7 días</p>
                <p className="text-xs text-gray-500">Tickets creados por día</p>
              </div>
            </div>
            {porDia.length === 0 ? (
              <p className="text-sm text-gray-600">Sin datos recientes.</p>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={porDia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={2.5}
                      dot={{ r: 4, strokeWidth: 1.5, fill: "#0ea37a" }}
                      activeDot={{ r: 5.5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
