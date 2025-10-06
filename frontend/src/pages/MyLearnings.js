import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
// import DashboardHeader from "../components/DashboardHeader";
import EnrolledCoursesGrid from "../components/EnrolledCoursesGrid";
import Header from "../components/Header";

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
        const res = await api.courses.getEnrolledCourses();
        if (!mounted) return;
        const all = res.data || [];
        setCourses(all);

        
        const enrolled = [];
        await Promise.all(all.map(async (c) => {
          const id = c._id || c.id;
          try {
            const p = await api.progress.get(id);
            
            enrolled.push({ course: c, progress: p.data });
          } catch (e) {
            
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
    <div className="container" /*style={{ paddingTop: 96 }}*/>
      <Header
        showSearchBar={false}
      />

      <EnrolledCoursesGrid
        enrolledCourses={enrolledCourses}
        loading={loading}
        openCourse={openCourse}
      />
    </div>
  );
}
