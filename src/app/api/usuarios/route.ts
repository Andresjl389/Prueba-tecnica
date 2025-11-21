import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const sessionToken = req.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="))
    ?.split("=")[1];

  const session = await verifySessionToken(sessionToken);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { email } = await req.json();

  const user = await prisma.usuario.findUnique({
    where: { email },
    include: { role: true }
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json(user);
}
