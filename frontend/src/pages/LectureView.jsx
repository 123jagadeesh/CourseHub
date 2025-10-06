import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import LectureContentDisplay from "../components/LectureContentDisplay";
import AccessBlockedMessage from "../components/AccessBlockedMessage";
import CourseProgressDisplay from "../components/CourseProgressDisplay";

export default function LectureView() {
  const { courseId, lectureId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [lecture, setLecture] = useState(null);
  const [loadingLecture, setLoadingLecture] = useState(false);
  const [lectureError, setLectureError] = useState(null);

  const [progress, setProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  const fetchProgress = useCallback(async () => {
    if (user && user.role === "student") {
      setLoadingProgress(true);
      try {
        const p = await api.progress.get(courseId);
        setProgress(p.data);
      } catch (e) {
        setProgress(null);
      } finally {
        setLoadingProgress(false);
      }
    } else {
      setProgress(null);
    }
  }, [courseId, user]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLecture(null);
      setLectureError(null);
      setLoadingLecture(true);
      try {
        const res = await api.lectures.get(courseId, lectureId);
        if (!mounted) return;
        setLecture(res.data);
      } catch (err) {
        setLectureError({ status: err.response?.status || 500, message: err.response?.data?.message || "Failed to load lecture" });
      } finally {
        if (mounted) setLoadingLecture(false);
      }
      fetchProgress();
    };
    load();
    return () => { mounted = false; };
  }, [courseId, lectureId, fetchProgress]);

  const handleEnrollInline = async () => {
    if (!user) return navigate("/auth?role=student");
    try {
      await api.progress.enroll(courseId);
      fetchProgress(); 
      const res = await api.lectures.get(courseId, lectureId);
      setLecture(res.data);
      setLectureError(null);
      alert("Enrolled and lecture unlocked (if allowed).");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Enroll failed");
    }
  };

  if (loadingLecture) return <div className="container">Loading lecture...</div>;
  if (lectureError) {
    if (lectureError.status === 403) {
      return (
        <AccessBlockedMessage
          lectureError={lectureError}
          progress={progress}
          handleEnrollInline={handleEnrollInline}
        />
      );
    }
    return <div className="container" style={{ color: "red", paddingTop: 24 }}>{lectureError.message}</div>;
  }

  if (!lecture) return <div className="container" style={{ paddingTop: 24 }}>No lecture data</div>;

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <div className="lecture-view-header">
        <h2 className="lecture-view-title">{lecture.title}</h2>
        <div className="lecture-view-type">{lecture.type && lecture.type.toUpperCase()}</div>
      </div>

      <LectureContentDisplay
        lecture={lecture}
        courseId={courseId}
        lectureId={lectureId}
        fetchProgress={fetchProgress}
        progress={progress}
        handleEnrollInline={handleEnrollInline}
      />

      <CourseProgressDisplay
        loadingProgress={loadingProgress}
        progress={progress}
      />
    </div>
  );
}
