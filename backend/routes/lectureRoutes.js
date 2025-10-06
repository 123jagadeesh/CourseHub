import express from "express";
import { addLecture, getLecturesByCourse, getLectureById } from "../controllers/lectureController.js";
import { protect, instructorOnly, studentOnly } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.route("/")
  .post(protect, instructorOnly, addLecture)
  .get(protect, getLecturesByCourse); 

router.route("/:lectureId")
  .get(protect, getLectureById); 

export default router;
