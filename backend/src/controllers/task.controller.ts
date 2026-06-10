import mongoose from "mongoose";
import type { NextFunction, Request, Response } from "express";
import { Task, type TaskPriority, type TaskStatus } from "../models/task.model.js";
import { sendError, sendSuccess } from "../lib/response.js";
import { messages } from "../messages/index.js";

const VALID_STATUSES: TaskStatus[] = ["To Do", "In Progress", "Done"];
const VALID_PRIORITIES: TaskPriority[] = ["Low", "Medium", "High"];

export async function getTasks(_req: Request, res: Response, next: NextFunction) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return sendSuccess(res, tasks);
  } catch (err) {
    next(err);
  }
}

export async function getTaskById(req: Request, res: Response, next: NextFunction) {
  try {
    if (!mongoose.isValidObjectId(req.params["id"])) {
      return sendError(res, messages.task.notFound, 404);
    }

    const task = await Task.findById(req.params["id"]);
    if (!task) return sendError(res, messages.task.notFound, 404);

    return sendSuccess(res, task);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, status, priority } = req.body as {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
    };

    if (!title || !title.trim()) {
      return sendError(res, messages.task.titleRequired, 400);
    }

    if (status !== undefined && !VALID_STATUSES.includes(status as TaskStatus)) {
      return sendError(res, messages.task.invalidStatus, 400);
    }

    if (priority !== undefined && !VALID_PRIORITIES.includes(priority as TaskPriority)) {
      return sendError(res, messages.task.invalidPriority, 400);
    }

    const task = await new Task({ title, description, status, priority }).save();
    return sendSuccess(res, task, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    if (!mongoose.isValidObjectId(req.params["id"])) {
      return sendError(res, messages.task.notFound, 404);
    }

    const task = await Task.findById(req.params["id"]);
    if (!task) return sendError(res, messages.task.notFound, 404);

    const { title, description, status, priority } = req.body as {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
    };

    if (title !== undefined) {
      if (!title.trim()) return sendError(res, messages.task.titleRequired, 400);
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status as TaskStatus)) {
        return sendError(res, messages.task.invalidStatus, 400);
      }
      task.status = status as TaskStatus;
    }

    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority as TaskPriority)) {
        return sendError(res, messages.task.invalidPriority, 400);
      }
      task.priority = priority as TaskPriority;
    }

    await task.save();
    return sendSuccess(res, task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    if (!mongoose.isValidObjectId(req.params["id"])) {
      return sendError(res, messages.task.notFound, 404);
    }

    const task = await Task.findByIdAndDelete(req.params["id"]);
    if (!task) return sendError(res, messages.task.notFound, 404);

    return sendSuccess(res, { message: messages.task.deleted });
  } catch (err) {
    next(err);
  }
}
