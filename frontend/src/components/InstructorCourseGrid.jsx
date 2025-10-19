import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/instructorDashboard.css";
import api from "../api/api.js";

export default function InstructorCourseGrid({ myCourses, loading, error, setMyCourses }) {
  const navigate = useNavigate();

  const handleDelete = (courseId) => async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.courses.delete(courseId);
      alert("Course deleted successfully!");

      // Update the course list in the parent component
      setMyCourses(myCourses.filter((course) => course._id !== courseId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course");
      console.error(err);
    }
  };

  if (loading) return <p className="loading-message">Loading your courses...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="instructor-course-grid-container">
      {myCourses.length === 0 && (
        <p className="no-courses-message">You haven't created any courses yet. Click "Add Course" to begin.</p>
      )}
      <div className="instructor-course-grid">
        {myCourses.map((c) => (
          <div key={c._id} className="instructor-course-card">
            <h3 className="instructor-course-title">{c.title}</h3>
            <p className="instructor-course-description">{c.description}</p>
            <div className="instructor-course-actions">
              <button className="btn" onClick={() => navigate(`/instructor/courses/${c._id}`)}>
                Manage
              </button>
              <button className="btn" onClick={handleDelete(c._id)}>
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}