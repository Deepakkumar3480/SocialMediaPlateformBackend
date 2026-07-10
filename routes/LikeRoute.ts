import express from "express";
import { GetLikeCount, LikePost, likePostbyUser, UnlikePost } from "../controller/LikeController";

const router = express.Router()


//here the likes and the comment related apis
router.get("/:id/count", GetLikeCount);

router.get('/',likePostbyUser);

router.post("/", LikePost);

router.delete("/", UnlikePost);

module.exports = router;
