import type { NextFunction, Request, Response } from "express";
import { messages } from "../messages/index.js";
import { sendError } from "../lib/response.js";

export function notFoundHandler(_req: Request, res: Response) {
  return sendError(res, messages.errors.notFound, 404);
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);
  return sendError(res, messages.errors.internal, 500);
}
