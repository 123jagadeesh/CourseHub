// src/routes/progressRoutes.js
import express from "express";
import { enrollCourse, completeReadingLecture, getProgressSummary } from "../controllers/progressController.js";
import { protect, studentOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/enroll/:courseId", protect, studentOnly, enrollCourse);
router.post("/complete/:lectureId", protect, studentOnly, completeReadingLecture);
router.get("/:courseId", protect, studentOnly, getProgressSummary);

export default router;
