import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // replace with real API call that fetches enrolled courses
  const enrolled = [
    { id: "c1", title: "MERN Stack", completed: 1, total: 3 },
  ];

  return (
    <div className="container">
      <header className="dash-header">
        <h2>My Learnings</h2>
        <div>{user?.name}</div>
      </header>

      <div className="grid">
        {enrolled.map(c => (
          <div key={c.id} className="course-card">
            <h3>{c.title}</h3>
            <p>{c.completed}/{c.total} completed</p>
            <button className="btn" onClick={() => navigate(`/courses/${c.id}`)}>Open</button>
          </div>
        ))}
      </div>
    </div>
  );
}
