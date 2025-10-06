import Lecture from "../models/Lecture.js";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import { sanitizeLectureForStudent } from "../utils/sanitizeLecture.js";
import mongoose from "mongoose";

export const addLecture = async (req, res) => {
  const { title, type, content, questions, order, published } = req.body;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your course" });
    }

    
    const lecture = await Lecture.create({
      course: courseId,
      title,
      type,
      content: type === "reading" ? content : undefined,
      questions: type === "quiz" ? questions : [],
      order,
      published: published !== undefined ? published : true
    });

    
    course.lectures.push(lecture._id);
    await course.save();

    res.status(201).json(lecture);
  } catch (error) {
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "Lecture order already exists for this course" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getLecturesByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const lectures = await Lecture.find({ course: courseId }).sort({ order: 1 });
    if (req.user && req.user.role === "instructor") {
      return res.json(lectures);
    }
    
    const sanitized = lectures.map(l => sanitizeLectureForStudent(l));
    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLectureById = async (req, res) => {
  const { courseId, lectureId } = req.params;
  try {
    const lecture = await Lecture.findById(lectureId);
    if (!lecture || lecture.course.toString() !== courseId) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    
    if (req.user && req.user.role === "instructor" && req.user._id.toString() === String(lecture.course.instructor)) {
      return res.json(lecture);
    }

    
    if (req.user && req.user.role === "student") {
      
      const allLectures = await Lecture.find({ course: courseId }).sort({ order: 1 }).select("_id order");
      const progress = await Progress.findOne({ student: req.user._id, course: courseId });

      
      const completedSet = new Set((progress && progress.completedLectures) ? progress.completedLectures.map(id => String(id)) : []);

      
      const requested = allLectures.find(l => String(l._id) === String(lectureId));
      if (!requested) return res.status(404).json({ message: "Lecture not found in course" });

      
      const priorLectures = allLectures.filter(l => l.order < requested.order);
      const notCompletedPrior = priorLectures.find(l => !completedSet.has(String(l._id)));
      if (notCompletedPrior) {
        return res.status(403).json({ message: "Complete previous lectures before accessing this one" });
      }

      
      return res.json(sanitizeLectureForStudent(lecture));
    }

    
    
    return res.json(sanitizeLectureForStudent(lecture));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
