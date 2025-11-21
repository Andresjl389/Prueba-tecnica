import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const solicitudes = await prisma.solicitud.findMany({
    include: {
      cliente: true,
      soporte: true,
    }
  });

  return NextResponse.json(solicitudes);
}

export async function POST(req: Request) {
  const body = await req.json();

  const nueva = await prisma.solicitud.create({
    data: {
      titulo: body.titulo,
      descripcion: body.descripcion,
      clienteId: body.clienteId,
      soporteId: body.soporteId ?? null,
    }
  });

  return NextResponse.json(nueva);
}
