import { Request, Response } from "express";
const prisma = require("../config/prisma.ts");

// CREATE ENROLLMENT
export const createEnrollment = async (req: Request, res: Response) => {
  try {
    // const userId = req.user?.id;
    const { courseId, userId } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const alreadyExist = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (alreadyExist && !alreadyExist.deletedAt) {
      return res.status(400).json({
        message: "Already enrolled in this course",
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    res.status(201).json({
      message: "Course enrolled successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

// GET ALL ENROLLMENTS

export const getAllEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        deletedAt: null,
      },

      include: {
        user: true,
        course: true,
      },
    });

    res.status(200).json({
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

// GET SINGLE ENROLLMENT

export const getEnrollmentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        id,
      },

      include: {
        user: true,
        course: true,
      },
    });

    if (!enrollment || enrollment.deletedAt) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    res.status(200).json({
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

// UPDATE ENROLLMENT

export const updateEnrollment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const { courseId } = req.body;

    const enrollment = await prisma.enrollment.update({
      where: {
        id,
      },

      data: {
        courseId,
      },
    });

    res.status(200).json({
      message: "Enrollment updated successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

// DELETE ENROLLMENT (Soft Delete)

export const deleteEnrollment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const enrollment = await prisma.enrollment.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },
    });

    res.status(200).json({
      message: "Enrollment deleted successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
