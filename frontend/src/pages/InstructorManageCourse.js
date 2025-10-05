import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function InstructorManageCourse() {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLectures = async () => {
    setLoading(true);
    try {
      const res = await api.lectures.list(courseId);
      setLectures(res.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch lectures");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  const addLecture = async () => {
    const type = prompt("Lecture type (reading | quiz)");
    if (!type || (type !== "reading" && type !== "quiz")) return;

    const title = prompt("Lecture title");
    if (!title) return;

    const order = lectures.length + 1;
    let payload = { title, type, order };

    if (type === "reading") {
      const content = prompt("Reading content (markdown is fine)");
      payload.content = content;
    } else {
      // For quizzes, we'll create a dummy question. A real UI would have a form.
      payload.questions = [
        {
          questionText: "What is 2 + 2?",
          options: ["3", "4", "5"],
          correctAnswer: 1, // index of "4"
        },
      ];
      alert("A dummy quiz question has been added. You can edit it later.");
    }

    try {
      await api.lectures.add(courseId, payload);
      alert("Lecture added successfully!");
      fetchLectures(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add lecture");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Manage Course: {courseId}</h2>
      <div>
        <button className="btn" onClick={addLecture}>Add Lecture</button>
      </div>
      <div style={{ marginTop: 12 }}>
        {loading && <p>Loading lectures...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <div>
            {lectures.length === 0 ? (
              <p>No lectures yet. Add one to get started.</p>
            ) : (
              lectures.map((lecture) => (
                <div key={lecture._id} className="lecture-item">
                  <span>{lecture.order}. {lecture.title} ({lecture.type})</span>
                  {/* Add edit/delete buttons here */}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
