import React from "react";
import "../styles/lectureListDisplay.css";

export default function LectureListDisplay({ lectures, loading, error }) {
  if (loading) return <p className="loading-message">Loading lectures...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="lecture-list-display-container">
      {lectures.length === 0 ? (
        <p className="no-lectures-message">No lectures yet. Add one to get started.</p>
      ) : (
        <div className="lecture-list">
          {lectures.map((lecture) => (
            <div key={lecture._id} className="lecture-item">
              <span>{lecture.order}. {lecture.title} ({lecture.type})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
