import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import CoursesGrid from "../components/CoursesGrid";
import Header from "../components/Header";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState({});

 

  useEffect(() => {
    let mounted = true;
    const loadCourses = async () => {
      setLoading(true);
      try {
        const res = await api.courses.getNotEnrolledCourses();
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

  
  const handleEnroll = async (courseId) => {
    if (!user) return navigate("/auth?role=student");
    
    setEnrolling(prev => ({ ...prev, [courseId]: true }));
    try {
      await api.courses.enroll(courseId);
      
      
      setCourses(prevCourses => prevCourses.filter(c => (c._id || c.id) !== courseId));
      alert("Enrolled successfully");
    } catch (err) {
      console.error("Enroll error", err);
      alert(err.response?.data?.message || "Enroll failed");
    } finally {
      setEnrolling(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const openCourse = (courseId) => navigate(`/courses/${courseId}`);

  return (
    <div className="container">
      <Header
        query={query}
        setQuery={setQuery}
        showSearchBar={false}
      />

      <CoursesGrid
        courses={courses}
        loading={loading}
        error={error}
        query={query}
        setQuery={setQuery}
        handleEnroll={handleEnroll}
        enrolling={enrolling}
        openCourse={openCourse}
      />
    </div>
  );
}
