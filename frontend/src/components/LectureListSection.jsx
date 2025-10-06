import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/courseDetail.css";

export default function LectureListSection({ lectures, courseId }) {
  const navigate = useNavigate();

  return (
    <section className="lectures-section">
      <h3>Lectures</h3>
      <div className="lecture-list-container">
        {lectures.length === 0 && <div className="no-lectures-message">No lectures yet</div>}
        {lectures.map((l) => (
          <div key={l._id || l.id} className="lecture-list-item">
            <div>
              <div className="lecture-title">{l.title}</div>
              <div className="lecture-type">{l.type}</div>
            </div>
            <div>
              <button onClick={() => navigate(`/courses/${courseId}/lectures/${l._id || l.id}`)} className="btn btn-link lecture-open-btn">
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
