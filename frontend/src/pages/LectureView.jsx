import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function LectureView() {
  const { courseId, lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [answers, setAnswers] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    // fetch lecture
    // api.lectures.get(courseId, lectureId).then(r => setLecture(r.data)).catch(...)
    // dummy:
    setLecture({ id: lectureId, title: "Intro", type: "reading", content: "Sample content", order: 0 });
    // if quiz, lecture.questions = [...]
  }, [courseId, lectureId]);

  if (!lecture) return <div className="container">Loading lecture...</div>;

  if (lecture.type === "reading") {
    return (
      <div className="container">
        <h2>{lecture.title}</h2>
        <div className="reading">{lecture.content}</div>
        <div style={{ marginTop: 12 }}>
          <button className="btn">Mark Complete</button>
        </div>
      </div>
    );
  }

  // quiz UI
  return (
    <div className="container">
      <h2>{lecture.title}</h2>
      <div className="quiz">
        {(lecture.questions || []).map((q, i) => (
          <div key={q.id} className="question">
            <div className="q-text">{i + 1}. {q.questionText}</div>
            <div className="options">
              {q.options.map((opt, idx) => (
                <label key={idx} className="option">
                  <input type="radio" name={`q${i}`} value={idx} onChange={(e) => setAnswers(prev => ({ ...prev, [i]: Number(e.target.value) }))} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 12 }}>
          <button className="btn">Submit Quiz</button>
        </div>
      </div>
    </div>
  );
}
