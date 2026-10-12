import mongoose from "mongoose";
import { postModel } from "../models/Post.js";
// import cloudinary from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

import { randomBytes } from "crypto";

import { validationResult } from "express-validator";

const checkValidation = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });

    return false;
  }

  return true;
};

// Convert a title into a readable URL slug.
const createSlug = (title) =>
  title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");

const uploadImage = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "myblog/posts",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(buffer);
  });

const deleteImage = async (publicId) => {
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};

// CREATE POST
const createPost = async (req, res, next) => {
  let uploadedImage;

  try {
    if (!checkValidation(req, res)) return;
    const { title, content, status } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 120 ||
      typeof content !== "string" ||
      !content.trim() ||
      content.length > 50000
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid title and content",
      });
    }

    if (status && !["draft", "published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post status",
      });
    }

    const slug = createSlug(title);

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Title must contain letters or numbers",
      });
    }

    // Add a suffix to avoid collisions between identical titles.
    const uniqueSlug = `${slug}-${randomBytes(4).toString("hex")}`;

    if (req.file) {
      uploadedImage = await uploadImage(req.file.buffer);
    }

    const post = await postModel.create({
      title: title.trim(),
      slug: uniqueSlug,
      content: content.trim(),
      author: req.user._id,
      status: status || "draft",
      coverImage: uploadedImage
        ? {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
          }
        : undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    // Avoid leaving an uploaded image behind if saving fails.
    if (uploadedImage) {
      await deleteImage(uploadedImage.public_id).catch(() => {});
    }

    next(error);
  }
};

// GET ALL PUBLISHED POSTS
const getPublishedPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      20,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );

    const filter = { status: "published" };

    const [posts, total] = await Promise.all([
      postModel
        .find(filter)
        .select("title slug coverImage author createdAt")
        .populate("author", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      postModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET ONE PUBLISHED POST BY SLUG
const getPostBySlug = async (req, res, next) => {
  try {
    const post = await postModel
      .findOne({
        slug: req.params.slug,
        status: "published",
      })
      .populate("author", "name")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Published post not found",
      });
    }

    return res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

//=======================================

// EDIT POST
const updatePost = async (req, res, next) => {
  let newImage;

  try {
    if (!checkValidation(req, res)) return;
    const { title, content, status } = req.body;

    if (
      title !== undefined &&
      (typeof title !== "string" || !title.trim() || title.trim().length > 120)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid title",
      });
    }

    if (
      content !== undefined &&
      (typeof content !== "string" || !content.trim() || content.length > 50000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid content",
      });
    }

    if (status !== undefined && !["draft", "published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post status",
      });
    }

    if (
      title === undefined &&
      content === undefined &&
      status === undefined &&
      !req.file
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    // Find only a post owned by this user, unless they are an admin.
    const filter = { _id: req.params.id };

    if (req.user.role !== "admin") {
      filter.author = req.user._id;
    }

    const post = await postModel.findOne(filter);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or you do not have permission",
      });
    }

    if (title !== undefined) {
      const slug = createSlug(title);

      if (!slug) {
        return res.status(400).json({
          success: false,
          message: "Title must contain letters or numbers",
        });
      }

      post.title = title.trim();

      // Preserve the current slug when the title hasn't changed.
      if (post.isModified("title")) {
        post.slug = `${slug}-${randomBytes(4).toString("hex")}`;
      }
    }

    if (content !== undefined) post.content = content.trim();
    if (status !== undefined) post.status = status;

    const oldImageId = post.coverImage?.publicId;

    if (req.file) {
      newImage = await uploadImage(req.file.buffer);

      post.coverImage = {
        url: newImage.secure_url,
        publicId: newImage.public_id,
      };
    }

    await post.save();

    // Delete the previous image only after the new image and post save.
    if (newImage && oldImageId) {
      await deleteImage(oldImageId).catch((error) => {
        console.error("Old image cleanup failed:", error.message);
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    if (newImage) {
      await deleteImage(newImage.public_id).catch(() => {});
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A post with this slug already exists",
      });
    }

    next(error);
  }
};

// DELETE POST
const deletePost = async (req, res, next) => {
  try {
    const postById = await postModel.findById(req.params.id);
    if (!postById) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const isOwner = postById.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    // ======================
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const filter = { _id: req.params.id };

    if (req.user.role !== "admin") {
      filter.author = req.user._id;
    }

    const post = await postModel.findOneAndDelete(filter);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or you do not have permission",
      });
    }

    if (post.coverImage?.publicId) {
      try {
        await deleteImage(post.coverImage.publicId);
      } catch (error) {
        // The post is already deleted; log cleanup failures for retry.
        console.error("Cloudinary cleanup failed:", error.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    // Page number from URL; default is 1
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    // Show at most 20 posts per page
    const limit = Math.min(
      20,
      Math.max(1, parseInt(req.query.limit, 10) || 10),
    );

    // Find posts created by the logged-in user
    const filter = { author: req.user._id };

    const [posts, total] = await Promise.all([
      postModel
        .find(filter)
        .select("title slug coverImage status createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      postModel.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMyPostById = async (req, res, next) => {
  try {
    const mongoose = require("mongoose");

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const filter = { _id: req.params.id };

    // Admins may view any post; users may view only their own.
    if (req.user.role !== "admin") {
      filter.author = req.user._id;
    }

    const post = await Post.findOne(filter).lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

const getPostStats = async (req, res, next) => {
  try {
    // Count all posts, including drafts and published posts.
    const [totalPosts, publishedPosts, draftPosts, recentPosts] =
      await Promise.all([
        Post.countDocuments(),

        Post.countDocuments({ status: "published" }),

        Post.countDocuments({ status: "draft" }),

        Post.find()
          .select("title slug status author createdAt")
          .populate("author", "name")
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
      },
      recentPosts,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getPostStats,
  getMyPostById,
  getMyPosts,
  createPost,
  getPublishedPosts,
  getPostBySlug,
  updatePost,
  deletePost,
};
