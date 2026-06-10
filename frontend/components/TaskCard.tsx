"use client";

import { Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task, TaskStatus } from "@/lib/types";

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  Low: "bg-gray-100 text-gray-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

const STATUS_OPTIONS: TaskStatus[] = ["To Do", "In Progress", "Done"];

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  updatingId: string | null;
  deletingId: string | null;
}

export default function TaskCard({
  task,
  onStatusChange,
  onDelete,
  updatingId,
  deletingId,
}: TaskCardProps) {
  const isUpdating = updatingId === task._id;
  const isDeleting = deletingId === task._id;

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="flex flex-row items-start justify-between pb-1">
        <Badge className={PRIORITY_STYLES[task.priority]}>{task.priority}</Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(task._id)}
          disabled={isDeleting}
          aria-label="Delete task"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div>
          <p className="font-semibold leading-snug">{task.title}</p>
          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={task.status}
            onValueChange={(val) => onStatusChange(task._id, val as TaskStatus)}
            disabled={isUpdating}
          >
            <SelectTrigger className="h-8 text-xs w-36">
              {isUpdating ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Updating…
                </span>
              ) : (
                <SelectValue />
              )}
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-xs text-muted-foreground">
          {new Date(task.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </CardContent>
    </Card>
  );
}
