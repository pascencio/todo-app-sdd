## Why

Construir un backend base de gestión de tareas (todo app) sobre Nest.js + PostgreSQL, dockerizado para facilitar su despliegue y demostración. Sirve como proyecto demostrable del stack y base para futuras iteraciones.

## What Changes

- Monorepo pnpm con estructura `apps/*` (backend ahora, frontend después)
- Proyecto Nest.js v11 con TypeScript en `apps/backend/`
- API REST CRUD para tareas (`/tasks`)
- PostgreSQL 18 como base de datos, corriendo en Docker Compose
- App Nest.js corriendo también dentro de Docker Compose con hot-reload
- TypeORM como ORM inicial, encapsulado tras el Repository Pattern (clase abstracta como token DI)
- Integración con `pnpm` como package manager
- Cada app tiene su propio `Dockerfile`

## Capabilities

### New Capabilities
- `task-crud`: CRUD completo de tareas (crear, listar, obtener, actualizar, eliminar) con validación y respuestas REST estándar

### Modified Capabilities
<!-- Ninguna — es proyecto nuevo -->

## Impact

- Monorepo en `/home/patricio/personal/github/todo-app` con `pnpm-workspace.yaml`
- Backend en `apps/backend/` con su propio `package.json` y `Dockerfile`
- Dependencias: `@nestjs/core`, `@nestjs/typeorm`, `typeorm`, `pg` (y devDependencies de Nest)
- Infraestructura: `docker-compose.yml` en la raíz, `apps/backend/Dockerfile`
- No impacta nada existente — es greenfield
