// src/utils/sanitizeLecture.js
export const sanitizeLectureForStudent = (lecture) => {
  if (!lecture) return lecture;
  const l = lecture.toObject ? lecture.toObject() : JSON.parse(JSON.stringify(lecture));
  if (l.type === "quiz" && Array.isArray(l.questions)) {
    l.questions = l.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options
      // intentionally omit correctAnswer
    }));
  }
  return l;
};
