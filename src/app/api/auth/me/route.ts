import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/session";

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get("session")?.value;
  const session = await verifySessionToken(sessionToken);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.usuario.findUnique({
    where: { id: session.id },
    include: { role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { contraseña, ...safeUser } = user;
  return NextResponse.json(safeUser);
}
