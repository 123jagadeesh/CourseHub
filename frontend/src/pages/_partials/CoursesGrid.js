import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function CoursesGrid() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // For now load from backend when integrated. Use dummy until integrated.
    // api.courses.getAll().then(r => setCourses(r.data)).catch(()=> setCourses([]));
    // Dummy sample
    setCourses([
      { id: "c1", title: "MERN Stack", description: "Full stack MERN", instructorName: "Alice" },
      { id: "c2", title: "Data Analysis", description: "Pandas & numpy", instructorName: "Bob" },
    ]);
  }, []);

  const filtered = courses.filter(c => c.title.toLowerCase().includes(q.toLowerCase()) || c.description.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="courses-grid">
      <div className="search-row">
        <input placeholder="Search courses..." value={q} onChange={(e)=> setQ(e.target.value)} />
      </div>

      <div className="grid">
        {filtered.map(c => (
          <div key={c.id} className="course-card">
            <h3>{c.title}</h3>
            <p className="desc">{c.description}</p>
            <p className="instructor">By {c.instructorName}</p>
            <div className="card-actions">
              <button onClick={() => navigate(`/courses/${c.id}`)} className="btn btn-link">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
