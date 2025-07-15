// src/lib/mongodb.ts
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI!;

export async function connectMongo() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      dbName: "summariser", // Use your existing database name
    });
  }
}

const blogSchema = new mongoose.Schema({
  url: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  __v: { type: Number, select: false } // Hide version key if not needed
});

// Connect to your existing 'blogs' collection
export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema, "blogs");