## Context

Proyecto greenfield. Sin código existente. Se construye un monorepo pnpm con un backend REST para gestión de tareas siguiendo el stack Nest.js + PostgreSQL + Docker. La estructura `apps/*` permite agregar un frontend u otras apps en el futuro.

## Goals / Non-Goals

**Goals:**
- Monorepo pnpm preparado para múltiples apps (backend ahora, frontend después)
- API REST funcional con CRUD de tareas
- Arquitectura desacoplada del ORM mediante Repository Pattern
- Entorno 100% dockerizado (app + BD) con hot-reload en desarrollo
- Código limpio, estructurado y demostrable

**Non-Goals:**
- Autenticación / autorización
- UI web (solo backend)
- Tests (por ahora — se pueden agregar después)
- Migrations avanzadas (TypeORM sync basta para MVP)

## Decisions

| Decisión | Opción elegida | Alternativas | Razón |
|---|---|---|---|---|
| Runtime Node | Última Current estable (v26.x) | v22 LTS, v24 LTS | El usuario pidió última versión estable. v26 es la Current más reciente al momento del desarrollo. |
| TypeScript paths | `@/*` → `src/*` | Rutas relativas | Imports absolutos evitan `../../../` y mejoran refactor. Nest CLI soporta tsconfig-paths nativamente (desde v11). |
| ORM | TypeORM | Prisma, Sequelize | TypeORM es el más integrado con Nest (`@nestjs/typeorm`). Curva baja y suficiente para el alcance. |
| Repository Pattern | Clase abstracta como token DI | Interface + `@Inject(Symbol)` | La clase abstracta existe en runtime y no requiere `@Inject()` en cada consumidor. Kamil Mysliwiec lo recomienda. |
| Validación | class-validator + class-transformer | Joi, Zod | Es el estándar de Nest, integración nativa con `ValidationPipe`. |
| Hot-reload | Volumen montando `./apps/backend/src` + `nest start --watch` | Sin hot-reload, rebuild manual | Experiencia dev fluida. El volumen bind-mount refleja cambios locales en el contenedor. |
| Postgres image | `postgres:18` | `postgres:18-alpine` | Official recomendada. El volume mount debe ir en `/var/lib/postgresql` (PG 18+ usa subdirectorios por versión). |
| Gestión de paquetes | pnpm | npm, yarn | El usuario lo pidió explícitamente. Corepack no viene en Node 26 → `npm install -g corepack` en Dockerfile. |
| Repo structure | Monorepo pnpm con `apps/*` + `packages/*` | Todo en la raíz | Escalable: el frontend después vive en `apps/frontend/` con su propio `Dockerfile`. Cada app es independiente. |
| Docker multi-app | Dockerfile por app en su carpeta | Un Dockerfile raíz con lógica | Cada app define su propia imagen. `docker-compose.yml` referencia `context: .` + `dockerfile: apps/backend/Dockerfile`. |

### Arquitectura

```
  todo-app/                 (pnpm workspace root)
  ├── pnpm-workspace.yaml
  ├── package.json          (private: true)
  ├── docker-compose.yml
  │
  ├── apps/
  │   └── backend/
  │       ├── package.json
  │       ├── Dockerfile
  │       └── src/
  │
  └── packages/             (futuro: shared libs)

  ┌─────────────────────────────────────────────────────┐
  │                    DOCKER COMPOSE                    │
  ├─────────────────────────────────────────────────────┤
  │                                                     │
  │  ┌──────────────────┐   ┌─────────────────────────┐ │
  │  │  postgres:18      │   │  app: backend           │ │
  │  │  :5432            │   │  :3000                  │ │
  │  │                   │   │                         │ │
  │  │  DB: todo_app     │   │  context: ./apps/backend│ │
  │  │  User: postgres   │   │  volume: ./apps/backend │ │
  │  │                   │   │  /src → /app/src        │ │
  │  └──────────────────┘   └─────────────────────────┘ │
  └─────────────────────────────────────────────────────┘
```

### Estructura de módulos

```
apps/backend/src/
├── main.ts                    # bootstrap, ValidationPipe global
├── app.module.ts              # módulo raíz
├── tasks/
│   ├── tasks.module.ts        # módulo del feature
│   ├── tasks.controller.ts    # endpoints REST
│   ├── tasks.service.ts       # lógica de negocio
│   ├── dto/
│   │   ├── create-task.dto.ts
│   │   └── update-task.dto.ts
│   ├── entities/
│   │   └── task.entity.ts
│   └── repository/
│       ├── tasks-repository.abstract.ts   # contrato (clase abstracta)
│       └── typeorm-tasks.repository.ts    # implementación TypeORM
└── common/
    └── filters/
        └── http-exception.filter.ts
```

### Data Model

```
Task
───────────────────────────────────
id             UUID (PK, auto)
title          VARCHAR(255) NOT NULL
description    TEXT nullable
completed      BOOLEAN DEFAULT false
createdAt      TIMESTAMP DEFAULT NOW()
updatedAt      TIMESTAMP DEFAULT NOW()
```

### API Endpoints

| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| GET | /tasks | - | `Task[]` |
| GET | /tasks/:id | - | `Task \| 404` |
| POST | /tasks | `CreateTaskDto` | `Task` (201) |
| PATCH | /tasks/:id | `UpdateTaskDto` | `Task \| 404` |
| DELETE | /tasks/:id | - | `204` |

### Docker Setup

```dockerfile
# apps/backend/Dockerfile
FROM node:26-alpine
RUN npm install -g corepack && corepack enable
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile
COPY apps/backend/ ./apps/backend/
WORKDIR /app/apps/backend
CMD ["pnpm", "dev"]
```

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:18
    environment:
      POSTGRES_DB: todo_app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql   # PG 18+ usa subdirectorios por versión
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .                     # raíz del monorepo para incluir workspace
      dockerfile: apps/backend/Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./apps/backend/src:/app/apps/backend/src  # hot-reload
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      DB_NAME: todo_app

volumes:
  pgdata:
```

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|---|
| TypeORM `synchronize: true` en producción es peligroso | Solo se usa en desarrollo. Para deploy real se agregan migrations. |
| Hot-reload en Docker puede ser lento en macOS/Windows | Usar volúmenes montados con `:cached` si es necesario. |
| Clase abstracta como DI token limita a una implementación por módulo | Si se necesita múltiples impl, usar `@Inject(Symbol)` con el patrón de multi-proveedor. |
| pnpm workspace: dependencias compartidas | Se instalan desde la raíz con `pnpm install`. Cada app puede tener sus propias dependencias en su `package.json`. |
| Node 26 no incluye corepack | `npm install -g corepack` explícito en Dockerfile antes de `corepack enable`. |
| PG 18+ images cambian estructura de data directory | Mount en `/var/lib/postgresql` (no `/var/lib/postgresql/data`). Siempre hacer `down -v` al cambiar versión mayor. |
| Imports relativos `../../../` se vuelven ilegibles | Configurar `@/*` path alias en tsconfig. Nest CLI lo resuelve automáticamente en build y watch. |
