import "dotenv/config"; // Loads variables immediately
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
configureCloudinary();
const app = express();

app.use(express.static("./dist"));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan());
app.use(cookieParser());
app.use(express.json());

connectDB();

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use(errorMiddleware);

//wild card route always at the end of all routes.
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
