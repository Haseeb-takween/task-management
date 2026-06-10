import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  updatingId: string | null;
  deletingId: string | null;
}

export default function TaskList({
  tasks,
  onStatusChange,
  onDelete,
  updatingId,
  deletingId,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No tasks found</p>
        <p className="text-sm">Create a new task to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          updatingId={updatingId}
          deletingId={deletingId}
        />
      ))}
    </div>
  );
}
