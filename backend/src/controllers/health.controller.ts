import type { Request, Response } from "express";
import { messages } from "../messages/index.js";
import { sendSuccess } from "../lib/response.js";

export function getHealth(_req: Request, res: Response) {
  return sendSuccess(res, { message: messages.api.running });
}
