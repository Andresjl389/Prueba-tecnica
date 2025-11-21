# Prueba Técnica – Sistema de Gestión de Solicitudes

Interfaz web para gestionar solicitudes según rol (Cliente, Soporte, Admin) consumiendo API interna con servicios reutilizables, dashboards y feedback al usuario.

## Tecnologías
- Next.js 16 (App Router) + TypeScript
- TailwindCSS 4, Framer Motion, Recharts
- Prisma + PostgreSQL (adapter-pg)
- Context API para sesión y servicios fetch tipados

## Arquitectura
- Next.js App Router con rutas separadas por rol.
- API interna en `/app/api/*` con cookies HttpOnly y middleware de rol.
- Prisma para acceso a datos y migraciones versionadas.
- Context API para sesión del usuario.

## Variables de entorno
Crea un archivo `.env` en la raíz con:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
SESSION_SECRET="una_clave_secreta_para_sesiones"
```
Usa tus credenciales reales de base de datos; el secreto puede ser cualquier string seguro.

## Instalación y ejecución
1) Clona el repositorio y entra a la carpeta  
`git clone <repo> && cd <repo>`

2) Crea `.env` con `DATABASE_URL` y `SESSION_SECRET` (ver sección Variables de entorno).

3) Instala dependencias  
`npm install`

4) Aplica el esquema de base de datos  
`npx prisma migrate deploy`

5) (Opcional) Carga datos de ejemplo: roles, usuarios y 5 solicitudes distribuidas  
`npm run seed`

6) Levanta el proyecto en dev  
`npm run dev`  
Disponible en `http://localhost:3000`.

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

## Rutas por rol
- Cliente: `/cliente` (crear y ver solicitudes propias)
- Soporte: `/soporte` (asignadas, estados y respuestas)
- Admin: `/admin` (filtros globales + dashboard)

## Autenticación
El login genera una cookie HttpOnly firmada. Un middleware valida el rol y bloquea rutas no autorizadas. Las rutas de API también verifican el rol antes de responder.

## Vista previa
Agrega aquí capturas o GIFs rápidos del panel Cliente, Soporte y Admin para una referencia visual.

## Funcionalidades implementadas
- Login con redirección por rol y feedback (toasts, validaciones básicas).
- Panel Cliente: crear solicitud y ver listado propio con estado/respuesta.
- Panel Soporte: ver asignadas, actualizar estado y responder (servicio reutilizable).
- Panel Admin: listado con filtros (cliente, estado, fecha) y dashboard con gráficas.
- Animaciones suaves en tablas/cards y diseño responsivo con Tailwind.
- Servicios de API centralizados para auth y solicitudes.

## Mejoras posibles
- Agregar tests automatizados.
- Validaciones extendidas (límites de longitud, formatos específicos).
- Mejor manejo de errores en API y UI.
