import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.courses.getAll();
      // Filter courses to show only those created by the current instructor
      const filtered = (res.data || []).filter(
        (course) => course.instructor?._id === user._id
      );
      setMyCourses(filtered);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const addCourse = async () => {
    const title = prompt("Course title:");
    if (!title) return;
    const description = prompt("Course description:");
    if (!description) return;

    try {
      await api.courses.create({ title, description });
      alert("Course created successfully!");
      fetchCourses(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create course");
      console.error(err);
    }
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

      {loading && <p>Loading your courses...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div className="grid">
        {!loading && !error && myCourses.length === 0 && (
          <p>You haven't created any courses yet. Click "Add Course" to begin.</p>
        )}
        {myCourses.map((c) => (
          <div key={c._id} className="course-card">
            <h3>{c.title}</h3>
            <p className="desc">{c.description}</p>
            <div className="actions">
              <button className="btn" onClick={() => navigate(`/instructor/courses/${c._id}`)}>
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
