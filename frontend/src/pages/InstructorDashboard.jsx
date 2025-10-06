import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
// import DashboardHeader from "../components/DashboardHeader";
import InstructorCourseGrid from "../components/InstructorCourseGrid";
import CourseForm from "../components/CourseForm";
import Header from "../components/Header";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);

  const fetchCourses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.courses.getAll();
      
      const filtered = (res.data || []).filter(
        (course) => course.instructor?._id === user._id
      );
      setMyCourses(filtered);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const handleAddCourse = async (title, description) => {
    try {
      await api.courses.create({ title, description });
      alert("Course created successfully!");
      setShowAddCourseForm(false);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create course");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <Header
        showSearchBar={false}
      />

      <div className="add-course-button-container">
        <button className="btn" onClick={() => setShowAddCourseForm(true)}>Add Course</button>
      </div>
      
      {showAddCourseForm && (
        <CourseForm
          onAddCourse={handleAddCourse}
          onCancel={() => setShowAddCourseForm(false)}
        />
      )}

      <InstructorCourseGrid
        myCourses={myCourses}
        loading={loading}
        error={error}
      />
    </div>
  );
}
