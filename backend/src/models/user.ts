import mongoose, 
{ Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: {
    type: String,
    required: true,
    trim: true,
   },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["admin", "student", "educator"],
      default: "student"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export type UserType = InferSchemaType<typeof userSchema>;

const User = mongoose.model("User", userSchema);

export default User;
