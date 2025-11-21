require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const [clienteRole, soporteRole, adminRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: "CLIENTE" },
      update: {},
      create: { name: "CLIENTE" },
    }),
    prisma.role.upsert({
      where: { name: "SOPORTE" },
      update: {},
      create: { name: "SOPORTE" },
    }),
    prisma.role.upsert({
      where: { name: "ADMIN" },
      update: {},
      create: { name: "ADMIN" },
    }),
  ]);

  await prisma.usuario.upsert({
    where: { email: "cliente@test.com" },
    update: {},
    create: {
      nombre: "Cliente Test",
      email: "cliente@test.com",
      roleId: clienteRole.id,
    },
  });

  await prisma.usuario.upsert({
    where: { email: "soporte@test.com" },
    update: {},
    create: {
      nombre: "Soporte Test",
      email: "soporte@test.com",
      roleId: soporteRole.id,
    },
  });

  await prisma.usuario.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      nombre: "Admin",
      email: "admin@test.com",
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
