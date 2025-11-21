import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/session";
import { NextResponse } from "next/server";

function getSessionTokenFromRequest(req: Request) {
  return req.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="))
    ?.split("=")[1];
}

export async function GET(request: Request) {
  const session = await verifySessionToken(getSessionTokenFromRequest(request));
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const solicitudes = await prisma.solicitud.findMany({
    where: {
      clienteId: session.id,
    },
    orderBy: { id: "desc" },
    include: {
      cliente: true,
      soporte: true,
    },
  });

  return NextResponse.json(solicitudes);
}

export async function POST(req: Request) {
  const session = await verifySessionToken(getSessionTokenFromRequest(req));
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();

  const nueva = await prisma.solicitud.create({
    data: {
      titulo: body.titulo,
      descripcion: body.descripcion,
      clienteId: session.id,
      soporteId: body.soporteId ?? null,
    },
  });

  return NextResponse.json(nueva);
}
