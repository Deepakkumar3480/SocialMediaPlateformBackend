import express from "express";
import {
    SavePost,
    GetSavedPosts,
    UnsavePost
} from "../controller/SavedPostController";
// import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", SavePost);

router.get("/", GetSavedPosts);

router.delete("/:postId", UnsavePost);

export default router;