import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/lectureView.css";

export default function AccessBlockedMessage({ lectureError, progress, handleEnrollInline }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="access-blocked-message-container">
      <div className="access-blocked-message-box">
        <h3>Access blocked</h3>
        <p>{lectureError.message}</p>
        {progress ? (
          <p className="muted-text">Your next lecture: {progress.nextLectureId}</p>
        ) : (
          <p className="muted-text">Enroll to access course lectures.</p>
        )}
        <div className="btn-container">
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
