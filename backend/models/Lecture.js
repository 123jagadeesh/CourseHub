import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true } 
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
    content: { type: String }, 
    questions: [questionSchema], 
    order: { type: Number, required: true }, 
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

lectureSchema.index({ course: 1, order: 1 }, { unique: true });

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;
