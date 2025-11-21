"use client";

import { Button } from "@/componentes/forms/button";
import { Input } from "@/componentes/forms/input";

type Props = {
  estado: string;
  clienteNombre: string;
  fecha: string;
  onEstadoChange: (v: string) => void;
  onClienteChange: (v: string) => void;
  onClienteNombreChange: (v: string) => void;
  onFechaChange: (v: string) => void;
};

export function AdminSolicitudesFilters({
  estado,
  clienteNombre,
  fecha,
  onEstadoChange,
  onClienteChange,
  onClienteNombreChange,
  onFechaChange,
}: Props) {
  return (
    <form
      className="grid grid-cols-1 gap-4 rounded-xl bg-white p-4 shadow md:grid-cols-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <label className="text-sm text-gray-600">Buscar cliente</label>
        <Input
          value={clienteNombre}
          onChangeValue={onClienteNombreChange}
          placeholder="Nombre del cliente"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Estado</label>
        <select
          value={estado}
          onChange={(e) => onEstadoChange(e.target.value)}
          className="h-11 w-full rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
        >
          <option value="">Todos</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_PROCESO">En proceso</option>
          <option value="RESUELTA">Resuelta</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-600">Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => onFechaChange(e.target.value)}
          className="h-11 w-full rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200 text-gray-900"
        />
      </div>

      <div className="flex items-end">
        <Button
          className="w-full"
          type="button"
          onClick={() => {
            onEstadoChange("");
            onClienteChange("");
            onClienteNombreChange("");
            onFechaChange("");
          }}
        >
          Borrar filtros
        </Button>
      </div>
    </form>
  );
}
