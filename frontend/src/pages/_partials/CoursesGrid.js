// src/pages/_partials/CoursesGrid.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

/**
 * CoursesGrid
 * - fetches /api/courses
 * - shows loading / error states
 * - basic search
 * - "View" navigates to /courses/:id
 */
export default function CoursesGrid() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.courses.getAll();
        if (!mounted) return;
        // expect res.data to be array of courses, instructor usually populated by backend
        setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = courses.filter((c) =>
    (c.title || "").toLowerCase().includes(q.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="courses-grid">
      <div className="search-row" style={{ marginBottom: 12 }}>
        <input
          placeholder="Search courses..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 8, width: "100%", borderRadius: 6, border: "1px solid #ddd" }}
        />
      </div>

      {loading && <div>Loading courses...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {!loading && !error && (
        <div className="grid" style={{ marginTop: 8 }}>
          {filtered.length === 0 && <div>No courses found</div>}

          {filtered.map((c) => (
            <div key={c._id || c.id} className="course-card" style={{ padding: 12, borderRadius: 8 }}>
              <h3 style={{ margin: 0 }}>{c.title}</h3>
              <p className="desc" style={{ color: "#666", fontSize: 13 }}>{c.description}</p>
              <p className="muted" style={{ fontSize: 12 }}>
                By {c.instructor?.name || c.instructorName || "Unknown"}
              </p>
              <div className="card-actions" style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => navigate(`/courses/${c._id || c.id}`)}
                  className="btn btn-link"
                  style={{ background: "transparent", border: "none", color: "#1976d2", cursor: "pointer" }}
                >
                  View
                </button>

                {/* optional enroll button (student-only). Enroll action implemented in Module C */}
                {user && user.role === "student" ? (
                  <button
                    className="btn"
                    style={{ padding: "6px 10px", borderRadius: 6 }}
                    onClick={() => navigate(`/courses/${c._id || c.id}`)}
                  >
                    Open
                  </button>
                ) : (
                  <button
                    className="btn"
                    style={{ padding: "6px 10px", borderRadius: 6 }}
                    onClick={() => navigate("/auth")}
                  >
                    Sign in to enroll
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
