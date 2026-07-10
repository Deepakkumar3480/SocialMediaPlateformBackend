import express from "express";

import {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} from "../controller/EnrollmentController";

const router = express.Router();

// Create Enrollment
router.post("/", createEnrollment);

// Get All Enrollments
router.get("/", getAllEnrollments);

// Get Single Enrollment
router.get("/:id", getEnrollmentById);

// Update Enrollment
router.put("/:id", updateEnrollment);

// Delete Enrollment (Soft Delete)
router.delete("/:id", deleteEnrollment);

module.exports = router
