import mongoose from "mongoose";
import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

const MONGODB_URI =
  process.env.MONGODB_URI ??
  "mongodb://127.0.0.1:27017/ngoDatabase";

async function startServer() {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/ngoDatabase"
    );

      console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error: unknown) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
}

startServer();