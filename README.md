# Prueba Técnica – Sistema de Gestión de Solicitudes

Interfaz web para gestionar solicitudes según rol (Cliente, Soporte, Admin) consumiendo API interna con servicios reutilizables, dashboards y feedback al usuario.

## Tecnologías
- Next.js 16 (App Router) + TypeScript
- TailwindCSS 4, Framer Motion, Recharts
- Prisma + PostgreSQL (adapter-pg)
- Context API para sesión y servicios fetch tipados

## Variables de entorno
Crea un archivo `.env` en la raíz con:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
SESSION_SECRET="una_clave_secreta_para_sesiones"
```
Usa tus credenciales reales de base de datos; el secreto puede ser cualquier string seguro.

## Instalación y ejecución
1) Instala dependencias  
`npm install`

2) Aplica el esquema de base de datos  
`npx prisma migrate deploy`

3) Carga datos de ejemplo (roles, usuarios y 5 solicitudes distribuidas)  
`npm run seed`

4) Levanta el proyecto  
`npm run dev`  
App disponible en `http://localhost:3000`.

Scripts útiles:
- `npm run lint` valida el código.
- `npm run build` genera el build productivo.
- `npm run start` sirve el build generado.

## Datos de prueba
Usuarios creados por el seed (contraseña: `test123`):
- Admin: `admin@test.com`
- Soporte: `soporte@test.com`
- Cliente A: `cliente@test.com` (3 solicitudes)
- Cliente B: `cliente2@test.com` (2 solicitudes)

## Funcionalidades implementadas
- Login con redirección por rol y feedback (toasts, validaciones básicas).
- Panel Cliente: crear solicitud y ver listado propio con estado/respuesta.
- Panel Soporte: ver asignadas, actualizar estado y responder (servicio reutilizable).
- Panel Admin: listado con filtros (cliente, estado, fecha) y dashboard con gráficas.
- Animaciones suaves en tablas/cards y diseño responsivo con Tailwind.
- Servicios de API centralizados para auth y solicitudes.

## Pendiente / mejoras posibles
- Agregar tests automatizados.
- Extender validaciones (límites de longitud, formatos específicos).
- Manejo de errores más granular en toda la app (mensajes por código).
