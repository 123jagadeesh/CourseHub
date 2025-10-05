// src/pages/Landing.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const [tab, setTab] = useState("student"); // 'student' | 'instructor'

  return (
    <div style={{ paddingTop: 24 }}>
      <header style={{ padding: 24, background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0 }}>CourseHub</h1>
            <p style={{ margin: 0, color: "#666" }}>A simple online learning platform — instructors create courses, students enroll and learn sequentially.</p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {/* top-level signin/signup (generic) */}
            <Link to="/auth" className="btn" style={{ marginRight: 8 }}>Sign In / Sign Up</Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: "24px auto", padding: 16 }}>
        <section style={{ background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ marginTop: 0 }}>Welcome to CourseHub</h2>
              <p style={{ color: "#666" }}>
                Build instructor-led courses with reading & quizzes. Students enroll, progress is tracked sequentially, quizzes are graded in real-time.
              </p>
            </div>

            <div style={{ minWidth: 260 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button
                  onClick={() => setTab("student")}
                  className={`btn`}
                  style={{ background: tab === "student" ? "#1976d2" : "#f0f0f0", color: tab === "student" ? "#fff" : "#333" }}
                >
                  Students
                </button>
                <button
                  onClick={() => setTab("instructor")}
                  className={`btn`}
                  style={{ background: tab === "instructor" ? "#1976d2" : "#f0f0f0", color: tab === "instructor" ? "#fff" : "#333" }}
                >
                  Instructors
                </button>
              </div>

              {tab === "student" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link to="/auth?role=student" className="btn">Student Sign Up / Sign In</Link>
                  <div style={{ fontSize: 13, color: "#666" }}>Sign up as a student to browse & enroll in courses, track progress and attempt quizzes.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link to="/auth?role=instructor" className="btn">Instructor Sign Up / Sign In</Link>
                  <div style={{ fontSize: 13, color: "#666" }}>Create courses, add reading and quiz lectures and manage your learners.</div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section style={{ marginTop: 18 }}>
          <h3>Project Overview</h3>
          <div style={{ background: "#fff", padding: 12, borderRadius: 8, border: "1px solid #eee", color: "#333" }}>
            <ul>
              <li>Role-based auth for students & instructors (JWT)</li>
              <li>Courses created by instructors with ordered lectures</li>
              <li>Lecture types: reading and quiz (server-side grading)</li>
              <li>Student enrollment, sequential gating and progress tracking</li>
            </ul>
            <p style={{ color: "#666", fontSize: 13 }}>Use Sign Up / Sign In above to create users. Student dashboard lists all courses with enroll buttons — open a course to see lectures and progress.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
