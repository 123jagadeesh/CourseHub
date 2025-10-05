// src/pages/StudentDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

/**
 * StudentDashboard: shows all public courses (GET /api/courses)
 * - Student can Enroll on each card (POST /api/progress/enroll/:courseId)
 * - View opens course detail
 * - Enroll button remains until enroll is completed successfully
 */
export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [enrolling, setEnrolling] = useState({});

  useEffect(() => {
    let mounted = true;
    const loadCourses = async () => {
      setLoading(true);
      try {
        const res = await api.courses.getAll();
        if (!mounted) return;
        setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadCourses();
    return () => { mounted = false; };
  }, []);

  // load progress for courses the student might already be enrolled in
  useEffect(() => {
    if (!user || user.role !== "student") return;
    let mounted = true;
    const loadProgress = async () => {
      const map = {};
      await Promise.all(courses.map(async (c) => {
        const id = c._id || c.id;
        try {
          const res = await api.progress.get(id);
          if (!mounted) return;
          map[id] = res.data;
        } catch (e) {
          // skip if not enrolled
        }
      }));
      if (mounted) setProgressMap(map);
    };
    loadProgress();
    return () => { mounted = false; };
  }, [courses, user]);

  const filtered = courses.filter(c => (c.title || "").toLowerCase().includes(query.toLowerCase()) || (c.description || "").toLowerCase().includes(query.toLowerCase()));

  const handleEnroll = async (courseId) => {
    if (!user) return navigate("/auth?role=student");
    // mark enrolling
    setEnrolling(prev => ({ ...prev, [courseId]: true }));
    try {
      await api.progress.enroll(courseId);
      // refresh progress for the course only
      try {
        const p = await api.progress.get(courseId);
        setProgressMap(prev => ({ ...prev, [courseId]: p.data }));
      } catch (e) {
        console.warn("Failed to refresh progress after enroll", e);
      }
      alert("Enrolled successfully");
    } catch (err) {
      console.error("Enroll error", err);
      alert(err.response?.data?.message || "Enroll failed");
    } finally {
      setEnrolling(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const openCourse = (courseId) => navigate(`/courses/${courseId}`);
  const openMyLearnings = () => navigate("/student/mylearnings");

  return (
    <div className="container" style={{ paddingTop: 96 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>Courses</h2>
          <div style={{ color: "#666", fontSize: 13 }}>Explore available courses and enroll</div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <input placeholder="Search courses..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          <button className="btn" onClick={openMyLearnings}>My Learnings</button>
        </div>
      </header>

      {loading && <div>Loading courses...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
        {filtered.map(c => {
          const id = c._id || c.id;
          const progress = progressMap[id];
          const enrolled = !!progress;
          const percent = progress ? progress.percent || 0 : 0;
          const completedCount = progress ? progress.completedCount || 0 : 0;
          const total = progress ? progress.totalLectures || (c.lectures ? c.lectures.length : 0) : (c.lectures ? c.lectures.length : 0);

          return (
            <div key={id} style={{ padding: 12, borderRadius: 8, background: "#fff", border: "1px solid #eee" }}>
              <h3 style={{ margin: 0 }}>{c.title}</h3>
              <p style={{ color: "#666", fontSize: 13 }}>{c.description}</p>
              <p style={{ fontSize: 12, color: "#666" }}>By {c.instructor?.name || c.instructorName || "Unknown"}</p>

              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  {enrolled ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ fontSize: 13, color: "#666" }}>{completedCount}/{total} completed</div>
                      <div style={{ width: 160, height: 10, background: "#eee", borderRadius: 6 }}>
                        <div style={{ width: `${percent}%`, height: "100%", background: "#1976d2", borderRadius: 6 }} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: "#666" }}>Not enrolled</div>
                  )}
                </div>

                <div style={{ marginLeft: 12, display: "flex", gap: 8 }}>
                  <button onClick={() => openCourse(id)} className="btn btn-link" style={{ background: "transparent", border: "none", color: "#1976d2" }}>
                    View
                  </button>

                  {enrolled ? (
                    <button onClick={() => openCourse(id)} className="btn" style={{ padding: "6px 10px" }}>
                      Open
                    </button>
                  ) : (
                    <button onClick={() => handleEnroll(id)} className="btn" style={{ padding: "6px 10px" }} disabled={!!enrolling[id]}>
                      {enrolling[id] ? "Enrolling..." : "Enroll"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
