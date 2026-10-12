import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      // match: [
      //     /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      //     "Please provide a valid email"
      // ],
      lowercase: true,
      trim: true,
      maxlength: [30, "Email must not exceed 30 characters"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

export const userModel = mongoose.model("User", userSchema);
