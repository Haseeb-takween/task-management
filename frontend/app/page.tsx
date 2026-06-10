"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterBar from "@/components/FilterBar";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import { getAllTasks, createTask, updateTask, deleteTask } from "@/lib/api";
import type { CreateTaskPayload, Task, TaskStatus } from "@/lib/types";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskStatus | "All">("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllTasks();
        if (!cancelled) setTasks(data);
      } catch {
        if (!cancelled) setError("Failed to load tasks. Make sure the backend is running.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  async function handleCreate(payload: CreateTaskPayload) {
    const task = await createTask(payload);
    setTasks((prev) => [task, ...prev]);
  }

  async function handleStatusChange(id: string, status: TaskStatus) {
    setUpdatingId(id);
    try {
      const updated = await updateTask(id, { status });
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
            </p>
          </div>
          <TaskForm onSubmit={handleCreate} />
        </div>

        {/* Filter bar */}
        <div className="mb-6">
          <FilterBar active={filter} onChange={setFilter} />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/10 px-6 py-10 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        )}

        {/* Task list */}
        {!loading && !error && (
          <TaskList
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            updatingId={updatingId}
            deletingId={deletingId}
          />
        )}
      </div>
    </main>
  );
}
