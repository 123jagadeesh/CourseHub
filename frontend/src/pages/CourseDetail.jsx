// src/pages/CourseDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [progress, setProgress] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await api.courses.getById(courseId);
        if (!mounted) return;
        setCourse(res.data);
        // lecture list may be populated as objects, otherwise fetch separately
        if (Array.isArray(res.data.lectures) && res.data.lectures.length > 0 && typeof res.data.lectures[0] === "object") {
          setLectures(res.data.lectures.sort((a,b) => (a.order||0) - (b.order||0)));
        } else {
          try {
            const lres = await api.lectures.list(courseId);
            if (!mounted) return;
            setLectures(lres.data.sort((a,b) => (a.order||0) - (b.order||0)));
          } catch (e) {
            setLectures([]);
          }
        }

        // fetch progress if student
        if (user && user.role === "student") {
          try {
            const pres = await api.progress.get(courseId);
            if (!mounted) return;
            setProgress(pres.data);
          } catch (e) {
            setProgress(null);
          }
        } else {
          setProgress(null);
        }
      } catch (error) {
        console.error("Course load failed", error);
        setErr(error.response?.data?.message || "Failed to load course");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) return navigate("/auth");
    setEnrolling(true);
    try {
      await api.progress.enroll(courseId);
      const p = await api.progress.get(courseId);
      setProgress(p.data);
      alert("Enrolled successfully");
    } catch (err) {
      console.error("Enroll failed", err);
      alert(err.response?.data?.message || "Enroll failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="container">Loading course...</div>;
  if (err) return <div className="container" style={{ color: "red" }}>{err}</div>;
  if (!course) return <div className="container">Course not found</div>;

  const totalLectures = lectures.length;
  const completedCount = progress ? progress.completedCount || 0 : 0;
  const percent = progress ? progress.percent || 0 : 0;

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <div style={{ display: "flex", gap: 20 }}>
        <main style={{ flex: 1 }}>
          <h2 style={{ marginTop: 0 }}>{course.title}</h2>
          <p style={{ color: "#666" }}>{course.description}</p>
          <p className="muted">Instructor: {course.instructor?.name || course.instructorName || "Unknown"}</p>

          <section style={{ marginTop: 18 }}>
            <h3>Lectures</h3>
            <div style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}>
              {lectures.length === 0 && <div style={{ padding: 12 }}>No lectures yet</div>}
              {lectures.map((l) => (
                <div key={l._id || l.id} style={{ display: "flex", justifyContent: "space-between", padding: 12, borderBottom: "1px solid #fafafa" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{l.title}</div>
                    <div style={{ fontSize: 13, color: "#666" }}>{l.type}</div>
                  </div>
                  <div>
                    <button onClick={() => navigate(`/courses/${courseId}/lectures/${l._id || l.id}`)} className="btn btn-link" style={{ background: "transparent", border: "none", color: "#1976d2" }}>
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside style={{ width: 260 }}>
          <div style={{ background: "#fff", padding: 12, borderRadius: 8, border: "1px solid #eee" }}>
            <h4 style={{ margin: 0 }}>Course Status</h4>
            <p style={{ margin: "6px 0", color: "#666" }}>{progress ? `Enrolled — ${completedCount}/${totalLectures} (${percent}%)` : "Not enrolled"}</p>

            {user && user.role === "student" ? (
              progress ? (
                <button className="btn" onClick={() => navigate(`/courses/${courseId}`)} style={{ marginTop: 8 }}>Go to Course</button>
              ) : (
                <button className="btn" onClick={handleEnroll} disabled={enrolling} style={{ marginTop: 8 }}>{enrolling ? "Enrolling..." : "Enroll"}</button>
              )
            ) : (
              !user && <button className="btn" onClick={() => navigate(`/auth?role=student`)} style={{ marginTop: 8 }}>Sign in as Student to Enroll</button>
            )}

          </div>
        </aside>
      </div>
    </div>
  );
}
