import express from "express";
import {
  CreatePost,
  GetAllPosts,
  GetPostsByCourse,
  UpdatePost,
  DeletePost,
  GetPostDetails,
} from "../controller/PostController";
const router = express.Router();

// Create Post
// POST /api/posts
router.post("/", CreatePost);

// Get All Posts
// GET /api/posts
router.get("/", GetAllPosts);

// Get Posts By Course
// GET /api/posts/course/:courseId
router.get("/course/:courseId", GetPostsByCourse);

// Update Post
// PUT /api/posts/:id
router.put("/:id", UpdatePost);

// Soft Delete Post
// DELETE /api/posts/:id
router.delete("/:id", DeletePost);

router.get("/details/:id", GetPostDetails);
// router.get("/details/:id", GetPostById);


module.exports = router;
