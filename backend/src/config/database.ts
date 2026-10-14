import mongoose from "mongoose";

mongoose
  .connect("mongodb://127.0.0.1:27017/Database")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });