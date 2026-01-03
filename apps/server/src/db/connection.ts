import mongoose from "mongoose";
import { MongoClient } from "mongodb";

// Native MongoDB client for better-auth adapter
const MONGODB_URI = process.env.MONGODB_URI!;
export const client = new MongoClient(MONGODB_URI);

// Get the database instance from the client for better-auth adapter
// The database name is extracted from the connection URI
export const db = client.db();

export const connectDatabase = async (): Promise<typeof mongoose> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI!;

    if (!MONGODB_URI) {
      throw new Error("❌ MONGODB_URI environment variable is not defined");
    }

    const connection = await mongoose.connect(MONGODB_URI);
    console.log(
      `✅ MongoDB connected successfully: ${connection.connection.host}`
    );
    return connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("ongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

// Graceful shutdown handling
process.on("SIGINT", async () => {
  await disconnectDatabase();
  process.exit(0);
});

export default mongoose;
