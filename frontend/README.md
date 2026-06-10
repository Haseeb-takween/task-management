# Task Management — Frontend

A task management UI built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, and **shadcn/ui**. It talks to the [backend REST API](../backend/README.md) to create, view, update, filter, and delete tasks.

## Features

- Create tasks with title, description, status, and priority
- Edit and delete existing tasks
- Filter tasks by status (`To Do`, `In Progress`, `Done`) and priority (`Low`, `Medium`, `High`)
- Responsive card-based task list

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/)
- [lucide-react](https://lucide.dev/) icons

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Create `.env.local` (or edit the existing one) and point it at the backend:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Start the backend

Make sure the [backend](../backend/README.md) is running on port `3000` first.

### 4. Run the dev server

The backend uses port `3000`, so run the frontend on port `3001` (which is also the origin allowed by the backend's CORS config):

```bash
pnpm dev -p 3001
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

## Project Structure

```
app/
├── layout.tsx        # Root layout
├── page.tsx          # Main task management page
└── globals.css       # Tailwind / theme styles
components/
├── FilterBar.tsx     # Status & priority filters
├── TaskCard.tsx      # Single task display
├── TaskForm.tsx      # Create / edit task form
├── TaskList.tsx      # Task list rendering
└── ui/               # shadcn/ui primitives
lib/
├── api.ts            # Backend API client (fetch wrappers)
├── types.ts          # Shared TypeScript types
└── utils.ts          # Utility helpers
```
