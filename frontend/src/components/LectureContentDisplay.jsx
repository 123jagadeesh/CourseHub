import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/lectureView.css";

export default function LectureContentDisplay({
  lecture,
  courseId,
  lectureId,
  fetchProgress,
  progress,
  handleEnrollInline,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [answers, setAnswers] = useState({});

  const ensureEnrolledBeforeSubmit = async () => {
    if (progress) return true;
    try {
      const p = await api.progress.get(courseId);
      fetchProgress(); 
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmitQuiz = async () => {
    if (!user) return navigate("/auth?role=student");
    if (!lecture || lecture.type !== "quiz") return;

    const totalQ = (lecture.questions || []).length;
    const ansArr = [];
    for (let i = 0; i < totalQ; i++) {
      if (typeof answers[i] === "undefined" || answers[i] === null) {
        alert("Please answer all questions");
        return;
      }
      ansArr.push(Number(answers[i]));
    }

    setSubmitting(true);
    try {
      const enrolled = await ensureEnrolledBeforeSubmit();
      if (!enrolled) {
        const ok = window.confirm("You are not enrolled. Would you like to enroll now?");
        if (!ok) {
          setSubmitting(false);
          return;
        }
        await handleEnrollInline();
      }

      const res = await api.progress.attempt(lectureId, { answers: ansArr });
      setQuizResult(res.data);
      fetchProgress(); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Quiz submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!user) return navigate("/auth?role=student");
    setSubmitting(true);
    try {
      await api.progress.complete(lectureId);
      fetchProgress(); 
      alert("Lecture marked complete");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to mark complete");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lecture-content-display">
      {lecture.type === "reading" && (
        <div className="reading-lecture-content">
          <div className="lecture-text">{lecture.content}</div>
          <div className="lecture-actions">
            <button className="btn" onClick={handleMarkComplete} disabled={submitting}>
              {submitting ? "Marking..." : "Mark Complete"}
            </button>
          </div>
        </div>
      )}

      {lecture.type === "quiz" && (
        <div className="quiz-lecture-content">
          {(lecture.questions || []).map((q, qi) => (
            <div key={q._id || qi} className="quiz-question">
              <div className="question-text">{qi + 1}. {q.questionText}</div>
              <div className="question-options">
                {(q.options || []).map((opt, oi) => (
                  <label key={oi} className="option-label">
                    <input
                      type="radio"
                      name={`q${qi}`}
                      value={oi}
                      checked={answers[qi] === oi}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [qi]: Number(e.target.value) }))}
                      disabled={submitting}
                    />
                    <span className="option-text">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="quiz-actions">
            <button className="btn" onClick={handleSubmitQuiz} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>

          {quizResult && (
            <div className="quiz-result">
              <div><strong>Score:</strong> {quizResult.scorePercent}%</div>
              <div><strong>Result:</strong> {quizResult.passed ? "Passed" : "Failed"}</div>
              <div>{quizResult.correctCount}/{quizResult.total} correct</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
