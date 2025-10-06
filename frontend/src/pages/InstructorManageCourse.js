import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import LectureForms from "../components/LectureForms";
import LectureListDisplay from "../components/LectureListDisplay";

export default function InstructorManageCourse() {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLectures = async () => {
    setLoading(true);
    try {
      const res = await api.lectures.list(courseId);
      setLectures(res.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch lectures");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  return (
    <div className="container">
      <h2>Manage Course: {courseId}</h2>
      
      <LectureForms courseId={courseId} lectures={lectures} fetchLectures={fetchLectures} />

      <LectureListDisplay lectures={lectures} loading={loading} error={error} />
    </div>
  );
}
