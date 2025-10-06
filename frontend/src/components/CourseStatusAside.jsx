import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/courseDetail.css";

export default function CourseStatusAside({ courseId, progress, enrolling, handleEnroll }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalLectures = progress ? progress.totalLectures || 0 : 0;
  const completedCount = progress ? progress.completedCount || 0 : 0;
  const percent = progress ? progress.percent || 0 : 0;

  return (
    <aside className="course-status-aside">
      <h4>Course Status</h4>
      <p className="course-status-text">
        {progress ? `Enrolled — ${completedCount}/${totalLectures} (${percent}%)` : "Not enrolled"}
      </p>

      <div className="course-status-actions">
        {user && user.role === "student" ? (
          progress ? (
            <button className="btn" onClick={() => navigate(`/courses/${courseId}`)}>Go to Course</button>
          ) : (
            <button className="btn" onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? "Enrolling..." : "Enroll"}
            </button>
          )
        ) : (
          !user && <button className="btn" onClick={() => navigate(`/auth?role=student`)}>Sign in as Student to Enroll</button>
        )}
      </div>
    </aside>
  );
}
