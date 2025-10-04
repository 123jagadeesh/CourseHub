import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // fetch course & lectures
    // api.courses.getById(courseId).then(r => setCourse(r.data)).catch(...)
    // api.lectures.list(courseId).then(r => setLectures(r.data)).catch(...)
    // dummy:
    setCourse({ id: courseId, title: "Sample Course", description: "Demo", instructorName: "Alice" });
    setLectures([
      { id: "l1", order: 0, title: "Intro", type: "reading" },
      { id: "l2", order: 1, title: "Quiz1", type: "quiz" },
    ]);
  }, [courseId]);

  const goLecture = (id) => navigate(`/courses/${courseId}/lectures/${id}`);

  if (!course) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="course-detail">
        <h2>{course.title}</h2>
        <p>{course.description}</p>
        <p>Instructor: {course.instructorName}</p>

        <div className="lectures">
          <h3>Lectures</h3>
          <ul>
            {lectures.sort((a,b)=>a.order-b.order).map(l => (
              <li key={l.id} className="lecture-item">
                <div>
                  <strong>{l.title}</strong>
                  <span className="muted"> ({l.type})</span>
                </div>
                <div><button onClick={() => goLecture(l.id)} className="btn btn-link">Open</button></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
