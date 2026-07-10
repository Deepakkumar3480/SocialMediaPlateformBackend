import express from "express";
import {
  AddComment,
  DeleteComment,
  GetCommentCount,
  GetComments,
  UpdateComment,
} from "../controller/CommentController";

const router = express.Router();

//comments
router.get("/:id", GetComments);


router.get("/:id/count", GetCommentCount);


router.post("/", AddComment);

router.put("/:commentId", UpdateComment);

router.delete("/:commentId", DeleteComment);

module.exports = router;
