import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const data = await req.json();
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isFinite(id)) {
    return NextResponse.json(
      { error: "ID inválido" },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = {};
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.respuesta !== undefined) updateData.respuesta = data.respuesta;
  if (data.soporteId !== undefined) updateData.soporteId = data.soporteId;

  const updated = await prisma.solicitud.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.solicitud.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "Eliminado" });
}
