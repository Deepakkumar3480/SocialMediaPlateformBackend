import { Request, Response } from "express";
const prisma = require("../config/prisma.ts");

export const CreatePost = async (req: Request, res: Response) => {
  try {
    const { title, content, courseId, authorId } = req.body;

    // const authorId = req?.user?.id;

    if (!title || !content || !courseId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!authorId) {
      return res.status(401).json({
        message: "Unauthorized user",
      });
    }

    const course = await prisma.course.findFirst({
      where: {
        id: Number(courseId),

        deletedAt: null,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: authorId,

        deletedAt: null,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const post = await prisma.post.create({
      data: {
        title,

        content,

        authorId,

        courseId: Number(courseId),
      },

      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        course: true,
      },
    });

    return res.status(201).json({
      message: "Post created successfully",

      post,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const GetAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        deletedAt: null,
      },

      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        course: true,
        // views:true,

        _count: {
          select: {
            likes: {
              where: {
                deletedAt: null,
              },
            },

            comments: {
              where: {
                deletedAt: null,
              },
            },
            views: {
              where: {
                deletedAt: null,
              },
            },
            savedPosts: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const GetPostById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = req.body.userId; // or req.user.id if using authentication

    const post = await prisma.post.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: true,
        comments: {
          where: {
            deletedAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            likes: {
              where: {
                deletedAt: null,
              },
            },
            comments: {
              where: {
                deletedAt: null,
              },
            },
            views: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Record the view
    if (userId) {
      await prisma.view.create({
        data: {
          postId: id,
          userId,
        },
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const GetPostsByCourse = async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);

    const posts = await prisma.post.findMany({
      where: {
        courseId,

        deletedAt: null,
      },

      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },

        course: true,

        _count: {
          select: {
            likes: {
              where: {
                deletedAt: null,
              },
            },

            comments: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const UpdatePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const { title, content } = req.body;

    const post = await prisma.post.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (req?.user?.role !== "MODERATOR" && req?.user?.id !== post.authorId) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const updatedPost = await prisma.post.update({
      where: {
        id,
      },

      data: {
        title,
        content,
      },
    });

    return res.status(200).json({
      message: "Post updated successfully",

      updatedPost,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const DeletePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    // const {postId} = Number()

    const post = await prisma.post.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // if (req?.user?.role !== "MODERATOR" && req?.user?.id !== post.authorId) {
    //   return res.status(403).json({
    //     message: "Access denied",
    //   });
    // }

    await prisma.post.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },
    });

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const GetPostDetails = async (req: Request, res: Response) => {
  try {
    // const id=Number(req.params.id);
    const postId = Number(req.params.id);
    const userId = Number(req.query.userId);

    // Check if post exists
    const postExists = await prisma.post.findFirst({
      where: {
        id: postId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!postExists) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Create a view (every API hit counts as a new view)
    await prisma.view.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      update: {}, // Already viewed, do nothing
      create: {
        userId,
        postId,
      },
    });

    // Fetch updated post details
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: true,
        _count: {
          select: {
            likes: {
              where: {
                deletedAt: null,
              },
            },
            comments: {
              where: {
                deletedAt: null,
              },
            },
            views: {
              where: {
                deletedAt: null,
              },
            },
            savedPosts:{
                where:{
                    deletedAt:null,
                }
            }
          },
        },
        comments: {
          where: {
            deletedAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      message: "Post details fetched successfully",
      post,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
