// src/pages/LectureView.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function LectureView() {
  const { courseId, lectureId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [lecture, setLecture] = useState(null);
  const [loadingLecture, setLoadingLecture] = useState(false);
  const [lectureError, setLectureError] = useState(null);

  const [progress, setProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLecture(null);
      setLectureError(null);
      setQuizResult(null);
      setAnswers({});
      setLoadingLecture(true);
      try {
        const res = await api.lectures.get(courseId, lectureId);
        if (!mounted) return;
        setLecture(res.data);
      } catch (err) {
        setLectureError({ status: err.response?.status || 500, message: err.response?.data?.message || "Failed to load lecture" });
      } finally {
        if (mounted) setLoadingLecture(false);
      }

      if (user && user.role === "student") {
        setLoadingProgress(true);
        try {
          const p = await api.progress.get(courseId);
          if (!mounted) return;
          setProgress(p.data);
        } catch (e) {
          setProgress(null);
        } finally {
          if (mounted) setLoadingProgress(false);
        }
      } else {
        setProgress(null);
      }
    };
    load();
    return () => { mounted = false; };
  }, [courseId, lectureId, user]);

  const handleEnrollInline = async () => {
    if (!user) return navigate("/auth?role=student");
    try {
      await api.progress.enroll(courseId);
      const p = await api.progress.get(courseId);
      setProgress(p.data);
      // retry loading lecture after enroll
      const res = await api.lectures.get(courseId, lectureId);
      setLecture(res.data);
      setLectureError(null);
      alert("Enrolled and lecture unlocked (if allowed).");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Enroll failed");
    }
  };

  const handleMarkComplete = async () => {
    if (!user) return navigate("/auth?role=student");
    setSubmitting(true);
    try {
      await api.progress.complete(lectureId);
      const p = await api.progress.get(courseId);
      setProgress(p.data);
      alert("Lecture marked complete");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to mark complete");
    } finally {
      setSubmitting(false);
    }
  };

  const ensureEnrolledBeforeSubmit = async () => {
    // make sure progress exists before submitting quiz
    if (progress) return true;
    // try to fetch progress
    try {
      const p = await api.progress.get(courseId);
      setProgress(p.data);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmitQuiz = async () => {
    if (!user) return navigate("/auth?role=student");
    if (!lecture || lecture.type !== "quiz") return;

    // validate all answers present
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
      // check enrollment
      const enrolled = await ensureEnrolledBeforeSubmit();
      if (!enrolled) {
        const ok = window.confirm("You are not enrolled. Would you like to enroll now?");
        if (!ok) {
          setSubmitting(false);
          return;
        }
        // enroll and reload
        await handleEnrollInline();
      }

      // submit
      const res = await api.lectures.attempt(lectureId, { answers: ansArr });
      setQuizResult(res.data);
      // refresh progress
      try {
        const p = await api.progress.get(courseId);
        setProgress(p.data);
      } catch (e) { }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Quiz submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingLecture) return <div className="container">Loading lecture...</div>;
  if (lectureError) {
    if (lectureError.status === 403) {
      return (
        <div className="container" style={{ paddingTop: 24 }}>
          <div style={{ background: "#fff", padding: 16, borderRadius: 8, border: "1px solid #eee" }}>
            <h3>Access blocked</h3>
            <p>{lectureError.message}</p>
            {progress ? (
              <p style={{ color: "#666" }}>Your next lecture: {progress.nextLectureId}</p>
            ) : (
              <p style={{ color: "#666" }}>Enroll to access course lectures.</p>
            )}
            <div style={{ marginTop: 12 }}>
              {(!user || user.role !== "student") ? (
                <button className="btn" onClick={() => navigate("/auth?role=student")}>Sign in as student</button>
              ) : (
                <button className="btn" onClick={handleEnrollInline}>Enroll in course</button>
              )}
            </div>
          </div>
        </div>
      );
    }
    return <div className="container" style={{ color: "red", paddingTop: 24 }}>{lectureError.message}</div>;
  }

  if (!lecture) return <div className="container" style={{ paddingTop: 24 }}>No lecture data</div>;

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>{lecture.title}</h2>
        <div style={{ color: "#666", fontSize: 13 }}>{lecture.type && lecture.type.toUpperCase()}</div>
      </div>

      {lecture.type === "reading" && (
        <div style={{ marginTop: 12, background: "#fff", padding: 12, borderRadius: 8, border: "1px solid #eee" }}>
          <div style={{ whiteSpace: "pre-wrap" }}>{lecture.content}</div>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={handleMarkComplete} disabled={submitting}>
              {submitting ? "Marking..." : "Mark Complete"}
            </button>
          </div>
        </div>
      )}

      {lecture.type === "quiz" && (
        <div style={{ marginTop: 12, background: "#fff", padding: 12, borderRadius: 8, border: "1px solid #eee" }}>
          {(lecture.questions || []).map((q, qi) => (
            <div key={q._id || qi} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600 }}>{qi + 1}. {q.questionText}</div>
              <div style={{ marginTop: 8 }}>
                {(q.options || []).map((opt, oi) => (
                  <label key={oi} style={{ display: "block", margin: "6px 0" }}>
                    <input
                      type="radio"
                      name={`q${qi}`}
                      value={oi}
                      checked={answers[qi] === oi}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [qi]: Number(e.target.value) }))}
                      disabled={submitting}
                    />{" "}
                    <span style={{ marginLeft: 8 }}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 8 }}>
            <button className="btn" onClick={handleSubmitQuiz} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>

          {quizResult && (
            <div style={{ marginTop: 12, background: "#f7f7f8", padding: 10, borderRadius: 6 }}>
              <div><strong>Score:</strong> {quizResult.scorePercent}%</div>
              <div><strong>Result:</strong> {quizResult.passed ? "Passed" : "Failed"}</div>
              <div>{quizResult.correctCount}/{quizResult.total} correct</div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {loadingProgress ? (
          <div>Loading progress...</div>
        ) : progress ? (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 13, color: "#666" }}>{progress.completedCount}/{progress.totalLectures} completed</div>
            <div style={{ width: 200, height: 10, background: "#eee", borderRadius: 6 }}>
              <div style={{ width: `${progress.percent}%`, height: "100%", background: "#1976d2", borderRadius: 6 }} />
            </div>
          </div>
        ) : (
          <div style={{ color: "#666" }}>Not enrolled — enroll to track progress</div>
        )}
      </div>
    </div>
  );
}
