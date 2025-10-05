// src/pages/MyLearnings.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

/**
 * MyLearnings: shows only enrolled courses for the logged-in student
 * Implementation: fetch all courses, then GET /api/progress/:courseId for each,
 * and display those with progress present (enrolled).
 */
export default function MyLearnings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "student") return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.courses.getAll();
        if (!mounted) return;
        const all = res.data || [];
        setCourses(all);

        // check progress per course
        const enrolled = [];
        await Promise.all(all.map(async (c) => {
          const id = c._id || c.id;
          try {
            const p = await api.progress.get(id);
            // if progress exists, include the course and progress summary
            enrolled.push({ course: c, progress: p.data });
          } catch (e) {
            // not enrolled -> skip
          }
        }));
        if (!mounted) return;
        setEnrolledCourses(enrolled);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user]);

  const openCourse = (courseId) => navigate(`/courses/${courseId}`);

  return (
    <div className="container" style={{ paddingTop: 96 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>My Learnings</h2>
          <div style={{ color: "#666", fontSize: 13 }}>{user?.name || ""}</div>
        </div>
      </header>

      {loading && <div>Loading enrolled courses...</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 12 }}>
        {enrolledCourses.length === 0 && !loading && <div>No enrolled courses yet.</div>}

        {enrolledCourses.map(({ course, progress }) => {
          const id = course._id || course.id;
          const percent = progress ? progress.percent || 0 : 0;
          const completed = progress ? progress.completedCount || 0 : 0;
          const total = progress ? progress.totalLectures || (course.lectures ? course.lectures.length : 0) : (course.lectures ? course.lectures.length : 0);

          return (
            <div key={id} style={{ padding: 12, borderRadius: 8, background: "#fff", border: "1px solid #eee" }}>
              <h3 style={{ margin: 0 }}>{course.title}</h3>
              <p style={{ color: "#666", fontSize: 13 }}>{course.description}</p>
              <p style={{ fontSize: 12, color: "#666" }}>By {course.instructor?.name || course.instructorName || "Unknown"}</p>

              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, color: "#666" }}>{completed}/{total} completed</div>
                <div style={{ width: 240, height: 10, background: "#eee", borderRadius: 6, marginTop: 6 }}>
                  <div style={{ width: `${percent}%`, height: "100%", background: "#1976d2", borderRadius: 6 }} />
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <button className="btn" onClick={() => openCourse(id)}>Open Course</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
