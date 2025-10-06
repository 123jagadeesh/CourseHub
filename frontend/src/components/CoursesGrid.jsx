import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/courses.css"; 

export default function CoursesGrid({ courses, loading, error, query, setQuery, handleEnroll, enrolling, openCourse }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const filteredCourses = courses.filter((c) =>
    (c.title || "").toLowerCase().includes(query.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="courses-grid-container">
      <div className="search-row">
        <input
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <div className="loading-message">Loading courses...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="courses-grid">
          {filteredCourses.length === 0 && <div className="no-courses-message">No courses found</div>}

          {filteredCourses.map((c) => {
            const id = c._id || c.id;
            return (
              <div key={id} className="course-card">
                <h3 className="course-card-title">{c.title}</h3>
                <p className="course-card-description">{c.description}</p>
                <p className="course-card-instructor">By {c.instructor?.name || c.instructorName || "Unknown"}</p>

                <div className="course-card-actions">
                  <button
                    onClick={() => openCourse(id)}
                    className="btn btn-link"
                  >
                    View
                  </button>

                  {user && user.role === "student" ? (
                    <button
                      className="btn"
                      onClick={() => handleEnroll(id)}
                      disabled={!!enrolling[id]}
                    >
                      {enrolling[id] ? "Enrolling..." : "Enroll"}
                    </button>
                  ) : (
                    <button
                      className="btn"
                      onClick={() => navigate("/auth")}
                    >
                      Sign in to enroll
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
