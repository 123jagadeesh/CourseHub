import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

export default function RoleSelector({ tab, setTab }) {
  return (
    <div className="role-selector-container">
      <div className="role-selector-buttons">
        <button
          onClick={() => setTab("student")}
          className={`btn ${tab === "student" ? "btn-primary" : "btn-secondary"}`}
        >
          Students
        </button>
        <button
          onClick={() => setTab("instructor")}
          className={`btn ${tab === "instructor" ? "btn-primary" : "btn-secondary"}`}
        >
          Instructors
        </button>
      </div>

      {tab === "student" ? (
        <div className="role-description">
          <Link to="/auth?role=student" className="btn">Student Sign Up / Sign In</Link>
          <div className="role-text">Sign up as a student to browse & enroll in courses, track progress and attempt quizzes.</div>
        </div>
      ) : (
        <div className="role-description">
          <Link to="/auth?role=instructor" className="btn">Instructor Sign Up / Sign In</Link>
          <div className="role-text">Create courses, add reading and quiz lectures and manage your learners.</div>
        </div>
      )}
    </div>
  );
}
