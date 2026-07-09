# Todo App — SDD

Monorepo con backend REST para gestión de tareas. Nest.js + TypeORM + PostgreSQL + Docker.

## Stack

| Componente | Versión |
|---|---|
| Node.js | 26 |
| Nest.js | 11.1 |
| TypeORM | 0.3.x |
| PostgreSQL | 18 |
| pnpm | 11.10 |

## Quick Start

```bash
docker compose up --build
```

API disponible en `http://localhost:3000/tasks`.

## API

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/tasks` | Listar tareas |
| `GET` | `/tasks/:id` | Obtener tarea |
| `POST` | `/tasks` | Crear tarea |
| `PATCH` | `/tasks/:id` | Actualizar tarea |
| `DELETE` | `/tasks/:id` | Eliminar tarea |

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Comprar pan"}'
```

## Estructura

```
todo-app/
├── apps/backend/          ← API Nest.js
│   ├── src/tasks/         ← Módulo Tasks (controller, service, dto, entity, repository)
│   └── Dockerfile
├── docker-compose.yml     ← Postgres + app
└── docs/architecture.md   ← Diagramas y documentación detallada
```

## Documentación

Ver [`docs/architecture.md`](docs/architecture.md) para diagramas de flujo, BD, data dictionary y convenciones.
