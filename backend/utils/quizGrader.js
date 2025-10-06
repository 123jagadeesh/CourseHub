export const gradeQuiz = ({ lecture, answers = [], passPercent = 70 }) => {
  if (!lecture) throw new Error("Lecture is required");
  if (lecture.type !== "quiz") throw new Error("Lecture is not a quiz");

  const questions = lecture.questions || [];
  let correctCount = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const userAns = typeof answers[i] === "number" ? answers[i] : null;
    if (userAns !== null && userAns === q.correctAnswer) {
      correctCount++;
    }
  }

  const total = questions.length;
  const scorePercent = total ? (correctCount / total) * 100 : 0;
  const passed = scorePercent >= passPercent;

  return { scorePercent, passed, correctCount, total };
};
