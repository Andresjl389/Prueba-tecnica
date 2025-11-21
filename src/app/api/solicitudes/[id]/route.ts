import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const id = Number(params.id);

  const updated = await prisma.solicitud.update({
    where: { id },
    data: {
      estado: data.estado,
      respuesta: data.respuesta,
      soporteId: data.soporteId,
    }
  });

  return NextResponse.json(updated);
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.solicitud.delete({
    where: { id: Number(params.id) }
  });

  return NextResponse.json({ message: "Eliminado" });
}
