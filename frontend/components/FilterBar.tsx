"use client";

import { Button } from "@/components/ui/button";
import type { TaskStatus } from "@/lib/types";

const FILTERS: Array<TaskStatus | "All"> = ["All", "To Do", "In Progress", "Done"];

interface FilterBarProps {
  active: TaskStatus | "All";
  onChange: (filter: TaskStatus | "All") => void;
}

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <Button
          key={f}
          variant={active === f ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(f)}
        >
          {f}
        </Button>
      ))}
    </div>
  );
}
