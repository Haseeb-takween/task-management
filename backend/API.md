# Task Management REST API — Documentation

A simple REST API for managing tasks, built with Express 5, TypeScript, and MongoDB (Mongoose).

## Base URLs

| Environment | URL |
|-------------|-----|
| Local development | `http://localhost:3000` |
| Production (Vercel) | `https://task-management-backend-haseeb.vercel.app` |

All examples below use the local URL — swap in the production URL as needed.

## Authentication

None. All endpoints are public.

## Response Envelope

Every response follows a consistent JSON shape.

**Success**

```json
{
  "success": true,
  "data": { ... }
}
```

**Error**

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

## HTTP Status Codes

| Code | Meaning | When it occurs |
|------|---------|----------------|
| 200 | OK | Successful read, update, or delete |
| 201 | Created | Task created successfully |
| 400 | Bad Request | Validation failed (missing title, invalid status/priority) |
| 404 | Not Found | Task ID does not exist, ID is not a valid ObjectId, or unknown route |
| 500 | Internal Server Error | Unexpected server/database failure |

## CORS

The API only accepts browser requests from origins listed in the `CORS_ORIGIN` environment variable (comma-separated). Trailing slashes are stripped automatically. Tools like curl or Postman are unaffected.

---

## The Task Object

```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c0d",
  "title": "Set up CI pipeline",
  "description": "Configure GitHub Actions",
  "status": "In Progress",
  "priority": "High",
  "createdAt": "2026-06-10T09:00:00.000Z",
  "updatedAt": "2026-06-10T10:30:00.000Z",
  "__v": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | MongoDB ObjectId, generated automatically |
| `title` | string | Task title. Required, trimmed of whitespace |
| `description` | string | Optional details. Trimmed of whitespace |
| `status` | string | One of `"To Do"`, `"In Progress"`, `"Done"`. Default: `"To Do"` |
| `priority` | string | One of `"Low"`, `"Medium"`, `"High"`. Default: `"Medium"` |
| `createdAt` | string (ISO 8601) | Set automatically on creation. Immutable |
| `updatedAt` | string (ISO 8601) | Updated automatically on every save |
| `__v` | number | Mongoose internal version key. Ignore it |

---

## Endpoints

### Health Check

#### `GET /`

Verifies the API is up. Does not touch the database.

**Response `200`**

```json
{
  "success": true,
  "data": { "message": "API is running" }
}
```

```bash
curl http://localhost:3000/
```

---

### List All Tasks

#### `GET /tasks`

Returns every task, sorted by creation date — newest first. Returns an empty array if no tasks exist.

**Response `200`**

```json
{
  "success": true,
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "title": "Set up CI pipeline",
      "description": "Configure GitHub Actions",
      "status": "In Progress",
      "priority": "High",
      "createdAt": "2026-06-10T09:00:00.000Z",
      "updatedAt": "2026-06-10T09:00:00.000Z",
      "__v": 0
    }
  ]
}
```

```bash
curl http://localhost:3000/tasks
```

---

### Get a Single Task

#### `GET /tasks/:id`

Returns one task by its MongoDB ObjectId.

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | 24-character hex ObjectId of the task |

**Response `200`**

```json
{
  "success": true,
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Set up CI pipeline",
    "description": "Configure GitHub Actions",
    "status": "In Progress",
    "priority": "High",
    "createdAt": "2026-06-10T09:00:00.000Z",
    "updatedAt": "2026-06-10T09:00:00.000Z",
    "__v": 0
  }
}
```

**Response `404`** — ID not found, or not a valid ObjectId

```json
{ "success": false, "message": "Task not found" }
```

```bash
curl http://localhost:3000/tasks/665f1a2b3c4d5e6f7a8b9c0d
```

---

### Create a Task

#### `POST /tasks`

Creates a new task. Requires `Content-Type: application/json`.

**Request Body**

| Field | Type | Required | Constraints | Default |
|-------|------|----------|-------------|---------|
| `title` | string | **Yes** | Must be non-empty after trimming whitespace | — |
| `description` | string | No | Any string | — |
| `status` | string | No | `"To Do"` \| `"In Progress"` \| `"Done"` (exact match, case-sensitive) | `"To Do"` |
| `priority` | string | No | `"Low"` \| `"Medium"` \| `"High"` (exact match, case-sensitive) | `"Medium"` |

Unknown fields are ignored.

**Example Request**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Set up CI pipeline",
    "description": "Configure GitHub Actions",
    "priority": "High"
  }'
```

