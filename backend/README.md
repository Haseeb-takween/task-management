# Task Management — Backend

REST API for the task management app, built with **Express 5**, **TypeScript**, and **MongoDB (Mongoose)**.

## Tech Stack

- [Express 5](https://expressjs.com/) — HTTP server
- [Mongoose](https://mongoosejs.com/) — MongoDB ODM
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [tsx](https://tsx.is/) + [nodemon](https://nodemon.io/) — dev hot-reload

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Port the server listens on | `3000` |
| `MONGODB_URI` | MongoDB connection string | — (required) |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3001` |

### 3. Run the server

```bash
# Development (auto-restarts on changes)
pnpm dev

# Production
pnpm build
pnpm start
```

The API will be available at `http://localhost:3000`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/tasks` | List all tasks (newest first) |
| GET | `/tasks/:id` | Get a single task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

All responses follow the shape `{ "success": boolean, "data": ... }` (or `{ "success": false, "message": "..." }` on error).

See [API.md](./API.md) for full request/response examples, validation rules, and a curl smoke-test sequence.

## Task Model

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Required |
| `description` | string | Optional |
| `status` | string | `To Do` \| `In Progress` \| `Done` (default: `To Do`) |
| `priority` | string | `Low` \| `Medium` \| `High` (default: `Medium`) |
| `createdAt` | date | Set on creation, immutable |

## Project Structure

```
src/
├── config/        # Environment variable loading
├── controllers/   # Request handlers (health, tasks)
├── lib/           # DB connection, response helpers
├── messages/      # Centralized response messages
├── middleware/    # Error handling
├── models/        # Mongoose schemas
├── routes/        # Express routers
├── app.ts         # Express app setup
└── index.ts       # Server entry point
```
