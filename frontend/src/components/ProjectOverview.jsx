import React from "react";
import "../styles/landing.css";

export default function ProjectOverview() {
  return (
    <section className="project-overview-section">
      <h3>Project Overview</h3>
      <div className="project-overview-content">
        <ul>
          <li>Role-based auth for students & instructors (JWT)</li>
          <li>Courses created by instructors with ordered lectures</li>
          <li>Lecture types: reading and quiz (server-side grading)</li>
          <li>Student enrollment, sequential gating and progress tracking</li>
        </ul>
        <p className="project-overview-text">Use Sign Up / Sign In above to create users. Student dashboard lists all courses with enroll buttons — open a course to see lectures and progress.</p>
      </div>
    </section>
  );
}
