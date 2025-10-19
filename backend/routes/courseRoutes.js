import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollStudent,
  getEnrolledCourses,
  getNotEnrolledCourses,
  deleteCourse
} from "../controllers/courseController.js";
import { protect,studentOnly, instructorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getAllCourses)
  .post(protect, instructorOnly, createCourse);
  

router.route("/enrolled")
  .get(protect, studentOnly, getEnrolledCourses);

router.route("/not-enrolled")
  .get(protect, studentOnly, getNotEnrolledCourses);

router.route("/:id")
  .get(getCourseById)
  .delete(protect, instructorOnly, deleteCourse);

router.route("/:courseId/enroll")
  .post(protect, enrollStudent);

import lectureRoutes from "./lectureRoutes.js";
router.use("/:courseId/lectures", lectureRoutes);

export default router;