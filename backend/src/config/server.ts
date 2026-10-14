import mongoose from "mongoose";
import app from "./app";

async function startServer() {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/ngoDatabase"
    );

    console.log("MongoDB connected");

    app.listen(3000, () => {
      console.log("Backend running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
}

startServer();