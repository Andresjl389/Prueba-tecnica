/* eslint-disable @typescript-eslint/no-require-imports */
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

  const cliente1 = await prisma.usuario.upsert({
    where: { email: "cliente@test.com" },
    update: {},
    create: {
      nombre: "Cliente Test",
      email: "cliente@test.com",
      contraseña: "test123",
      roleId: clienteRole.id,
    },
  });

  const cliente2 = await prisma.usuario.upsert({
    where: { email: "cliente2@test.com" },
    update: {},
    create: {
      nombre: "Cliente Alterno",
      email: "cliente2@test.com",
      contraseña: "test123",
      roleId: clienteRole.id,
    },
  });

  const soporte = await prisma.usuario.upsert({
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

  const existingSolicitudes = await prisma.solicitud.count();
  if (existingSolicitudes === 0) {
    await prisma.solicitud.createMany({
      data: [
        {
          titulo: "Error en facturación",
          descripcion: "El monto de la última factura no coincide con el plan.",
          estado: "PENDIENTE",
          clienteId: cliente1.id,
          soporteId: soporte.id,
        },
        {
          titulo: "No puedo acceder a mi cuenta",
          descripcion: "Recibo error 403 al intentar iniciar sesión.",
          estado: "RESUELTA",
          respuesta: "Se reinició la contraseña y se verificó el acceso.",
          clienteId: cliente1.id,
          soporteId: soporte.id,
        },
        {
          titulo: "Solicitud de upgrade",
          descripcion: "Quiero pasar al plan premium el próximo mes.",
          estado: "RESUELTA",
          respuesta: "Upgrade programado y confirmado por correo.",
          clienteId: cliente1.id,
          soporteId: soporte.id,
        },
        {
          titulo: "Integración con API",
          descripcion: "Dudas sobre los endpoints y límites de uso.",
          estado: "RESUELTA",
          respuesta: "Se compartió la documentación y ejemplos.",
          clienteId: cliente2.id,
          soporteId: soporte.id,
        },
        {
          titulo: "Demora en notificaciones",
          descripcion: "Las alertas llegan con más de 10 minutos de retraso.",
          estado: "EN_PROCESO",
          respuesta: "Estamos ajustando colas de mensajería, te avisamos.",
          clienteId: cliente2.id,
          soporteId: soporte.id,
        },
      ],
    });
  }
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
