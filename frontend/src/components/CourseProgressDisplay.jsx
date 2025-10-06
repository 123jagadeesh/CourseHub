import React from "react";
import "../styles/lectureView.css";

export default function CourseProgressDisplay({ loadingProgress, progress }) {
  return (
    <div className="course-progress-display">
      {loadingProgress ? (
        <div className="loading-message">Loading progress...</div>
      ) : progress ? (
        <div className="progress-info">
          <div className="progress-text">{progress.completedCount}/{progress.totalLectures} completed</div>
          <div className="progress-bar-background">
            <div className="progress-bar-fill" style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
      ) : (
        <div className="not-enrolled-message">Not enrolled — enroll to track progress</div>
      )}
    </div>
  );
}
