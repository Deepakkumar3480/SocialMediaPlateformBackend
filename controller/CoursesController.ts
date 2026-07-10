import { Request, Response } from "express";

const prisma = require("../config/prisma.ts");

// Get All Courses
export const GetAllCourses = async(req:Request,res:Response)=>{


    try{


        const courses = await prisma.course.findMany({

            where:{

                deletedAt:null

            },


            include:{


                _count:{

                    select:{


                        posts:{

                            where:{

                                deletedAt:null

                            }

                        },


                        enrollments:{

                            where:{

                                deletedAt:null

                            }

                        }

                    }

                }

            },


            orderBy:{

                createdAt:"desc"

            }


        });



        return res.status(200).json(courses);



    }catch(error){


        return res.status(500).json({

            message:"Internal Server Error"

        });


    }

};


// Create Course
export const CreateCourse = async (req: Request, res: Response) => {

    try {

        const { title, description } = req.body;


        if (!title) {

            return res.status(400).json({
                message:"Course title is required"
            });

        }



        const course = await prisma.course.create({

            data: {

                title,

                description

            }

        });



        return res.status(201).json({

            message:"Course created successfully",

            course

        });



    } catch(error) {


        console.log(error);


        return res.status(500).json({

            message:"Internal Server Error"

        });


    }

};


// Get Course By ID
export const GetCourseById = async(req:Request,res:Response)=>{


    try{


        const id = Number(req.params.id);



        const course = await prisma.course.findFirst({

            where:{

                id,

                deletedAt:null

            },


            include:{


                posts:{

                    where:{

                        deletedAt:null

                    },


                    include:{


                        author:{

                            select:{

                                id:true,

                                name:true,

                                email:true

                            }

                        },


                        _count:{

                            select:{


                                likes:{

                                    where:{

                                        deletedAt:null

                                    }

                                },


                                comments:{

                                    where:{

                                        deletedAt:null

                                    }

                                }

                            }

                        }


                    }

                },


                _count:{

                    select:{


                        enrollments:{

                            where:{

                                deletedAt:null

                            }

                        }

                    }

                }


            }


        });



        if(!course){

            return res.status(404).json({

                message:"Course not found"

            });

        }



        return res.status(200).json(course);



    }catch(error){


        return res.status(500).json({

            message:"Internal Server Error"

        });


    }

};



// Update Course
export const UpdateCourse = async(req:Request,res:Response)=>{


    try{


        const id = Number(req.params.id);


        const {title,description}=req.body;



        const course = await prisma.course.findFirst({

            where:{

                id,

                deletedAt:null

            }

        });



        if(!course){

            return res.status(404).json({

                message:"Course not found"

            });

        }





        const updatedCourse = await prisma.course.update({

            where:{

                id

            },


            data:{

                title,

                description

            }


        });



        return res.status(200).json({

            message:"Course updated successfully",

            updatedCourse

        });



    }catch(error){


        console.log(error);


        return res.status(500).json({

            message:"Internal Server Error"

        });


    }

};


// Soft Delete Course
export const DeleteCourse = async(req:Request,res:Response)=>{


    try{


        const id = Number(req.params.id);



        const course = await prisma.course.findFirst({

            where:{

                id,

                deletedAt:null

            }

        });



        if(!course){

            return res.status(404).json({

                message:"Course not found"

            });

        }




        await prisma.course.update({

            where:{

                id

            },


            data:{

                deletedAt:new Date()

            }


        });



        return res.status(200).json({

            message:"Course deleted successfully"

        });



    }catch(error){


        console.log(error);


        return res.status(500).json({

            message:"Internal Server Error"

        });


    }

};