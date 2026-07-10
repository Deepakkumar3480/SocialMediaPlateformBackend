import express from "express";
import {
  GetLikeCount,
  LikePost,
  UnlikePost,
} from "../controller/LikeController";
import {
  AddComment,
  DeleteComment,
  GetCommentCount,
  GetComments,
  UpdateComment,
} from "../controller/CommentController";
import {
  CreatePost,
  GetAllPosts,
  GetPostById,
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

// Get Single Post By ID
// GET /api/posts/:id
router.get("/:id", GetPostById);

// Get Complete Post Details
// GET /api/posts/details/:id
router.get("/details/:id", GetPostDetails);

// Get Posts By Course
// GET /api/posts/course/:courseId
router.get("/course/:courseId", GetPostsByCourse);

// Update Post
// PUT /api/posts/:id
router.put("/:id", UpdatePost);

// Soft Delete Post
// DELETE /api/posts/:id
router.delete("/:id", DeletePost);




//here the likes and the comment related apis
router.get("/:id/likes/count", GetLikeCount);

router.get("/:id/comments", GetComments);

router.get("/:id/details", GetPostDetails);

router.get("/:id/comments/count", GetCommentCount);

router.post("/:id/like", LikePost);

router.delete("/:id/like", UnlikePost);

router.post("/:id/comments", AddComment);

router.put("/comments/:commentId", UpdateComment);

router.delete("/comments/:commentId", DeleteComment);

module.exports = router;
