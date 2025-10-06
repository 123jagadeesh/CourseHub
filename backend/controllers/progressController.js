import Progress from "../models/Progress.js";
import Course from "../models/Course.js";
import Lecture from "../models/Lecture.js";
import mongoose from "mongoose";
import { gradeQuiz } from "../utils/quizGrader.js";



export const completeReadingLecture = async (req, res) => {
  const { lectureId } = req.params;
  const studentId = req.user._id;

  try {
    const lecture = await Lecture.findById(lectureId).populate('course'); 
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });
    if (lecture.type !== "reading") return res.status(400).json({ message: "Not a reading lecture" });

    
    if (!lecture.course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ message: "Not enrolled in this course" });
    }

    const progress = await Progress.findOne({ student: studentId, course: lecture.course._id });
    if (!progress) return res.status(400).json({ message: "Progress record not found for this enrollment." });

    
    const priorLectures = await Lecture.find({ course: lecture.course._id, order: { $lt: lecture.order } }).select("_id");
    const priorIds = priorLectures.map(l => String(l._id));
    const completedSet = new Set(progress.completedLectures.map(id => String(id)));
    const notDone = priorIds.find(id => !completedSet.has(id));
    if (notDone) return res.status(403).json({ message: "Complete earlier lectures first" });

    
    if (!completedSet.has(String(lecture._id))) {
      progress.completedLectures.push(lecture._id);
      await progress.save();
    }

    return res.json({ message: "Lecture marked complete", progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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

    
    const priorLectures = await Lecture.find({ course: lecture.course, order: { $lt: lecture.order } }).select("_id").session(session);
    const priorIds = priorLectures.map(l => String(l._id));
    const completedSet = new Set(progress.completedLectures.map(id => String(id)));
    const notDone = priorIds.find(id => !completedSet.has(id));
    if (notDone) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Complete earlier lectures first" });
    }

    
    const { scorePercent, passed, correctCount, total } = gradeQuiz({ lecture, answers });

    
    progress.quizAttempts.push({
      lecture: lecture._id,
      answers,
      score: scorePercent,
      passed,
      attemptedAt: new Date()
    });

    
    if (passed && !progress.completedLectures.some(id => String(id) === String(lecture._id))) {
      progress.completedLectures.push(lecture._id);
    }

    
    
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
