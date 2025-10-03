import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
} from "../controllers/courseController.js";
import { protect, instructorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getAllCourses)
  .post(protect, instructorOnly, createCourse);

router.route("/:id")
  .get(getCourseById);

import lectureRoutes from "./lectureRoutes.js";
router.use("/:courseId/lectures", lectureRoutes);

export default router;
