// src/models/Lecture.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true } // index of correct option
});

const lectureSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["reading", "quiz"],
      required: true,
    },
    content: { type: String }, // for reading
    questions: [questionSchema], // for quiz
    order: { type: Number, required: true }, // lecture position in course
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// ensure unique order per course (no two lectures share same order)
lectureSchema.index({ course: 1, order: 1 }, { unique: true });

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;
