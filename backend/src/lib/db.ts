import mongoose from "mongoose";
import env from "../config/env.js";

export async function connectDB() {
  if (!env.mongodbUri) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(env.mongodbUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
