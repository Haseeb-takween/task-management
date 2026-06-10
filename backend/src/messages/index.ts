export const messages = {
  api: {
    running: "API is running",
  },
  task: {
    created: "Task created successfully",
    updated: "Task updated successfully",
    deleted: "Task deleted successfully",
    notFound: "Task not found",
    fetched: "Tasks fetched successfully",
    titleRequired: "Title is required",
    invalidStatus: "Status must be 'To Do', 'In Progress', or 'Done'",
    invalidPriority: "Priority must be 'Low', 'Medium', or 'High'",
  },
  errors: {
    notFound: "Route not found",
    internal: "Internal server error",
  },
} as const;
