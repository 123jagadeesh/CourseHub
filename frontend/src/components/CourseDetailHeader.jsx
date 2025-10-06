import React from "react";
import "../styles/courseDetail.css";

export default function CourseDetailHeader({ course }) {
  return (
    <div className="course-detail-header">
      <h2 className="course-detail-title">{course.title}</h2>
      <p className="course-detail-description">{course.description}</p>
      <p className="course-detail-instructor">Instructor: {course.instructor?.name || course.instructorName || "Unknown"}</p>
    </div>
  );
}
