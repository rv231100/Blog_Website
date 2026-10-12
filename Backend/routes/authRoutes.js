import { body } from "express-validator";
import rateLimit from "express-rate-limit";

import express from "express";
import {
  getMe,
  login,
  logout,
  register,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 10, // limit each IP to 10 requests per windowMs
//   message: {
//     success: false,
//     message:
//       "Too many requests from this IP, please try again after 15 minutes",
//   },
// });

// const validateRegister = [
//   body("name")
//     .trim()
//     .isLength({ min: 3, max: 50 })
//     .withMessage("Name must be between 3 and 50 characters"),
//   body("email")
//     .trim()
//     .isEmail()
//     .withMessage("Please provide a valid email")
//     .normalizeEmail(),
//   body("password")
//     .isString()
//     .isLength({ min: 4, max: 20 })
//     .withMessage("Password must be at least 4 characters long"),
// ];
// const validateLogin = [
//   body("email")
//     .trim()
//     .isEmail()
//     .withMessage("Please provide a valid email")
//     .normalizeEmail(),
//   body("password")
//     .isString()
//     .isLength({ min: 4, max: 20 })
//     .withMessage("Password must be at least 4 characters long"),
// ];

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
