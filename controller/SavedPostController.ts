import { Request, Response } from "express";
const prisma = require("../config/prisma.ts");



// Save Post
export const SavePost = async (req: Request, res: Response) => {

    try {

        const { postId } = req.body;
        const userId = req?.user?.id;



        if (!userId) {

            return res.status(401).json({
                message: "Unauthorized"
            });

        }



        if (!postId) {

            return res.status(400).json({
                message: "Post ID is required"
            });

        }



        const user = await prisma.user.findFirst({

            where: {
                id: userId,
                deletedAt: null
            }

        });



        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }




        const post = await prisma.post.findFirst({

            where: {
                id: Number(postId),
                deletedAt: null
            }

        });



        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }





        const existing = await prisma.savedPost.findUnique({

            where: {

                userId_postId: {

                    userId,

                    postId: Number(postId)

                }

            }

        });




        // Already saved
        if (existing && existing.deletedAt === null) {

            return res.status(409).json({

                message: "Post already saved"

            });

        }




        // Restore soft deleted save
        if (existing) {


            const restored = await prisma.savedPost.update({

                where: {

                    userId_postId: {

                        userId,

                        postId: Number(postId)

                    }

                },


                data: {

                    deletedAt: null

                }

            });



            return res.status(200).json({

                message: "Post saved successfully",

                savedPost: restored

            });


        }




        const savedPost = await prisma.savedPost.create({

            data: {

                userId,

                postId: Number(postId)

            }

        });



        return res.status(201).json({

            message: "Post saved successfully",

            savedPost

        });



    } catch(error) {


        console.log(error);


        return res.status(500).json({

            message:"Internal Server Error"

        });


    }

};


// Get Saved Posts
export const GetSavedPosts = async (req: Request, res: Response) => {


    try {


        const userId = req?.user?.id;



        const savedPosts = await prisma.savedPost.findMany({

            where: {

                userId,

                deletedAt:null

            },


            include: {

                post: {

                    where: {

                        deletedAt:null

                    },


                    include: {


                        author: {

                            select: {

                                id:true,

                                name:true,

                                email:true

                            }

                        },


                        course:true,


                        _count: {

                            select: {

                                likes: {

                                    where: {

                                        deletedAt:null

                                    }

                                },


                                comments: {

                                    where: {

                                        deletedAt:null

                                    }

                                }

                            }

                        }


                    }

                }

            },


            orderBy: {

                createdAt:"desc"

            }


        });



        return res.status(200).json(savedPosts);



    } catch(error) {


        console.log(error);


        return res.status(500).json({

            message:"Internal Server Error"

        });


    }

};


// Unsave Post (Soft Delete)
export const UnsavePost = async (req: Request, res: Response) => {


    try {


        const userId = req?.user?.id;

        const postId = Number(req.params.postId);



        const savedPost = await prisma.savedPost.findUnique({

            where: {

                userId_postId: {

                    userId,

                    postId

                }

            }

        });



        if (!savedPost || savedPost.deletedAt !== null) {


            return res.status(404).json({

                message:"Saved post not found"

            });


        }





        await prisma.savedPost.update({

            where: {

                userId_postId: {

                    userId,

                    postId

                }

            },


            data: {

                deletedAt:new Date()

            }

        });





        return res.status(200).json({

            message:"Post removed from saved posts"

        });



    } catch(error) {


        console.log(error);


        return res.status(500).json({

            message:"Internal Server Error"

        });


    }

};