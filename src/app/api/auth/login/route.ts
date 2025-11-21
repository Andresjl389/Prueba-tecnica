import { prisma } from "@/lib/prisma";
import { createSessionToken } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || user.contraseña !== password) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contraseña, ...safeUser } = user;

    const session = await createSessionToken({
      id: user.id,
      email: user.email,
      role: user.role.nombre,
    });

    const res = NextResponse.json(safeUser);
    res.cookies.set("session", session, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      { error: "Error procesando la solicitud" },
      { status: 500 }
    );
  }
}
