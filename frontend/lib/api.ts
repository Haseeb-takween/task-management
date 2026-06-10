import type { CreateTaskPayload, Task, UpdateTaskPayload } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const json = await res.json() as { success: boolean; data: T; message?: string };

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? "Something went wrong");
  }

  return json.data;
}

export function getAllTasks(): Promise<Task[]> {
  return request<Task[]>("/tasks");
}

export function createTask(payload: CreateTaskPayload): Promise<Task> {
  return request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
  return request<Task>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTask(id: string): Promise<void> {
  return request<void>(`/tasks/${id}`, { method: "DELETE" });
}
