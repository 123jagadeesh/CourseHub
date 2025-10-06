import express from "express";
import {  completeReadingLecture, getProgressSummary, submitQuizAttempt } from "../controllers/progressController.js";
import { protect, studentOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/complete/:lectureId", protect, studentOnly, completeReadingLecture);
router.get("/:courseId", protect, studentOnly, getProgressSummary);
router.post("/:lectureId/attempt", protect, studentOnly, submitQuizAttempt);

export default router;
