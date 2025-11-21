import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const [clienteRole, soporteRole, adminRole] = await Promise.all([
    prisma.role.upsert({
      where: { nombre: "CLIENTE" },
      update: {},
      create: { nombre: "CLIENTE" },
    }),
    prisma.role.upsert({
      where: { nombre: "SOPORTE" },
      update: {},
      create: { nombre: "SOPORTE" },
    }),
    prisma.role.upsert({
      where: { nombre: "ADMIN" },
      update: {},
      create: { nombre: "ADMIN" },
    }),
  ]);

  await prisma.usuario.upsert({
    where: { email: "cliente@test.com" },
    update: {},
    create: {
      nombre: "Cliente Test",
      email: "cliente@test.com",
      contraseña: "test123",
      roleId: clienteRole.id,
    },
  });

  await prisma.usuario.upsert({
    where: { email: "soporte@test.com" },
    update: {},
    create: {
      nombre: "Soporte Test",
      email: "soporte@test.com",
      contraseña: "test123",
      roleId: soporteRole.id,
    },
  });

  await prisma.usuario.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      nombre: "Admin",
      email: "admin@test.com",
      contraseña: "test123",
      roleId: adminRole.id,
    },
  });
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
