import express from "express";
import { body } from "express-validator";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

import {
  createPost,
  getPublishedPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  getMyPosts,
  getMyPostById,
  getPostStats,
} from "../controllers/postController.js";

import { adminOnly } from "../middleware/adminMiddleware.js";

import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getPublishedPosts);
// Logged-in user's posts
router.get("/my-posts", protect, getMyPosts);
router.get("/my-posts/:id", protect, getMyPostById);

router.get("/admin/stats", protect, adminOnly, getPostStats);
// Keep the generic slug route after specific routes.
router.get("/:slug", getPostBySlug);

// Protected routes

router.get("/admin/example", protect, requireAdmin, (req, res) => {
  res.json({ message: "Welcome, admin!" });
});

router.post(
  "/",
  protect,
  upload.single("coverImage"),
  [
    body("title").isString().trim().isLength({ min: 1, max: 120 }),
    body("content").isString().trim().notEmpty().isLength({ max: 50000 }),
    body("status").optional().isIn(["draft", "published"]),
  ],
  createPost,
);

router.patch(
  "/:id",
  protect,
  upload.single("coverImage"),
  [
    body("title").optional().isString().trim().isLength({ min: 1, max: 120 }),
    body("content")
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 50000 }),
    body("status").optional().isIn(["draft", "published"]),
  ],
  updatePost,
);

router.delete("/:id", protect, deletePost);

export default router;