**Response `201`**

```json
{
  "success": true,
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Set up CI pipeline",
    "description": "Configure GitHub Actions",
    "status": "To Do",
    "priority": "High",
    "createdAt": "2026-06-10T09:00:00.000Z",
    "updatedAt": "2026-06-10T09:00:00.000Z",
    "__v": 0
  }
}
```

**Validation Errors `400`**

| Condition | Response message |
|-----------|------------------|
| `title` missing or only whitespace | `"Title is required"` |
| `status` not one of the allowed values | `"Status must be 'To Do', 'In Progress', or 'Done'"` |
| `priority` not one of the allowed values | `"Priority must be 'Low', 'Medium', or 'High'"` |

```json
{ "success": false, "message": "Title is required" }
```

---

### Update a Task

#### `PUT /tasks/:id`

Partially updates an existing task. Send only the fields you want to change — omitted fields keep their current values.

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | 24-character hex ObjectId of the task |

**Request Body** (all fields optional)

| Field | Type | Constraints |
|-------|------|-------------|
| `title` | string | Must be non-empty after trimming, if provided |
| `description` | string | Any string. Send `""` to clear it |
| `status` | string | `"To Do"` \| `"In Progress"` \| `"Done"` |
| `priority` | string | `"Low"` \| `"Medium"` \| `"High"` |

> `createdAt` is immutable and cannot be changed. `updatedAt` is refreshed automatically.

**Example Request**

```bash
curl -X PUT http://localhost:3000/tasks/665f1a2b3c4d5e6f7a8b9c0d \
  -H "Content-Type: application/json" \
  -d '{ "status": "Done" }'
```

**Response `200`**

```json
{
  "success": true,
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Set up CI pipeline",
    "description": "Configure GitHub Actions",
    "status": "Done",
    "priority": "High",
    "createdAt": "2026-06-10T09:00:00.000Z",
    "updatedAt": "2026-06-10T11:45:00.000Z",
    "__v": 0
  }
}
```

**Error Responses**

| Code | Condition | Message |
|------|-----------|---------|
| 404 | Task not found or invalid ObjectId | `"Task not found"` |
| 400 | `title` provided but empty/whitespace | `"Title is required"` |
| 400 | Invalid `status` value | `"Status must be 'To Do', 'In Progress', or 'Done'"` |
| 400 | Invalid `priority` value | `"Priority must be 'Low', 'Medium', or 'High'"` |

---

### Delete a Task

#### `DELETE /tasks/:id`

Permanently deletes a task. This cannot be undone.

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | 24-character hex ObjectId of the task |

**Response `200`**

```json
{
  "success": true,
  "data": { "message": "Task deleted successfully" }
}
```

**Response `404`** — ID not found, or not a valid ObjectId

```json
{ "success": false, "message": "Task not found" }
```

```bash
curl -X DELETE http://localhost:3000/tasks/665f1a2b3c4d5e6f7a8b9c0d
```

---

### Unknown Routes

Any request to a route not listed above returns:

**Response `404`**

```json
{ "success": false, "message": "Route not found" }
```

---

## Full Smoke-Test Sequence

Run these in order to verify every endpoint and validation rule:

```bash
# 0. Health check
curl http://localhost:3000/

# 1. Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","priority":"Low"}'

# 2. Create another task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Fix login bug","description":"Auth token expires too early","status":"In Progress","priority":"High"}'

# 3. List all tasks
curl http://localhost:3000/tasks

# 4. Get single task (replace <ID> with a real _id from step 3)
curl http://localhost:3000/tasks/<ID>

# 5. Update status to Done
curl -X PUT http://localhost:3000/tasks/<ID> \
  -H "Content-Type: application/json" \
  -d '{"status":"Done"}'

# 6. Delete task
curl -X DELETE http://localhost:3000/tasks/<ID>

# 7. Confirm deleted → 404
curl http://localhost:3000/tasks/<ID>

# 8. Validation — missing title → 400
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"No title here"}'

# 9. Validation — bad status → 400
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","status":"todo"}'

# 10. Validation — bad priority → 400
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","priority":"urgent"}'

# 11. Unknown route → 404
curl http://localhost:3000/nonexistent
```
