// src/routes/lectureActionRoutes.js
import express from "express";
import { submitQuizAttempt } from "../controllers/progressController.js";
import { protect, studentOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/lectures/:lectureId/attempt
router.post("/:lectureId/attempt", protect, studentOnly, submitQuizAttempt);

export default router;
