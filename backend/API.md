# Task Management REST API

**Base URL:** `http://localhost:3000`

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error (bad input) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Endpoints

### GET /tasks
Returns all tasks, sorted newest first.

**Response 200**
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
      "createdAt": "2026-06-10T09:00:00.000Z"
    }
  ]
}
```

```bash
curl http://localhost:3000/tasks
```

---

### GET /tasks/:id
Returns a single task by its MongoDB ObjectId.

**Response 200**
```json
{
  "success": true,
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Set up CI pipeline",
    "description": "Configure GitHub Actions",
    "status": "In Progress",
    "priority": "High",
    "createdAt": "2026-06-10T09:00:00.000Z"
  }
}
```

**Response 404**
```json
{ "success": false, "message": "Task not found" }
```

```bash
curl http://localhost:3000/tasks/665f1a2b3c4d5e6f7a8b9c0d
```

---

### POST /tasks
Creates a new task.

**Request Body**
| Field | Type | Required | Values |
|-------|------|----------|--------|
| title | string | yes | any non-empty string |
| description | string | no | any string |
| status | string | no | `"To Do"` \| `"In Progress"` \| `"Done"` (default: `"To Do"`) |
| priority | string | no | `"Low"` \| `"Medium"` \| `"High"` (default: `"Medium"`) |

**Response 201**
```json
{
  "success": true,
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Set up CI pipeline",
    "description": "Configure GitHub Actions",
    "status": "To Do",
    "priority": "High",
    "createdAt": "2026-06-10T09:00:00.000Z"
  }
}
```

**Response 400** (missing title)
```json
{ "success": false, "message": "Title is required" }
```

**Response 400** (invalid status)
```json
{ "success": false, "message": "Status must be 'To Do', 'In Progress', or 'Done'" }
```

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Set up CI pipeline",
    "description": "Configure GitHub Actions",
    "priority": "High"
  }'
```

---

### PUT /tasks/:id
Updates an existing task. Only send the fields you want to change.

**Request Body** (all fields optional)
| Field | Type | Values |
|-------|------|--------|
| title | string | any non-empty string |
| description | string | any string |
| status | string | `"To Do"` \| `"In Progress"` \| `"Done"` |
| priority | string | `"Low"` \| `"Medium"` \| `"High"` |

> `createdAt` is immutable and cannot be changed.

**Response 200**
```json
{
  "success": true,
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Set up CI pipeline",
    "description": "Configure GitHub Actions",
    "status": "Done",
    "priority": "High",
    "createdAt": "2026-06-10T09:00:00.000Z"
  }
}
```

```bash
curl -X PUT http://localhost:3000/tasks/665f1a2b3c4d5e6f7a8b9c0d \
  -H "Content-Type: application/json" \
  -d '{ "status": "Done" }'
```

---

### DELETE /tasks/:id
Deletes a task by ID.

**Response 200**
```json
{
  "success": true,
  "data": { "message": "Task deleted successfully" }
}
```

**Response 404**
```json
{ "success": false, "message": "Task not found" }
```

```bash
curl -X DELETE http://localhost:3000/tasks/665f1a2b3c4d5e6f7a8b9c0d
```

---

## Full Smoke-Test Sequence

```bash
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

# 4. Get single task (replace ID)
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
```
