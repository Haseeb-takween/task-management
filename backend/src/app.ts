import express, { type Express } from "express";
import cors from "cors";
import env from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

const app: Express = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
