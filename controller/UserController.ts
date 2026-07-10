import type { Request, Response } from "express";
const prisma = require("../config/prisma.ts");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Register User
const UserRegister = async (req: Request, res: Response) => {

    try {

        const { name, email, password, role } = req.body;


        if (!name || !email || !password || !role) {

            return res.status(400).json({
                message:"All fields are required"
            });

        }



        const existingUser = await prisma.user.findUnique({

            where:{
                email
            }

        });



        if(existingUser && existingUser.deletedAt === null){

            return res.status(409).json({
                message:"User already exists"
            });

        }



        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);



        let user;


        // Restore deleted user with same email
        if(existingUser && existingUser.deletedAt !== null){

            user = await prisma.user.update({

                where:{
                    id:existingUser.id
                },

                data:{

                    name,
                    password:hashedPassword,
                    role,
                    deletedAt:null

                }

            });


        }
        else{


            user = await prisma.user.create({

                data:{

                    name,
                    email,
                    password:hashedPassword,
                    role

                }

            });


        }




        return res.status(201).json({

            message:"User registered successfully",

            user

        });



    }catch(error){

        console.log(error);

        return res.status(500).json({
            message:"Internal Server Error"
        });

    }

};


// Login
const UserLogin = async(req:Request,res:Response)=>{


    try{


        const {email,password}=req.body;



        if(!email || !password){

            return res.status(400).json({

                message:"Email and password are required"

            });

        }




        const user = await prisma.user.findFirst({

            where:{

                email,

                deletedAt:null

            }

        });




        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }




        const isPasswordValid = await bcrypt.compare(

            password,

            user.password

        );




        if(!isPasswordValid){

            return res.status(401).json({

                message:"Invalid password"

            });

        }




        const token = jwt.sign(

            {

                id:user.id,

                email:user.email,

                role:user.role

            },

            process.env.JWT_SECRET!,

            {

                expiresIn:"1d"

            }

        );




        return res.status(200).json({

            message:"Login successful",

            token,

            user:{

                id:user.id,

                name:user.name,

                email:user.email,

                role:user.role

            }

        });



    }catch(error){

        return res.status(500).json({

            message:"Internal Server Error"

        });

    }

};


// Get All Users
const GetAllUsers = async(req:Request,res:Response)=>{


    try{


        const users = await prisma.user.findMany({

            where:{

                deletedAt:null

            },


            select:{

                id:true,

                name:true,

                email:true,

                role:true

            }

        });



        return res.status(200).json({

            success:true,

            users

        });



    }catch(error){

        return res.status(500).json({

            message:"Internal Server Error"

        });

    }

};


// Get User By Id
const GetUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,

        enrollments: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            enrolledAt: true,

            course: {
              select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// Update User
const UpdateUser = async(req:Request,res:Response)=>{


    try{


        const id = Number(req.params.id);


        const {name,email,password,role}=req.body;



        const existingUser = await prisma.user.findFirst({

            where:{

                id,

                deletedAt:null

            }

        });



        if(!existingUser){

            return res.status(404).json({

                message:"User not found"

            });

        }




        let hashedPassword = existingUser.password;



        if(password){

            hashedPassword = await bcrypt.hash(password,10);

        }




        const user = await prisma.user.update({

            where:{

                id

            },


            data:{

                name,

                email,

                password:hashedPassword,

                role

            }

        });





        return res.status(200).json({

            message:"User updated successfully",

            user

        });



    }catch(error){


        return res.status(500).json({

            message:"Internal Server Error"

        });

    }

};


// Soft Delete User
const DeleteUser = async(req:Request,res:Response)=>{


    try{


        const id = Number(req.params.id);



        const existingUser = await prisma.user.findFirst({

            where:{

                id,

                deletedAt:null

            }

        });



        if(!existingUser){

            return res.status(404).json({

                message:"User not found"

            });

        }





        await prisma.user.update({

            where:{

                id

            },


            data:{

                deletedAt:new Date()

            }

        });





        return res.status(200).json({

            message:"User deleted successfully"

        });



    }catch(error){


        return res.status(500).json({

            message:"Internal Server Error"

        });

    }

};


module.exports = {

    UserRegister,
    UserLogin,
    GetAllUsers,
    GetUserById,
    UpdateUser,
    DeleteUser

};