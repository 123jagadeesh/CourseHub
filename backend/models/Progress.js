
import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture", required: true },
  answers: [{ type: Number }],    
  score: { type: Number },        
  passed: { type: Boolean },
  attemptedAt: { type: Date, default: Date.now }
});

const progressSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    enrolledAt: { type: Date, default: Date.now },
    completedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
    quizAttempts: [quizAttemptSchema],
    score: { type: Number, default: 0 } 
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;
