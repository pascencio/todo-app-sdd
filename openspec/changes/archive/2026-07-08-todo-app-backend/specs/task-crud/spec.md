## ADDED Requirements

### Requirement: Create task
The system SHALL allow creating a new task with title, optional description, and default `completed: false`.

#### Scenario: Create task with title only
- **WHEN** a POST request is sent to `/tasks` with `{"title": "Comprar leche"}`
- **THEN** the system responds with HTTP 201 and a task object containing `id`, `title: "Comprar leche"`, `description: null`, `completed: false`, `createdAt`, and `updatedAt`

#### Scenario: Create task with all fields
- **WHEN** a POST request is sent to `/tasks` with `{"title": "Comprar leche", "description": "Ir al super antes de las 8"}`
- **THEN** the system responds with HTTP 201 and a task object containing the provided fields

#### Scenario: Create task with empty title
- **WHEN** a POST request is sent to `/tasks` with `{"title": ""}`
- **THEN** the system responds with HTTP 400 and a validation error

#### Scenario: Create task without title
- **WHEN** a POST request is sent to `/tasks` with `{}`
- **THEN** the system responds with HTTP 400 and a validation error

### Requirement: List tasks
The system SHALL return all tasks when a GET request is sent to `/tasks`.

#### Scenario: List all tasks
- **WHEN** a GET request is sent to `/tasks`
- **THEN** the system responds with HTTP 200 and an array of task objects

#### Scenario: List tasks when empty
- **WHEN** a GET request is sent to `/tasks` and there are no tasks
- **THEN** the system responds with HTTP 200 and an empty array

### Requirement: Get task by ID
The system SHALL return a single task by its ID.

#### Scenario: Get existing task
- **WHEN** a GET request is sent to `/tasks/{id}` and a task with that ID exists
- **THEN** the system responds with HTTP 200 and the task object

#### Scenario: Get non-existent task
- **WHEN** a GET request is sent to `/tasks/{id}` and no task with that ID exists
- **THEN** the system responds with HTTP 404

### Requirement: Update task
The system SHALL allow partial updates to a task (title, description, and/or completed).

#### Scenario: Update title only
- **WHEN** a PATCH request is sent to `/tasks/{id}` with `{"title": "Nuevo titulo"}`
- **THEN** the system responds with HTTP 200 and the task with the updated title

#### Scenario: Mark task as completed
- **WHEN** a PATCH request is sent to `/tasks/{id}` with `{"completed": true}`
- **THEN** the system responds with HTTP 200 and the task with `completed: true`

#### Scenario: Update non-existent task
- **WHEN** a PATCH request is sent to `/tasks/{id}` and no task with that ID exists
- **THEN** the system responds with HTTP 404

### Requirement: Delete task
The system SHALL allow deleting a task by its ID.

#### Scenario: Delete existing task
- **WHEN** a DELETE request is sent to `/tasks/{id}` and a task with that ID exists
- **THEN** the system responds with HTTP 204 and no body

#### Scenario: Delete non-existent task
- **WHEN** a DELETE request is sent to `/tasks/{id}` and no task with that ID exists
- **THEN** the system responds with HTTP 404
