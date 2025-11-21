import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const roles = await prisma.role.findMany();
  return NextResponse.json(roles);
}
