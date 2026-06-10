import mongoose, { type Document, Schema } from "mongoose";

export type TaskStatus = "To Do" | "In Progress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"] satisfies TaskStatus[],
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"] satisfies TaskPriority[],
      default: "Medium",
    },
  },
  { timestamps: true },
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
