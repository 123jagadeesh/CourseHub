// src/routes/lectureRoutes.js
import express from "express";
import { addLecture, getLecturesByCourse, getLectureById } from "../controllers/lectureController.js";
import { protect, instructorOnly, studentOnly } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.route("/")
  .post(protect, instructorOnly, addLecture)
  .get(protect, getLecturesByCourse); // optionally allow public without protect if you want

router.route("/:lectureId")
  .get(protect, getLectureById); // protect ensures we know the user's role to gate

export default router;
