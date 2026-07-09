## 1. Monorepo Setup

- [x] 1.1 Crear `package.json` raíz con `private: true` y script `"dev": "pnpm --filter backend dev"`
- [x] 1.2 Crear `pnpm-workspace.yaml` definiendo `packages: ['apps/*', 'packages/*']`
- [x] 1.3 Inicializar proyecto Nest.js v11 como `apps/backend/` con `nest new` moviendo los archivos a esa carpeta
- [x] 1.4 Agregar dependencias en `apps/backend/`: `@nestjs/typeorm`, `typeorm`, `pg`, `class-validator`, `class-transformer`
- [x] 1.5 Crear carpeta `apps/backend/src/tasks/` con estructura de módulo (controller, service, dto, entity, repository)

## 2. Docker Setup

- [x] 2.1 Crear `apps/backend/Dockerfile` con Node 22-alpine, corepack enable, pnpm install, CMD `pnpm dev`
- [x] 2.2 Crear `apps/backend/.dockerignore` excluyendo `node_modules`, `dist`, `.git`
- [x] 2.3 Crear `docker-compose.yml` en la raíz con servicios `postgres` (image: postgres:18, healthcheck) y `app` (build: ./apps/backend, volumen apps/backend/src, depends_on postgres)
- [x] 2.4 Configurar variables de entorno en docker-compose para conexión a BD

## 3. Database Layer (apps/backend/)

- [x] 3.1 Crear entity `Task` con campos: id (UUID auto), title, description (nullable), completed (default false), createdAt, updatedAt
- [x] 3.2 Configurar `TypeOrmModule.forRoot()` en `AppModule` usando variables de entorno del contenedor
- [x] 3.3 Configurar `synchronize: true` (solo para dev)

## 4. Repository Pattern (apps/backend/)

- [x] 4.1 Crear clase abstracta `TasksRepository` con métodos: findAll, findById, create, update, delete
- [x] 4.2 Crear implementación `TypeOrmTasksRepository extends TasksRepository` usando `@InjectRepository`
- [x] 4.3 Registrar `TypeOrmTasksRepository` como provider con token `TasksRepository` (useClass) en TasksModule

## 5. DTOs (apps/backend/)

- [x] 5.1 Crear `CreateTaskDto` con title (string, required), description (string, optional)
- [x] 5.2 Crear `UpdateTaskDto` con title, description, completed (todos opcionales, partial type)

## 6. Service Layer (apps/backend/)

- [x] 6.1 Implementar `TasksService` con dependencia `TasksRepository` (clase abstracta, sin @Inject)
- [x] 6.2 Métodos: findAll, findById (return 404 si no existe), create, update, delete (return 404 si no existe)

## 7. Controller (apps/backend/)

- [x] 7.1 Implementar `TasksController` con ruta base `/tasks`
- [x] 7.2 Endpoints: GET /tasks, GET /tasks/:id, POST /tasks, PATCH /tasks/:id, DELETE /tasks/:id
- [x] 7.3 Usar `ValidationPipe` global en main.ts para validación automática de DTOs
- [x] 7.4 Agregar `HttpExceptionFilter` global para respuestas de error consistentes

## 8. Verification (docker compose up desde la raíz)

- [x] 8.1 Levantar stack con `docker compose up --build`
- [x] 8.2 Probar CRUD completo con curl: crear tarea, listar, obtener, actualizar, eliminar
- [x] 8.3 Verificar validación: POST sin title debe retornar 400
- [ ] 8.4 Verificar hot-reload: cambiar un mensaje de log y confirmar que se refleja sin rebuild

## 9. Post-Setup (lecciones aprendidas)

- [x] 9.1 Actualizar Node a v26 (último stable) en Dockerfile y tsconfig paths `@/*`
- [x] 9.2 Fix volume mount de Postgres 18+ a `/var/lib/postgresql`
- [x] 9.3 Fix corepack no incluido en Node 26 → `npm install -g corepack`
- [x] 9.4 Crear `openspec/config.yaml` con contexto y reglas del proyecto
- [x] 9.5 Crear `docs/architecture.md` con diagramas de flujo, BD y data dictionary
- [x] 9.6 Actualizar `design.md` con decisiones finales
