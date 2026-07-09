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

## Ejemplo CRUD completo

```bash
# 1. Crear tarea (guardar ID desde la respuesta JSON)
RESP=$(curl -s -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Comprar pan","description":"Pan integral"}')
ID=$(echo "$RESP" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "$RESP"

# 2. Listar todas
curl -s http://localhost:3000/tasks

# 3. Obtener por ID
curl -s http://localhost:3000/tasks/$ID

# 4. Actualizar (marcar completada)
curl -s -X PATCH http://localhost:3000/tasks/$ID \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# 5. Eliminar
curl -s -X DELETE http://localhost:3000/tasks/$ID

# 6. Verificar que ya no existe (responde 404)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/tasks/$ID
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
