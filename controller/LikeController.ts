import { Request, Response } from "express";
const prisma = require("../config/prisma.ts");

// Like Post
export const LikePost = async (req: Request, res: Response) => {
  try {
    const {userId,postId} =req.body;
    // const postId = Number(req.params.id);

    if (!userId || !postId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        deletedAt: null,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    // Restore soft deleted like
    if (existingLike) {
      if (existingLike.deletedAt) {
        await prisma.like.update({
          where: {
            id: existingLike.id,
          },

          data: {
            deletedAt: null,
          },
        });
      } else {
        return res.status(400).json({
          message: "Already liked",
        });
      }
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
    }

    const totalLikes = await prisma.like.count({
      where: {
        postId,

        deletedAt: null,
      },
    });

    return res.status(200).json({
      message: "Post liked",

      totalLikes,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Unlike Post (Soft Delete)
export const UnlikePost = async (req: Request, res: Response) => {
  try {
    // const userId = (req as Request & { user?: { id: number } }).user?.id;
    const {userId,postId} =req.body;

    // const postId = Number(req.params.id);

    const like = await prisma.like.findFirst({
      where: {
        userId,

        postId,

        deletedAt: null,
      },
    });

    if (!like) {
      return res.status(404).json({
        message: "Like not found",
      });
    }

    await prisma.like.update({
      where: {
        id: like.id,
      },

      data: {
        deletedAt: new Date(),
      },
    });

    const totalLikes = await prisma.like.count({
      where: {
        postId,

        deletedAt: null,
      },
    });

    return res.status(200).json({
      message: "Post unliked",

      totalLikes,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const likePostbyUser = async (req: Request, res: Response) => {
  try {
    const { userId, postId } = req.body;

    if (!userId ) {
      return res.status(400).json({
        message: "userId and postId are required",
      });
    }

    const like = await prisma.like.findFirst({
      where: {
        userId: Number(userId),
        // postId: Number(postId),
        deletedAt: null,
      },
    });

    return res.status(200).json({
      liked: !!like,
      like,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get Like Count
export const GetLikeCount = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);

    const totalLikes = await prisma.like.count({
      where: {
        postId,

        deletedAt: null,
      },
    });

    return res.status(200).json({
      totalLikes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
