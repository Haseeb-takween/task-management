import express, { type Express } from "express";
import cors from "cors";
import env from "./config/env.js";
import routes from "./routes/index.js";
import { connectDB } from "./lib/db.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

const app: Express = express();

const allowedOrigins = env.corsOrigin
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// On serverless (Vercel), index.ts's startServer() never runs,
// so ensure the DB is connected before handling each request.
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
