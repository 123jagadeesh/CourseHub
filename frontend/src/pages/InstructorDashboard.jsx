import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // replace with API call to fetch instructor courses
  const myCourses = [
    { id: "c1", title: "MERN Stack" },
  ];

  const addCourse = () => {
    // form/modal in real UI; here just prompt
    const title = prompt("Course title");
    if (!title) return;
    // call api.courses.create(...)
    // then refresh
    alert("Course created (dummy). Implement API call to create course.");
  };

  return (
    <div className="container">
      <header className="dash-header">
        <h2>Instructor Dashboard</h2>
        <div>{user?.name}</div>
      </header>

      <div style={{ marginBottom: 12 }}>
        <button className="btn" onClick={addCourse}>Add Course</button>
      </div>

      <div className="grid">
        {myCourses.map(c => (
          <div key={c.id} className="course-card">
            <h3>{c.title}</h3>
            <div className="actions">
              <button className="btn" onClick={() => navigate(`/instructor/courses/${c.id}`)}>Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
