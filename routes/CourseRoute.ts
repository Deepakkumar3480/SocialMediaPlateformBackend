import express from "express";
import { CreateCourse, DeleteCourse, GetAllCourses, GetCourseById, UpdateCourse } from "../controller/CoursesController";


const router = express.Router();

// Create Course
// POST /api/courses
router.post("/", CreateCourse);

// Get All Courses
// GET /api/courses
router.get("/", GetAllCourses);

// Get Course By Id
// GET /api/courses/:id
router.get("/:id", GetCourseById);

// Update Course
// PUT /api/courses/:id
router.put("/:id", UpdateCourse);

// Soft Delete Course
// DELETE /api/courses/:id
router.delete("/:id", DeleteCourse);

module.exports = router;
