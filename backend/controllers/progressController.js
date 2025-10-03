// src/controllers/progressController.js
import Progress from "../models/Progress.js";
import Course from "../models/Course.js";
import Lecture from "../models/Lecture.js";
import mongoose from "mongoose";
import { gradeQuiz } from "../utils/quizGrader.js";

/**
 * POST /api/progress/enroll/:courseId
 */
export const enrollCourse = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // ensure unique enrollment
    const existing = await Progress.findOne({ student: studentId, course: courseId });
    if (existing) return res.status(400).json({ message: "Already enrolled" });

    const progress = await Progress.create({
      student: studentId,
      course: courseId,
      completedLectures: [],
      quizAttempts: []
    });

    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/progress/complete/:lectureId
 * For marking reading lectures as complete (explicit action from frontend)
 */
export const completeReadingLecture = async (req, res) => {
  const { lectureId } = req.params;
  const studentId = req.user._id;

  try {
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });
    if (lecture.type !== "reading") return res.status(400).json({ message: "Not a reading lecture" });

    const progress = await Progress.findOne({ student: studentId, course: lecture.course });
    if (!progress) return res.status(400).json({ message: "Not enrolled in this course" });

    // We should ensure gating: the previous lectures must be completed
    const priorLectures = await Lecture.find({ course: lecture.course, order: { $lt: lecture.order } }).select("_id");
    const priorIds = priorLectures.map(l => String(l._id));
    const completedSet = new Set(progress.completedLectures.map(id => String(id)));
    const notDone = priorIds.find(id => !completedSet.has(id));
    if (notDone) return res.status(403).json({ message: "Complete earlier lectures first" });

    // add lecture id if not already present
    if (!completedSet.has(String(lecture._id))) {
      progress.completedLectures.push(lecture._id);
      await progress.save();
    }

    return res.json({ message: "Lecture marked complete", progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/lectures/:lectureId/attempt
 * Student submits quiz answers; grade server-side; record attempt; mark complete on pass
 */
export const submitQuizAttempt = async (req, res) => {
  const { lectureId } = req.params;
  const { answers } = req.body;
  const studentId = req.user._id;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const lecture = await Lecture.findById(lectureId).session(session);
    if (!lecture) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Lecture not found" });
    }
    if (lecture.type !== "quiz") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Lecture is not a quiz" });
    }

    const progress = await Progress.findOne({ student: studentId, course: lecture.course }).session(session);
    if (!progress) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Not enrolled in this course" });
    }

    // Ensure gating: previous lectures must be completed
    const priorLectures = await Lecture.find({ course: lecture.course, order: { $lt: lecture.order } }).select("_id").session(session);
    const priorIds = priorLectures.map(l => String(l._id));
    const completedSet = new Set(progress.completedLectures.map(id => String(id)));
    const notDone = priorIds.find(id => !completedSet.has(id));
    if (notDone) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Complete earlier lectures first" });
    }

    // grade
    const { scorePercent, passed, correctCount, total } = gradeQuiz({ lecture, answers });

    // record attempt
    progress.quizAttempts.push({
      lecture: lecture._id,
      answers,
      score: scorePercent,
      passed,
      attemptedAt: new Date()
    });

    // mark completed if passed and not already done
    if (passed && !progress.completedLectures.some(id => String(id) === String(lecture._id))) {
      progress.completedLectures.push(lecture._id);
    }

    // Optionally update aggregate score (example: average of passed quiz scores)
    // Here we update a simple average of attempts' scores (optional)
    const allScores = progress.quizAttempts.map(a => a.score || 0);
    progress.score = allScores.length ? (allScores.reduce((s, v) => s + v, 0) / allScores.length) : 0;

    await progress.save({ session });
    await session.commitTransaction();
    session.endSession();

    return res.json({
      scorePercent,
      passed,
      correctCount,
      total
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/progress/:courseId
 * return progress summary: totalLectures, completedCount, percent, nextLectureId
 */
export const getProgressSummary = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  try {
    const lectures = await Lecture.find({ course: courseId }).sort({ order: 1 }).select("_id order title type");
    const progress = await Progress.findOne({ student: studentId, course: courseId });

    const total = lectures.length;
    const completed = progress ? progress.completedLectures.length : 0;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    const completedSet = new Set(progress ? progress.completedLectures.map(id => String(id)) : []);
    const next = lectures.find(l => !completedSet.has(String(l._id)));
    const nextLectureId = next ? next._id : null;

    res.json({ totalLectures: total, completedCount: completed, percent, nextLectureId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
