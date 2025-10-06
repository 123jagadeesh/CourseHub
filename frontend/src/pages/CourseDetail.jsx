import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import CourseDetailHeader from "../components/CourseDetailHeader";
import LectureListSection from "../components/LectureListSection";
import CourseStatusAside from "../components/CourseStatusAside";

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
        const res = await api.courses.get(courseId);
        if (!mounted) return;
        setCourse(res.data);
        
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

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <div className="course-detail-main-content">
        <main className="course-detail-main">
          <CourseDetailHeader course={course} />
          <LectureListSection lectures={lectures} courseId={courseId} />
        </main>
        <CourseStatusAside
          courseId={courseId}
          progress={progress}
          enrolling={enrolling}
          handleEnroll={handleEnroll}
        />
      </div>
    </div>
  );
}
