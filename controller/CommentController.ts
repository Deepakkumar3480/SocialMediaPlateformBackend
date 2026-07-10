import { Request, Response } from "express";
const prisma = require("../config/prisma.ts");


// Add Comment
export const AddComment = async(req:Request,res:Response)=>{

    try{

        const {userId,postId,content} = req.body;
        


        if(!userId || !postId){

            return res.status(401).json({
                message:"Unauthorized"
            });

        }


        if(!content){

            return res.status(400).json({
                message:"Comment required"
            });

        }



        const post = await prisma.post.findFirst({

            where:{
                id:postId,
                deletedAt:null
            }

        });



        if(!post){

            return res.status(404).json({
                message:"Post not found"
            });

        }




        const user = await prisma.user.findFirst({

            where:{
                id:userId,
                deletedAt:null
            }

        });



        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }




        const comment = await prisma.comment.create({

            data:{
                content,
                userId,
                postId
            },


            include:{

                user:{
                    select:{
                        id:true,
                        name:true
                    }
                }

            }

        });



        return res.status(201).json({

            message:"Comment added",

            comment

        });



    }catch(error){

        console.log(error);

        return res.status(500).json({
            message:"Internal Server Error"
        });

    }

};


// Get Comments
export const GetComments = async(req:Request,res:Response)=>{


    try{


        const postId = Number(req.params.id);



        const comments = await prisma.comment.findMany({

            where:{

                postId,

                deletedAt:null

            },


            include:{

                user:{
                    select:{
                        id:true,
                        name:true
                    }
                }

            },


            orderBy:{

                createdAt:"desc"

            }

        });



        return res.status(200).json(comments);



    }catch(error){

        return res.status(500).json({
            message:"Internal Server Error"
        });

    }

};


// Update Comment
export const UpdateComment = async(req:Request,res:Response)=>{


    try{


        const id = Number(req.params.commentId);

        const {content} = req.body;



        const comment = await prisma.comment.findFirst({

            where:{

                id,

                deletedAt:null

            }

        });



        if(!comment){

            return res.status(404).json({

                message:"Comment not found"

            });

        }




        if(comment.userId !== req?.user?.id){

            return res.status(403).json({

                message:"Access denied"

            });

        }




        const updated = await prisma.comment.update({

            where:{

                id

            },


            data:{

                content

            }

        });



        return res.status(200).json({

            message:"Comment updated",

            updated

        });



    }catch(error){

        return res.status(500).json({

            message:"Internal Server Error"

        });

    }

};


// Delete Comment (Soft Delete)
export const DeleteComment = async(req:Request,res:Response)=>{


    try{


        const id = Number(req.params.commentId);



        const comment = await prisma.comment.findFirst({

            where:{

                id,

                deletedAt:null

            }

        });



        if(!comment){

            return res.status(404).json({

                message:"Comment not found"

            });

        }




        if(
            comment.userId !== req?.user?.id &&
            req?.user?.role !== "MODERATOR"
        ){

            return res.status(403).json({

                message:"Access denied"

            });

        }





        await prisma.comment.update({

            where:{

                id

            },


            data:{

                deletedAt:new Date()

            }

        });




        return res.status(200).json({

            message:"Comment deleted successfully"

        });



    }catch(error){

        return res.status(500).json({

            message:"Internal Server Error"

        });

    }

};


// Comment Count
export const GetCommentCount = async(req:Request,res:Response)=>{


    try{


        const postId = Number(req.params.id);



        const totalComments = await prisma.comment.count({

            where:{

                postId,

                deletedAt:null

            }

        });



        return res.status(200).json({

            totalComments

        });



    }catch(error){

        return res.status(500).json({

            message:"Internal Server Error"

        });

    }

};