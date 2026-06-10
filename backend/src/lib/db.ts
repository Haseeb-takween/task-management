import mongoose from "mongoose";
import env from "../config/env.js";

// Cache the connection promise so concurrent serverless invocations
// reuse a single connection attempt instead of opening new ones.
let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  if (!env.mongodbUri) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.mongodbUri).then((m) => {
      console.log("Connected to MongoDB");
      return m;
    });
    connectionPromise.catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      connectionPromise = null;
    });
  }

  await connectionPromise;
}
