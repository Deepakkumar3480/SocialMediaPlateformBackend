import { Request, Response } from "express";
const prisma = require("../config/prisma.ts");

export const addPostView = async (req: Request, res: Response) => {
  try {
    const {userId,postId}= req.body;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post || post.deletedAt) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    await prisma.view.create({
      data: {
        postId,
        userId,
      },
    });

    return res.status(200).json({
      message: "View added",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
